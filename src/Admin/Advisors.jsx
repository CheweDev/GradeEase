import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";

const Advisors = () => {
  const [advisors, setAdvisors] = useState([
    {
      id: 1,
      name: "Mr. Smith",
      advisory: ["Section A", "Section B"],
      grade: "Grade 10",
    },
    { id: 2, name: "Ms. Johnson", advisory: ["Section C"], grade: "Grade 9" },
    {
      id: 3,
      name: "Mr. Lee",
      advisory: ["Section D", "Section E"],
      grade: "Grade 8",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAdvisory, setNewAdvisory] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // Open modal for adding/editing advisors
  const openModal = (advisor = null) => {
    if (advisor) {
      setEditingAdvisor(advisor);
      setNewName(advisor.name);
      setNewAdvisory(advisor.advisory.join(", ")); // Convert array to string
      setNewGrade(advisor.grade);
    } else {
      setEditingAdvisor(null);
      setNewName("");
      setNewAdvisory("");
      setNewGrade("");
    }
    setIsModalOpen(true);
  };

  // Add new advisor
  const addAdvisor = () => {
    if (!newName || !newAdvisory || !newGrade) return;
    setAdvisors([
      ...advisors,
      {
        id: Date.now(),
        name: newName,
        advisory: newAdvisory.split(",").map((s) => s.trim()),
        grade: newGrade,
      },
    ]);
    setIsModalOpen(false);
  };

  // Update advisor
  const updateAdvisor = () => {
    setAdvisors(
      advisors.map((item) =>
        item.id === editingAdvisor.id
          ? {
              ...item,
              name: newName,
              advisory: newAdvisory.split(",").map((s) => s.trim()),
              grade: newGrade,
            }
          : item
      )
    );
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredAdvisors = advisors.filter((advisor) => {
    return (
      (selectedGrade === "" || advisor.grade === selectedGrade) &&
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Filters */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Advisors</h2>
          <div className="flex gap-4 mb-4">
            <select
              className="p-2 border rounded w-1/3"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="">All Grades</option>
              {[...new Set(advisors.map((a) => a.grade))].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="p-2 border rounded w-2/3"
              placeholder="Search by advisor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn bg-[#333] text-white flex"
              onClick={() => openModal()}
            >
              <IoAddCircleSharp size={18} />
              Add Advisor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Advisor Name</th>
                <th>Advisory Section(s)</th>
                <th>Grade Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvisors.length > 0 ? (
                filteredAdvisors.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.advisory.join(", ")}</td>
                    <td className="p-3">{item.grade}</td>
                    <td className="p-3">
                      <button
                        className="btn btn-sm bg-info text-white"
                        onClick={() => openModal(item)}
                      >
                        <FiEdit className="inline-block" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No advisors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Advisor */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {editingAdvisor ? "Edit Advisor" : "Add New Advisor"}
              </h3>

              {/* Advisor Name Input */}
              <label className="input w-full mb-4">
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder="Enter advisor name (e.g., Mr. Smith)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </label>

              {/* Advisory Sections Input */}
              <label className="input w-full mb-4">
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder="Enter advisory sections (comma separated)"
                  value={newAdvisory}
                  onChange={(e) => setNewAdvisory(e.target.value)}
                />
              </label>

              {/* Grade Level Input */}
              <label className="input w-full mb-4">
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder="Enter grade level (e.g., Grade 10)"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
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
                  onClick={editingAdvisor ? updateAdvisor : addAdvisor}
                >
                  {editingAdvisor ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Advisors;
