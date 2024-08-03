import React, { useState } from "react";
import { processCsv } from "./CsvProcessor";
import DataTable from "./components/DataTable";

const App = () => {
  const [content, setContent] = useState(null);
  const [results, setResults] = useState(["Click,Search"]);
  const [searchString, setSearchString] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setContent(reader.result);
    };
    reader.onerror = () => {
      alert("Couldn't read file");
    };
  };

  const search = () => {
    if (searchString == null) {
      alert("Search value cant be empty");
      return;
    }
    if (content == null || content == "") {
      alert("Please chose a file before searching");
      return;
    }

    setResults(processCsv(searchString, content));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange}></input>
      {/* <div>{content}</div> */}
      <input onChange={(e) => setSearchString(e.target.value)}></input>
      <button
        style={{ height: "20px", width: "60px", marginLeft: "20px" }}
        onClick={search}
      >
        Search
      </button>
      <div>
        <DataTable data={results} />
      </div>
    </div>
  );
};

export default App;
