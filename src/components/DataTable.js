import React from "react";
import "./DataTable.css";

const DataTable = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  const headers = data[0];

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
        {data.slice(1).map((row, index) => (
          <tr key={index}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
