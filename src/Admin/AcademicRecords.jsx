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
    language: "",
    esp: "",
    english: "",
    math: "",
    science: "",
    filipino: "",
    ap: "",
    reading: "",
    mapeh: "",
    makabansa: "",
    gmrc: "",
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
    fetchGrades(student.grade, "1st Grading", student.name);
  };

  // Fetch grades for the selected grading period
  const fetchGrades = async (grade, gradingPeriod, name) => {
    try {
      const { data, error } = await supabase
        .from("Grades")
        .select("*")
        .eq("grade", grade)
        .eq("name", name)
        .eq("grading", gradingPeriod)
        .single();

      if (error) {
        console.error("Error fetching grades:", error);
        // If no grades found, set empty grades
        setStudentGrades({
          language: "",
          esp: "",
          english: "",
          math: "",
          science: "",
          filipino: "",
          ap: "",
          reading: "",
          mapeh: "",
          makabansa: "",
          gmrc: "",
          average: "",
        });
      } else if (data) {
        setStudentGrades({
          language: data.language || "",
          esp: data.esp || "",
          english: data.english || "",
          math: data.math || "",
          science: data.science || "",
          filipino: data.filipino || "",
          ap: data.ap || "",
          reading: data.reading || "",
          mapeh: data.mapeh || "",
          makabansa: data.makabansa || "",
          gmrc: data.gmrc || "",
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
    fetchGrades(currentStudent.grade, period, currentStudent.name);
  };

  // Handle changes to student grades
  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    
    // Don't allow grades below 70 (except empty values)
    if (value !== "" && Number(value) < 70) {
      alert(`Grades below 70 are considered failing and will not be accepted.`);
      return;
    }

    const updatedGrades = {
      ...studentGrades,
      [name]: value,
    };

    // Calculate average if the grade is a valid number
    if (value !== "" && !isNaN(value)) {
      const validGrades = Object.entries(updatedGrades)
        .filter(([key, val]) => key !== 'average' && val !== "" && !isNaN(val))
        .map(([_, val]) => parseInt(val));

      if (validGrades.length > 0) {
        const sum = validGrades.reduce((acc, curr) => acc + curr, 0);
        updatedGrades.average = Math.round(sum / validGrades.length);
      } else {
        updatedGrades.average = "";
      }
    } else {
      // Recalculate average if a grade was cleared
      const validGrades = Object.entries(updatedGrades)
        .filter(([key, val]) => key !== 'average' && val !== "" && !isNaN(val))
        .map(([_, val]) => parseInt(val));

      if (validGrades.length > 0) {
        const sum = validGrades.reduce((acc, curr) => acc + curr, 0);
        updatedGrades.average = Math.round(sum / validGrades.length);
      } else {
        updatedGrades.average = "";
      }
    }

    setStudentGrades(updatedGrades);
  };

  // Update student grades in the database
  const updateGrades = async () => {
    try {
      // Convert empty strings to null for bigint fields
      const gradesToUpdate = Object.fromEntries(
        Object.entries(studentGrades).map(([key, value]) => [
          key,
          value === "" ? null : parseInt(value)
        ])
      );

      // Check if record exists
      const { data: existingRecord } = await supabase
        .from("Grades")
        .select("*")
        .eq("grade", currentStudent.grade)
        .eq("name", currentStudent.name)
        .eq("grading", selectedGradingPeriod);

      if (existingRecord && existingRecord.length > 0) {
        const { error } = await supabase
          .from("Grades")
          .update(gradesToUpdate)
          .eq("grade", currentStudent.grade)
          .eq("name", currentStudent.name)
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
              ...gradesToUpdate
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

              <div className="mb-1">
                <p className="font-medium">Student: {currentStudent?.name}</p>
                <p>LRN: {currentStudent?.lrn}</p>
                <p>Grade & Section: {currentStudent?.grade} - {currentStudent?.section}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-1">
                  <label className="block text-sm font-medium">Language</label>
                  <input
                    type="number"
                    name="language"
                    value={studentGrades.language}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">ESP</label>
                  <input
                    type="number"
                    name="esp"
                    value={studentGrades.esp}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">English</label>
                  <input
                    type="number"
                    name="english"
                    value={studentGrades.english}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Math</label>
                  <input
                    type="number"
                    name="math"
                    value={studentGrades.math}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Science</label>
                  <input
                    type="number"
                    name="science"
                    value={studentGrades.science}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Filipino</label>
                  <input
                    type="number"
                    name="filipino"
                    value={studentGrades.filipino}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">AP</label>
                  <input
                    type="number"
                    name="ap"
                    value={studentGrades.ap}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Reading and Literacy</label>
                  <input
                    type="number"
                    name="reading"
                    value={studentGrades.reading}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Makabansa</label>
                  <input
                    type="number"
                    name="makabansa"
                    value={studentGrades.makabansa}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">GMRC</label>
                  <input
                    type="number"
                    name="gmrc"
                    value={studentGrades.gmrc}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">MAPEH</label>
                  <input
                    type="number"
                    name="mapeh"
                    value={studentGrades.mapeh}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium">Average</label>
                  <input
                    type="number"
                    name="average"
                    value={studentGrades.average}
                    onChange={handleGradeChange}
                    className="mt-1 p-2 border rounded w-full"
                    min="0"
                    max="100"
                    step="1"
                    readOnly
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