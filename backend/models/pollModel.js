import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  poll: {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    participants: [
      {
        name: String,
        image: String,
        count: Number,
      },
    ],
    votedUsers: {
      type: [String], // store author names or user IDs
      default: [],
    },
  },
});

const pollModel = mongoose.models.poll || mongoose.model("Poll", pollSchema);

export default pollModel;
