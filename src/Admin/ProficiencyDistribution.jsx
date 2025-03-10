import React, { useState, useEffect } from "react";

const ProficiencyDistribution = () => {
  // Sample data based on what appears to be in the image
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
    grades: [
      {
        name: "Grade 1",
        totalStudents: 86,
        distribution: {
          Outstanding: 22,
          "Very Satisfactory": 28,
          Satisfactory: 19,
          "Fairly Satisfactory": 10,
          "Did not meet expectation": 7,
        },
      },
      {
        name: "Grade 2",
        totalStudents: 73,
        distribution: {
          Outstanding: 18,
          "Very Satisfactory": 25,
          Satisfactory: 15,
          "Fairly Satisfactory": 12,
          "Did not meet expectation": 3,
        },
      },
      {
        name: "Grade 3",
        totalStudents: 65,
        distribution: {
          Outstanding: 15,
          "Very Satisfactory": 22,
          Satisfactory: 18,
          "Fairly Satisfactory": 7,
          "Did not meet expectation": 3,
        },
      },
      {
        name: "Grade 4",
        totalStudents: 60,
        distribution: {
          Outstanding: 12,
          "Very Satisfactory": 20,
          Satisfactory: 15,
          "Fairly Satisfactory": 8,
          "Did not meet expectation": 5,
        },
      },
      {
        name: "Grade 5",
        totalStudents: 50,
        distribution: {
          Outstanding: 10,
          "Very Satisfactory": 18,
          Satisfactory: 14,
          "Fairly Satisfactory": 12,
          "Did not meet expectation": 4,
        },
      },
      {
        name: "Grade 6",
        totalStudents: 57,
        distribution: {
          Outstanding: 9,
          "Very Satisfactory": 15,
          Satisfactory: 13,
          "Fairly Satisfactory": 14,
          "Did not meet expectation": 6,
        },
      },
    ],
  });

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
          Proficiency Report 1st Quarter 2024-2025
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

      {/* School-wide summary */}
      <div className="border rounded-lg p-2 sm:p-4 bg-blue-50">
        <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">
          School-wide Summary
        </h3>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="text-xs sm:text-sm">
            <p className="font-medium">
              Total Students:{" "}
              <span className="font-normal">{totalStudents}</span>
            </p>
            <p className="font-medium">
              Overall Performance:{" "}
              <span className="font-normal">
                {Math.round(
                  (categoryTotals["Outstanding"] * 95 +
                    categoryTotals["Very Satisfactory"] * 87 +
                    categoryTotals["Satisfactory"] * 82 +
                    categoryTotals["Fairly Satisfactory"] * 77 +
                    categoryTotals["Did not meet expectation"] * 72) /
                    totalStudents
                )}
                % GPA
              </span>
            </p>
          </div>

          <div className="text-xs sm:text-sm">
            <p className="font-medium">
              Meeting Expectations:{" "}
              <span className="font-normal">
                {categoryTotals["Outstanding"] +
                  categoryTotals["Very Satisfactory"] +
                  categoryTotals["Satisfactory"] +
                  categoryTotals["Fairly Satisfactory"]}{" "}
                students (
                {Math.round(
                  ((categoryTotals["Outstanding"] +
                    categoryTotals["Very Satisfactory"] +
                    categoryTotals["Satisfactory"] +
                    categoryTotals["Fairly Satisfactory"]) /
                    totalStudents) *
                    100
                )}
                %)
              </span>
            </p>
            <p className="font-medium">
              Outstanding Students:{" "}
              <span className="font-normal">
                {categoryTotals["Outstanding"]} (
                {Math.round(
                  (categoryTotals["Outstanding"] / totalStudents) * 100
                )}
                %)
              </span>
            </p>
          </div>
        </div>

        {/* Mobile-friendly visualization */}
        <div className="mt-3 sm:mt-4">
          <div className="h-4 sm:h-6 w-full flex rounded-full overflow-hidden">
            {data.categories.map((category, idx) => {
              const percentage =
                (categoryTotals[category.name] / totalStudents) * 100;
              return (
                <div
                  key={idx}
                  className={`${category.color}`}
                  style={{ width: `${percentage}%` }}
                  title={`${category.name}: ${Math.round(percentage)}%`}
                ></div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProficiencyDistribution;
