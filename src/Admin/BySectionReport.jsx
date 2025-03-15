import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState } from "react";

const BySectionReport = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const dummyData = [
    {
      level: "I-Enstein",
      enrollment: { m: 45, f: 52, t: 97 },
      outstanding: { m: 12, f: 15, t: 27, percent: 28 },
      verySatisfactory: { m: 18, f: 20, t: 38, percent: 39 },
      satisfactory: { m: 10, f: 12, t: 22, percent: 23 },
      fairlySatisfactory: { m: 4, f: 3, t: 7, percent: 7 },
      didNotMeet: { m: 1, f: 2, t: 3, percent: 3 },
      gpa: { m: 85, f: 87, t: 86 },
    },
    {
      level: "TOTAL",
      enrollment: { m: 45, f: 52, t: 97 },
      outstanding: { m: 12, f: 15, t: 27, percent: 28 },
      verySatisfactory: { m: 18, f: 20, t: 38, percent: 39 },
      satisfactory: { m: 10, f: 12, t: 22, percent: 23 },
      fairlySatisfactory: { m: 4, f: 3, t: 7, percent: 7 },
      didNotMeet: { m: 1, f: 2, t: 3, percent: 3 },
      gpa: { m: 85, f: 87, t: 86 },
    },
    {
      level: "II-Pacot",
      enrollment: { m: 50, f: 48, t: 98 },
      outstanding: { m: 14, f: 16, t: 30, percent: 31 },
      verySatisfactory: { m: 20, f: 18, t: 38, percent: 39 },
      satisfactory: { m: 12, f: 10, t: 22, percent: 22 },
      fairlySatisfactory: { m: 3, f: 3, t: 6, percent: 6 },
      didNotMeet: { m: 1, f: 1, t: 2, percent: 2 },
      gpa: { m: 86, f: 88, t: 87 },
    },
    {
      level: "TOTAL",
      enrollment: { m: 50, f: 48, t: 98 },
      outstanding: { m: 14, f: 16, t: 30, percent: 31 },
      verySatisfactory: { m: 20, f: 18, t: 38, percent: 39 },
      satisfactory: { m: 12, f: 10, t: 22, percent: 22 },
      fairlySatisfactory: { m: 3, f: 3, t: 6, percent: 6 },
      didNotMeet: { m: 1, f: 1, t: 2, percent: 2 },
      gpa: { m: 86, f: 88, t: 87 },
    },
    {
      level: "III-Parrot",
      enrollment: { m: 48, f: 50, t: 98 },
      outstanding: { m: 13, f: 17, t: 30, percent: 31 },
      verySatisfactory: { m: 19, f: 19, t: 38, percent: 39 },
      satisfactory: { m: 11, f: 10, t: 21, percent: 21 },
      fairlySatisfactory: { m: 4, f: 3, t: 7, percent: 7 },
      didNotMeet: { m: 1, f: 1, t: 2, percent: 2 },
      gpa: { m: 85, f: 86, t: 86 },
    },
    {
      level: "TOTAL",
      enrollment: { m: 48, f: 50, t: 98 },
      outstanding: { m: 13, f: 17, t: 30, percent: 31 },
      verySatisfactory: { m: 19, f: 19, t: 38, percent: 39 },
      satisfactory: { m: 11, f: 10, t: 21, percent: 21 },
      fairlySatisfactory: { m: 4, f: 3, t: 7, percent: 7 },
      didNotMeet: { m: 1, f: 1, t: 2, percent: 2 },
      gpa: { m: 85, f: 86, t: 86 },
    },
  ];

  const filteredData = [];
  for (let i = 0; i < dummyData.length; i++) {
    const row = dummyData[i];

    // If the row matches the search query, include it and the next row if it's "TOTAL"
    if (row.level.toLowerCase().includes(searchQuery.toLowerCase())) {
      filteredData.push(row);

      // Check if the next row exists and is a "TOTAL" row
      if (i + 1 < dummyData.length && dummyData[i + 1].level === "TOTAL") {
        filteredData.push(dummyData[i + 1]);
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64 overflow-x-auto">
        <Header />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            No. of Learners per Proficiency Level (By Section)
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search Grade Level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 bg-white"
            />
            <button className="btn bg-green-700 text-white flex">
              <RiFileExcel2Fill />
              Export via Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="border-collapse table">
            <thead>
              <tr>
                <th
                  rowSpan="2"
                  className="border border-gray-400 p-2 text-center font-bold"
                >
                  GRADE LEVEL
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Enrollment
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Outstanding
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold w-12"
                >
                  %
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Very Satisfactory (85-89)
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold w-12"
                >
                  %
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Satisfactory (80-84)
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold w-12"
                >
                  %
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Fairly Satisfactory (75-79)
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold w-12"
                >
                  %
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  Did not meet expectations (70-74)
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold w-12"
                >
                  %
                </th>
                <th
                  colSpan="3"
                  className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                >
                  GENERAL PERCENTAGE AVERAGE (GPA)
                </th>
              </tr>
              <tr>
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`enrollment-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`outstanding-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`very-satisfactory-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`satisfactory-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`fairly-satisfactory-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`did-not-meet-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
                {["M", "F", "T"].map((header) => (
                  <th
                    key={`gpa-${header}`}
                    className="border border-gray-400 bg-yellow-200 p-2 text-center w-12"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className={row.level.includes("TOTAL") ? "bg-gray-100" : ""}
                >
                  <td className="border border-gray-400 p-2 font-bold text-center">
                    {row.level}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.enrollment.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.enrollment.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.enrollment.t}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.outstanding.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.outstanding.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.outstanding.t}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.outstanding.percent}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.verySatisfactory.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.verySatisfactory.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.verySatisfactory.t}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.verySatisfactory.percent}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.satisfactory.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.satisfactory.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.satisfactory.t}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.satisfactory.percent}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.fairlySatisfactory.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.fairlySatisfactory.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.fairlySatisfactory.t}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.fairlySatisfactory.percent}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.didNotMeet.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.didNotMeet.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.didNotMeet.t}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.didNotMeet.percent}
                  </td>

                  <td className="border border-gray-400 p-2 text-center">
                    {row.gpa.m}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {row.gpa.f}
                  </td>
                  <td className="border border-gray-400 p-2 text-center bg-gray-50">
                    {row.gpa.t}
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

export default BySectionReport;
