import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    // ma hoa password cho vao database
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hash,
     
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
    try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));
    
    // tao 1 JSON Web Token gui den cookie, chua truong id va isAdmin KHI LOGIN
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
       
      })
      // httpOnly: true, // de bao mat hon , ko duoc truy cap cookie qua javascript
    //  res.cookie("user_id", user._id.toString(), {
    //   });
      
      res.status(200).json({ ...otherDetails, isAdmin }); // cái trả về sẽ dùng ở Login.jsx- phần dispatch(kq trả về đẩy vào payload/ cũng là trong localStorage)
  } catch (err) {
    next(err);
  }
    };