import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import supabase from "../SupabaseClient.jsx";

const ByGradeReport = () => {
  const [gradeData, setGradeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("average");
  const [selectedGrading, setSelectedGrading] = useState("all");

  // List of subjects
  const subjects = [
    { value: "average", label: "All Subjects (Average)" },
    { value: "mtb_mle", label: "MTB-MLE" },
    { value: "esp", label: "ESP" },
    { value: "english", label: "English" },
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "filipino", label: "Filipino" },
    { value: "ap", label: "AP" },
    { value: "epp", label: "EPP" },
    { value: "mapeh", label: "MAPEH" },
  ];

  // List of grading periods
  const gradingPeriods = [
    { value: "all", label: "All Gradings" },
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
          mtb_mle,
          esp,
          english,
          math,
          science,
          filipino,
          ap,
          epp,
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
      
      const gradeKey = `GRADE ${grade.grade}`;
      if (!gradeGroups[gradeKey]) {
          gradeGroups[gradeKey] = {
              grade: gradeKey,
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
      const aNum = parseInt(a.grade.replace('GRADE ', ''));
      const bNum = parseInt(b.grade.replace('GRADE ', ''));
      return aNum - bNum;
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
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
            <button className="btn bg-green-700 text-white flex items-center px-3 py-1 rounded">
              <RiFileExcel2Fill className="mr-1" />
              Export via Excel
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
                  <th className="p-2">Grade Level</th>
                  <th className="p-2 bg-yellow-100">
                    Number of <br /> Learners
                  </th>
                  <th className="p-2 bg-yellow-100">
                    Outstanding <br /> (90-100%)
                  </th>
                  <th className="p-2">%</th>
                  <th className="p-2 bg-yellow-100">
                    Very Satisfactory <br /> (85-89%)
                  </th>
                  <th className="p-2">%</th>
                  <th className="p-2 bg-yellow-100">
                    Satisfactory <br /> (80-84%)
                  </th>
                  <th className="p-2">%</th>
                  <th className="p-2 bg-yellow-100">
                    Fairly Satisfactory <br /> (75-79%)
                  </th>
                  <th className="p-2">%</th>
                  <th className="p-2 bg-yellow-100">
                    Did Not Meet <br /> Expectation <br /> (70-74%)
                  </th>
                  <th className="p-2">%</th>
                  <th className="p-2 bg-yellow-100">
                    General Percentage <br /> Average (GPA)
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index} className="border-t text-center">
                      <td className="p-3 font-medium">{row.grade}</td>
                      <td className="p-3 bg-gray-50">{row.enrollment.t}</td>
                      <td className="p-3 bg-gray-50">{row.outstanding.t}</td>
                      <td className="p-3">{row.outstanding.percent}%</td>
                      <td className="p-3 bg-gray-50">{row.verySatisfactory.t}</td>
                      <td className="p-3">{row.verySatisfactory.percent}%</td>
                      <td className="p-3 bg-gray-50">{row.satisfactory.t}</td>
                      <td className="p-3">{row.satisfactory.percent}%</td>
                      <td className="p-3 bg-gray-50">{row.fairlySatisfactory.t}</td>
                      <td className="p-3">{row.fairlySatisfactory.percent}%</td>
                      <td className="p-3 bg-gray-50">{row.didNotMeet.t}</td>
                      <td className="p-3">{row.didNotMeet.percent}%</td>
                      <td className="p-3 bg-gray-50">{row.gpa.t}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="p-4 text-center">
                      No data found matching your search criteria
                    </td>
                  </tr>
                )}

                {/* Total Row */}
                {totals && filteredData.length > 0 && (
                  <tr className="bg-gray-200 font-bold text-center border-t">
                    <td className="p-3">TOTAL</td>
                    <td className="p-3">{totals.enrollment.t}</td>
                    <td className="p-3">{totals.outstanding.t}</td>
                    <td className="p-3">{totals.outstanding.percent}%</td>
                    <td className="p-3">{totals.verySatisfactory.t}</td>
                    <td className="p-3">{totals.verySatisfactory.percent}%</td>
                    <td className="p-3">{totals.satisfactory.t}</td>
                    <td className="p-3">{totals.satisfactory.percent}%</td>
                    <td className="p-3">{totals.fairlySatisfactory.t}</td>
                    <td className="p-3">{totals.fairlySatisfactory.percent}%</td>
                    <td className="p-3">{totals.didNotMeet.t}</td>
                    <td className="p-3">{totals.didNotMeet.percent}%</td>
                    <td className="p-3">{totals.gpa.t}</td>
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

export default ByGradeReport;