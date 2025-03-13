import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface SearchResult {
  score: number;
  fileId: string;
  fileName: string;
  webViewLink: string;
}

const SearchPage = () => {
  const { isAuthenticated } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/search/query?query=${encodeURIComponent(query)}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Semantic Search</h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your search query..."
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Back to Dashboard
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {hasSearched && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Search Results {results.length > 0 ? `(${results.length})` : ""}
              </h2>

              {results.length === 0 ? (
                <p className="text-gray-500 py-4">
                  No matching files found. Try a different search query.
                </p>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.fileId}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {result.fileName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Relevance score: {(result.score * 100).toFixed(2)}%
                          </p>
                        </div>
                        <a
                          href={result.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Open in Drive
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
