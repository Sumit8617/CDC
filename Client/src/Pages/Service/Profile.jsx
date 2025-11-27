import React, { useState, useEffect } from "react";
import { Card, Button, PageLoaderWrapper } from "../../Components/index";
import {
  Edit2,
  Trophy,
  Star,
  Eye,
  EyeOff,
  Camera,
  User2Icon,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import useSignup from "../../Hooks/AuthHooks";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [modalBioInput, setModalBioInput] = useState("");

  const toggleVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  // Hook
  const { handleFetchUserDetails, handleUpdateProfile, user } = useSignup();
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch user details on mount if not present
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        if (!user || !user.fullName) {
          await handleFetchUserDetails(); // hook will update Redux user
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData();
  }, [user, handleFetchUserDetails]);

  // Loading guard
  if (localLoading) {
    return <PageLoaderWrapper loading={true} />;
  }

  if (!user) {
    return <div>Unauthorized Access</div>;
  }

  const finalUser = {
    name: user.fullName || "No Name",
    email: user.email || "No Email",
    college: "Jalpaiguri Government Engineering College",
    memberSince: user.since || "N/A",
    profilePic: user.profilePic || null,
    bio: user.bio || "Add Your Bio from the Edit Profile Button",
    stats: user.stats || {
      totalContests: 0,
      avgScore: "0%",
      bestRank: "--",
      successRate: "0%",
    },
    performance: user.performance || [
      { category: "Reasoning", score: 0 },
      { category: "Quant", score: 0 },
      { category: "Verbal", score: 0 },
      { category: "Logic", score: 0 },
      { category: "Data", score: 0 },
    ],
    achievements: user.achievements || [
      {
        title: "Top Performer",
        description: "Ranked in top 100 globally",
        icon: <Trophy className="w-7 h-7 text-yellow-500" />,
        color: "bg-yellow-100",
        earned: true,
      },
      {
        title: "Consistency Master",
        description: "Participated in 30 consecutive contests",
        icon: <Star className="w-7 h-7 text-blue-500" />,
        color: "bg-blue-100",
        earned: true,
      },
    ],
  };

  // Save bio update from modal
  const handleModalBioUpdate = async () => {
    try {
      if (!modalBioInput.trim()) return;
      await handleUpdateProfile({ bio: modalBioInput });
      setIsBioModalOpen(false);

      // Refresh user data
      await handleFetchUserDetails();
    } catch (err) {
      console.error("Bio update failed:", err);
    } finally {
      setTimeout(() => setUploadStatus(null), 2000);
    }
  };

  // Upload image
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
      await handleUpdateProfile(formData); // Use unified endpoint
      setUploadStatus("success");

      // Refresh user data
      await handleFetchUserDetails();
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadStatus("failed");
    }

    setTimeout(() => setUploadStatus(null), 2000);
  };

  const activeIndex = 1;

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      {/* Header */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </div>

      {/* Main Section */}
      <div className="pt-24 px-4 sm:px-6 md:px-8 space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "overview" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "achievements" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </Button>
          <Button
            variant={activeTab === "security" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("security")}
          >
            Security
          </Button>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`ml-28 mt-10 fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      z-50 px-4 py-2 rounded-lg text-white text-sm font-medium 
      ${uploadStatus === "uploading" && "bg-blue-600"} 
      ${uploadStatus === "success" && "bg-green-600"} 
      ${uploadStatus === "failed" && "bg-red-600"}`}
          >
            {uploadStatus === "uploading" && "Uploading profile photo..."}
            {uploadStatus === "success" &&
              "Profile photo updated successfully!"}
            {uploadStatus === "failed" && "Failed to upload image"}
          </div>
        )}

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Profile Picture */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
                    {finalUser.profilePic ? (
                      <img
                        src={finalUser.profilePic}
                        alt="User Profile Picture"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User2Icon className="w-16 h-16 text-gray-400" />
                    )}
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
                      {finalUser.name}
                    </h2>
                    <p className="text-gray-600">{finalUser.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="mb-2">{finalUser.college}</span> <br />
                      <span>User since {finalUser.memberSince}</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 sm:mt-0 flex items-center gap-2"
                  onClick={() => {
                    setModalBioInput(finalUser.bio); // prefill modal with current bio
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

            {/* Bio Modal */}
            {isBioModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                  <button
                    onClick={() => setIsBioModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-xl font-bold mb-4">Edit Bio</h2>
                  <textarea
                    className="w-full border p-2 rounded mb-4"
                    value={modalBioInput}
                    onChange={(e) => setModalBioInput(e.target.value)}
                    placeholder="Enter your bio"
                  />
                  <Button
                    className="w-full"
                    onClick={handleModalBioUpdate}
                    disabled={uploadStatus === "uploading"}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(finalUser.stats).map(([key, value], i) => (
                <Card
                  key={i}
                  className="p-5 rounded-2xl text-center border border-gray-100 bg-white shadow-sm"
                >
                  <div className="text-3xl font-extrabold text-indigo-700">
                    {value}
                  </div>
                  <div className="text-gray-600 mt-1 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                </Card>
              ))}
            </div>

            {/* Chart */}
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Performance by Category
              </h2>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={finalUser.performance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: "#555", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#555", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                      }}
                    />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={50}>
                      {finalUser.performance.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={index === activeIndex ? "#4F46E5" : "#6366F1"}
                          opacity={index === activeIndex ? 1 : 0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Achievements & Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {finalUser.achievements.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all ${
                    item.earned
                      ? "bg-white hover:shadow-md border-gray-100"
                      : "bg-gray-50 border-gray-200 opacity-70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className={`text-base font-semibold ${
                      item.earned ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      item.earned ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <Card className="p-8 rounded-2xl shadow-sm border border-gray-100 bg-white w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Security Settings
            </h2>

            {/* Change Password */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Change Password
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["current", "new", "confirm"].map((type, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 mb-2 capitalize">
                      {type} Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword[type] ? "text" : "password"}
                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Enter ${type} password`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(type)}
                        className="absolute right-3 top-3.5 text-gray-500"
                      >
                        {showPassword[type] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg">
                  Update Password
                </Button>
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            {/* 2FA */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account using OTP or
                authenticator apps.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Enable 2FA
              </Button>
            </section>

            <hr className="my-8 border-gray-200" />

            {/* Recovery */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Account Recovery Options
              </h3>
              <p className="text-gray-600 mb-4">
                Set recovery email or security questions to help regain access
                if you forget your password.
              </p>
              <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg">
                Manage Recovery Options
              </Button>
            </section>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
