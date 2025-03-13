import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import supabase from "../SupabaseClient.jsx";

const GradeLevel = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("Advisers").select("*");

    // Group data by grade
    const groupedData = data.reduce((acc, curr) => {
      if (!acc[curr.grade]) {
        acc[curr.grade] = { grade: curr.grade, teachers: [] };
      }
      acc[curr.grade].teachers.push(curr.name);
      return acc;
    }, {});

    setGrades(Object.values(groupedData)); // Convert object back to array
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        <h2 className="text-2xl font-semibold mb-6">Manage Grade Levels</h2>

        {/* Table Display */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Grade Level</th>
                <th>Assigned Teachers</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.grade} className="border-t">
                  <td className="p-3 font-semibold">{grade.grade}</td>
                  <td className="p-3">
                    {grade.teachers.length > 0 ? (
                      grade.teachers.map((teacher, index) => (
                        <span key={index} className="block text-gray-700">
                          {teacher}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        No teachers assigned
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GradeLevel;
