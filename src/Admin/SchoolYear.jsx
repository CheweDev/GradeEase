import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";

const SchoolYear = () => {
  const [schoolYears, setSchoolYears] = useState([
    { year: "2019-2020", isCurrent: false },
    { year: "2018-2019", isCurrent: false },
    { year: "2017-2018", isCurrent: true },
    { year: "2016-2017", isCurrent: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newYear, setNewYear] = useState("");

  // Function to set a year as current
  const setAsCurrent = (year) => {
    setSchoolYears((prev) =>
      prev.map((item) => ({
        ...item,
        isCurrent: item.year === year,
      }))
    );
  };

  // Function to add a new school year
  const addSchoolYear = () => {
    if (!newYear) return;
    setSchoolYears([...schoolYears, { year: newYear, isCurrent: false }]);
    setNewYear("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage School Years</h2>
          <button
            className="btn bg-[#333] text-white flex"
            onClick={() => setIsModalOpen(true)}
          >
            <IoAddCircleSharp size={18} />
            School Year
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>School Year</th>
                <th>Current</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schoolYears.map((item) => (
                <tr
                  key={item.year}
                  className={`border-t ${item.isCurrent ? "bg-green-100" : ""}`}
                >
                  <td className="p-3">{item.year}</td>
                  <td className="p-3">
                    {item.isCurrent ? (
                      <span className="text-green-700 font-semibold">
                        Current
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="p-3">
                    {!item.isCurrent && (
                      <button
                        className="btn btn-sm btn-info text-white"
                        onClick={() => setAsCurrent(item.year)}
                      >
                        Set as Current
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding New Year */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Add New School Year
              </h3>
              <label className="input w-full mb-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>

                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder="Enter school year (e.g., 2024-2025)"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[#333] text-white"
                  onClick={addSchoolYear}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SchoolYear;
