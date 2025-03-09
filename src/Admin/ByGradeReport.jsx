import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const ByGradeReport = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <div>Grade Report</div>
      </main>
    </div>
  );
};

export default ByGradeReport;
