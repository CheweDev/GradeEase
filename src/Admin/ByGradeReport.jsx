import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import React from "react";
import { RiFileExcel2Fill } from "react-icons/ri";

const ByGradeReport = () => {
  const data = [
    { grade: "GRADE 1", learners: 73 },
    { grade: "GRADE 2", learners: 33 },
    { grade: "GRADE 3", learners: 42 },
    { grade: "GRADE 4", learners: 92 },
    { grade: "GRADE 5", learners: 73 },
    { grade: "GRADE 6", learners: 53 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            No. of Learners per Proficiency Level (By Grade Level)
          </h2>
          <button className="btn bg-green-700 text-white flex">
            <RiFileExcel2Fill />
            Export via Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table table-auto w-full max-w-full">
            {/* Table Head */}
            <thead>
              <tr className="text-center border-b border-gray-300">
                <th className="p-2">Grade Level</th>
                <th className="p-2">
                  Number of <br /> Learners
                </th>
                <th className="p-2">
                  Outstanding <br /> (90-100%)
                </th>
                <th className="p-2">
                  Very Satisfactory <br /> (85-89%)
                </th>
                <th className="p-2">
                  Satisfactory <br /> (80-84%)
                </th>
                <th className="p-2">
                  Fairly Satisfactory <br /> (75-79%)
                </th>
                <th className="p-2">
                  Did Not Meet <br /> Expectation <br /> (70-74%)
                </th>
                <th className="p-2">
                  General Percentage <br /> Average (GPA)
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-t text-center">
                  <td className="p-3">{row.grade}</td>
                  <td className="p-3">{row.learners}</td>
                  <td className="p-3 "></td>
                  <td className="p-3 "></td>
                  <td className="p-3 "></td>
                  <td className="p-3 "></td>
                  <td className="p-3 "></td>
                  <td className="p-3 "></td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-200 font-bold text-center border-t">
                <td className="p-3">TOTAL</td>
                <td className="p-3">366</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ByGradeReport;
