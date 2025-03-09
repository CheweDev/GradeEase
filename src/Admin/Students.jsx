import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiEye, FiPlusCircle } from "react-icons/fi";

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      lrn: "123456789012",
      name: "John Doe",
      grade: "Grade 10",
      section: "Section A",
      profile: {
        age: 16,
        address: "123 Main St, City",
        contact: "09123456789",
        guardian: "Jane Doe",
      },
    },
    {
      id: 2,
      lrn: "987654321098",
      name: "Jane Smith",
      grade: "Grade 9",
      section: "Section B",
      profile: {
        age: 15,
        address: "456 Elm St, Town",
        contact: "09987654321",
        guardian: "John Smith",
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    lrn: "",
    name: "",
    grade: "",
    section: "",
  });

  // Filter students by name or LRN
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lrn.includes(searchTerm)
  );

  // Add New Student
  const addStudent = () => {
    if (
      !newStudent.lrn ||
      !newStudent.name ||
      !newStudent.grade ||
      !newStudent.section
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const newEntry = {
      id: students.length + 1,
      ...newStudent,
      profile: {
        age: "N/A",
        address: "N/A",
        contact: "N/A",
        guardian: "N/A",
      },
    };

    setStudents([...students, newEntry]);
    setIsAddModalOpen(false);
    setNewStudent({ lrn: "", name: "", grade: "", section: "" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Search bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Students</h2>
          <div className="flex justify-end gap-2">
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Search by Name or LRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn bg-[#333] text-white flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FiPlusCircle size={18} />
              Add Student
            </button>
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
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-3">{student.lrn}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.grade}</td>
                    <td className="p-3">{student.section}</td>
                    <td className="p-3 text-right">
                      <button
                        className="px-3 py-1 text-sm bg-info text-white rounded flex items-center gap-1 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <FiEye size={14} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Student Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
              <label className="block mb-2">
                <span>LRN Number</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter LRN"
                  value={newStudent.lrn}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, lrn: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Student Name</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Grade Level</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade Level"
                  value={newStudent.grade}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, grade: e.target.value })
                  }
                />
              </label>
              <label className="block mb-4">
                <span>Section</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Section"
                  value={newStudent.section}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, section: e.target.value })
                  }
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 btn bg-[#333] text-white"
                  onClick={addStudent}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Profile Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Student Profile</h3>
              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>
              <p>
                <strong>LRN:</strong> {selectedStudent.lrn}
              </p>
              <p>
                <strong>Grade Level:</strong> {selectedStudent.grade}
              </p>
              <p>
                <strong>Section:</strong> {selectedStudent.section}
              </p>
              <p>
                <strong>Age:</strong> {selectedStudent.profile.age}
              </p>
              <p>
                <strong>Address:</strong> {selectedStudent.profile.address}
              </p>
              <p>
                <strong>Contact:</strong> {selectedStudent.profile.contact}
              </p>
              <p>
                <strong>Guardian:</strong> {selectedStudent.profile.guardian}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;
