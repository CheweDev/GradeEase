import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";

// Dummy
const studentsData = [
  {
    id: "20241001",
    name: "John Doe",
    section: "Grade 10 - A",
    gradeLevel: "10",
    subjects: [
      {
        name: "Math",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "English",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "Science",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "History",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "Geography",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "Physics",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "Chemistry",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
      {
        name: "Biology",
        grades: {
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
        },
      },
    ],
  },
];

const TeacherDashboard = () => {
  const [students, setStudents] = useState(studentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("firstQuarter");
  const [grades, setGrades] = useState({});

  // Handle quarter selection change
  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
  };

  // Handle grade input change
  const handleGradeChange = (subjectName, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subjectName]: {
        ...prevGrades[subjectName],
        [selectedQuarter]: value,
      },
    }));
  };

  // Handle submitting grades for each subject
  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const updatedStudents = students.map((student) => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          subjects: student.subjects.map((subject) => {
            if (grades[subject.name]) {
              return {
                ...subject,
                grades: { ...grades[subject.name] },
              };
            }
            return subject;
          }),
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    alert(`Grades saved for ${selectedStudent.name}`);
    document.getElementById("grade_modal").close();
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter students by LRN or name
  const filteredStudents = students.filter(
    (student) =>
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <div className="flex justify-between mb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
            <p className="mt-1 text-gray-600">Add Grades for your Students</p>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by LRN or Name"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg mb-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>LRN</th>
                <th>Name</th>
                <th>Section</th>
                <th>Grade Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.section}</td>
                  <td>{student.gradeLevel}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelectedStudent(student);
                        document.getElementById("grade_modal").showModal();
                      }}
                    >
                      Add Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Update Grades Modal */}
        <dialog id="grade_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Add Grades for {selectedStudent?.name}
            </h3>

            {/* Tabs for Quarters */}
            <div className="tabs mb-6">
              <button
                className={`tab ${
                  selectedQuarter === "firstQuarter" ? "tab-active" : ""
                }`}
                onClick={() => handleQuarterChange("firstQuarter")}
              >
                1st Quarter
              </button>
              <button
                className={`tab ${
                  selectedQuarter === "secondQuarter" ? "tab-active" : ""
                }`}
                onClick={() => handleQuarterChange("secondQuarter")}
              >
                2nd Quarter
              </button>
              <button
                className={`tab ${
                  selectedQuarter === "thirdQuarter" ? "tab-active" : ""
                }`}
                onClick={() => handleQuarterChange("thirdQuarter")}
              >
                3rd Quarter
              </button>
              <button
                className={`tab ${
                  selectedQuarter === "fourthQuarter" ? "tab-active" : ""
                }`}
                onClick={() => handleQuarterChange("fourthQuarter")}
              >
                4th Quarter
              </button>
            </div>

            {/* Form for Grades */}
            <form onSubmit={handleGradeSubmit}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                type="button"
                onClick={() => document.getElementById("grade_modal").close()}
              >
                ✕
              </button>

              {/* Subjects Grades Table */}
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent?.subjects.map((subject) => (
                      <tr key={subject.name}>
                        <td>{subject.name}</td>
                        <td>
                          <input
                            type="number"
                            value={
                              grades[subject.name]?.[selectedQuarter] || ""
                            }
                            onChange={(e) =>
                              handleGradeChange(subject.name, e.target.value)
                            }
                            className="input input-bordered w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("grade_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-[#333] text-white">
                  Save Grades
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default TeacherDashboard;
