import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Message from "../models/message.js";
import Post from '../models/post.js';

export const register = async (request, response) => {
  const { username, email, password, confirmPassword } = request.body;

  try {
    const existingUsername = await User.findOne({ username });

    const existingEmail = await User.findOne({ email });

    if (existingUsername)
      return response.status(404).json({ message: "User already exists" });
    if (existingEmail)
      return response.status(404).json({ message: "Username already exists" });

    if (password !== confirmPassword)
      return response.status(400).json({ message: "Passwords do not match " });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    jwt.sign(
      { userId: result._id, username },
      process.env.SECRET_KEY,
      {},
      (err, token) => {
        if (err) throw err;
        response
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: result._id,
          });
      }
    );

    response
      .status(200)
      .json({ result: result, token: request.headers.cookie.split("=")[1] });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signin = async (request, response) => {
  const { username, password } = request.body;

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser)
      return response.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return response.status(400).json({ message: "Invalid credentials" });

    jwt.sign(
      { userId: existingUser._id, username },
      process.env.SECRET_KEY,
      {},
      (err, token) => {
        if (err) throw err;
        response
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(200)
          .json({ id: existingUser._id, result: existingUser, token });
      }
    );
  } catch (error) {
    response.status(500).json("error");
    console.log(error);
  }
};

export const singleUser = async (request, response) => {
  const { userId } = request.params;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser)
      return response.status(404).json({ message: "User does not exist" });

    response.status(200).json({ existingUser });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const editEmail = async (request, response) => {
  const { oldEmail, newEmail, password } = request.body;

  try {
    const existingUser = await User.findOne({ email: oldEmail });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return response.status(400).json({ message: "Invalid credentials" });

    const updatedUser = await User.findOneAndUpdate(
      { email: oldEmail },
      { $set: { email: newEmail } },
      { new: true }
    );

    response.status(200).json({ result: updatedUser });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const editUsername = async (request, response) => {
  const { oldUsername, newUsername, password } = request.body;

  try {
    const existingUser = await User.findOne({ username: oldUsername });

    if (
      existingUser.username !== oldUsername ||
      existingUser.username === newUsername
    )
      return response.status(404).json({ message: "Error with username" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return response.status(400).json({ message: "Invalid credentials" });

    const updatedUser = await User.findOneAndUpdate(
      { username: oldUsername },
      { $set: { username: newUsername } },
      { new: true }
    );

    const updatedPosts = await Post.updateMany(
      { username: oldUsername },
      { $set: {username: newUsername} },
      { new: true }
    )

    response.status(200).json({ result: updatedUser });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const editPassword = async (request, response) => {
  const { username, oldPassword, newPassword, confirmNewPassword } =
    request.body;

  try {
    const existingUser = await User.findOne({ username: username });

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return response.status(400).json({ message: "Invalid credentials" });

    if (newPassword !== confirmNewPassword)
      return response
        .status(400)
        .json({ message: "New password does not match" });

    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $set: { password: newHashedPassword } },
      { new: true }
    );

    response.status(200).json({ result: updatedUser });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (request, response) => {
  const { currentUsername, password, confirmationMessage } = request.body;

  try {
    const existingUser = await User.findOne({ username: currentUsername });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return response.status(400).json({ message: "Invalid credentials" });

    if (confirmationMessage !== "I AM SURE, DELETE MY ACCOUNT")
      return response
        .status(400)
        .json({ message: "Invalid confirmation message" });
    await User.deleteOne({ username: currentUsername });
    return response.status(200).json({ message: "User deleted" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const profile = async (request, response) => {
    const token = request.cookies?.token;
    if (token) {
        try {
            User.findOne({ _id: request.params.id })
                .select("-password")
                .then(user => {
                    Post.find({ postedBy: request.params.id })
                        .populate("postedBy", "_id name")
                        .then((posts) => {
                            res.json({ user, posts })
                        }).catch(error => {
                            return res.status(422).json({ error: error })
                        })
                }).catch(error => {
                    return response.status(404).json({ error: "User not found" })
                })
        }
        catch (error) {
            response.status(500).json('error');
        }
    } else {
        response.status(401).json('no token');
    }
};

export const personalProfile = async (request, response) => {
    const token = request.cookies?.token;
    if (token) {
        try {
            jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
                if (err) throw err;
                response.json(userData);
            });
        } catch (error) {
            response.status(500).json("error");
            console.log(error);
        }
    } else {
        response.status(401).json("no token");
    }
};

async function getUserDataFromRequest(request) {
  return new Promise((resolve, reject) => {
    const token = request.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

export const messages = async (request, response) => {
  const { userId } = request.params;
  const userData = await getUserDataFromRequest(request);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  response.json(messages);
};

export const people = async (requst, response) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  response.json(users);
};