import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiGrid, FiUser, FiMenu, FiX } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

const TeacherSidebar = () => {
  const name = sessionStorage.getItem("name");
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isReportsOpen, setIsReportsOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("isReportsOpen")) || false;
  });


  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleReports = () => setIsReportsOpen((prev) => !prev);

  const sessionClear = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const openModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) modal.close();
  };

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#171e29] text-white z-40 border-b border-[#2a3441]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-[#2a3441]"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="flex justify-center text-xl tracking-wider font-bold">
            Grade<span className="text-yellow-400">Ease</span>
          </div>
          <div className="flex items-center">
            <img
              src="admin.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen md:h-auto bg-[#1e2530] text-gray-300 w-full md:w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-y-14 md:translate-y-0"
            : "-translate-y-full md:translate-y-0"
        } top-0 left-0 md:translate-x-0 overflow-y-auto max-h-[calc(100vh-56px)] md:max-h-screen md:flex-shrink-0`}
      >
        <div className="hidden md:flex px-4 py-3 bg-[#171e29] text-white justify-center text-xl tracking-wider font-bold">
          Grade<span className="text-yellow-400">Ease</span>
        </div>

        {/* User info - hidden on mobile */}
        <div className="hidden md:flex items-center px-4 py-3 border-b border-[#2a3441]">
          <div className="flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/women/32.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-600"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs text-yellow-500">Teacher</p>
          </div>
          <button className="p-1 rounded-full hover:bg-[#2a3441]">
            <FiMoreVertical size={16} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/teacher-dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm ${
                    isActive ? "bg-teal-500 text-white" : "hover:bg-[#2a3441]"
                  }`
                }
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FiGrid size={16} />
                </span>
                <span className="flex-1">Dashboard</span>
              </NavLink>
            </li>

              {/* Reports */}
                      <li>
                        <button
                          onClick={toggleReports}
                          className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441] w-full text-left"
                        >
                          <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                            <FiBarChart2 size={16} />
                          </span>
                          <span className="flex-1">Proficiency Reports</span>
                          <span>
                            {isReportsOpen ? (
                              <FiChevronDown size={16} />
                            ) : (
                              <FiChevronRight size={16} />
                            )}
                          </span>
                        </button>
                        {isReportsOpen && (
                          <ul className="pl-8 space-y-1">
                            <li>
                              <NavLink
                                to="/teacher-section"
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-2.5 text-sm ${
                                    isActive
                                      ? "bg-teal-500 text-white"
                                      : "hover:bg-[#2a3441]"
                                  }`
                                }
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                                  <FiBarChart2 size={16} />
                                </span>
                                <span className="flex-1">By Section</span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                    to="/teacher-grade"
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-2.5 text-sm ${
                                    isActive
                                      ? "bg-teal-500 text-white"
                                      : "hover:bg-[#2a3441]"
                                  }`
                                }
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                                  <FiBarChart2 size={16} />
                                </span>
                                <span className="flex-1">By Grade Level</span>
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>

            <li>
              <NavLink
                to="/teacher-profile"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm ${
                    isActive ? "bg-teal-500 text-white" : "hover:bg-[#2a3441]"
                  }`
                }
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FiUser size={16} />
                </span>
                <span className="flex-1">User Profile</span>
              </NavLink>
            </li>

            {/* Logout */}
            <li>
              <div
                className="flex items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-[#2a3441]"
                onClick={openModal}
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <RiLogoutCircleLine size={16} />
                </span>
                <span className="flex-1">Logout</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="px-4 py-2 text-xs text-gray-500 border-t border-[#2a3441]">
          <p>GradeEase © 2025</p>
          <p className="text-right">v1.0</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-base">Confirm Action</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="flex justify-end">
            <button
              className="btn btn-error text-white flex items-center"
              onClick={sessionClear}
            >
              <RiLogoutCircleLine className="mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </dialog>
    </aside>
  );
};

export default TeacherSidebar;
