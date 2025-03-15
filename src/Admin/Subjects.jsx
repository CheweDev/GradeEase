import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import supabase from "../SupabaseClient.jsx";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase.from("Subjects").select("*");
    setSubjects(data);
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Dropdown Filter for Subject */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Subjects</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Subjects List</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-t">
                  <td className="p-3">{subject.subject_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Subject Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
              <label className="block mb-2">
                <span>Subject Name</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Subject"
                  value={newSubject.subject}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, subject: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Applicable For</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Applicable Grade"
                  value={newSubject.applicableFor}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      applicableFor: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block mb-4">
                <span>Description</span>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter Subject Description"
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#333] text-white rounded hover:bg-green-700"
                  onClick={addSubject}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Edit Subject</h3>
              <label className="block mb-2">
                <span>Subject Name</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Subject"
                  value={editedSubject.subject}
                  onChange={(e) =>
                    setEditedSubject({
                      ...editedSubject,
                      subject: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Applicable For</span>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Applicable Grade"
                  value={editedSubject.applicableFor}
                  onChange={(e) =>
                    setEditedSubject({
                      ...editedSubject,
                      applicableFor: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block mb-4">
                <span>Description</span>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter Subject Description"
                  value={editedSubject.description}
                  onChange={(e) =>
                    setEditedSubject({
                      ...editedSubject,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#333] text-white rounded"
                  onClick={updateSubject}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Subjects;
