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
  const [selectedStudents, setSelectedStudents] = useState([]);
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
  const [hasExistingGrades, setHasExistingGrades] = useState(false);
  const [existingGrades, setExistingGrades] = useState(null);
  const [currentSchoolYear, setCurrentSchoolYear] = useState("");
  const [selectedGradingPeriod, setSelectedGradingPeriod] = useState("");

  useEffect(() => {
    fetchAdvisers();
    fetchSections();
    fetchCurrentSchoolYear();
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

  const fetchCurrentSchoolYear = async () => {
    const { data, error } = await supabase
      .from("School Year")
      .select("*")
      .eq("current", "Yes")
      .single();

    if (error) {
      console.error("Error fetching current school year:", error);
      return;
    }

    if (data) {
      setCurrentSchoolYear(data.school_year);
      console.log(data.school_year);
    }
  };

  const fetchStudents = async (advisory) => {
    const { data } = await supabase.from("Student Data")
    .select("*")
    .eq("section", advisory)
    .eq("status", "Active");
    setStudents(data.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const fetchStudentGrades = async (studentName, studentGrade) => {
    if (!currentSchoolYear) {
      console.error("No current school year found");
      return;
    }

    const { data, error } = await supabase
      .from("Grades")
      .select("*")
      .eq("name", studentName)
      .eq("grade", studentGrade)
      .eq("school_year", currentSchoolYear);

    if (error) {
      console.error("Error fetching grades:", error);
      return;
    }

    setStudentGrades(data || []);
  };

  const checkGradesForGradingPeriod = async (studentName, studentGrade, gradingPeriod) => {
    if (!currentSchoolYear) {
      console.error("No current school year found");
      return;
    }

    const { data, error } = await supabase
      .from("Grades")
      .select("*")
      .eq("name", studentName)
      .eq("grade", studentGrade)
      .eq("grading", gradingPeriod)
      .eq("school_year", currentSchoolYear);

    if (error) {
      console.error("Error checking grades:", error);
      return;
    }

    setHasExistingGrades(data && data.length > 0);
    if (data && data.length > 0) {
      setExistingGrades(data[0]);
      setNewGrade({
        ...newGrades,
        language: data[0].language || "",
        esp: data[0].esp || "",
        english: data[0].english || "",
        math: data[0].math || "",
        science: data[0].science || "",
        filipino: data[0].filipino || "",
        ap: data[0].ap || "",
        reading: data[0].reading || "",
        makabansa: data[0].makabansa || "",
        gmrc: data[0].gmrc || "",
        mapeh: data[0].mapeh || "",
        average: data[0].average || "",
      });
    } else {
      setExistingGrades(null);
      setNewGrade({
        ...newGrades,
        language: "",
        esp: "",
        english: "",
        math: "",
        science: "",
        filipino: "",
        ap: "",
        reading: "",
        makabansa: "",
        gmrc: "",
        mapeh: "",
        average: "",
      });
    }
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
    
    if (hasExistingGrades) {
      alert("Grades already exist for this student in the selected grading period.");
      return;
    }

    if (!currentSchoolYear) {
      alert("No current school year found. Please contact the administrator.");
      return;
    }

    if (!selectedGradingPeriod) {
      alert("Please select a grading period.");
      return;
    }

    const gradesToCheck = [
      { subject: "Language", grade: newGrades.language },
      { subject: "ESP", grade: newGrades.esp },
      { subject: "English", grade: newGrades.english },
      { subject: "Math", grade: newGrades.math },
      { subject: "Science", grade: newGrades.science },
      { subject: "Filipino", grade: newGrades.filipino },
      { subject: "AP", grade: newGrades.ap },
      { subject: "Reading", grade: newGrades.reading },
      { subject: "Makabansa", grade: newGrades.makabansa },
      { subject: "GMRC", grade: newGrades.gmrc },
      { subject: "MAPEH", grade: newGrades.mapeh }
    ];

    for (const { subject, grade } of gradesToCheck) {
      if (grade !== "" && Number(grade) < 70) {
        alert(`Grades below 70 are considered failing and will not be accepted.`);
        return;
      }
    }

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
        grading: selectedGradingPeriod,
        school_year: currentSchoolYear,
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
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
    
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to promote");
      return;
    }

    if (!promotionData.section || !promotionData.grade_level) {
      alert("Please select a section and grade level");
      return;
    }

    let successfulPromotions = 0;
    let failedPromotions = 0;

    for (const student of selectedStudents) {
      const { data: gradesData, error: gradesError } = await supabase
        .from("Grades")
        .select("*")
        .eq("name", student.name)
        .eq("grade", student.grade)
        .eq("school_year", currentSchoolYear);

      if (gradesError) {
        alert(`Error checking grades for ${student.name}.`);
        failedPromotions++;
        continue;
      }

      const quarters = ["1st Grading", "2nd Grading", "3rd Grading", "4th Grading"];
      const completedQuarters = gradesData.map(g => g.grading);
      const missingQuarters = quarters.filter(q => !completedQuarters.includes(q));
      if (missingQuarters.length > 0) {
        alert(`Cannot promote ${student.name}: Missing grading period(s): ${missingQuarters.join(", ")}`);
        failedPromotions++;
        continue;
      }

      const hasFailingGrade = gradesData.some(g =>
        [
          g.language, g.esp, g.english, g.math, g.science, g.filipino,
          g.ap, g.reading, g.makabansa, g.gmrc, g.mapeh
        ].some(val => val !== null && val !== undefined && Number(val) < 75)
      );
      if (hasFailingGrade) {
        alert(`Cannot promote ${student.name}: Has a grade below 75 in at least one subject.`);
        failedPromotions++;
        continue;
      }

      const adviser = adviserName;
      const school_year = currentSchoolYear;
      const student_name = student.name;
      const grade = student.grade;
      const section = student.section;
      const status = "Passed";

      const { error } = await supabase
        .from("Student Data")
        .update({ 
          section: promotionData.section,
          grade: promotionData.grade_level 
        })
        .eq("id", student.id);

      if (error) {
        console.error(`Error promoting student ${student.name}:`, error);
        alert(`Error promoting ${student.name}`);
        failedPromotions++;
        continue;
      }

      const { error: historyError } = await supabase
        .from("History")
        .insert([
          {
            student_name,
            adviser,
            grade,
            section,
            school_year,
            status
          }
        ]);

      if (historyError) {
        console.error(`Error inserting into History table for ${student.name}:`, historyError);
        alert(`Error inserting into History table for ${student.name}`);
        failedPromotions++;
        continue;
      }

      successfulPromotions++;
    }

    if (successfulPromotions > 0) {
      if (failedPromotions > 0) {
        alert(`${successfulPromotions} student(s) promoted successfully. ${failedPromotions} student(s) failed to promote.`);
      } else {
        alert("All selected students have been promoted successfully!");
      }
      document.getElementById("promote_modal").close();
      window.location.reload();
    } else {
      alert("No students were promoted. Please check the error messages above.");
    }
  };

  const resetGradeFields = () => {
    setNewGrade({
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
      gmrc: "",
      mapeh: "",
      average: "",
    });
    setHasExistingGrades(false);
    setExistingGrades(null);
  };

  const handleGradeModalOpen = (student) => {
    setSelectedStudent(student);
    setSelectedGradingPeriod("");
    document.getElementById("grade_modal").showModal();
  };

  const handleGradeModalClose = () => {
    document.getElementById("grade_modal").close();
    setSelectedGradingPeriod("");
  };

  const handleGradingPeriodChange = (e) => {
    const selectedGrading = e.target.value;
    setSelectedGradingPeriod(selectedGrading);
    setNewGrade(prev => ({ ...prev, grading: selectedGrading }));
    if (selectedStudent) {
      checkGradesForGradingPeriod(selectedStudent.name, selectedStudent.grade, selectedGrading);
    }
  };

  const handleFailStudent = async (student) => {
    const { error } = await supabase
      .from("Student Data")
      .update({ status: "Failed" })
      .eq("id", student.id);

    if (error) {
      alert("Error updating student status.");
      return;
    }

    const adviser = adviserName;
    const school_year = currentSchoolYear;
    const student_name = student.name;
    const grade = student.grade;
    const section = student.section;
    const status = "Failed";

    const { error: historyError } = await supabase
      .from("History")
      .insert([
        {
          student_name,
          adviser,
          grade,
          section,
          school_year,
          status
        }
      ]);

    if (historyError) {
      alert("Error inserting into History table.");
    } else {
      alert("Student marked as Failed.");
      window.location.reload();
    }
  };

  const handleGraduateStudent = async (student) => {
    // First check if all grades are present and meet requirements
    const { data: gradesData, error: gradesError } = await supabase
      .from("Grades")
      .select("*")
      .eq("name", student.name)
      .eq("grade", student.grade)
      .eq("school_year", currentSchoolYear);

    if (gradesError) {
      alert(`Error checking grades for ${student.name}.`);
      return;
    }

    // Check if all grading periods are present
    const quarters = ["1st Grading", "2nd Grading", "3rd Grading", "4th Grading"];
    const completedQuarters = gradesData.map(g => g.grading);
    const missingQuarters = quarters.filter(q => !completedQuarters.includes(q));
    
    if (missingQuarters.length > 0) {
      alert(`Cannot graduate ${student.name}: Missing grading period(s): ${missingQuarters.join(", ")}`);
      return;
    }

    // Check if any grade is below 75
    const hasFailingGrade = gradesData.some(g =>
      [
        g.language, g.esp, g.english, g.math, g.science, g.filipino,
        g.ap, g.reading, g.makabansa, g.gmrc, g.mapeh
      ].some(val => val !== null && val !== undefined && Number(val) < 75)
    );

    if (hasFailingGrade) {
      alert(`Cannot graduate ${student.name}: Has a grade below 75 in at least one subject.`);
      return;
    }

    // If all checks pass, proceed with graduation
    const { error } = await supabase
      .from("Student Data")
      .update({ status: "Graduate" })
      .eq("id", student.id);

    if (error) {
      alert("Error updating student status.");
      return;
    }

    const adviser = adviserName;
    const school_year = currentSchoolYear;
    const student_name = student.name;
    const grade = student.grade;
    const section = student.section;
    const status = "Graduate";

    const { error: historyError } = await supabase
      .from("History")
      .insert([
        {
          student_name,
          adviser,
          grade,
          section,
          school_year,
          status
        }
      ]);

    if (historyError) {
      alert("Error inserting into History table.");
    } else {
      alert("Student has been graduated successfully!");
      window.location.reload();
    }
  };

  const handleStudentSelection = (student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.id === student.id);
      if (isSelected) {
        return prev.filter(s => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents);
    } else {
      setSelectedStudents([]);
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

        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg mb-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>LRN</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedStudents.some(s => s.id === student.id)}
                      onChange={() => handleStudentSelection(student)}
                    />
                  </td>
                  <td>{student.lrn}</td>
                  <td>{student.name}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleGradeModalOpen(student)}
                    >
                      Add Grade
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
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleFailStudent(student)}
                    >
                      Failed
                    </button>
                    {student.grade === "Grade 6" && (
                      <button
                        className="btn btn-sm btn-outline btn-success"
                        onClick={() => handleGraduateStudent(student)}
                      >
                        Graduate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-4">
          <button
            className="btn bg-[#333] text-white"
            onClick={() => {
              if (selectedStudents.length === 0) {
                alert("Please select at least one student to promote");
                return;
              }
              document.getElementById("promote_modal").showModal();
            }}
          >
            Promote Selected Students ({selectedStudents.length})
          </button>
        </div>

        <dialog id="grade_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Add Grades for {selectedStudent?.name}
            </h3>
            <form onSubmit={handleGradeSubmit}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                type="button"
                onClick={handleGradeModalClose}
              >
                ✕
              </button>
              <label className="block mb-4 mt-4">
                <span>Select Grading</span>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedGradingPeriod}
                  onChange={handleGradingPeriodChange}
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.language}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, language: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
                <label className="block mb-2">
                  <span>ESP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.esp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, esp: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="block mb-2">
                  <span>English</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.english}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, english: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
                <label className="block mb-2">
                  <span>Math</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.math}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, math: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="block mb-2">
                  <span>Science</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.science}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, science: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
                <label className="block mb-2">
                  <span>Filipino</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.filipino}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, filipino: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="block mb-2">
                  <span>AP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.ap}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, ap: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
                <label className="block mb-2">
                  <span>Reading and Literacy</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.reading}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, reading: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block mb-2">
                  <span>Makabansa</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.makabansa}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, makabansa: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
                <label className="block mb-2">
                  <span>GMRC</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.gmrc}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, gmrc: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="block mb-2">
                  <span>MAPEH</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          e.key !== 'Backspace' && 
                          e.key !== 'Delete' && 
                          e.key !== 'ArrowLeft' && 
                          e.key !== 'ArrowRight' && 
                          e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter Grade"
                    value={newGrades.mapeh}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value) && (+value <= 99 || value === '') && !value.includes('e')) {
                        setNewGrade({ ...newGrades, mapeh: value });
                      }
                    }}
                    readOnly={hasExistingGrades}
                  />
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    document.getElementById("grade_modal").close();
                    resetGradeFields();
                  }}
                >
                  Close
                </button>
                {!hasExistingGrades && (
                  <button type="submit" className="btn bg-[#333] text-white">
                    Save Grades
                  </button>
                )}
              </div>
            </form>
          </div>
        </dialog>

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
                    <td className="border text-center">{getGradeForSubject("reading", "4th Grading")}</td>
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
              Promote {selectedStudents.length} Selected Student{selectedStudents.length !== 1 ? 's' : ''}
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
                  Promote Students
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
