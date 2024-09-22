import React, { useEffect, useState } from "react";
import { processCsv } from "./CsvProcessor";
import DataTable from "./components/DataTable";
import { useNavigate } from "react-router-dom";

let firstVal = 0;
let lastVal = 0;
let totalLines = 0;

const SearchPage = () => {
  const [content, setContent] = useState(null);
  const [results, setResults] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [isPreviousVisible, setPreviousVisible] = useState(false);
  const [isNextVisible, setNextVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // const [firstVal, setFirstVal] = useState(1);
  // const [lastVal, setLastVal] = useState(1);

  const setLastVal = (val) => {
    lastVal = val;
  };
  const setFirstVal = (val) => {
    firstVal = val;
  };
  let pageSize = 100;
  let endOfResult = content == null;
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
    console.log(content);
    if (!content) {
      alert("Please choose a file before searching");
      return;
    }

    if (showNext === null) {
      // console.log("null", firstVal, lastVal);
      showNext = true;
      setFirstVal(1);
      setLastVal(1);
    }

    const [processedVal, first, last, lines] = processCsv(
      searchString.trim(),
      content,
      firstVal,
      lastVal,
      pageSize,
      showNext
    );
    totalLines = lines;
    console.log("lines" + lines);
    console.log("last", last);
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

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8443/download-csv");
      const result = await response.text();
      console.log(result);

      // if (!result.ok) {
      //   console.error("Error fetching data:");
      //   setErrorMessage("Failed to fetch data.");
      // }
      setContent(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data.");
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (
      !authToken ||
      (authToken !== "tempUnsecureTokenForUsers" &&
        authToken !== "tempUnsecureToken")
    ) {
      navigate("/");
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* <input type="file" onChange={handleFileChange}></input> */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <input
        type="text"
        placeholder="Enter search string"
        onChange={(e) => setSearchString(e.target.value)}
      ></input>
      <button
        style={{ height: "20px", width: "60px", marginLeft: "20px" }}
        onClick={() => search(null)}
      >
        Search
      </button>

      <div>
        <DataTable data={results} />
        {console.log(page)}
      </div>

      <div>
        {page != 1 && <button onClick={showPreviousPage}>previous</button>}
        {lastVal != totalLines && <button onClick={showNextPage}>next</button>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "80%",
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  fileInput: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
};

export default SearchPage;
