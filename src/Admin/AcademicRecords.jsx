import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiEdit } from "react-icons/fi";

const AcademicRecords = () => {
  const [students, setStudents] = useState([
    {
      lrn: "123456789",
      name: "John Doe",
      gradeLevel: "Grade 10",
      section: "Section A",
      grades: {
        math: "A",
        science: "B",
        english: "A",
      },
    },
    {
      lrn: "987654321",
      name: "Jane Smith",
      gradeLevel: "Grade 9",
      section: "Section B",
      grades: {
        math: "C",
        science: "B",
        english: "A",
      },
    },
    {
      lrn: "112233445",
      name: "Emily Johnson",
      gradeLevel: "Grade 11",
      section: "Section C",
      grades: {
        math: "B",
        science: "B",
        english: "B",
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState(null);

  // Filter students based on search query (LRN or Name)
  const filteredStudents = students.filter(
    (student) =>
      student.lrn.includes(searchQuery) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Open Edit modal to update basic student info and grades
  const handleEditRecord = (student) => {
    setCurrentStudent(student);
    setUpdatedStudent(student); // Prepare updated student details
    setIsEditModalOpen(true);
  };

  // Handle changes to basic student info
  const handleStudentChange = (e) => {
    setUpdatedStudent({
      ...updatedStudent,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes to student grades
  const handleGradeChange = (subject, grade) => {
    setUpdatedStudent({
      ...updatedStudent,
      grades: {
        ...updatedStudent.grades,
        [subject]: grade,
      },
    });
  };

  // Save updated student info and grades
  const handleSaveStudentInfo = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.lrn === updatedStudent.lrn ? updatedStudent : student
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Student Academic Records</h2>
          <div>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Search by LRN or Name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>LRN Number</th>
                <th>Student Name</th>
                <th>Grade Level</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.lrn} className="border-t">
                  <td className="p-3">{student.lrn}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.gradeLevel}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => handleEditRecord(student)}
                    >
                      <FiEdit className="inline-block" /> Edit Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Student Info and Grades Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-[80%] md:w-[60%] lg:w-[40%]">
              <div className="flex justify-between gap-6">
                {/* Left Section - Basic Info */}
                <div className="w-1/2">
                  <h4 className="font-semibold mb-4">
                    {" "}
                    Edit Student Info & Grades
                  </h4>
                  <div className="mb-4">
                    <label className="block">Student Name</label>
                    <input
                      type="text"
                      name="name"
                      value={updatedStudent?.name || ""}
                      onChange={handleStudentChange}
                      className="input w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block">Grade Level</label>
                    <input
                      type="text"
                      name="gradeLevel"
                      value={updatedStudent?.gradeLevel || ""}
                      onChange={handleStudentChange}
                      className="input w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={updatedStudent?.section || ""}
                      onChange={handleStudentChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                {/* Right Section - Grades */}
                <div className="w-1/2">
                  <h4 className="font-semibold mb-4">Grades</h4>
                  {Object.keys(updatedStudent?.grades || {}).map((subject) => (
                    <div key={subject} className="mb-4">
                      <label className="block">
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={updatedStudent?.grades[subject] || ""}
                        onChange={(e) =>
                          handleGradeChange(subject, e.target.value)
                        }
                        className="input w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save & Cancel */}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[#333] text-white"
                  onClick={handleSaveStudentInfo}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AcademicRecords;
