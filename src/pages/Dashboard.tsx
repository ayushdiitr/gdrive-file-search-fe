import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface File {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}

const DashboardPage = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    fetchFiles();
  }, [isAuthenticated, navigate]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/drive/files`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Failed to fetch files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngest = async () => {
    setIsIngesting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/ingest`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to ingest files");
      }

      const data = await response.json();
      setMessage(
        `Successfully processed ${data.count} files. You can now search them!`
      );
    } catch (error) {
      console.error("Error ingesting files:", error);
      setMessage("Failed to process files. Please try again.");
    } finally {
      setIsIngesting(false);
    }
  };


  return (
    <div className="w-full px-4 sm:px-6 py-8">
      {/* User Profile Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 max-w-7xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {user && (
            <div className="flex items-center mb-6">
              <img
                src={user?.profilePicture}
                alt={user.name}
                className="h-10 w-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-black">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={fetchFiles}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 w-full"
            >
              {isLoading ? "Loading..." : "Refresh Files"}
            </button>

            <button
              onClick={handleIngest}
              disabled={isIngesting || files.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 w-full"
            >
              {isIngesting ? "Processing..." : "Process Files for Search"}
            </button>

            <button
              onClick={() => navigate("/search")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              Go to Search
            </button>
          </div>

          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.includes("Failed")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Files Table Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-7xl mx-auto">
        <div className="p-6">
          <h2 className="text-xl text-black font-semibold mb-4">
            Your Text Files ({files.length})
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : files.length === 0 ? (
            <p className="text-gray-500 py-4">
              No text files found in your Google Drive. Only .txt and .md files
              are supported.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      File Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {file.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {file.mimeType === "text/plain" ? "Text" : "Markdown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View in Drive
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
