import { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar.jsx";
import Header from "../Admin/Header.jsx";

const StudentDashboard = () => {
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [studentInfo, setStudentInfo] = useState({
    name: "Marc Dominic Gerasmio",
    id: "20241001",
    section: "Grade 10 - A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [schoolYear, setSchoolYear] = useState("2024-2025");
  const [quarter, setQuarter] = useState("1st");

  // Dummy data for grades
  const dummyGrades = [
    {
      schoolYear: "2024-2025",
      quarter: "1st",
      subjects: [
        { subject: "Mathematics", grade: "A" },
        { subject: "English", grade: "B+" },
        { subject: "Science", grade: "A-" },
      ],
    },
    {
      schoolYear: "2024-2025",
      quarter: "2nd",
      subjects: [
        { subject: "Mathematics", grade: "B+" },
        { subject: "English", grade: "A" },
        { subject: "Science", grade: "B" },
      ],
    },
    {
      schoolYear: "2024-2025",
      quarter: "3rd",
      subjects: [
        { subject: "Mathematics", grade: "A-" },
        { subject: "English", grade: "B" },
        { subject: "Science", grade: "A" },
      ],
    },
    {
      schoolYear: "2024-2025",
      quarter: "4th",
      subjects: [
        { subject: "Mathematics", grade: "A" },
        { subject: "English", grade: "B+" },
        { subject: "Science", grade: "A-" },
      ],
    },
  ];

  // Simulate fetching and filtering grades based on school year and quarter
  useEffect(() => {
    // Filter grades based on school year and quarter
    const filtered = dummyGrades.filter(
      (data) => data.schoolYear === schoolYear && data.quarter === quarter
    );
    if (filtered.length > 0) {
      setFilteredGrades(filtered[0].subjects);
    }
  }, [schoolYear, quarter]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Student Info */}
        <div className="bg-white p-4 shadow-md rounded-md mb-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={studentInfo.avatar}
              alt="Student Avatar"
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold">{studentInfo.name}</h2>
              <p className="text-sm text-gray-500">ID: {studentInfo.id}</p>
              <p className="text-sm text-gray-500">
                Section: {studentInfo.section}
              </p>
            </div>
          </div>

          {/* Filters for School Year and Quarter */}
          <div className="mb-4 flex gap-4">
            <div className="flex items-center">
              <label htmlFor="schoolYear" className="mr-2 text-sm">
                School Year:
              </label>
              <select
                id="schoolYear"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="quarter" className="mr-2 text-sm">
                Quarter:
              </label>
              <select
                id="quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="1st">1st Quarter</option>
                <option value="2nd">2nd Quarter</option>
                <option value="3rd">3rd Quarter</option>
                <option value="4th">4th Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Grades for {quarter} Quarter ({schoolYear})
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Subject</th>
                <th className="border border-gray-300 p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">
                      {grade.subject}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {grade.grade}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No grades available for this quarter and school year
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
