import React, { useState, useEffect } from "react";
import { Card, Button, Modal, PageLoaderWrapper } from "../../Components/index";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  BarChart3,
  Users,
  Settings,
  User2Icon,
  Camera,
  Edit2,
} from "lucide-react";
import { useAdminStats } from "../../Hooks/AdminStatsHook";
import useSignup from "../../Hooks/AuthHooks";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { adminDetails, stats, recentContests, userDetails, loading, error } =
    useAdminStats();

  const { handleFetchUserDetails, handleUpdateProfile } = useSignup();
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [modalBioInput, setModalBioInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);

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

  // Upload Image
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

  useEffect(() => {
    handleFetchUserDetails();
  }, []);

  const admin = adminDetails || null;

  // Dynamic stats
  const quickStats = [
    {
      label: "Total Contests",
      value: recentContests?.length || 0,
      icon: <Trophy className="w-5 h-5" />,
      color: "text-yellow-600",
    },
    {
      label: "Active Users",
      value: userDetails?.length || 0,
      icon: <Users className="w-5 h-5" />,
      color: "text-indigo-600",
    },
    {
      label: "Reports Reviewed",
      value: stats?.reportsReviewed || 0,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-green-600",
    },
  ];

  console.log("Loading:", loading, "Error:", error, "Admin:", admin);

  return (
    <>
      {/* Page Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <PageLoaderWrapper loading={loading} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="p-8 text-center bg-red-50 border border-red-300 rounded-xl">
          <p className="text-red-600 font-medium">{error}</p>
        </Card>
      )}

      {/* Main Profile Content */}
      {!loading && !error && admin && (
        <div className="min-h-auto flex flex-col gap-6 md:pl-64">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {admin?.fullName
                ? String(`${admin?.fullName.split(" ")[0]}'s Profile`)
                : "Admin Profile"}
            </h1>
            <Button
              variant="indigo"
              size="md"
              round="md"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="w-4 h-4 mr-2" /> Admin Settings
            </Button>
          </div>

          <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:brightness-105 hover:shadow-2xl hover:shadow-gray-300/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Profile Picture */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
                  {admin.profilePic ? (
                    <img
                      src={admin?.profilePic?.url}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User2Icon className="w-16 h-16 text-gray-400" />
                  )}

                  {/* Upload Status */}
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

                  {/* Camera Label */}
                  <label
                    htmlFor="profilePicUpload"
                    className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </label>

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
                    {admin.fullName || "Name not found"}
                  </h2>
                  <p className="text-gray-600">
                    {admin.email || "mail not found"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="mb-2">
                      {admin.role || "Role not found"}
                    </span>{" "}
                    <br />
                    <span>
                      Joined{" "}
                      {admin?.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Date Unknown"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="primary"
                size="sm"
                className="mt-4 sm:mt-0 flex items-center gap-2 hover:cursor-pointer"
                onClick={() => {
                  setModalBioInput(admin.bio);
                  setIsBioModalOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            <hr className="my-6 border-gray-200" />

            <p className="text-gray-700 text-center sm:text-left">
              {admin.bio}
            </p>
          </Card>

          {/* BIO EDIT MODAL */}
          <Modal
            isOpen={isBioModalOpen}
            onClose={() => setIsBioModalOpen(false)}
            title="Edit Bio"
          >
            <div className="space-y-4 flex flex-col justify-center">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <Card
                key={index}
                className="p-5 text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`flex justify-center mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
