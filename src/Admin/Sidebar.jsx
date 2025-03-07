import { useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import { LiaSchoolSolid } from "react-icons/lia";
import { LuCalendar1, LuClipboardList } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import { TbChecklist } from "react-icons/tb";
import { FaAward } from "react-icons/fa6";
import {
  FiGrid,
  FiBarChart2,
  FiUser,
  FiMoreVertical,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const [isMasterListOpen, setIsMasterListOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMasterList = () => setIsMasterListOpen(!isMasterListOpen);
  const toggleReports = () => setIsReportsOpen(!isReportsOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
              src="https://placehold.co/400"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden mt-14"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - becomes dropdown on mobile */}
      <div
        className={`fixed md:static flex flex-col h-screen md:h-auto bg-[#1e2530] text-gray-300 w-full md:w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-y-14 md:translate-y-0"
            : "-translate-y-full md:translate-y-0"
        } top-0 left-0 md:translate-x-0 overflow-y-auto max-h-[calc(100vh-56px)] md:max-h-screen md:flex-shrink-0`}
      >
        {/* Desktop Header - hidden on mobile */}
        <div className="hidden md:flex px-4 py-3 bg-[#171e29] text-white justify-center text-xl tracking-wider font-bold">
          Grade
          <span className="text-yellow-400">Ease</span>
        </div>

        {/* User info - hidden on mobile */}
        <div className="hidden md:flex items-center px-4 py-3 border-b border-[#2a3441]">
          <div className="flex-shrink-0">
            <img
              src="https://placehold.co/400"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-600"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">Marc Gerasmio</p>
            <p className="text-xs text-yellow-500">Super Admin</p>
          </div>
          <button className="p-1 rounded-full hover:bg-[#2a3441]">
            <FiMoreVertical size={16} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2.5 text-sm bg-teal-500 text-white"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FiGrid size={16} />
                </span>
                <span className="flex-1">Dashboard</span>
              </a>
            </li>

            {/* Master List */}
            <li>
              <a
                href="#"
                onClick={toggleMasterList}
                className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <LuClipboardList size={16} />
                </span>
                <span className="flex-1">Master list</span>
                <span>
                  {isMasterListOpen ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  )}
                </span>
              </a>
              {isMasterListOpen && (
                <ul className="pl-8 space-y-1">
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <LuCalendar1 size={16} />
                      </span>
                      <span className="flex-1">School Year</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <TbChecklist size={16} />
                      </span>
                      <span className="flex-1">Manage Grade</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <FaSchoolCircleCheck size={16} />
                      </span>
                      <span className="flex-1">Section</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <FaChalkboardTeacher size={16} />
                      </span>
                      <span className="flex-1">Teacher</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <PiStudentFill size={16} />
                      </span>
                      <span className="flex-1">Student</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <LiaSchoolSolid size={16} />
                      </span>
                      <span className="flex-1">Subject</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <FaAward size={16} />
                      </span>
                      <span className="flex-1">Academic Grade</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Reports */}
            <li>
              <a
                href="#"
                onClick={toggleReports}
                className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
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
              </a>
              {isReportsOpen && (
                <ul className="pl-8 space-y-1">
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <FiBarChart2 size={16} />
                      </span>
                      <span className="flex-1">By Section</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                        <FiBarChart2 size={16} />
                      </span>
                      <span className="flex-1">By Grade Level</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* User */}
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2.5 text-sm hover:bg-[#2a3441]"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FiUser size={16} />
                </span>
                <span className="flex-1">User</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="px-4 py-2 text-xs text-gray-500 border-t border-[#2a3441]">
          <p>GradeEase © 2025</p>
          <p className="text-right">v1.0</p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 pt-14 md:pt-0">
        {/* Your main content goes here */}
      </div>
    </aside>
  );
};

export default Sidebar;
