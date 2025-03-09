import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";

const Section = () => {
  const [sections, setSections] = useState([
    { id: 1, name: "Section A", grade: "Grade 10" },
    { id: 2, name: "Section B", grade: "Grade 9" },
    { id: 3, name: "Section C", grade: "Grade 8" },
    { id: 4, name: "Section D", grade: "Grade 7" },
    { id: 5, name: "Section E", grade: "Grade 10" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // Open modal for adding/editing section
  const openModal = (section = null) => {
    if (section) {
      setEditingSection(section);
      setNewSection(section.name);
      setNewGrade(section.grade);
    } else {
      setEditingSection(null);
      setNewSection("");
      setNewGrade("");
    }
    setIsModalOpen(true);
  };

  // Add new section
  const addSection = () => {
    if (!newSection || !newGrade) return;
    setSections([
      ...sections,
      { id: Date.now(), name: newSection, grade: newGrade },
    ]);
    setIsModalOpen(false);
  };

  // Update section
  const updateSection = () => {
    setSections(
      sections.map((item) =>
        item.id === editingSection.id
          ? { ...item, name: newSection, grade: newGrade }
          : item
      )
    );
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredSections = sections.filter((section) => {
    return (
      (selectedGrade === "" || section.grade === selectedGrade) &&
      section.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Filters */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Sections</h2>
          <div className="flex gap-4">
            <select
              className="p-2 border rounded w-1/3"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="">All Grades</option>
              {[...new Set(sections.map((s) => s.grade))].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="p-2 border rounded w-2/3"
              placeholder="Search by section name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn bg-[#333] text-white flex"
              onClick={() => openModal()}
            >
              <IoAddCircleSharp size={18} />
              Add Section
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Section Name</th>
                <th>Grade Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.length > 0 ? (
                filteredSections.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.grade}</td>
                    <td className="p-3 text-right">
                      <button
                        className="px-3 py-1 text-sm bg-info text-white rounded flex items-center gap-1"
                        onClick={() => openModal(item)}
                      >
                        <FiEdit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No sections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Section */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {editingSection ? "Edit Section" : "Add New Section"}
              </h3>

              {/* Section Name Input */}
              <label className="input w-full mb-4">
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder="Enter section name (e.g., Section A)"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
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
                  onClick={editingSection ? updateSection : addSection}
                >
                  {editingSection ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Section;
