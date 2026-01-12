import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  // this endpoint will return list of all users except the logged in user
  try {
    const loggedInUserId = req.user.id; // assuming protectRoute middleware adds user info to req
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .sort({ createdAt: -1 }); // hre we are excluding password field
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("error in getUsersForSidebar ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  // to get messages with a particular user
  try {
    const { id: userToChatId } = req.params; // id of the other user  , here userToChatId is the id of the user with whom logged in user is chatting
    const myid = req.user.id; // logged in user id
    const messages = await Message.find({
      $or: [
        { senderId: myid, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myid },
      ], //find messages where sender is logged in user and receiver is other user or vice versa
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("error in getMessages ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  // to send message to a particular user
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; // id of the receiver
    const senderId = req.user.id; // logged in user id

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image); // upload image to cloudinary
      imageUrl = uploadResponse.secure_url; // get the uploaded image url from cloudinary response
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, //imageUrl is `undefined` if no image is sent
    });
    await newMessage.save(); // save message to db
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("error in sendMessage ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearChat = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    await Message.deleteMany({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json({
      message: "Chat cleared successfully",
    });
  } catch (error) {
    console.error("error in ClearChat ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
