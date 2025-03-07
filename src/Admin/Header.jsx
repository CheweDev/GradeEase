import React, { useState, useEffect } from "react";

const Header = () => {
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Format timestamp as "DD Month YYYY • HH:MM:SS"
  const formatTimestamp = (date) => {
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      })
      .replace(",", " •"); // Adjust format
  };

  return (
    <>
      <div className="flex justify-between">
        <h2 className="tracking-wider">
          Caloc-an Elementary School Proficiency Report
        </h2>
        <span>{formatTimestamp(timestamp)}</span>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default Header;
