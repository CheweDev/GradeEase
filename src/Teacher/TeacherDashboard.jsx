import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";
import supabase from "../SupabaseClient.jsx";

const TeacherDashboard = () => {
  const adviserName = sessionStorage.getItem("name");
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [adviserSection, setAdviserSection] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("firstQuarter");
  const [grades, setGrades] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [promotionData, setPromotionData] = useState({
    section: "",
    grade_level: ""
  });
  const [newGrades, setNewGrade] = useState({
    grading: "",
    language: "",
    esp: "",
    english: "",
    math: "",
    science: "",
    filipino: "",
    ap: "",
    reading: "",
    makabansa: "",
    gmrc:"",
    mapeh: "",
    average: "",
  });

  useEffect(() => {
    fetchAdvisers();
    fetchSections();
  }, []);

  const fetchAdvisers = async () => {
    const { data } = await supabase
    .from("Advisers")
    .select("*")
    .eq("name", adviserName)
    .single();
    fetchStudents(data.advisory);

  };

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from("Section")
      .select("section, grade_level");
    
    if (error) {
      console.error("Error fetching sections:", error);
    } else {
      setSections(data);
    }
  };

  const fetchStudents = async (advisory) => {
    const { data } = await supabase.from("Student Data")
    .select("*")
    .eq("section", advisory);
    setStudents(data);

  };

  const fetchStudentGrades = async (studentName, studentGrade) => {
    const { data, error } = await supabase
      .from("Grades")
      .select("*")
      .eq("name", studentName)
      .eq("grade", studentGrade);

    if (error) {
      console.error("Error fetching grades:", error);
      return;
    }

    setStudentGrades(data || []);
  };


  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
  };


  const handleGradeChange = (subjectName, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subjectName]: {
        ...prevGrades[subjectName],
        [selectedQuarter]: value,
      },
    }));
  };

  const uniqueGradeLevels = [...new Set(sections.map(section => section.grade_level))];

  const handleGradeLevelChange = (selectedGradeLevel) => {
    const sectionsForGradeLevel = sections.filter(
      section => section.grade_level === selectedGradeLevel
    );


    setPromotionData(prev => ({
      grade_level: selectedGradeLevel,
      section: "" 
    }));
    setFilteredSections(sectionsForGradeLevel);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const school_year = `${currentYear}-${nextYear}`;
  
    const subjects = [
      newGrades.language,
      newGrades.esp,
      newGrades.english,
      newGrades.math,
      newGrades.science,
      newGrades.filipino,
      newGrades.ap,
      newGrades.reading,
      newGrades.makabansa,
      newGrades.gmrc,
      newGrades.mapeh,
    ].map((grade) => (grade === "" ? null : Number(grade))) 
      .filter((grade) => grade !== null && !isNaN(grade)); 
  

      const totalSubjects = subjects.length;
      const totalSum = subjects.reduce((sum, grade) => sum + grade, 0);
      
      let average = null;
      
      if (totalSubjects > 0) {
        const rawAverage = totalSum / totalSubjects;
        const decimal = rawAverage % 1;
      
        if (decimal < 0.5) {
          average = Math.floor(rawAverage);
        } else {
          average = Math.round(rawAverage);
        }
      }
      
  
    const { data, error } = await supabase.from("Grades").insert([
      {
        name: selectedStudent.name,
        section: selectedStudent.section,
        grade: selectedStudent.grade,
        grading: newGrades.grading,
        school_year,
        language: newGrades.language === "" ? null : Number(newGrades.language),
        esp: newGrades.esp === "" ? null : Number(newGrades.esp),
        english: newGrades.english === "" ? null : Number(newGrades.english),
        math: newGrades.math === "" ? null : Number(newGrades.math),
        science: newGrades.science === "" ? null : Number(newGrades.science),
        filipino: newGrades.filipino === "" ? null : Number(newGrades.filipino),
        ap: newGrades.ap === "" ? null : Number(newGrades.ap),
        reading: newGrades.reading === "" ? null : Number(newGrades.reading),
        makabansa: newGrades.makabansa === "" ? null : Number(newGrades.makabansa),
        gmrc: newGrades.gmrc === "" ? null : Number(newGrades.gmrc),
        mapeh: newGrades.mapeh === "" ? null : Number(newGrades.mapeh),
        average,
        gender: selectedStudent.gender,
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
  
  
  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter students by LRN or name
  const filteredStudents = students.filter(
    (student) =>
      student.lrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGradeForSubject = (subject, gradingPeriod) => {
    const gradeEntry = studentGrades.find(grade => grade.grading === gradingPeriod);
    return gradeEntry ? gradeEntry[subject] : "-";
  };

  const handlePromoteStudent = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !promotionData.section || !promotionData.grade_level) {
      alert("Please select a section and grade level");
      return;
    }

    const { error } = await supabase
      .from("Student Data")
      .update({ 
        section: promotionData.section,
        grade: promotionData.grade_level 
      })
      .eq("id", selectedStudent.id);

    if (error) {
      console.error("Error promoting student:", error);
      alert("Error promoting student");
    } else {
      alert("Student promoted successfully");
      document.getElementById("promote_modal").close();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <Header />
        <div className="flex justify-between mb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
            <p className="mt-1 text-gray-600">Add Grades for your Students</p>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by LRN or Name"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg mb-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>LRN</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.lrn}</td>
                  <td>{student.name}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelectedStudent(student);
                        document.getElementById("grade_modal").showModal();
                      }}
                    >
                      Add Grades
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => {
                        setSelectedStudent(student);
                        fetchStudentGrades(student.name, student.grade);
                        document.getElementById("view_grades_modal").showModal();
                      }}
                    >
                      View Grades
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelectedStudent(student);
                        document.getElementById("promote_modal").showModal();
                      }}
                    >
                   Promote
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>

          </table>
        </div>

        {/* Add/Update Grades Modal */}
        <dialog id="grade_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Add Grades for {selectedStudent?.name}
            </h3>
            {/* Form for Grades */}
            <form onSubmit={handleGradeSubmit}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                type="button"
                onClick={() => document.getElementById("grade_modal").close()}
              >
                ✕
              </button>
              <label className="block mb-4 mt-4">
                <span>Select Grading</span>
                <select
                  className="w-full p-2 border rounded"
                  value={newGrades.grading}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, grading: e.target.value })
                  }
                >
                  <option value="" disabled>Select Grading Period</option>
                  <option value="1st Grading">1st Grading</option>
                  <option value="2nd Grading">2nd Grading</option>
                  <option value="3rd Grading">3rd Grading</option>
                  <option value="4th Grading">4th Grading</option>
                </select>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-2">
                <span>Language</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.language}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, language: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>ESP</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.esp}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, esp: e.target.value })
                  }
                />
              </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-2">
                <span>English</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.english}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, english: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Math</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                   placeholder="Enter Grade"
                  value={newGrades.math}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, math: e.target.value })
                  }
                />
              </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-2">
                <span>Science</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.science}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, science: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Filipino</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.filipino}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, filipino: e.target.value })
                  }
                />
              </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-2">
                <span>AP</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.ap}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, ap: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>Reading</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.reading}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, reading: e.target.value })
                  }
                />
              </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block mb-2">
                <span>Makabansa</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.makabansa}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, makabansa: e.target.value })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>GMRC</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.gmrc}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, gmrc: e.target.value })
                  }
                />
              </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block mb-2">
                <span>MAPEH</span>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Grade"
                  value={newGrades.mapeh}
                  onChange={(e) =>
                    setNewGrade({ ...newGrades, mapeh: e.target.value })
                  }
                />
              </label>
              </div>

      

              {/* Modal Footer */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("grade_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-[#333] text-white">
                  Save Grades
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* View Grades Modal */}
<dialog id="view_grades_modal" className="modal">
  <div className="modal-box max-w-4xl">
    <h3 className="font-bold text-lg mb-4">
      Grades for {selectedStudent?.name}
    </h3>
    <button
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      onClick={() => document.getElementById("view_grades_modal").close()}
    >
      ✕
    </button>
    
    <div className="overflow-x-auto">
      <table className="table w-full border">
        <thead>
          <tr>
            <th className="border bg-gray-100">Subject</th>
            <th className="border bg-gray-100">1st Grading</th>
            <th className="border bg-gray-100">2nd Grading</th>
            <th className="border bg-gray-100">3rd Grading</th>
            <th className="border bg-gray-100">4th Grading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border font-medium">Language</td>
            <td className="border text-center">{getGradeForSubject("language", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("language", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("language", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("language", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">ESP</td>
            <td className="border text-center">{getGradeForSubject("esp", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("esp", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("esp", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("esp", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">English</td>
            <td className="border text-center">{getGradeForSubject("english", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("english", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("english", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("english", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">Math</td>
            <td className="border text-center">{getGradeForSubject("math", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("math", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("math", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("math", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">Science</td>
            <td className="border text-center">{getGradeForSubject("science", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("science", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("science", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("science", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">Filipino</td>
            <td className="border text-center">{getGradeForSubject("filipino", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("filipino", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("filipino", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("filipino", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">AP</td>
            <td className="border text-center">{getGradeForSubject("ap", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("ap", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("ap", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("ap", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">Reading</td>
            <td className="border text-center">{getGradeForSubject("reading", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("reading", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("reading", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("readings", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">Makabansa</td>
            <td className="border text-center">{getGradeForSubject("makabansa", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("makabansa", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("makabansa", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("makabansa", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">GMRC</td>
            <td className="border text-center">{getGradeForSubject("gmrc", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("gmrc", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("gmrc", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("gmrc", "4th Grading")}</td>
          </tr>
          <tr>
            <td className="border font-medium">MAPEH</td>
            <td className="border text-center">{getGradeForSubject("mapeh", "1st Grading")}</td>
            <td className="border text-center">{getGradeForSubject("mapeh", "2nd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("mapeh", "3rd Grading")}</td>
            <td className="border text-center">{getGradeForSubject("mapeh", "4th Grading")}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border font-bold">Average</td>
            <td className="border text-center font-bold">{getGradeForSubject("average", "1st Grading")}</td>
            <td className="border text-center font-bold">{getGradeForSubject("average", "2nd Grading")}</td>
            <td className="border text-center font-bold">{getGradeForSubject("average", "3rd Grading")}</td>
            <td className="border text-center font-bold">{getGradeForSubject("average", "4th Grading")}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div className="modal-action">
      <button
        className="btn bg-[#333] text-white"
        onClick={() => document.getElementById("view_grades_modal").close()}
      >
        Close
      </button>
    </div>
  </div>
</dialog>

<dialog id="promote_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Promote {selectedStudent?.name}
            </h3>
            <form onSubmit={handlePromoteStudent}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                type="button"
                onClick={() => document.getElementById("promote_modal").close()}
              >
                ✕
              </button>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Select New Grade Level</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={promotionData.grade_level}
                  onChange={(e) => handleGradeLevelChange(e.target.value)}
                  required
                >
                  <option value="">Select Grade Level</option>
                  {uniqueGradeLevels.map((gradeLevel, index) => (
                    <option 
                      key={index} 
                      value={gradeLevel}
                    >
                      {gradeLevel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Select New Section</span>
                </label>
                <select
                     className="select select-bordered w-full"
                     value={promotionData.section}
                     onChange={(e) => 
                       setPromotionData(prev => ({ 
                         ...prev, 
                         section: e.target.value 
                       }))
                     }
                     disabled={!promotionData.grade_level}
                     required
                >
                  <option value="">
                    {promotionData.grade_level 
                      ? "Select Section" 
                      : "First Select Grade Level"}
                  </option>
                  {filteredSections.map((sectionItem, index) => (
                    <option 
                      key={index} 
                      value={sectionItem.section}
                    >
                      {sectionItem.section}
                    </option>
                  ))}
                </select>
              </div>

           

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("promote_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-[#333] text-white">
                  Promote Student
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default TeacherDashboard;
