import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = "tempUnsecureToken";
  const navigate = useNavigate();

  const redirectToUploadPage = () => {
    localStorage.setItem("authToken", "tempUnsecureToken");

    navigate("/file-upload");
  };

  const redirectToSearchPage = () => {
    localStorage.setItem("authToken", "tempUnsecureTokenForUsers");

    navigate("/search");
  };
  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setErrorMessage("Username and Password are required!");
    } else {
      // Simulate a login API call
      if (username === "admin" && password === "Admin@123") {
        setErrorMessage("Login Successful!");
        redirectToUploadPage();
        // Redirect or further logic
      } else if (username === "user" && password === "User@123") {
        setErrorMessage("Login Successful!");
        redirectToSearchPage();
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};
const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "calc(100% - 22px)", // Adjust width to add space
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default Login;
