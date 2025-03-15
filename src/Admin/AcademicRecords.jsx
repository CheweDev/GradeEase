import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiEdit } from "react-icons/fi";
import supabase from "../SupabaseClient.jsx";

const AcademicRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState(null);
  const [selectedGradingPeriod, setSelectedGradingPeriod] = useState("1st Grading");
  const [studentGrades, setStudentGrades] = useState({
    mtb_mle: "",
    esp: "",
    english: "",
    math: "",
    science: "",
    filipino: "",
    ap: "",
    epp: "",
    mapeh: "",
    average: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("Student Data").select("*");
    setStudents(data);
  };

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

  // Open Edit modal to update student grades
  const handleEditRecord = (student) => {
    setCurrentStudent(student);
    setUpdatedStudent(student);
    setIsEditModalOpen(true);
    // Fetch grades for the initial grading period (1st)
    fetchGrades(student.grade, "1st Grading");
  };

  // Fetch grades for the selected grading period
  const fetchGrades = async (grade, gradingPeriod) => {
    try {
      const { data, error } = await supabase
        .from("Grades")
        .select("*")
        .eq("grade", grade)
        .eq("grading", gradingPeriod)
        .single();

      if (error) {
        console.error("Error fetching grades:", error);
        // If no grades found, set empty grades
        setStudentGrades({
          mtb_mle: "",
          esp: "",
          english: "",
          math: "",
          science: "",
          filipino: "",
          ap: "",
          epp: "",
          mapeh: "",
          average: "",
        });
      } else if (data) {
        setStudentGrades({
          mtb_mle: data.mtb_mle || "",
          esp: data.esp || "",
          english: data.english || "",
          math: data.math || "",
          science: data.science || "",
          filipino: data.filipino || "",
          ap: data.ap || "",
          epp: data.epp || "",
          mapeh: data.mapeh || "",
          average: data.average || "",
        });
      }
    } catch (error) {
      console.error("Error in fetchGrades:", error);
    }
  };

  // Handle grading period change
  const handleGradingPeriodChange = (e) => {
    const period = e.target.value;
    setSelectedGradingPeriod(period);
    fetchGrades(currentStudent.grade, period);
  };

  // Handle changes to student grades
  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setStudentGrades({
      ...studentGrades,
      [name]: value,
    });
  };

  // Update student grades in the database
  const updateGrades = async () => {
    try {
      // Check if record exists
      const { data: existingRecord } = await supabase
        .from("Grades")
        .select("*")
        .eq("grade", currentStudent.grade)
        .eq("grading", selectedGradingPeriod);

      if (existingRecord && existingRecord.length > 0) {
        const { error } = await supabase
          .from("Grades")
          .update(studentGrades)
          .eq("grade", currentStudent.grade)
          .eq("grading", selectedGradingPeriod);

        if (error) throw error;
      } else {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const school_year = `${currentYear}-${nextYear}`;
        const { error } = await supabase
          .from("Grades")
          .insert([
            { 
              grade: currentStudent.grade,
              name: currentStudent.name,
              section: currentStudent.section,
              school_year,
              grading: selectedGradingPeriod,
              ...studentGrades
            }
          ]);

        if (error) throw error;
      }

     window.location.reload();
      
    } catch (error) {
      console.error("Error updating grades:", error);
      alert("Failed to update grades. Please try again.");
    }
  };

  // Handle student basic info update
  const handleStudentChange = (e) => {
    setUpdatedStudent({
      ...updatedStudent,
      [e.target.name]: e.target.value,
    });
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
              className="p-2 border rounded w-full bg-white border-gray-400"
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
                  <td className="p-3">{student.grade}</td>
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

        {/* Edit Student Grades Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-[80%] md:w-[60%] lg:w-[40%]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Edit Student Grades</h4>
                <select
                  className="select select-bordered"
                  value={selectedGradingPeriod}
                  onChange={handleGradingPeriodChange}
                >
                  <option value="1st Grading">1st Grading</option>
                  <option value="2nd Grading">2nd Grading</option>
                  <option value="3rd Grading">3rd Grading</option>
                  <option value="4th Grading">4th Grading</option>
                </select>
              </div>

              <div className="mb-4">
                <p className="font-medium">Student: {currentStudent?.name}</p>
                <p>LRN: {currentStudent?.lrn}</p>
                <p>Grade & Section: {currentStudent?.grade} - {currentStudent?.section}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium">MTB-MLE</label>
                  <input
                    type="text"
                    name="mtb_mle"
                    value={studentGrades.mtb_mle}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">ESP</label>
                  <input
                    type="text"
                    name="esp"
                    value={studentGrades.esp}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">English</label>
                  <input
                    type="text"
                    name="english"
                    value={studentGrades.english}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Math</label>
                  <input
                    type="text"
                    name="math"
                    value={studentGrades.math}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Science</label>
                  <input
                    type="text"
                    name="science"
                    value={studentGrades.science}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Filipino</label>
                  <input
                    type="text"
                    name="filipino"
                    value={studentGrades.filipino}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">AP</label>
                  <input
                    type="text"
                    name="ap"
                    value={studentGrades.ap}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">EPP</label>
                  <input
                    type="text"
                    name="epp"
                    value={studentGrades.epp}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">MAPEH</label>
                  <input
                    type="text"
                    name="mapeh"
                    value={studentGrades.mapeh}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Average</label>
                  <input
                    type="text"
                    name="average"
                    value={studentGrades.average}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[#333] text-white"
                  onClick={updateGrades}
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