import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { FiPlusCircle, FiEdit } from "react-icons/fi";

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      subject: "Mathematics",
      applicableFor: "Grade 10",
      description: "Mathematics for Grade 10 students.",
    },
    {
      id: 2,
      subject: "English",
      applicableFor: "All",
      description: "English subject for all grade levels.",
    },
    {
      id: 3,
      subject: "Science",
      applicableFor: "Grade 9",
      description: "Science subject for Grade 9 students.",
    },
  ]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject: "",
    applicableFor: "",
    description: "",
  });

  const [editedSubject, setEditedSubject] = useState({
    subject: "",
    applicableFor: "",
    description: "",
  });

  // Handle Filter Dropdown change
  const filteredSubjects = selectedSubject
    ? subjects.filter(
        (subject) =>
          subject.subject === selectedSubject || selectedSubject === "All"
      )
    : subjects;

  // Handle Add New Subject
  const addSubject = () => {
    if (
      !newSubject.subject ||
      !newSubject.applicableFor ||
      !newSubject.description
    ) {
      alert("Please fill all fields!");
      return;
    }

    const newEntry = {
      id: subjects.length + 1,
      ...newSubject,
    };

    setSubjects([...subjects, newEntry]);
    setIsAddModalOpen(false);
    setNewSubject({ subject: "", applicableFor: "", description: "" });
  };

  // Handle Edit Subject
  const editSubject = (subject) => {
    setEditedSubject(subject);
    setIsEditModalOpen(true);
  };

  const updateSubject = () => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === editedSubject.id ? editedSubject : subject
      )
    );
    setIsEditModalOpen(false);
    setEditedSubject({
      subject: "",
      applicableFor: "",
      description: "",
    });
  };

  // Get distinct subjects for the filter dropdown (including "All" option)
  const subjectOptions = [
    "All",
    ...new Set(subjects.map((subject) => subject.subject)),
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />

        {/* Header Section & Dropdown Filter for Subject */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Subjects</h2>

          <div className="flex justify-end gap-2">
            <select
              className="p-2 border rounded w-full bg-white border-gray-400"
              onChange={(e) => setSelectedSubject(e.target.value)}
              value={selectedSubject}
            >
              {subjectOptions.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <button
              className="btn bg-[#333] text-white flex items-center"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FiPlusCircle size={18} />
              Add Subject
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Applicable For</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-t">
                  <td className="p-3">{subject.subject}</td>
                  <td className="p-3">{subject.applicableFor}</td>
                  <td className="p-3">{subject.description}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => editSubject(subject)}
                    >
                      <FiEdit className="inline-block" /> Edit
                    </button>
                  </td>
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
