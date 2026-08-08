import React, { useState, useMemo } from "react";
import { Card, Button, Modal, PageLoaderWrapper } from "../../Components/index";
import { useAdminStats } from "../../Hooks/AdminStatsHook";
import { useDispatch } from "react-redux";
import { blockUser, unblockUser, deleteUserAdmin } from "../../lib/StatsSlice";
import {
  Mail,
  Shield,
  Ban,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
} from "lucide-react";

const ManageUsers = () => {
  const { userDetails, loading, error, refresh } = useAdminStats();
  const dispatch = useDispatch();

  const [blockLoading, setBlockLoading] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

  const handleEdit = (id) => {
    alert(`Edit user feature coming soon with this ID : ${id}`);
  };

  const handleBlock = async (user) => {
    if (!user) return;
    setBlockLoading(user._id);
    try {
      if (user.isBlocked) {
        await dispatch(unblockUser(user._id)).unwrap();
        alert("User unblocked successfully!");
      } else {
        await dispatch(blockUser(user._id)).unwrap();
        alert("User blocked successfully!");
      }
      // Refresh the user list to get updated isBlocked status
      await refresh();
    } catch (err) {
      console.error("Block/Unblock failed:", err);
      alert(err || "Failed to update user status");
    } finally {
      setBlockLoading(null);
    }
  };

  const openDeleteModal = (user) => {
    setModalOpen(true);
    setSelectedUser(user);
    setDeleteMessage("");
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    setDeleteMessage("");
    try {
      await dispatch(deleteUserAdmin(selectedUser._id)).unwrap();
      setDeleteMessage("User deleted successfully!");
      setModalOpen(false);
    } catch (err) {
      setDeleteMessage(err || "Failed to delete user. Try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userDetails;

    const query = searchQuery.toLowerCase();
    return userDetails?.filter(
      (user) =>
        user?.fullName?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        user?.role?.toLowerCase().includes(query)
    );
  }, [userDetails, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page) => setCurrentPage(page);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <title>CDC JGEC | Manage Users</title>
      <meta name="description" content="This is the manage users page" />
      <section className="min-h-screen flex flex-col space-y-6 md:pl-64 px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Manage Users
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all registered users and their activity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Filter */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <Button
              variant="indigo"
              size="md"
              onClick={refresh}
              className="whitespace-nowrap"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Results Info */}
        {!loading && !error && filteredUsers?.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {searchQuery ? (
                <>
                  Found{" "}
                  <span className="font-semibold">{filteredUsers.length}</span>{" "}
                  user{filteredUsers.length !== 1 ? "s" : ""}
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold">
                    {indexOfFirstUser + 1}-
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{filteredUsers.length}</span>{" "}
                  users
                </>
              )}
            </p>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Users Loading */}
        {loading && <PageLoaderWrapper loading={loading} />}

        {/* Users Error */}
        {error && (
          <Card className="p-8 text-center bg-red-50 border border-red-300 rounded-xl">
            <p className="text-red-600 font-medium">{error}</p>
          </Card>
        )}

        {/* User List */}
        {!loading && !error && currentUsers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentUsers.map((user) => (
              <Card
                key={user._id}
                className="
                  relative
                  p-6 bg-white shadow-sm border border-gray-200 rounded-2xl 
                  hover:shadow-lg hover:border-indigo-300 
                  transition-all duration-300
                  group
                "
              >
                {/* Edit Button - Top Right */}
                <Button
                  variant="secondary"
                  size="sm"
                  round="md"
                  className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEdit(user._id)}
                >
                  <Edit size={16} />
                </Button>

                {/* Header */}
                <div className="flex items-center justify-start mb-6 gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-indigo-200 flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
                    <img
                      src={user?.profilePic?.url || "/default-avatar.png"}
                      alt={`${user?.fullName} Profile Picture`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {user?.fullName}
                    </h2>

                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Mail className="w-4 h-4 opacity-70 shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="text-sm text-gray-700 mb-5 space-y-3">
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span className="text-gray-600">Role:</span>
                    <span className="font-semibold capitalize">
                      {user?.role}
                    </span>
                  </p>

                  <div className="grid grid-cols-2 gap-4 bg-linear-to-br from-gray-50 to-indigo-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">
                        Contests Taken
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {user?.contestsTaken ?? 0}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">
                        Avg Score
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {user?.avgScore ?? 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant={user?.isBlocked ? "indigo" : "danger"}
                    size="sm"
                    round="md"
                    className="flex items-center gap-1.5"
                    onClick={() => handleBlock(user)}
                    disabled={blockLoading === user._id}
                  >
                    {user?.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                    {blockLoading === user._id ? "Loading..." : (user?.isBlocked ? "Unblock" : "Block")}
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    round="md"
                    className="flex items-center gap-1.5"
                    onClick={() => openDeleteModal(user)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <Card className="p-12 text-center bg-linear-to-br from-gray-50 to-indigo-50 border-2 border-dashed border-gray-300 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-700 font-semibold text-xl mb-2">
                  {searchQuery ? "No matching users found" : "No users found"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery
                    ? `No users match your search "${searchQuery}"`
                    : "There are no registered users yet."}
                </p>
              </div>
            </Card>
          )
        )}

        {/* Pagination */}
        {!loading && !error && filteredUsers?.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            {/* Page info for mobile */}
            <p className="text-sm text-gray-600 sm:hidden">
              Page {currentPage} of {totalPages}
            </p>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* First Page */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="hidden sm:flex items-center gap-1"
              >
                <ChevronsLeft size={16} />
              </Button>

              {/* Previous Page */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1 text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`
                        px-3 py-1 rounded-md font-medium transition-all
                        ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }
                      `}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Page */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </Button>

              {/* Last Page */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="hidden sm:flex items-center gap-1"
              >
                <ChevronsRight size={16} />
              </Button>
            </div>

            {/* Items per page info */}
            <p className="hidden sm:block text-sm text-gray-600">
              Showing {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {modalOpen && selectedUser && (
          <Modal isOpen={modalOpen} onClose={closeDeleteModal}>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Delete {selectedUser.fullName}?
              </h2>
              <p className="text-gray-600 text-sm text-center max-w-sm">
                This action cannot be undone. This will permanently delete the
                user account and all associated data.
              </p>

              {deleteMessage && (
                <p
                  className={`${
                    deleteMessage.includes("Failed")
                      ? "text-red-600 bg-red-50"
                      : "text-green-600 bg-green-50"
                  } font-medium px-4 py-2 rounded-lg`}
                >
                  {deleteMessage}
                </p>
              )}

              <div className="flex gap-3 mt-2 w-full">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1"
                >
                  {deleteLoading ? "Deleting..." : "Delete User"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </section>
    </>
  );
};

export default ManageUsers;
