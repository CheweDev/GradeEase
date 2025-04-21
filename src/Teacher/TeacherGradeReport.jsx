import TeacherSidebar from "./TeacherSidebar.jsx";
import Header from "../Admin/Header.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import supabase from "../SupabaseClient.jsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TeacherGradeReport = () => {
  const [gradeData, setGradeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("average");
  const [selectedGrading, setSelectedGrading] = useState("1st Grading");
  const [isExporting, setIsExporting] = useState(false);

  // List of subjects
  const subjects = [
    { value: "average", label: "All Subjects (Average)" },
    { value: "language", label: "Language" },
    { value: "esp", label: "ESP" },
    { value: "english", label: "English" },
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "filipino", label: "Filipino" },
    { value: "ap", label: "AP" },
    { value: "reading", label: "Reading" },
    { value: "makabansa", label: "Makabansa" },
    { value: "gmrc", label: "GMRC" },
    { value: "mapeh", label: "MAPEH" },
  ];

  // List of grading periods
  const gradingPeriods = [
    { value: "1st Grading", label: "First Grading" },
    { value: "2nd Grading", label: "Second Grading" },
    { value: "3rd Grading", label: "Third Grading" },
    { value: "4th Grading", label: "Fourth Grading" },
  ];

  useEffect(() => {
    fetchGradeData();
  }, [selectedSubject, selectedGrading]);

  const fetchGradeData = async () => {
    setIsLoading(true);
    try {
      // Build the query based on filters
      let query = supabase
        .from("Grades")
        .select(`
               id, 
          grade, 
          gender,
          language,
          esp,
          english,
          math,
          science,
          filipino,
          ap,
          reading,
          makabansa,
          gmrc,
          mapeh,
          average,
          grading
        `);

      // Add grading period filter if not "all"
      if (selectedGrading !== "all") {
        query = query.eq('grading', selectedGrading);
      }

      const { data: gradesData, error } = await query;

      if (error) {
        console.error("Error fetching grades:", error);
        return;
      }

      // Process the data to get the grade level summaries
      const gradeLevelSummaries = processGradeData(gradesData);
      setGradeData(gradeLevelSummaries);
    } catch (error) {
      console.error("Error in data processing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processGradeData = (gradesData) => {
    // Group by grade_level only (not section)
    const gradeGroups = {};
    
    gradesData.forEach(grade => {
      // Use the selected subject's score instead of average if a specific subject is selected
      const scoreToUse = selectedSubject === "average" ? grade.average : grade[selectedSubject];
      
      // Skip this entry if the selected subject has no data
      if (scoreToUse === null || scoreToUse === undefined) {
        return;
      }
      
      // Format the grade key to ensure consistent format
      const gradeKey = `${grade.grade}`;
      if (!gradeGroups[gradeKey]) {
          gradeGroups[gradeKey] = {
              grade: gradeKey,
              gradeNumber: parseInt(grade.grade), // Add grade number for sorting
              enrollment: { m: 0, f: 0, t: 0 },
              outstanding: { m: 0, f: 0, t: 0, percent: 0 },
              verySatisfactory: { m: 0, f: 0, t: 0, percent: 0 },
              satisfactory: { m: 0, f: 0, t: 0, percent: 0 },
              fairlySatisfactory: { m: 0, f: 0, t: 0, percent: 0 },
              didNotMeet: { m: 0, f: 0, t: 0, percent: 0 },
              gpa: { m: 0, f: 0, t: 0 },
              maleCount: 0,
              femaleCount: 0,
              maleTotalScore: 0,
              femaleTotalScore: 0
          };
      }
  
      const gradeLevel = gradeGroups[gradeKey];
  
      // Determine gender (with proper trimming and case handling)
      const gender = grade.gender?.trim().toLowerCase() === 'male' ? 'Male' : 'Female';
      const genderKey = gender === 'Male' ? 'm' : 'f';
  
      // Increment enrollment
      gradeLevel.enrollment[genderKey]++;
      gradeLevel.enrollment.t++;
  
      // Update gender-specific counts and scores
      if (gender === 'Male') {
          gradeLevel.maleCount++;
          gradeLevel.maleTotalScore += scoreToUse;
      } else {
          gradeLevel.femaleCount++;
          gradeLevel.femaleTotalScore += scoreToUse;
      }
  
      // Categorize based on score
      if (scoreToUse >= 90) {
          gradeLevel.outstanding[genderKey]++;
          gradeLevel.outstanding.t++;
      } else if (scoreToUse >= 85) {
          gradeLevel.verySatisfactory[genderKey]++;
          gradeLevel.verySatisfactory.t++;
      } else if (scoreToUse >= 80) {
          gradeLevel.satisfactory[genderKey]++;
          gradeLevel.satisfactory.t++;
      } else if (scoreToUse >= 75) {
          gradeLevel.fairlySatisfactory[genderKey]++;
          gradeLevel.fairlySatisfactory.t++;
      } else {
          gradeLevel.didNotMeet[genderKey]++;
          gradeLevel.didNotMeet.t++;
      }
    });
  
    // Calculate percentages and averages
    Object.values(gradeGroups).forEach(gradeLevel => {
      const totalStudents = gradeLevel.enrollment.t;
      if (totalStudents > 0) {
        gradeLevel.outstanding.percent = Math.round((gradeLevel.outstanding.t / totalStudents) * 100);
        gradeLevel.verySatisfactory.percent = Math.round((gradeLevel.verySatisfactory.t / totalStudents) * 100);
        gradeLevel.satisfactory.percent = Math.round((gradeLevel.satisfactory.t / totalStudents) * 100);
        gradeLevel.fairlySatisfactory.percent = Math.round((gradeLevel.fairlySatisfactory.t / totalStudents) * 100);
        gradeLevel.didNotMeet.percent = Math.round((gradeLevel.didNotMeet.t / totalStudents) * 100);
        
        gradeLevel.gpa.m = gradeLevel.maleCount > 0 ? Math.round(gradeLevel.maleTotalScore / gradeLevel.maleCount) : 0;
        gradeLevel.gpa.f = gradeLevel.femaleCount > 0 ? Math.round(gradeLevel.femaleTotalScore / gradeLevel.femaleCount) : 0;
        gradeLevel.gpa.t = Math.round((gradeLevel.maleTotalScore + gradeLevel.femaleTotalScore) / totalStudents);
      }
    });

    // Convert to array and sort by grade level
    return Object.values(gradeGroups).sort((a, b) => {
      // Extract grade numbers from strings like "Grade 1"
      const getGradeNumber = (str) => {
        const match = str.match(/Grade (\d+)/i) || str.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      const gradeA = getGradeNumber(a.grade);
      const gradeB = getGradeNumber(b.grade);
      return gradeA - gradeB;
    });
  };

  // Calculate totals for all rows
  const calculateTotals = () => {
    if (!gradeData.length) return null;
    
    const totals = {
      grade: "TOTAL",
      enrollment: { m: 0, f: 0, t: 0 },
      outstanding: { m: 0, f: 0, t: 0, percent: 0 },
      verySatisfactory: { m: 0, f: 0, t: 0, percent: 0 },
      satisfactory: { m: 0, f: 0, t: 0, percent: 0 },
      fairlySatisfactory: { m: 0, f: 0, t: 0, percent: 0 },
      didNotMeet: { m: 0, f: 0, t: 0, percent: 0 },
      gpa: { m: 0, f: 0, t: 0 },
      maleTotalScore: 0,
      femaleTotalScore: 0,
      maleCount: 0,
      femaleCount: 0
    };
    
    gradeData.forEach(row => {
      // Sum up enrollments
      totals.enrollment.m += row.enrollment.m;
      totals.enrollment.f += row.enrollment.f;
      totals.enrollment.t += row.enrollment.t;
      
      // Sum up categories
      ['outstanding', 'verySatisfactory', 'satisfactory', 'fairlySatisfactory', 'didNotMeet'].forEach(category => {
        totals[category].m += row[category].m;
        totals[category].f += row[category].f;
        totals[category].t += row[category].t;
      });
      
      // Sum up for GPA calculation
      totals.maleTotalScore += row.maleTotalScore;
      totals.femaleTotalScore += row.femaleTotalScore;
      totals.maleCount += row.maleCount;
      totals.femaleCount += row.femaleCount;
    });
    
    // Calculate percentages for totals
    if (totals.enrollment.t > 0) {
      ['outstanding', 'verySatisfactory', 'satisfactory', 'fairlySatisfactory', 'didNotMeet'].forEach(category => {
        totals[category].percent = Math.round((totals[category].t / totals.enrollment.t) * 100);
      });
      
      // Calculate overall GPA
      totals.gpa.m = totals.maleCount > 0 ? Math.round(totals.maleTotalScore / totals.maleCount) : 0;
      totals.gpa.f = totals.femaleCount > 0 ? Math.round(totals.femaleTotalScore / totals.femaleCount) : 0;
      totals.gpa.t = Math.round((totals.maleTotalScore + totals.femaleTotalScore) / totals.enrollment.t);
    }
    
    return totals;
  };

  const filteredData = gradeData.filter(row => 
    row.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totals = calculateTotals();

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleGradingChange = (e) => {
    setSelectedGrading(e.target.value);
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Generate a title for the export file based on selected filters
      const subjectName = subjects.find(s => s.value === selectedSubject)?.label || "All Subjects";
      const gradingPeriod = selectedGrading === "all" 
        ? "All Gradings" 
        : gradingPeriods.find(g => g.value === selectedGrading)?.label || "All Gradings";
      
      // Create header rows for the Excel file
      const excelData = [];
      
      // Add title rows
      excelData.push(["LEARNERS' PROFICIENCY LEVEL BY GRADE LEVEL"]);
      excelData.push([`Subject: ${subjectName}`]);
      excelData.push([`Grading Period: ${gradingPeriod}`]);
      excelData.push([`Date Generated: ${new Date().toLocaleDateString()}`]);
      excelData.push([]);  // Empty row for spacing
      
      // Add header rows
      excelData.push([
        "Grade Level",
        "Number of Learners (M)", "Number of Learners (F)", "Number of Learners (T)",
        "Outstanding (90-100%) (M)", "Outstanding (90-100%) (F)", "Outstanding (90-100%) (T)", "Outstanding %",
        "Very Satisfactory (85-89%) (M)", "Very Satisfactory (85-89%) (F)", "Very Satisfactory (85-89%) (T)", "Very Satisfactory %",
        "Satisfactory (80-84%) (M)", "Satisfactory (80-84%) (F)", "Satisfactory (80-84%) (T)", "Satisfactory %",
        "Fairly Satisfactory (75-79%) (M)", "Fairly Satisfactory (75-79%) (F)", "Fairly Satisfactory (75-79%) (T)", "Fairly Satisfactory %",
        "Did Not Meet Expectation (70-74%) (M)", "Did Not Meet Expectation (70-74%) (F)", "Did Not Meet Expectation (70-74%) (T)", "Did Not Meet Expectation %",
        "GPA (M)", "GPA (F)", "GPA (T)"
      ]);
      
      // Add data rows
      filteredData.forEach(row => {
        excelData.push([
          row.grade,
          row.enrollment.m, row.enrollment.f, row.enrollment.t,
          row.outstanding.m, row.outstanding.f, row.outstanding.t, `${row.outstanding.percent}%`,
          row.verySatisfactory.m, row.verySatisfactory.f, row.verySatisfactory.t, `${row.verySatisfactory.percent}%`,
          row.satisfactory.m, row.satisfactory.f, row.satisfactory.t, `${row.satisfactory.percent}%`,
          row.fairlySatisfactory.m, row.fairlySatisfactory.f, row.fairlySatisfactory.t, `${row.fairlySatisfactory.percent}%`,
          row.didNotMeet.m, row.didNotMeet.f, row.didNotMeet.t, `${row.didNotMeet.percent}%`,
          row.gpa.m, row.gpa.f, row.gpa.t
        ]);
      });
      
      // Add totals row if available
      if (totals) {
        excelData.push([
          totals.grade,
          totals.enrollment.m, totals.enrollment.f, totals.enrollment.t,
          totals.outstanding.m, totals.outstanding.f, totals.outstanding.t, `${totals.outstanding.percent}%`,
          totals.verySatisfactory.m, totals.verySatisfactory.f, totals.verySatisfactory.t, `${totals.verySatisfactory.percent}%`,
          totals.satisfactory.m, totals.satisfactory.f, totals.satisfactory.t, `${totals.satisfactory.percent}%`,
          totals.fairlySatisfactory.m, totals.fairlySatisfactory.f, totals.fairlySatisfactory.t, `${totals.fairlySatisfactory.percent}%`,
          totals.didNotMeet.m, totals.didNotMeet.f, totals.didNotMeet.t, `${totals.didNotMeet.percent}%`,
          totals.gpa.m, totals.gpa.f, totals.gpa.t
        ]);
      }
      
      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Set column widths
      const wscols = Array(27).fill({ wch: 15 });  // Default width for all columns
      wscols[0] = { wch: 20 };  // Grade Level column wider
      ws['!cols'] = wscols;
      
      // Style the header cells
      // Note: cell styling requires using xlsx-style package instead of regular xlsx
      // For this example, we'll just adjust column widths
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Proficiency Report");
      
      // Generate file name
      const fileName = `Proficiency_Level_Report_${subjectName.replace(/[^a-zA-Z0-9]/g, "_")}_${gradingPeriod.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write and download file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("An error occurred while exporting to Excel. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-6 lg:ml-64 overflow-x-auto">
        <Header />
  
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            No. of Learners per Proficiency Level (By Grade Level)
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search Grade Level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1 bg-white"
            />
            <button 
              className="btn bg-green-700 text-white flex items-center px-3 py-1 rounded"
              onClick={exportToExcel}
              disabled={isExporting || isLoading || filteredData.length === 0}
            >
              <RiFileExcel2Fill className="mr-1" />
              {isExporting ? 'Exporting...' : 'Export via Excel'}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Subject
            </label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
            >
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="grading-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Grading Period
            </label>
            <select
              id="grading-filter"
              value={selectedGrading}
              onChange={handleGradingChange}
              className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
            >
              {gradingPeriods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Filter Summary */}
        <div className="mb-6 bg-blue-50 p-3 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Current filters:</span> 
            {" "}
            {subjects.find(s => s.value === selectedSubject)?.label || "All Subjects"}
            {" | "}
            {selectedGrading === "all" ? "All Grading Periods" : gradingPeriods.find(g => g.value === selectedGrading)?.label || "All Grading Periods"}
          </p>
        </div>
  
        {/* Loading indicator */}
        {isLoading ? (
          <div className="text-center py-6">Loading data...</div>
        ) : (
          /* Table */
          <div className="overflow-x-auto w-full rounded-box border border-base-content/5 bg-base-100 p-5">
            <table className="table table-auto w-full max-w-full">
              <thead>
                <tr className="text-center border-b border-gray-300">
                  <th rowSpan="2" className="p-2">Grade Level</th>
                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Number of Learners
                  </th>
                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Outstanding <br /> (90-100%)
                  </th>
        
                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Very Satisfactory <br /> (85-89%)
                  </th>

                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Satisfactory <br /> (80-84%)
                  </th>

                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Fairly Satisfactory <br /> (75-79%)
                  </th>

                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    Did Not Meet <br /> Expectation <br /> (70-74%)
                  </th>

                  
                  <th colSpan="3" className="p-2 bg-yellow-100">
                    General Percentage <br /> Average (GPA)
                  </th>
                </tr>
                
                <tr className="text-center border-b border-gray-300">
                  {/* Gender headers for each category */}
                  {/* Enrollment */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>
                  
                  {/* Outstanding */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>
      
                  
                  {/* Very Satisfactory */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>

                  
                  {/* Satisfactory */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>

                  
                  {/* Fairly Satisfactory */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>

                  
                  {/* Did Not Meet */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>

                  
                  {/* GPA */}
                  <th className="p-2 bg-blue-50">M</th>
                  <th className="p-2 bg-pink-50">F</th>
                  <th className="p-2 bg-gray-50">T</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((row, index) => (
                      <tr key={index} className="text-center hover:bg-gray-100">
                        <td className="p-2 font-medium">{row.grade}</td>
                        
                        {/* Enrollment */}
                        <td className="p-2 bg-blue-50">{row.enrollment.m}</td>
                        <td className="p-2 bg-pink-50">{row.enrollment.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.enrollment.t}</td>
                        
                        {/* Outstanding */}
                        <td className="p-2 bg-blue-50">{row.outstanding.m}</td>
                        <td className="p-2 bg-pink-50">{row.outstanding.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.outstanding.t}</td>
           
                        
                        {/* Very Satisfactory */}
                        <td className="p-2 bg-blue-50">{row.verySatisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{row.verySatisfactory.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.verySatisfactory.t}</td>
                
                        
                        {/* Satisfactory */}
                        <td className="p-2 bg-blue-50">{row.satisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{row.satisfactory.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.satisfactory.t}</td>
                
                        
                        {/* Fairly Satisfactory */}
                        <td className="p-2 bg-blue-50">{row.fairlySatisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{row.fairlySatisfactory.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.fairlySatisfactory.t}</td>
               
                        
                        {/* Did Not Meet */}
                        <td className="p-2 bg-blue-50">{row.didNotMeet.m}</td>
                        <td className="p-2 bg-pink-50">{row.didNotMeet.f}</td>
                        <td className="p-2 bg-gray-50 font-medium">{row.didNotMeet.t}</td>
         
                        
                        {/* GPA */}
                        <td className="p-2 bg-blue-50">{row.gpa.m}</td>
                        <td className="p-2 bg-pink-50">{row.gpa.f}</td>
                        <td className="p-2 bg-gray-50 font-bold">{row.gpa.t}</td>
                      </tr>
                    ))}
                    
                    {/* Totals row */}
                    {totals && (
                      <tr className="text-center font-bold bg-slate-100">
                        <td className="p-2">{totals.grade}</td>
                        
                        {/* Enrollment */}
                        <td className="p-2 bg-blue-50">{totals.enrollment.m}</td>
                        <td className="p-2 bg-pink-50">{totals.enrollment.f}</td>
                        <td className="p-2 bg-gray-50">{totals.enrollment.t}</td>
                        
                        {/* Outstanding */}
                        <td className="p-2 bg-blue-50">{totals.outstanding.m}</td>
                        <td className="p-2 bg-pink-50">{totals.outstanding.f}</td>
                        <td className="p-2 bg-gray-50">{totals.outstanding.t}</td>

                        
                        {/* Very Satisfactory */}
                        <td className="p-2 bg-blue-50">{totals.verySatisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{totals.verySatisfactory.f}</td>
                        <td className="p-2 bg-gray-50">{totals.verySatisfactory.t}</td>
  
                        
                        {/* Satisfactory */}
                        <td className="p-2 bg-blue-50">{totals.satisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{totals.satisfactory.f}</td>
                        <td className="p-2 bg-gray-50">{totals.satisfactory.t}</td>

                        
                        {/* Fairly Satisfactory */}
                        <td className="p-2 bg-blue-50">{totals.fairlySatisfactory.m}</td>
                        <td className="p-2 bg-pink-50">{totals.fairlySatisfactory.f}</td>
                        <td className="p-2 bg-gray-50">{totals.fairlySatisfactory.t}</td>
             
                        
                        {/* Did Not Meet */}
                        <td className="p-2 bg-blue-50">{totals.didNotMeet.m}</td>
                        <td className="p-2 bg-pink-50">{totals.didNotMeet.f}</td>
                        <td className="p-2 bg-gray-50">{totals.didNotMeet.t}</td>
          
                        
                        {/* GPA */}
                        <td className="p-2 bg-blue-50">{totals.gpa.m}</td>
                        <td className="p-2 bg-pink-50">{totals.gpa.f}</td>
                        <td className="p-2 bg-gray-50">{totals.gpa.t}</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="27" className="text-center py-6">
                      {isLoading ? 'Loading data...' : 'No data available for the selected filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherGradeReport;