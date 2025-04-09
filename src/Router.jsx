import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import SchoolYear from "./Admin/SchoolYear.jsx";
import GradeLevel from "./Admin/GradeLevel.jsx";
import Section from "./Admin/Section.jsx";
import Advisors from "./Admin/Advisors.jsx";
import Students from "./Admin/Students.jsx";
import Subjects from "./Admin/Subjects.jsx";
import AcademicRecords from "./Admin/AcademicRecords.jsx";
import ByGradeReport from "./Admin/ByGradeReport.jsx";
import BySectionReport from "./Admin/BySectionReport.jsx";
import UserAccounts from "./Admin/UserAccounts.jsx";
import StudentDashboard from "./Student/StudentDashboard.jsx";
import StudentProfile from "./Student/StudentProfile.jsx";
import TeacherDashboard from "./Teacher/TeacherDashboard.jsx";
import TeacherProfile from "./Teacher/TeacherProfile.jsx";
import TeacherSectionReport from "./Teacher/TeacherSectionReport.jsx";
import TeacherGradeReport from "./Teacher/TeacherGradeReport.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/school-year" element={<SchoolYear />} />
        <Route path="/grade-level" element={<GradeLevel />} />
        <Route path="/section" element={<Section />} />
        <Route path="/advisors" element={<Advisors />} />
        <Route path="/students" element={<Students />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/academic-records" element={<AcademicRecords />} />
        <Route path="/grade-report" element={<ByGradeReport />} />
        <Route path="/section-report" element={<BySectionReport />} />
        <Route path="/user-accounts" element={<UserAccounts />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/user-profile" element={<StudentProfile />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-profile" element={<TeacherProfile />} />
        <Route path="/teacher-section" element={<TeacherSectionReport />} />
        <Route path="/teacher-grade" element={<TeacherGradeReport />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
