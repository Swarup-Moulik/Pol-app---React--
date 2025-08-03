import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
//Create Account
const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    //Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({
        success: false,
        message: "Account Already exists",
      });
    }
    //Validating email and password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Give correct email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length should be more than 8",
      });
    }
    //Encypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //New User
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({
      success: true,
      name,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
//Login Account
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Account does not exist.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    const name = user.name;
    if (match) {
      const token = createToken(user._id);
      res.json({
        success: true,
        name,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { register, login };
