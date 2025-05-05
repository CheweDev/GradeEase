import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";
import supabase from "../SupabaseClient.jsx";

const TeacherHistory = () => {
  const [students, setStudents] = useState([]);
  const adviserName = sessionStorage.getItem('name');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("History").select("*").eq("adviser", adviserName);
    setStudents(data);
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
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.lrn} className="border-t">
                  <td className="p-3">{student.student_name}</td>
                  <td className="p-3">{student.grade}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TeacherHistory;