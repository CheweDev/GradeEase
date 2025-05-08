import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";
import supabase from "../SupabaseClient.jsx";

const TeacherHistory = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [currentSchoolYear, setCurrentSchoolYear] = useState("");
  const adviserName = sessionStorage.getItem('name');

  useEffect(() => {
    fetchStudents();
    fetchCurrentSchoolYear();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("History").select("*").eq("adviser", adviserName);
    setStudents(data);
  };

  const fetchCurrentSchoolYear = async () => {
    const { data, error } = await supabase
      .from("School Year")
      .select("*")
      .eq("current", "Yes")
      .single();

    if (error) {
      console.error("Error fetching current school year:", error);
      return;
    }

    if (data) {
      setCurrentSchoolYear(data.school_year);
    }
  };

  const fetchStudentGrades = async (studentName, studentGrade) => {
    if (!currentSchoolYear) {
      console.error("No current school year found");
      return;
    }

    const { data, error } = await supabase
      .from("Grades")
      .select("*")
      .eq("name", studentName)
      .eq("grade", studentGrade)
      .eq("school_year", currentSchoolYear);

    if (error) {
      console.error("Error fetching grades:", error);
      return;
    }

    setStudentGrades(data || []);
  };

  const getGradeForSubject = (subject, gradingPeriod) => {
    const gradeEntry = studentGrades.find(grade => grade.grading === gradingPeriod);
    return gradeEntry ? gradeEntry[subject] : "-";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Student Archives</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Grade Level</th>
                <th>Section</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.lrn} className="border-t">
                  <td className="p-3">{student.student_name}</td>
                  <td className="p-3">{student.grade}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3">{student.status}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => {
                        setSelectedStudent(student);
                        fetchStudentGrades(student.student_name, student.grade);
                        document.getElementById("view_grades_modal").showModal();
                      }}
                    >
                      View Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Grades Modal */}
        <dialog id="view_grades_modal" className="modal">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              Grades for {selectedStudent?.student_name}
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("view_grades_modal").close()}
            >
              ✕
            </button>
            
            <div className="overflow-x-auto">
              <table className="table w-full border">
                <thead>
                  <tr>
                    <th className="border bg-gray-100">Subject</th>
                    <th className="border bg-gray-100">1st Grading</th>
                    <th className="border bg-gray-100">2nd Grading</th>
                    <th className="border bg-gray-100">3rd Grading</th>
                    <th className="border bg-gray-100">4th Grading</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-medium">Language</td>
                    <td className="border text-center">{getGradeForSubject("language", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("language", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("language", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("language", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">ESP</td>
                    <td className="border text-center">{getGradeForSubject("esp", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("esp", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("esp", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("esp", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">English</td>
                    <td className="border text-center">{getGradeForSubject("english", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("english", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("english", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("english", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">Math</td>
                    <td className="border text-center">{getGradeForSubject("math", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("math", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("math", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("math", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">Science</td>
                    <td className="border text-center">{getGradeForSubject("science", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("science", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("science", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("science", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">Filipino</td>
                    <td className="border text-center">{getGradeForSubject("filipino", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("filipino", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("filipino", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("filipino", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">AP</td>
                    <td className="border text-center">{getGradeForSubject("ap", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("ap", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("ap", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("ap", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">Reading</td>
                    <td className="border text-center">{getGradeForSubject("reading", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("reading", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("reading", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("reading", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">Makabansa</td>
                    <td className="border text-center">{getGradeForSubject("makabansa", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("makabansa", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("makabansa", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("makabansa", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">GMRC</td>
                    <td className="border text-center">{getGradeForSubject("gmrc", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("gmrc", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("gmrc", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("gmrc", "4th Grading")}</td>
                  </tr>
                  <tr>
                    <td className="border font-medium">MAPEH</td>
                    <td className="border text-center">{getGradeForSubject("mapeh", "1st Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("mapeh", "2nd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("mapeh", "3rd Grading")}</td>
                    <td className="border text-center">{getGradeForSubject("mapeh", "4th Grading")}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border font-bold">Average</td>
                    <td className="border text-center font-bold">{getGradeForSubject("average", "1st Grading")}</td>
                    <td className="border text-center font-bold">{getGradeForSubject("average", "2nd Grading")}</td>
                    <td className="border text-center font-bold">{getGradeForSubject("average", "3rd Grading")}</td>
                    <td className="border text-center font-bold">{getGradeForSubject("average", "4th Grading")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="modal-action">
              <button
                className="btn bg-[#333] text-white"
                onClick={() => document.getElementById("view_grades_modal").close()}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default TeacherHistory;