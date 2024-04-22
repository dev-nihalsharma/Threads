import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { getUserSocketId, io } from '../socket/socket.js';
import { v2 as cloudinary } from 'cloudinary';

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    let { img } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: {
          text,
          sender: senderId,
        },
      });
    } else {
      conversation.lastMessage = {
        text,
        sender: senderId,
      };
      conversation.save();
    }

    if (img) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
      });

      const uploadedImage = await cloudinary.uploader.upload(img);
      img = uploadedImage.secure_url;
    }

    const message = await Message.create({
      sender: senderId,
      conversationId: conversation._id,
      text,
      img: img || '',
    });

    const userSocketId = getUserSocketId(receiverId);

    io.to(userSocketId).emit('newMessage', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: 'participants',
        select: 'username profilePic',
      })
      .sort({
        createdAt: -1,
      });

    conversations.forEach((conv) => {
      conv.participants = conv.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, getConversations };
