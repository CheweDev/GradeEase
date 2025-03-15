import { useState } from "react";
import StudentSidebar from "./StudentSidebar.jsx";
import Header from "../Admin/Header.jsx";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

// Dummy data for student profile
const StudentProfile = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "John Doe",
    id: "20241001",
    section: "Grade 10 - A",
    gradeLevel: "10",
    email: "johndoe@email.com",
    contact: "+1 234 567 890",
    dob: "2005-08-15",
    address: "1234 Student Ave, Cityville",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Dummy avatar URL
  });

  const [editableInfo, setEditableInfo] = useState({ ...studentInfo });
  const [imagePreview, setImagePreview] = useState(studentInfo.avatar);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Show/Hide password state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form input changes for profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change (upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditableInfo((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile information
  const handleSubmitProfile = (e) => {
    e.preventDefault();
    setStudentInfo(editableInfo);
    document.getElementById("my_modal_3").close(); // Close the profile edit modal
  };

  // Submit password change
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Here you can handle password validation and update logic
    console.log("Password changed:", password);
    document.getElementById("change_password_modal").close(); // Close the password change modal
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Student Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Avatar and Name */}
            <div className="flex items-center space-x-4">
              <img
                src={studentInfo.avatar}
                alt="Student Avatar"
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
              <div>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {studentInfo.name}
                </h2>
                <p className="text-sm text-gray-500">ID: {studentInfo.id}</p>
              </div>
            </div>
            {/* Edit Profile Button */}
            <div className="flex gap-3">
              <button
                className="btn btn-sm btn-outline"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Edit Profile
              </button>
              {/* Change Password Button */}
              <button
                className="btn btn-sm btn-outline"
                onClick={() =>
                  document.getElementById("change_password_modal").showModal()
                }
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="divider"></div>

          {/* Profile Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition duration-300">
              <p className="text-lg font-medium text-gray-600">Section</p>
              <p className="text-lg text-gray-800">{studentInfo.section}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition duration-300">
              <p className="text-lg font-medium text-gray-600">Grade Level</p>
              <p className="text-lg text-gray-800">{studentInfo.gradeLevel}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition duration-300">
              <p className="text-lg font-medium text-gray-600">Email</p>
              <p className="text-lg text-gray-800">{studentInfo.email}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700 font-medium">Contact</p>
              <p className="text-lg text-gray-500">{studentInfo.contact}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700 font-medium">Date of Birth</p>
              <p className="text-lg text-gray-500">{studentInfo.dob}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700 font-medium">Address</p>
              <p className="text-lg text-gray-500">{studentInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Profile</h3>
            <form method="dialog" onSubmit={handleSubmitProfile}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => document.getElementById("my_modal_3").close()}
              >
                ✕
              </button>

              {/* Form Fields */}
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-gray-700">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 border-gray-300"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered w-full max-w-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editableInfo.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={editableInfo.section}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Grade Level</label>
                  <input
                    type="text"
                    name="gradeLevel"
                    value={editableInfo.gradeLevel}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Modal Footer with buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("my_modal_3").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-[#333] text-white">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* Change Password Modal */}
        <dialog id="change_password_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Change Password</h3>
            <form method="dialog" onSubmit={handleSubmitPassword}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() =>
                  document.getElementById("change_password_modal").close()
                }
              >
                ✕
              </button>

              {/* Password Change Fields */}
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-gray-700">Old Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={handlePasswordChange}
                      className="input input-bordered w-full"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      className="input input-bordered w-full"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input input-bordered w-full"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer with buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    document.getElementById("change_password_modal").close()
                  }
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-[#333] text-white">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default StudentProfile;
