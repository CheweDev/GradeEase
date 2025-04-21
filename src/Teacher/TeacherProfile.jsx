import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import supabase from "../SupabaseClient.jsx";


const TeacherProfile = () => {
  const [teacherInfo, setTeacherInfo] = useState([]);
  const teacherName = sessionStorage.getItem("name");
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    const { data } = await supabase.from("Advisers")
    .select("*")
    .eq("name", teacherName)
    .single();
    setTeacherInfo(data);
  };

  const fetchPasswordData = async (e) => {
    e.preventDefault();

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password.newPassword)) {
        alert("New password must be at least 8 characters long, include at least one number, one lowercase letter, and one uppercase letter.");
        return;
    }

    const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("name", teacherName)
        .single();

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    if (!data || data.password !== password.oldPassword) {
        alert("Password Incorrect");
        return;
    }

    if (password.newPassword !== password.confirmPassword) {
        alert("New password and confirm password do not match");
        return;
    }

    updatePassword(); 
};

const updatePassword = async () => {
  const { data, error } = await supabase
    .from("Users")
    .update({
      password: password.newPassword,
    })
    .eq("name", teacherName);
  if (error) {
    console.error("Error inserting data:", error);
    alert("Error inserting data");
  } else {
    console.log("Data inserted successfully:", data);
    window.location.reload();
  }
};



  // Show/Hide password state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form input changes for profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prev) => ({ ...prev, [name]: value }));
  };


  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
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
      <TeacherSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Student Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Avatar and Name */}
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {teacherInfo.name}
                </h2>
                <p className="text-sm text-gray-500">Advisory: {teacherInfo.grade} - {teacherInfo.advisory}</p>
              </div>
            </div>
            {/* Edit Profile Button */}
            <div className="flex gap-3">
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
        </div>

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
                <button onClick={fetchPasswordData} className="btn bg-[#333] text-white">
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

export default TeacherProfile;
