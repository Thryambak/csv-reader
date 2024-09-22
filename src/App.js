import React, { useState } from "react";
import { processCsv } from "./CsvProcessor";
import DataTable from "./components/DataTable";
import SearchPage from "./SearchPage";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploadPage from "./FileUploadPage";

let firstVal = 0;
let lastVal = 0;
let totalLines = 0;

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/file-upload" element={<FileUploadPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

export default App;
