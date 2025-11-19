import { deleteFromCloudinary, uploadOnCloudinary } from "../../Config/Cloudinary.config.js";
import { User } from "../../Service/Models/User.models.js";

import {asynchandler,APIERR, APIRES}from "../index.utils.js";

const updateProfile = asynchandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  if(!imageLocalPath){
    throw new APIERR(400,"Profile Picture is required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new APIERR(404, "User not found");

  if(user.profilePic?.publicId){
    await deleteFromCloudinary(user.profilePic.publicId)
  }

  const profileImage = await uploadOnCloudinary(imageLocalPath)
  if (!profileImage.url) {
        throw new APIERR(400, "Error while uploading on avatar")
        
    }
    user.profilePic = {
      url: profileImage.url,
      publicId: profileImage.public_id,
    };
   await user.save({ validateBeforeSave: false });
      return res.status(200).json(
      new APIRES(200, user , "Profile Updated Successfully" )
    )
});
  

export { updateProfile };