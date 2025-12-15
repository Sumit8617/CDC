import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../config/cloudinary.config.js";
import { User } from "../../Service/Models/User.models.js";

import { asynchandler, APIERR, APIRES } from "../index.utils.js";

const updateProfile = asynchandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  const { bio } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) throw new APIERR(404, "User not found");

  // Update profile picture if file provided
  if (imageLocalPath) {
    if (user.profilePic?.publicId) {
      await deleteFromCloudinary(user.profilePic.publicId);
    }

    const profileImage = await uploadOnCloudinary(imageLocalPath);

    if (!profileImage || !profileImage.url) {
      throw new APIERR(400, "Error while uploading profile picture");
    }

    user.profilePic = {
      url: profileImage.url,
      publicId: profileImage.public_id,
    };
  }

  // Update bio if provided
  if (bio) user.bio = bio;

  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new APIRES(200, user, "Profile Updated Successfully"));
});

export { updateProfile };
