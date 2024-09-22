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
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const url = "https://csv-reader-m1md.onrender.com";

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

    if (showNext === null) {
      showNext = true;
      firstVal = 1;
      lastVal = 1;
    }

    const [processedVal, first, last, lines] = processCsv(
      searchString.trim(),
      content,
      firstVal,
      lastVal,
      100, // pageSize
      showNext
    );
    totalLines = lines;
    lastVal = last;
    firstVal = first;
    setResults(processedVal);
  };

  const showNextPage = () => {
    if (content == null) return;
    setPage((previousValue) => previousValue + 1);
    search(true);
  };

  const showPreviousPage = () => {
    if (page === 1) return;
    setPage((previousValue) => previousValue - 1);
    search(false);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/download-csv");
      const result = await response.text();
      setContent(result);
      setShowSearchButton(true);
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
    <div style={styles.container}>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter search string"
          onChange={(e) => setSearchString(e.target.value)}
          style={styles.input}
        />
        {showSearchButton && (
          <button style={styles.button} onClick={() => search(null)}>
            Search
          </button>
        )}
      </div>

      <div style={styles.tableContainer}>
        <DataTable data={results} />
      </div>

      <div style={styles.pagination}>
        {page > 1 && (
          <button style={styles.pageButton} onClick={showPreviousPage}>
            Previous
          </button>
        )}
        {lastVal < totalLines && (
          <button style={styles.pageButton} onClick={showNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    margin: "0 auto",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  searchContainer: {
    marginBottom: "20px",
  },
  input: {
    padding: "5px", // Reduced padding
    marginRight: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "200px", // Reduced width
    fontSize: "14px", // Reduced font size
  },
  button: {
    padding: "5px 10px", // Reduced padding
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "14px", // Reduced font size
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  tableContainer: {
    flex: 1,
    overflow: "auto",
    maxHeight: "calc(100vh - 100px)", // Adjusted to increase table view height
    marginBottom: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "100%", // Increased width
    margin: "0 auto", // Center the table
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  pageButton: {
    padding: "5px 10px", // Reduced padding
    margin: "0 5px",
    backgroundColor: "#000", // Set button color to black
    color: "#fff", // Set text color to white
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default SearchPage;
