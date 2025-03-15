import React, { useState, useEffect } from "react";
import supabase from "../SupabaseClient";

const ProficiencyDistribution = () => {
  const [grade1, setGrade1] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [grade2, setGrade2] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [grade3, setGrade3] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [grade4, setGrade4] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [grade5, setGrade5] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [grade6, setGrade6] = useState({ total: 0, outstanding: 0, very_satisfactory: 0, satisfactory: 0, fairly_satisfactory:0, failed:0});
  const [data, setData] = useState({
    categories: [
      {
        name: "Outstanding",
        range: "90-100",
        color: "bg-emerald-500",
        textColor: "text-white",
      },
      {
        name: "Very Satisfactory",
        range: "85-89",
        color: "bg-blue-500",
        textColor: "text-white",
      },
      {
        name: "Satisfactory",
        range: "80-84",
        color: "bg-yellow-400",
        textColor: "text-black",
      },
      {
        name: "Fairly Satisfactory",
        range: "75-79",
        color: "bg-orange-300",
        textColor: "text-black",
      },
      {
        name: "Did not meet expectation",
        range: "70-74",
        color: "bg-red-500",
        textColor: "text-white",
      },
    ],
    grades: [],
  });
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("Grades").select("*");
  
    if (error) {
      console.error("Error fetching students:", error);
      return;
    }
  
    const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
    const gradeStats = {};
  
    grades.forEach(grade => {
      const total = data.filter(student => student.grade === grade).length;
      const outstanding = data.filter(student => student.grade === grade && student.average >= 90).length;
      const verySatisfactory = data.filter(student => student.grade === grade && student.average >= 85 && student.average <= 89).length;
      const satisfactory = data.filter(student => student.grade === grade && student.average >= 80 && student.average <= 84).length;
      const fairlySatisfactory = data.filter(student => student.grade === grade && student.average >= 75 && student.average <= 79).length;
      const failed = data.filter(student => student.grade === grade && student.average <= 74).length;
  
      gradeStats[grade] = {
        total,
        outstanding,
        very_satisfactory: verySatisfactory,
        satisfactory,
        fairly_satisfactory: fairlySatisfactory,
        failed
      };
    });
  
    setGrade1(prevState => ({
      ...prevState,
      ...gradeStats["Grade 1"]
    }));
    
    setGrade2(gradeStats["Grade 2"]);
    setGrade3(gradeStats["Grade 3"]);
    setGrade4(gradeStats["Grade 4"]);
    setGrade5(gradeStats["Grade 5"]);
    setGrade6(gradeStats["Grade 6"]);
  };
  
  

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      grades: [
        {
          name: "Grade 1",
          totalStudents: grade1.total,
          distribution: {
            Outstanding: grade1.outstanding,
            "Very Satisfactory": grade1.very_satisfactory,
            Satisfactory: grade1.satisfactory,
            "Fairly Satisfactory": grade1.fairly_satisfactory,
            "Did not meet expectation": grade1.failed,
          },
        },
        {
          name: "Grade 2",
          totalStudents: grade2.total,
          distribution: {
            Outstanding: grade2.outstanding,
            "Very Satisfactory": grade2.very_satisfactory,
            Satisfactory: grade2.satisfactory,
            "Fairly Satisfactory": grade2.fairly_satisfactory,
            "Did not meet expectation": grade2.failed,
          },
        },
        {
          name: "Grade 3",
          totalStudents: grade3.total,
          distribution: {
            Outstanding: grade3.outstanding,
            "Very Satisfactory": grade3.very_satisfactory,
            Satisfactory: grade3.satisfactory,
            "Fairly Satisfactory": grade3.fairly_satisfactory,
            "Did not meet expectation": grade3.failed,
          },
        },
        {
          name: "Grade 4",
          totalStudents: grade4.total,
          distribution: {
            Outstanding: grade4.outstanding,
            "Very Satisfactory": grade4.very_satisfactory,
            Satisfactory: grade4.satisfactory,
            "Fairly Satisfactory": grade4.fairly_satisfactory,
            "Did not meet expectation": grade4.failed,
          },
        },
        {
          name: "Grade 5",
          totalStudents: grade5.total,
          distribution: {
            Outstanding: grade5.outstanding,
            "Very Satisfactory": grade5.very_satisfactory,
            Satisfactory: grade5.satisfactory,
            "Fairly Satisfactory": grade5.fairly_satisfactory,
            "Did not meet expectation": grade5.failed,
          },
        },
        {
          name: "Grade 6",
          totalStudents: grade6.total,
          distribution: {
            Outstanding: grade6.outstanding,
            "Very Satisfactory": grade6.very_satisfactory,
            Satisfactory: grade6.satisfactory,
            "Fairly Satisfactory": grade6.fairly_satisfactory,
            "Did not meet expectation": grade6.failed,
          },
        },
      ],
    }));
  }, [grade1]); // Runs only when `grade1.total` changes
  

  const [grading, setGrading] = useState("1st Grading");
  const [viewMode, setViewMode] = useState("count"); // 'count', 'percentage', or 'bars'
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [screenSize, setScreenSize] = useState("lg");
  

 

  // Monitor screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("sm");
      } else if (width < 1024) {
        setScreenSize("md");
      } else {
        setScreenSize("lg");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate percentages for a grade
  const calculatePercentages = (grade) => {
    const result = {};
    const total = grade.totalStudents;

    Object.keys(grade.distribution).forEach((category) => {
      result[category] = Math.round(
        (grade.distribution[category] / total) * 100
      );
    });

    return result;
  };

  // Get total students in each category across all grades
  const getTotalsByCategory = () => {
    const totals = {};
    data.categories.forEach((cat) => {
      totals[cat.name] = 0;
    });

    data.grades.forEach((grade) => {
      Object.keys(grade.distribution).forEach((category) => {
        totals[category] += grade.distribution[category];
      });
    });

    return totals;
  };

  const categoryTotals = getTotalsByCategory();
  const totalStudents = data.grades.reduce(
    (sum, grade) => sum + grade.totalStudents,
    0
  );

  // Handle grade selection for detailed view
  const handleGradeClick = (grade) => {
    setSelectedGrade(selectedGrade?.name === grade.name ? null : grade);
  };

  // Render category abbreviations for small screens
  const getCategoryAbbreviation = (categoryName) => {
    if (screenSize === "sm") {
      const words = categoryName.split(" ");
      if (words.length === 1) {
        return words[0].substring(0, 3);
      }
      return words.map((word) => word[0]).join("");
    }
    return categoryName;
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-700 mb-2 sm:mb-0">
          Proficiency Report
        </h2>
        <div className="inline-flex rounded overflow-hidden border border-gray-300">
          <button
            className={`px-4 py-2 ${
              viewMode === "count" ? "bg-info text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("count")}
          >
            Count
          </button>
          <button
            className={`px-4 py-2 border-l border-gray-300 ${
              viewMode === "percentage" ? "bg-info text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("percentage")}
          >
            Percentage
          </button>
          <button
            className={`px-4 py-2 border-l border-gray-300 ${
              viewMode === "bars" ? "bg-info text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("bars")}
          >
            Bar View
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 sm:mb-6 flex justify-center sm:flex sm:flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
        {data.categories.map((category, idx) => (
          <div key={idx} className="flex">
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 ${category.color} rounded mr-1`}
            ></div>
            <span>
              {getCategoryAbbreviation(category.name)}
              <span className="hidden sm:inline"> ({category.range})</span>
              {/* {screenSize !== "sm" && viewMode !== "bars" && (
                <span className="ml-1 text-gray-600 text-xs">
                  - {categoryTotals[category.name]}
                  <span className="hidden md:inline"> students</span>(
                  {Math.round(
                    (categoryTotals[category.name] / totalStudents) * 100
                  )}
                  %)
                </span>
              )} */}
            </span>
          </div>
        ))}
      </div>

      {/* Grid view of proficiency distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
        {data.grades.map((grade, idx) => (
          <div
            key={idx}
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedGrade?.name === grade.name ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleGradeClick(grade)}
          >
            <div className="bg-gray-100 p-2 sm:p-3 border-b">
              <h3 className="font-bold text-sm sm:text-base">{grade.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Total: {grade.totalStudents} students
              </p>
            </div>

            <div className="p-2 sm:p-4">
              {viewMode === "bars" ? (
                <div className="space-y-1 sm:space-y-2">
                  {data.categories.map((category, catIdx) => {
                    const count = grade.distribution[category.name] || 0;
                    const percentage = Math.round(
                      (count / grade.totalStudents) * 100
                    );
                    return (
                      <div key={catIdx} className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {screenSize === "sm"
                              ? getCategoryAbbreviation(category.name)
                              : category.name}
                          </span>
                          <span>
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                          <div
                            className={`${category.color} h-3 sm:h-4 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center">
                  {data.categories.map((category, catIdx) => {
                    const count = grade.distribution[category.name] || 0;
                    const displayValue =
                      viewMode === "percentage"
                        ? `${Math.round((count / grade.totalStudents) * 100)}%`
                        : count;

                    // Responsive width calculations
                    const percentWidth = Math.max(
                      5,
                      Math.round((count / grade.totalStudents) * 100)
                    );
                    const minWidth = screenSize === "sm" ? "20px" : "30px";

                    return (
                      <div
                        key={catIdx}
                        className={`${category.color} ${category.textColor} flex items-center justify-center text-center text-xs sm:text-sm font-medium`}
                        style={{
                          width: `${percentWidth}%`,
                          minWidth: minWidth,
                          height: screenSize === "sm" ? "60px" : "80px",
                        }}
                      >
                        {displayValue}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected grade detail */}
      {selectedGrade && (
        <div className="border rounded-lg p-2 sm:p-4 mb-4 sm:mb-6 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-xl font-bold">
              {selectedGrade.name} - Details
            </h3>
            <button
              onClick={() => setSelectedGrade(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="overflow-x-auto">
              <h4 className="font-medium mb-2 text-sm sm:text-base">
                Distribution
              </h4>
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="border p-1 sm:p-2 text-left">Category</th>
                    <th className="border p-1 sm:p-2 text-right">Count</th>
                    <th className="border p-1 sm:p-2 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((category, catIdx) => {
                    const count =
                      selectedGrade.distribution[category.name] || 0;
                    const percentage = Math.round(
                      (count / selectedGrade.totalStudents) * 100
                    );
                    return (
                      <tr key={catIdx}>
                        <td className="border p-1 sm:p-2">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${category.color} rounded mr-1 sm:mr-2`}
                            ></div>
                            {screenSize === "sm"
                              ? getCategoryAbbreviation(category.name)
                              : category.name}
                          </div>
                        </td>
                        <td className="border p-1 sm:p-2 text-right">
                          {count}
                        </td>
                        <td className="border p-1 sm:p-2 text-right">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-medium">
                    <td className="border p-1 sm:p-2">Total</td>
                    <td className="border p-1 sm:p-2 text-right">
                      {selectedGrade.totalStudents}
                    </td>
                    <td className="border p-1 sm:p-2 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">
                Visualization
              </h4>
              <div className="bg-white p-2 sm:p-4 rounded border">
                {/* Responsive pie chart visualization */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  {data.categories.map((category, catIdx) => {
                    const count =
                      selectedGrade.distribution[category.name] || 0;
                    const percentage = Math.round(
                      (count / selectedGrade.totalStudents) * 100
                    );
                    return (
                      <div
                        key={catIdx}
                        className={`text-center p-1 sm:p-2 rounded ${category.color} ${category.textColor}`}
                        style={{
                          width: screenSize === "sm" ? "45%" : "30%",
                        }}
                      >
                        <div className="text-xs sm:text-sm font-bold">
                          {percentage}%
                        </div>
                        <div className="text-xs truncate">
                          {screenSize === "sm"
                            ? getCategoryAbbreviation(category.name)
                            : category.name}
                        </div>
                        <div className="text-xs">{count}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 sm:mt-4 text-center">
                  <div className="inline-block bg-blue-100 rounded-full px-3 py-1">
                    <span className="font-bold text-sm sm:text-base">
                      {selectedGrade.totalStudents}
                    </span>
                    <span className="text-xs sm:text-sm ml-1">
                      Total Students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProficiencyDistribution;
