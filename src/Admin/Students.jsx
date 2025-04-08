import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiEye, FiPlusCircle } from "react-icons/fi";
import supabase from "../SupabaseClient.jsx";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    lrn: "",
    name: "",
    grade: "",
    section: "",
    guardian: "",
    contact_number: "",
    school_year: "",
    gender: "",
  });

  useEffect(() => {
    fetchSections();
    fetchSchoolYear();
    fetchStudents();
  }, []);

  const fetchSections = async () => {
    const { data } = await supabase.from("Section").select("*");
    setSections(data);
  };

  const fetchSchoolYear = async () => {
    const { data } = await supabase.from("School Year").select("*");
    setSchoolYear(data);
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from("Student Data").select("*");
    setStudents(data);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lrn.includes(searchTerm)
  );

  const addStudent = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("Student Data").insert([
      {
        lrn: newStudent.lrn,
        name: newStudent.name,
        grade: newStudent.grade,
        gender: newStudent.gender,
        section: newStudent.section,
        guardian: newStudent.guardian,
        school_year: newStudent.school_year,
        contact_number: newStudent.contact_number,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    } else {
      console.log("Data inserted successfully:", data);
      createAccount();
    }
  };

  const createAccount = async () => {
    const { data, error } = await supabase.from("Users").insert([
      {
        password: generateRandomPassword(),
        name: newStudent.name,
        role: "STUDENT",
        email: `${newStudent.name?.toLowerCase().replace(/\s+/g, "")}@edu.ph`,
        status: "Active",
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    } else {
      console.log("Data inserted successfully:", data);
      window.location.reload();
    }
  };

  const generateRandomPassword = () => {
    const length = 8;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = uppercase + lowercase + numbers;
  
    let password =
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      lowercase[Math.floor(Math.random() * lowercase.length)] +
      numbers[Math.floor(Math.random() * numbers.length)];
  
 
    for (let i = 3; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split("").sort(() => Math.random() - 0.5).join("");
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
              className="p-2 border rounded w-full bg-white border-gray-400"
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
                    <td className="p-3">
                      <button
                        className="btn btn-sm btn-info text-white"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <FiEye className="inline-block" /> View Profile
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
            <div className="bg-white p-6 rounded shadow-lg w-2/4">
              <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <label className="block mb-2">
                <span>Grade Level</span>
                <select
                className="w-full p-2 border rounded"
                value={newStudent.grade}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, grade: e.target.value })
                }
              >
                <option value="" disabled>Select Grade Level</option>
                {sections.map((item, index) => (
                  <option key={index} value={item.grade_level}>{item.grade_level}</option>
                ))}
              </select>
              </label>
              <label className="block mb-4">
              <span>Section</span>
              <select
                className="w-full p-2 border rounded"
                value={newStudent.section}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, section: e.target.value })
                }
              >
                <option value="" disabled>Select Section</option>
                {sections.map((item, index) => (
                  <option key={index} value={item.section}>{item.section}</option>
                ))}
              </select>
            </label>
              <label className="block mb-4">
                <span>School Year</span>
                <select
                className="w-full p-2 border rounded"
                value={newStudent.school_year}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, school_year: e.target.value })
                }
              >
                <option value="" disabled>Select School Year</option>
                {schoolYear.map((item, index) => (
                  <option key={index} value={item.school_year}>{item.school_year}</option>
                ))}
              </select>
              </label>

              <label className="block mb-4">
                <span>Gender</span>
                <select
                  className="w-full p-2 border rounded"
                  value={newStudent.gender}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value })
                  }
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-4">
                <span>Guardian's Name</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Section"
                  value={newStudent.guardian}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, guardian: e.target.value })
                  }
                />
              </label>

              <label className="block mb-4">
                <span>Guardian's Number</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Section"
                  value={newStudent.contact_number}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, contact_number: e.target.value })
                  }
                />
              </label>
              </div>

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
              <h3 className="text-lg font-semibold mb-4">Student Details</h3>
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
                <strong>Guardian:</strong> {selectedStudent.guardian}
              </p>
              <p>
                <strong>Contact:</strong> {selectedStudent.contact_number}
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
