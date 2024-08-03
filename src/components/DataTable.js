import React from "react";
import "./DataTable.css"; // Import the CSS file

const DataTable = ({ data }) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = data[0].split(",");

  return (
    <table className="data-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, index) => {
          const cells = row.split(",");
          return (
            <tr key={index}>
              {cells.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
