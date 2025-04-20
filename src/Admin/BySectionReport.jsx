import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import supabase from "../SupabaseClient.jsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const BySectionReport = () => {
  const [sectionData, setSectionData] = useState([]);
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
      excelData.push(["LEARNERS' PROFICIENCY LEVEL BY SECTION"]);
      excelData.push([`Subject: ${subjectName}`]);
      excelData.push([`Grading Period: ${gradingPeriod}`]);
      excelData.push([`Date Generated: ${new Date().toLocaleDateString()}`]);
      excelData.push([]);  // Empty row for spacing
      
      // Add header rows
      excelData.push([
        "Grade Level & Section",
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
          row.level,
          row.enrollment.m, row.enrollment.f, row.enrollment.t,
          row.outstanding.m, row.outstanding.f, row.outstanding.t, `${row.outstanding.percent}%`,
          row.verySatisfactory.m, row.verySatisfactory.f, row.verySatisfactory.t, `${row.verySatisfactory.percent}%`,
          row.satisfactory.m, row.satisfactory.f, row.satisfactory.t, `${row.satisfactory.percent}%`,
          row.fairlySatisfactory.m, row.fairlySatisfactory.f, row.fairlySatisfactory.t, `${row.fairlySatisfactory.percent}%`,
          row.didNotMeet.m, row.didNotMeet.f, row.didNotMeet.t, `${row.didNotMeet.percent}%`,
          row.gpa.m, row.gpa.f, row.gpa.t
        ]);
      });
      
      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Set column widths
      const wscols = Array(27).fill({ wch: 15 });  // Default width for all columns
      wscols[0] = { wch: 25 };  // Section column wider
      ws['!cols'] = wscols;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Section Proficiency Report");
      
      // Generate file name
      const fileName = `Section_Proficiency_Report_${subjectName.replace(/[^a-zA-Z0-9]/g, "_")}_${gradingPeriod.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write and download file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("An error occurred while exporting to Excel. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const fetchGradeData = async () => {
    setIsLoading(true);
    try {
      // Build the query based on filters
      let query = supabase
        .from("Grades")
        .select(`
          id, 
          grade, 
          section, 
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

      // Process the data to get the section summaries
      const sectionSummaries = processSectionData(gradesData);
      setSectionData(sectionSummaries);
    } catch (error) {
      console.error("Error in data processing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processSectionData = (gradesData) => {
    // Group by grade_level and section
    const sectionGroups = {};
    
    gradesData.forEach(grade => {
      // Use the selected subject's score instead of average if a specific subject is selected
      const scoreToUse = selectedSubject === "average" ? grade.average : grade[selectedSubject];
      
      // Skip this entry if the selected subject has no data
      if (scoreToUse === null || scoreToUse === undefined) {
        return;
      }
      
      // Format the section key to ensure consistent format
      const gradeLevel = grade.grade.toString().trim();
      const section = grade.section.toString().trim();
      const sectionKey = `${gradeLevel}-${section}`;
      
      if (!sectionGroups[sectionKey]) {
          sectionGroups[sectionKey] = {
              level: sectionKey,
              gradeNumber: parseInt(gradeLevel), // Add grade number for sorting
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
  
      const sectionData = sectionGroups[sectionKey];
  
      // Fix: Trim and lower case comparison
      const gender = grade.gender?.trim().toLowerCase() === 'male' ? 'Male' : 'Female';
      const genderKey = gender === 'Male' ? 'm' : 'f';
  
      // Fix: Correct enrollment counting
      sectionData.enrollment[genderKey]++;
      sectionData.enrollment.t++;
  
      // Fix: Correct male and female score counting
      if (gender === 'Male') {
          sectionData.maleCount++;
          sectionData.maleTotalScore += scoreToUse;
      } else {
          sectionData.femaleCount++;
          sectionData.femaleTotalScore += scoreToUse;
      }
  
      // Fix: Correct category assignments
      if (scoreToUse >= 90) {
          sectionData.outstanding[genderKey]++;
          sectionData.outstanding.t++;
      } else if (scoreToUse >= 85) {
          sectionData.verySatisfactory[genderKey]++;
          sectionData.verySatisfactory.t++;
      } else if (scoreToUse >= 80) {
          sectionData.satisfactory[genderKey]++;
          sectionData.satisfactory.t++;
      } else if (scoreToUse >= 75) {
          sectionData.fairlySatisfactory[genderKey]++;
          sectionData.fairlySatisfactory.t++;
      } else {
          sectionData.didNotMeet[genderKey]++;
          sectionData.didNotMeet.t++;
      }
    });
  
    // Calculate percentages and averages
    Object.values(sectionGroups).forEach(section => {
      const totalStudents = section.enrollment.t;
      if (totalStudents > 0) {
        section.outstanding.percent = Math.round((section.outstanding.t / totalStudents) * 100);
        section.verySatisfactory.percent = Math.round((section.verySatisfactory.t / totalStudents) * 100);
        section.satisfactory.percent = Math.round((section.satisfactory.t / totalStudents) * 100);
        section.fairlySatisfactory.percent = Math.round((section.fairlySatisfactory.t / totalStudents) * 100);
        section.didNotMeet.percent = Math.round((section.didNotMeet.t / totalStudents) * 100);
        
        section.gpa.m = section.maleCount > 0 ? Math.round(section.maleTotalScore / section.maleCount) : 0;
        section.gpa.f = section.femaleCount > 0 ? Math.round(section.femaleTotalScore / section.femaleCount) : 0;
        section.gpa.t = Math.round((section.maleTotalScore + section.femaleTotalScore) / totalStudents);
      }
    });
    
    return Object.values(sectionGroups);
  };

  const filteredData = sectionData
    .filter(row => row.level.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Extract grade level number from strings like "Grade 1-Batong"
      const getGradeNumber = (str) => {
        const match = str.match(/Grade (\d+)/i);
        return match ? parseInt(match[1]) : 0;
      };
      
      return getGradeNumber(a.level) - getGradeNumber(b.level);
    });

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleGradingChange = (e) => {
    setSelectedGrading(e.target.value);
  };

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
          <div className="overflow-x-auto">
            <table className="border-collapse table w-full">
              <thead>
                <tr>
                  <th
                    rowSpan="2"
                    className="border border-gray-400 p-2 text-center font-bold"
                  >
                    GRADE LEVEL & SECTION
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
                    Outstanding (90-100)
                  </th>
                  <th
                    colSpan="3"
                    className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                  >
                    Very Satisfactory (85-89)
                  </th>
                  <th
                    colSpan="3"
                    className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                  >
                    Satisfactory (80-84)
                  </th>
                  <th
                    colSpan="3"
                    className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                  >
                    Fairly Satisfactory (75-79)
                  </th>
                  <th
                    colSpan="3"
                    className="border border-gray-400 bg-yellow-200 p-2 text-center font-bold"
                  >
                    Did not meet expectations (70-74)
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
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index}>
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
                        {row.verySatisfactory.m}
                      </td>
                      <td className="border border-gray-400 p-2 text-center">
                        {row.verySatisfactory.f}
                      </td>
                      <td className="border border-gray-400 p-2 text-center bg-gray-50">
                        {row.verySatisfactory.t}
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
                        {row.fairlySatisfactory.m}
                      </td>
                      <td className="border border-gray-400 p-2 text-center">
                        {row.fairlySatisfactory.f}
                      </td>
                      <td className="border border-gray-400 p-2 text-center bg-gray-50">
                        {row.fairlySatisfactory.t}
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
                        {row.gpa.m}
                      </td>
                      <td className="border border-gray-400 p-2 text-center">
                        {row.gpa.f}
                      </td>
                      <td className="border border-gray-400 p-2 text-center bg-gray-50">
                        {row.gpa.t}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="27" className="border border-gray-400 p-4 text-center">
                      No data found matching your search criteria
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

export default BySectionReport;