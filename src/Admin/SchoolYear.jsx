import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";
import supabase from "../SupabaseClient.jsx";

const SchoolYear = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [school_year, setSchoolYear] = useState("");

  useEffect(() => {
    fetchSchoolYear();
  }, []);

  const fetchSchoolYear = async () => {
    const { data } = await supabase
      .from("School Year")
      .select("*");
    
    setSchoolYears(data);
  };

  const handleAddSchoolYear = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
        .from('School Year')
        .insert([
          {
            school_year,
            current : "No",
          },
        ])
      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
      } else {
        console.log("Data inserted successfully:", data);
        window.location.reload();
      }
  };

  // Updated function to set a year as current
  const setAsCurrent = async (yearId) => {
    try {
      // First, update all years to "No"
      await supabase
        .from('School Year')
        .update({ current: "No" })
        .gt('id', 0); // This ensures all rows are updated

      // Then, set the selected year to "Yes"
      await supabase
        .from('School Year')
        .update({ current: "Yes" })
        .eq('id', yearId);

      // Refresh the data after update
      window.location.reload();
    } catch (error) {
      console.error("Error setting current year:", error);
      alert("Failed to set current year");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage School Years</h2>
          <button
            className="btn bg-[#333] text-white flex"
            onClick={() => setIsModalOpen(true)}
          >
            <IoAddCircleSharp size={18} />
            School Year
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>School Year</th>
                <th>Current</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schoolYears.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t ${item.current === "Yes" ? "bg-green-100" : ""}`}
                >
                  <td className="p-3">{item.school_year}</td>
                  <td className="p-3">{item.current}</td>
                  <td className="p-3">
                    {item.current !== "Yes" && (
                      <button
                        className="btn btn-sm btn-info text-white"
                        onClick={() => setAsCurrent(item.id)}
                      >
                        Set as Current
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding New Year */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Add New School Year
              </h3>
              <form onSubmit={handleAddSchoolYear}>
                <label className="input w-full mb-4">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>

                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    placeholder="Enter school year (e.g., 2024-2025)"
                    value={school_year}
                    onChange={(e) => {
                      const onlyNumbersAndDash = e.target.value.replace(/[^0-9-]/g, '');
                      setSchoolYear(onlyNumbersAndDash);
                    }}
                    pattern="\d{4}-\d{4}"
                    title="Please enter a valid school year format (e.g., 2024-2025)"
                    required
                  />
                </label>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#333] text-white"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SchoolYear;