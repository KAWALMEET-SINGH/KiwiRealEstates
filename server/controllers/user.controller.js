import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    massage: "Message",
  });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Invalid User Id"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 12);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Invalid User Id"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User Deleted Sucessfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({userRef: req.params.id});
      res
      .status(200)
      .json(listings)
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your owm listings."));
  }
};
