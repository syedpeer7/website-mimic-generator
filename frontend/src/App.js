import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setError(null);
    setResult(null);
    try {
      const response = await axios.post("http://127.0.0.1:5000/scrape", { url });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">🌐 MimicGen</div>
        <ul className="navbar-links">
          <li>Home</li>
          <li>Docs</li>
          <li>About</li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="main-title">Website Mimic Generator</h1>
        <p className="subtitle">
          Instantly scrape and mimic design elements (color, fonts, layout, logo) from any website.
        </p>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
          />
          <button className="scrape-btn" onClick={handleScrape}>
            Scrape
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="result-section">
            <h2>Scraped Data:</h2>
            <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Website Mimic Generator &middot; Built with <span role="img" aria-label="love">💙</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
