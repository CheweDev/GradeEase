import { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar.jsx";
import Header from "../Admin/Header.jsx";
import supabase from "../SupabaseClient.jsx";

const StudentDashboard = () => {
  const studentName = sessionStorage.getItem("name");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    lrn: "",
    section: "",
  });

  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [quarter, setQuarter] = useState("1st Grading");
  const [loading, setLoading] = useState(true);

  // Subject display names mapping
  const subjectDisplayNames = {
    language: "Language",
    esp: "ESP",
    english: "English",
    math: "Mathematics",
    science: "Science",
    filipino: "Filipino",
    ap: "Araling Panlipunan",
    reading: "Reading & Literacy",
    makabansa: "Makabansa",
    gmrc: "GMRC",
    mapeh: "MAPEH",
    average: "General Average"
  };

  // Fetch student data from Supabase
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetch student information
        const { data: studentData, error: studentError } = await supabase
          .from("Student Data")
          .select("*")
          .eq("name", studentName)
          .single();

        if (studentError) {
          console.error("Error fetching student data:", studentError);
          return;
        }

        if (studentData) {
          setStudentInfo({
            name: studentData.name,
            lrn: studentData.lrn,
            section: studentData.section,
          });

          // Use the student's name to fetch their grades
          fetchGrades(studentData.name, schoolYear, quarter);
        }
      } catch (error) {
        console.error("Error in fetchStudentData:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentName) {
      fetchStudentData();
    }
  }, [studentName]);

  const fetchGrades = async (studentName, year, qtr) => {
    try {
      setLoading(true);
      const { data: gradesData, error: gradesError } = await supabase
        .from("Grades")
        .select("*")
        .eq("name", studentName)
        .eq("school_year", year)
        .eq("grading", qtr);

      if (gradesError) {
        console.error("Error fetching grades:", gradesError);
        return;
      }

      if (gradesData && gradesData.length > 0) {
        // Since the grades are stored as individual columns, we need to transform them
        // into a format that can be displayed in the table
        const gradeRecord = gradesData[0]; // Assuming one record per student per quarter
        
        // Transform the data to match the expected format
        const formattedGrades = Object.entries(gradeRecord)
          .filter(([key]) => [
            "language", "esp", "english", "math", "science", 
            "filipino", "ap", "reading", "makabansa", "gmrc", "mapeh", "average"
          ].includes(key))
          .map(([subject, grade]) => ({
            subject: subjectDisplayNames[subject] || subject,
            grade: grade || "N/A"
          }));
        
        setFilteredGrades(formattedGrades);
      } else {
        setFilteredGrades([]);
      }
    } catch (error) {
      console.error("Error in fetchGrades:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch grades when school year or quarter changes
  useEffect(() => {
    if (studentInfo.name) {
      fetchGrades(studentInfo.name, schoolYear, quarter);
    }
  }, [schoolYear, quarter, studentInfo.name]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Student Info */}
        <div className="bg-white p-4 shadow-md rounded-md mb-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">{studentInfo.name}</h2>
              <p className="text-sm text-gray-500">ID: {studentInfo.lrn}</p>
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
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
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
                <option value="1st Grading">1st Grading</option>
                <option value="2nd Grading">2nd Grading</option>
                <option value="3rd Grading">3rd Grading</option>
                <option value="4th Grading">4th Grading</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Grades for {quarter} ({schoolYear})
          </h3>
          {loading ? (
            <p className="text-center p-4">Loading grades...</p>
          ) : (
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
                    <tr key={index} className={grade.subject === "General Average" ? "font-bold bg-gray-100 text-center" : "text-center"}>
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
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;