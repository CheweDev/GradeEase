import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const BySectionReport = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <div>Section Report</div>
      </main>
    </div>
  );
};

export default BySectionReport;
