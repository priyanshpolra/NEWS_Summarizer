import React, { useState } from "react";
import axios from "axios";

const LAMBDA_URL =
  "https://mfbrazffkbgfgt57oie2jzrkly0cwtox.lambda-url.ap-south-1.on.aws/";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!url) {
      setError("Please enter a news URL");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    try {
      const res = await axios.post(
        LAMBDA_URL,
        { url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSummary(res.data.summary || "No summary returned");
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(`Server error: ${err.response.status} ${err.response.data.error}`);
      } else if (err.request) {
        setError(
          "Network or CORS error: Make sure your Lambda allows requests from localhost."
        );
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          📰 News Summarizer
        </h1>

        <input
          type="text"
          placeholder="Enter news URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-medium transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Summarizing..." : "Get Summary"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {summary && (
          <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              🧾 Summary
            </h2>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {summary}
            </p>
            <button
              onClick={handleCopy}
              className={`mt-4 px-4 py-2 rounded-lg text-sm text-white ${
                copied ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={copied}
            >
              {copied ? "Copied" : "Copy Summary"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
