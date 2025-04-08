import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { TbChecklist } from "react-icons/tb";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import ProficiencyDistribution from "./ProficiencyDistribution.jsx";
import { useState, useEffect } from "react";
import supabase from "../SupabaseClient.jsx";

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState("");
  const [teacherCount, setTeacherCount] = useState("");
  const [gradeCount, setGradeCount] = useState("");
  const [sectionCount, setSectionCount] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchSections();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("Student Data").select("*");
    setStudentCount(data.length);
  };

  const fetchTeachers = async () => {
    const { data } = await supabase.from("Advisers").select("*");
    setTeacherCount(data.length);
  };

  const fetchSections = async () => {
    const { data } = await supabase.from("Section").select("*");
    setSectionCount(data.length);
    const uniqueGradeLevels = new Set(data.map((item) => item.grade_level));
    setGradeCount(uniqueGradeLevels.size);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <h1 className="text-3xl font-extrabold text-gray-800 mt-5">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">A quick data overview</p>

        <div className="flex justify-between mt-5 tracking-widest">
          <div className="card card-border bg-base-100 border-b-green-500 w-64">
            <div className="card-body text-emerald-500">
              <div className="flex justify-center">
                <FaUsers size={32} />
              </div>
              <div className="flex justify-center">
                <h2 className="card-title text-lg">Total Student</h2>
              </div>
              <div className="flex justify-center">
                <h2 className="text-xl">{studentCount}</h2>
              </div>
            </div>
          </div>
          <div className="card card-border bg-base-100 border-b-amber-500 w-64">
            <div className="card-body text-amber-500">
              <div className="flex justify-center">
                <GiTeacher size={32} />
              </div>
              <div className="flex justify-center">
                <h2 className="card-title text-lg">Total Teacher</h2>
              </div>
              <div className="flex justify-center">
                <h2 className="text-xl">{teacherCount}</h2>
              </div>
            </div>
          </div>
          <div className="card card-border bg-base-100 border-b-blue-500 w-64">
            <div className="card-body text-blue-500">
              <div className="flex justify-center">
                <TbChecklist size={32} />
              </div>
              <div className="flex justify-center">
                <h2 className="card-title text-lg">Total Grade Level</h2>
              </div>
              <div className="flex justify-center">
                <h2 className="text-xl">{gradeCount}</h2>
              </div>
            </div>
          </div>
          <div className="card card-border bg-base-100 border-b-red-500 w-64">
            <div className="card-body text-red-500">
              <div className="flex justify-center">
                <FaSchoolCircleCheck size={32} />
              </div>
              <div className="flex justify-center">
                <h2 className="card-title text-lg">Total Section</h2>
              </div>
              <div className="flex justify-center">
                <h2 className="text-xl">{sectionCount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center divider mt-10 text-lg font-semibold">
          Proficiency Report 1st Quarter 2024-2025 | General Percentage Average
          (GPA)
        </div> */}

        <ProficiencyDistribution />
      </main>
    </div>
  );
};

export default AdminDashboard;
