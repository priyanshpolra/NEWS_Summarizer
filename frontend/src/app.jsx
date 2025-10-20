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
          headers: { "Content-Type": "application/json" },
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
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-gray-100">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          📰 News Summarizer
        </h1>

        <input
          type="text"
          placeholder="Enter news URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-700 rounded-xl p-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        />

        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-medium transition ${
            loading
              ? "bg-indigo-700 cursor-not-allowed text-gray-300"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {loading ? "Summarizing..." : "Get Summary"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {summary && (
          <div className="mt-6 bg-gray-700 p-5 rounded-xl border border-gray-600">
            <h2 className="text-xl font-semibold mb-2 text-gray-100">
              🧾 Summary
            </h2>
            <p className="text-gray-200 whitespace-pre-line leading-relaxed">
              {summary}
            </p>
            <button
              onClick={handleCopy}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
                copied
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-green-600 hover:bg-green-700 text-white"
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
