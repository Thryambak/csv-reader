import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirect, setRedirect] = useState(false); // State to trigger navigation
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Validate file
    if (!selectedFile) {
      setErrorMessage("No file selected!");
      return;
    }
    if (selectedFile.type !== "text/csv") {
      setErrorMessage("Only CSV files are allowed.");
      setFile(null);
    } else if (selectedFile.size > 500 * 1024 * 1024) {
      setErrorMessage("File size should be less than 5MB.");
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(selectedFile);
      setSuccessMessage("File is valid and ready to upload.");
    }
  };

  const handleUpload = () => {
    if (!file) {
      setErrorMessage("Please select a valid file before uploading.");
      return;
    }
    uploadToServer(file);
  };

  const uploadToServer = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("file", data);
      const response = await fetch("http://localhost:8443/upload-csv", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setSuccessMessage("File uploaded successfully!");
      } else {
        setErrorMessage("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      setErrorMessage("Failed to upload data.");
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect, navigate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "tempUnsecureToken") {
      setRedirect(true);
    }
  }, []);

  // New function to navigate to the search page
  const goToSearch = () => {
    navigate("/search");
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>Upload a CSV file:</p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={styles.fileInput}
      />

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <button onClick={handleUpload} style={styles.button} disabled={!file}>
        Upload File
      </button>

      {/* Button to navigate to the search page */}
      <button onClick={goToSearch} style={styles.button}>
        Go to Search
      </button>
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
    margin: "10px", // Added margin for spacing
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

export default FileUploadPage;
