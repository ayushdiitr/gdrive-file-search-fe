import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router";
import GoogleIcon from "../assets/google.svg";

const Login = () => {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Google Drive Semantic Search
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Connect your Google Drive to search your text files semantically.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-50  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <div className="flex items-center ">
            <img
              src={GoogleIcon}
              alt="Google"
              className="w-6 h-6 "
              style={{ verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle", paddingLeft: 10 }}>
              Sign in with Google
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Login;
