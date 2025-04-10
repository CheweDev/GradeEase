import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import supabase from "../SupabaseClient.jsx";

const Advisors = () => {
  const [advisors, setAdvisors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [advisory, setAdvisory] = useState("");
  const [grade, setGrade] = useState("");
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [sections, setSections] = useState([]);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    fetchAdvisers();
    fetchSections();
  }, []);

  const fetchAdvisers = async () => {
    const { data } = await supabase.from("Advisers").select("*");
    setAdvisors(data);
  };

  const fetchSections = async () => {
    const { data } = await supabase.from("Section").select("*");
    setSections(data);
  };

  // Open modal for adding/editing advisors
  const openModal = (advisor = null) => {
    if (advisor) {
      setEditingAdvisor(advisor);
      setEditId(advisor.id);
      setName(advisor.name);
      setAdvisory(advisor.advisory);
      setGrade(advisor.grade);
    } else {
      setEditingAdvisor(null);
      setName("");
      setAdvisory("");
      setGrade("");
    }
    setIsModalOpen(true);
  };

  const addAdvisor = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("Advisers").insert([
      {
        name,
        advisory,
        grade,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    } else {
      console.log("Data inserted successfully:", data);
      createAccount();
    }
  };

  const createAccount = async () => {
    const { data, error } = await supabase.from("Users").insert([
      {
        password: generateRandomPassword(),
        name,
        role: "TEACHER",
        email: `${name?.toLowerCase().replace(/\s+/g, "")}@edu.ph`,
        status: "Active",
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    } else {
      console.log("Data inserted successfully:", data);
      window.location.reload();
    }
  };

  const generateRandomPassword = () => {
    const length = 8;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = uppercase + lowercase + numbers;
  
    let password =
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      lowercase[Math.floor(Math.random() * lowercase.length)] +
      numbers[Math.floor(Math.random() * numbers.length)];
  
 
    for (let i = 3; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split("").sort(() => Math.random() - 0.5).join("");
  };

  // Update advisor
  const updateAdvisor = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("Advisers")
      .update({
        name,
        advisory,
        grade,
      })
      .eq("id", editId);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    } else {
      console.log("Data inserted successfully:", data);
      window.location.reload();
    }
  };

  // Filter logic
  const filteredAdvisors = advisors.filter((advisor) => {
    return (
      (selectedGrade === "" || advisor.grade === selectedGrade) &&
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Filters */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Advisers</h2>
          <div className="flex gap-4 mb-4">
            <select
              className="p-2 border rounded w-1/3 bg-white border-gray-400"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="">All Grades</option>
              {[...new Set(advisors.map((a) => a.grade))].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="p-2 border rounded w-2/3 bg-white border-gray-400"
              placeholder="Search by adviser name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn bg-[#333] text-white flex"
              onClick={() => openModal()}
            >
              <IoAddCircleSharp size={18} />
              Add Adviser
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Adviser Name</th>
                <th>Advisory Section(s)</th>
                <th>Grade Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvisors.length > 0 ? (
                filteredAdvisors.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.advisory}</td>
                    <td className="p-3">{item.grade}</td>
                    <td className="p-3">
                      <button
                        className="btn btn-sm bg-info text-white"
                        onClick={() => openModal(item)}
                      >
                        <FiEdit className="inline-block" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No advisers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Advisor */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {editingAdvisor ? "Edit Advisor" : "Add New Advisor"}
              </h3>

              {/* Advisor Name Input */}
              <label className="input w-full mb-4">
              <input
                type="text"
                className="w-full p-2 rounded"
                placeholder="Enter advisor name (e.g., Mr. Smith)"
                value={name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[0-9]/g, '');
                  setName(onlyLetters);
                }}
              />
            </label>
              {/* Grade Level Input */}
              <label className="input w-full mb-4">
              <select
                className="w-full"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="" disabled>Select Grade Level</option>
                {sections.map((item, index) => (
                  <option key={index} value={item.grade_level}>{item.grade_level}</option>
                ))}
              </select>
              </label>

                   {/* Advisory Sections Input */}
                   <label className="input w-full mb-4">
              <select
                className="w-full"
                value={advisory}
                  onChange={(e) => setAdvisory(e.target.value)}
              >
                <option value="" disabled>Select Section</option>
                {sections.map((item, index) => (
                  <option key={index} value={item.section}>{item.section}</option>
                ))}
              </select>
              </label>


              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[#333] text-white"
                  onClick={editingAdvisor ? updateAdvisor : addAdvisor}
                >
                  {editingAdvisor ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Advisors;
