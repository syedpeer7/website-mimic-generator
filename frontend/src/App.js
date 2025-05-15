import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/scrape", { url });
      setResult(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setResult(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Website Mimic Generator</h1>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleScrape}>Scrape</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h2>Scraped Data:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;