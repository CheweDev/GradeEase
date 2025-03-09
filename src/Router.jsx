import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import SchoolYear from "./Admin/SchoolYear.jsx";
import StudentDashboard from "./Student/StudentDashboard.jsx";
import GradeLevel from "./Admin/GradeLevel.jsx";
import Section from "./Admin/Section.jsx";
import Advisors from "./Admin/Advisors.jsx";
import Students from "./Admin/Students.jsx";
import Subjects from "./Admin/Subjects.jsx";
import AcademicRecords from "./Admin/AcademicRecords.jsx";

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
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
