import pollModel from "../models/pollModel.js";
import { v2 as cloudinary } from "cloudinary";

//Create New Poll
const createPoll = async (req, res) => {
  try {
    const files = req.files; 
    let pollImagesUrl = [];
    if (files?.pollImages?.length > 0) {
      pollImagesUrl = await Promise.all(
        files.pollImages.map(async (item) => {
          const uploadedImage = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return uploadedImage.secure_url;
        })
      );
    }
    
    const pollData = {
      author: req.body.author,
      poll: {
        title: req.body.title,
        desc: req.body.desc,
        participants: JSON.parse(req.body.participants || "[]").map(
          (participant, index) => ({
            name: participant.name,
            image: pollImagesUrl[index] || "",
          })
        ),
        category: req.body.category,
        dueDate: req.body.dueDate,
        count: 0
      },
    };
    const poll = new pollModel(pollData);
    await poll.save();
    res.json({
      success: true,
      message: "New Poll Launched",
    });
  } catch (error) {
    console.error("Create Poll Error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//List Poll
const listPoll = async (req, res) => {
  try {
    const polls = await pollModel.find({});
    res.json({
      success: true,
      polls,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//Delete Poll
const deletePoll = async (req, res) => {
  const { pollId } = req.params;
  try {
    const polls = await pollModel.findByIdAndDelete(pollId);
    res.json({
      success: true,
      message: "Poll Deleted Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//Vote Poll
const votePoll = async (req, res) => {
  const { pollId, selectedIndex, author } = req.body;
  try {
    const poll = await pollModel.findById(pollId);
    if (!poll) return res.json({ success: false, message: "Poll not found" });

    if (poll.poll.votedUsers.includes(author)) {
      return res.json({ success: false, message: "You have already voted!" });
    }
    // Increment vote (this assumes you have a `votes` field per participant)
    if (!poll.poll.participants[selectedIndex].count) {
      poll.poll.participants[selectedIndex].count = 0;
    }
    poll.poll.participants[selectedIndex].count += 1;
    poll.poll.votedUsers.push(author);
    await poll.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export { createPoll, listPoll, deletePoll, votePoll };
