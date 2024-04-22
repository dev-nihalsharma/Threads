import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/genrateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';

const signupUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      res.status(400).json({ error: 'User Already Exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(500).json({
        error: 'Invalid user data',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at Signup: ', error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordsCorrect = await bcrypt.compare(password, user?.password || '');

    if (!user || !isPasswordsCorrect) {
      res.status(400).json({ error: 'Invalid username or password' });
      return;
    }

    if (user.isFrozen) {
      user.isFrozen = false;
      user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error at Login: ', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.status(200).json({ message: 'User Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const followUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id == req.user._id.toString()) {
      return res.status(400).json({ error: 'You can not follow/un-follow yourself ' });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Un-Following
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      return res.status(200).json({ message: 'User Un-Followed Successfully' });
    } else {
      // Following
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      return res.status(200).json({ message: 'User Followed Successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
    });

    let user = await User.findById(req.user._id);

    if (!user) return req.status(400).json({ error: 'User not found' });

    if (id != req.user.id.toString()) return req.status(400).json({ error: 'Un-Authorized' });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        //  delete old one
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0] // get the name of profile picture
        );
      }
      const uploadedProfilePic = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedProfilePic.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    await Post.updateMany(
      {
        'replies.userId': user._id,
      },
      {
        $set: {
          'replies.$[reply].username': user.username,
          'replies.$[reply].userProfilePic': user.profilePic,
        },
      },
      { arrayFilters: [{ 'reply.userId': user._id }] }
    );

    user.password = null;

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at Updating Profile: ', error.message);
  }
};

const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.isValidObjectId(query)) {
      user = await User.findOne({ _id: query }).select('-password').select('-updatedAt');
    } else {
      user = await User.findOne({ username: query }).select('-password').select('-updatedAt');
    }

    if (!user) return res.status(400).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at fetching Profile Data: ', error.message);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByClient = await User.findById(userId).select('following');

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
          isFrozen: false,
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByClient.following.includes(user._id.toString())
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(400).json({ error: 'User not found' });

    user.isFrozen = true;
    user.save();

    res.status(200).json({ message: 'Account Frozen Successfully' });
  } catch (error) {
    console.log('Error at Freezing Account: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollow,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
};
