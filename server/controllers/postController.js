import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import { v2 as cloudinary } from 'cloudinary';

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at geting post: ', error.message);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ postedBy: user.id }).sort({
      createdAt: -1,
    });
    if (!posts) return res.status(404).json({ error: 'No Posts found' });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at geting post: ', error.message);
  }
};

const createPost = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
  });
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) return req.status(400).json({ error: 'PostedBy and text field is required' });

    const user = await User.findById(postedBy);
    if (!user) return req.status(404).json({ error: 'User not found' });

    if (user._id.toString() !== req.user._id.toString())
      return req.status(404).json({ error: 'Un-Authorized to post' });

    const maxTextLength = 500;
    if (text > maxTextLength) return req.status(403).json({ error: 'Text must have maximum 500 letters' });

    if (img) {
      const uploadedImg = await cloudinary.uploader.upload(img);
      img = uploadedImg.secure_url;
    }

    const newPost = new Post({
      postedBy,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json({ message: 'Successfully created post', post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at creating post: ', error.message);
  }
};

const deletePost = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
  });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(404).json({ error: 'Un-Authorized to delete' });

    if (post.img) {
      await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0]);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Successfully deleted post' });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at deleting post: ', error.message);
  }
};

const likeUnLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isUserLikedPost = post.likes.includes(req.user._id);

    if (isUserLikedPost) {
      // Un-Like
      await Post.updateOne(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        }
      );

      return res.status(200).json({ message: 'Successfully un-liked post' });
    } else {
      // Like
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({ message: 'Successfully liked post' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error while liking unliking post: ', error.message);
  }
};

const replyToPost = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.postId;
  const userId = req.user._id;
  const userProfilePic = req.user.profilePic;
  const username = req.user.username;

  if (!text) return res.status(400).json({ error: 'Text field required' });

  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ error: 'Post not found' });

  const reply = { userId, text, userProfilePic, username };

  post.replies.push(reply);
  await post.save();

  res.status(201).json(reply);
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userFollowing = user.following;
    userFollowing.push(userId.toString());

    const feedPosts = await Post.find({
      postedBy: { $in: userFollowing },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error at Feed Posts: ', error.message);
  }
};

export { getPost, getFeedPosts, getUserPosts, createPost, deletePost, likeUnLikePost, replyToPost };
