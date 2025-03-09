import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";

const GradeLevel = () => {
  const [grades, setGrades] = useState([
    { level: "Grade 1", teachers: ["Mr. Smith"] },
    { level: "Grade 2", teachers: ["Ms. Johnson"] },
    { level: "Grade 3", teachers: [] },
    { level: "Grade 4", teachers: ["Mr. Brown"] },
    { level: "Grade 5", teachers: [] },
    { level: "Grade 6", teachers: ["Ms. Davis"] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [newTeacher, setNewTeacher] = useState("");

  const openModal = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const addTeacher = () => {
    if (!newTeacher) return;
    setGrades((prev) =>
      prev.map((g) =>
        g.level === selectedGrade
          ? { ...g, teachers: [...g.teachers, newTeacher] }
          : g
      )
    );
    setNewTeacher("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        <h2 className="text-2xl font-semibold mb-6">Manage Grade Levels</h2>

        {/* Table Display */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Grade Level</th>
                <th>Assigned Teachers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.level} className="border-t">
                  <td className="p-3 font-semibold">{grade.level}</td>
                  <td className="p-3">
                    {grade.teachers.length > 0 ? (
                      grade.teachers.map((teacher, index) => (
                        <span key={index} className="block text-gray-700">
                          {teacher}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        No teachers assigned
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => openModal(grade.level)}
                    >
                      <IoAddCircleSharp className="inline-block" />
                      Add Teacher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding Teachers */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Add Teacher to {selectedGrade}
              </h3>

              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter teacher's name"
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#333] text-white rounded"
                  onClick={addTeacher}
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

export default GradeLevel;
