import { useEffect, useState } from "react";
import supabase from "../SupabaseClient.jsx";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("Users").select("id, name, email, role, status");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";

    const { error } = await supabase
      .from("Users")
      .update({ status: newStatus })
      .eq("id", userId);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    const { error } = await supabase.from("Users").delete().eq("id", userToDelete.id);
  
    if (error) {
      console.error("Error deleting user:", error);
    } else {
      window.location.reload();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-semibold">Manage User Accounts</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border bg-white rounded-md"
          />
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border">{user.status}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleBlock(user.id, user.status)}
                        className={`btn btn-sm mr-2 ${
                          user.status === "Blocked" ? "btn-success" : "btn-neutral"
                        } text-white`}
                      >
                        {user.status === "Blocked" ? "Unblock" : "Block"}
                      </button>
                      <button 
                        className="btn btn-error text-white btn-sm"
                        onClick={() => {
                          setUserToDelete(user);
                          document.getElementById("delete_confirm_modal").showModal();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <dialog id="delete_confirm_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Are you sure you want to delete this user?
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                document.getElementById("delete_confirm_modal").close();
                setUserToDelete(null);
              }}
            >
              ✕
            </button>

            {userToDelete && (
              <div className="mb-4">
                <p>Name: {userToDelete.name}</p>
                <p>Email: {userToDelete.email}</p>
                <p>Role: {userToDelete.role}</p>
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  document.getElementById("delete_confirm_modal").close();
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  handleDelete();
                  document.getElementById("delete_confirm_modal").close();
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default UserAccounts;
