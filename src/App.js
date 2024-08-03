import React, { useState } from "react";
import { processCsv } from "./CsvProcessor";
import DataTable from "./components/DataTable";

const App = () => {
  const [content, setContent] = useState(null);
  const [results, setResults] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [isPreviousVisible, setPreviousVisible] = useState(false);
  const [isNextVisible, setNextVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [firstVal, setFirstVal] = useState(1);
  let pageSize = 100;
  let endOfResult = content == null;
  const [lastVal, setLastVal] = useState(1);
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

  const search = (showNext) => {
    if (searchString.trim() === "") {
      alert("Search value can't be empty");
      return;
    }
    if (!content) {
      alert("Please choose a file before searching");
      return;
    }

    const [processedVal, first, last] = processCsv(
      searchString,
      content,
      firstVal,
      lastVal,
      pageSize,
      showNext
    );
    setLastVal(last);
    setFirstVal(first);
    setResults(processedVal);
  };

  const showNextPage = () => {
    if (content == null) {
      endOfResult = true;
      return;
    }
    setPage((previousValue) => previousValue + 1);
    search(true);
  };

  const showPreviousPage = () => {
    if (page === 1) {
      return;
    }
    setPage((previousValue) => previousValue - 1);
    search(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange}></input>
      <input
        type="text"
        placeholder="Enter search string"
        onChange={(e) => setSearchString(e.target.value)}
      ></input>
      <button
        style={{ height: "20px", width: "60px", marginLeft: "20px" }}
        onClick={search}
      >
        Search
      </button>

      <div>
        <DataTable data={results} />
        {console.log(page)}
      </div>

      <div>
        {page != 1 && <button onClick={showPreviousPage}>previous</button>}
        {!endOfResult && <button onClick={showNextPage}>next</button>}
      </div>
    </div>
  );
};

export default App;
