import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import supabase from "../SupabaseClient.jsx";

const Section = () => {
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [section, setSection] = useState("");
  const [grade_level, setGradeLevel] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [editId, setEditId] = useState("");

    useEffect(() => {
      fetchSection();
    }, []);
  
    const fetchSection = async () => {
      const { data } = await supabase
        .from("Section")
        .select("*");
      
     setSections(data);
    };
  

  // Open modal for adding/editing section
  const openModal = (section = null) => {
    if (section) {
      setEditingSection(section);
      setEditId(section.id);
      setSection(section.section);
      setGradeLevel(section.grade_level);
    } else {
      setEditingSection(null);
      setSection("");
      setGradeLevel("");
    }
    setIsModalOpen(true);
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
        .from('Section')
        .insert([
          {
           section,
           grade_level, 
          },
        ])
      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
      } else {
        console.log("Data inserted successfully:", data);
        window.location.reload();
      }
  };


  const handleUpdateSection = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
        .from('Section')
        .update(
          {
           section,
           grade_level, 
          })
        .eq('id', editId)  
      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
      } else {
        console.log("Data inserted successfully:", data);
        window.location.reload();
      }
  };

  // Filter logic
  const filteredSections = sections.filter((section) => {
    return (
      (selectedGrade === "" || section.grade_level === selectedGrade) &&
      section.section.toLowerCase().includes(searchTerm.toLowerCase())
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
              <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
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
                    <td className="p-3">{item.section}</td>
                    <td className="p-3">{item.grade_level}</td>
                    <td className="p-3">
                      <button
                        className="btn btn-sm btn-info text-white"
                        onClick={() => openModal(item)}
                      >
                        <FiEdit className="inline-block" /> Edit
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
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </label>

              {/* Grade Level Input */}
              <label className="input w-full mb-4">
              <select
                className="w-full p-2 rounded"
                value={grade_level}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="" disabled>
                  Select grade level
                </option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
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
                  onClick={editingSection ? handleUpdateSection : handleAddSection}
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
