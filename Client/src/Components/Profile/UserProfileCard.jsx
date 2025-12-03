import React, { useEffect, useState } from "react";
import { Camera, Edit2, User2Icon, Trophy, Star } from "lucide-react";
import { Button, Card, PageLoaderWrapper, Modal, Input } from "../index";
import useSignup from "../../Hooks/AuthHooks";

const UserProfileCard = () => {
  const { handleFetchUserDetails, handleUpdateProfile, user } = useSignup();
  const [localLoading, setLocalLoading] = useState(true);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [modalBioInput, setModalBioInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        if (!user || !user.fullName) {
          await handleFetchUserDetails();
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData();
  }, [user, handleFetchUserDetails]);

  if (localLoading) return <PageLoaderWrapper loading={true} />;
  if (!user) return <div>Unauthorized Access</div>;

  const finalUser = {
    name: user.fullName || "No Name",
    email: user.email || "No Email",
    college: "Jalpaiguri Government Engineering College",
    memberSince: user.since || "N/A",
    profilePic: user.profilePic || null,
    bio: user.bio || "Add Your Bio from the Edit Profile Button",
  };

  // Update Bio
  const handleModalBioUpdate = async () => {
    try {
      if (!modalBioInput.trim()) return;
      await handleUpdateProfile({ bio: modalBioInput });
      setIsBioModalOpen(false);
      await handleFetchUserDetails();
    } catch (err) {
      console.error("Bio update failed:", err);
    }
  };

  // upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadStatus("failed");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setUploadStatus("uploading");
      await handleUpdateProfile(formData);
      setUploadStatus("success");

      await handleFetchUserDetails();
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadStatus("failed");
    }

    setTimeout(() => setUploadStatus(null), 2000);
  };

  return (
    <>
      <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:brightness-105 hover:shadow-2xl hover:shadow-gray-300/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
              {/* IMAGE OR DEFAULT ICON */}
              {finalUser.profilePic ? (
                <img
                  src={finalUser.profilePic}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2Icon className="w-16 h-16 text-gray-400" />
              )}

              {/* UPLOAD STATUS INDICATOR */}
              {uploadStatus === "uploading" && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-white text-sm">
                  Uploading...
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="absolute top-0 left-0 w-full h-full bg-green-600/60 flex items-center justify-center text-white text-sm">
                  Uploaded ✓
                </div>
              )}

              {uploadStatus === "failed" && (
                <div className="absolute top-0 left-0 w-full h-full bg-red-600/60 flex items-center justify-center text-white text-sm">
                  Failed ✗
                </div>
              )}

              {/* CAMERA LABEL */}
              <label
                htmlFor="profilePicUpload"
                className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 
                flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>

              {/* INPUT */}
              <input
                id="profilePicUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadStatus === "uploading"}
              />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left mt-5">
              <h2 className="text-xl font-bold text-gray-900">
                {finalUser.name}
              </h2>
              <p className="text-gray-600">{finalUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="mb-2">{finalUser.college}</span> <br />
                <span>User since {finalUser.memberSince}</span>
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="primary"
            size="sm"
            className="mt-4 sm:mt-0 flex items-center gap-2 hover:cursor-pointer"
            onClick={() => {
              setModalBioInput(finalUser.bio);
              setIsBioModalOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        </div>

        <hr className="my-6 border-gray-200" />

        <p className="text-gray-700 text-center sm:text-left">
          {finalUser.bio}
        </p>
      </Card>

      {/* BIO EDIT MODAL */}
      <Modal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        title="Edit Bio"
      >
        <div className="space-y-4">
          <input
            value={modalBioInput}
            onChange={(e) => setModalBioInput(e.target.value)}
            placeholder="Write something about yourself"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button variant="primary" onClick={handleModalBioUpdate}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserProfileCard;
