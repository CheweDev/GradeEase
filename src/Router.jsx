import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import StudentDashboard from "./Student/StudentDashboard.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
