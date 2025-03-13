import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  
  return (
    <nav className="bg-red shadow-sm">
  <div className="max-w-full px-4 sm:px-6 lg:px-8">
    <div className="flex h-16">
      <div className="flex items-center flex-shrink-0">
        <span className="text-lg font-semibold text-gray-800">GDrive Search</span>
      </div>
      
      {isAuthenticated && (
        <div className="flex items-center ml-auto">
          <div className="md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/search"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Search
            </Link>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6">
            <div className="ml-3 relative">
              <div className="flex items-center">
                {user && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.profilePicture || 'https://ui-avatars.com/api/?name=Ayush+Dhiman'}
                    alt={user.name}
                  />
                )}
                <button
                  onClick={handleLogout}
                  className="ml-3 px-3 py-1 text-sm text-white hover:bg-gray-50 "
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</nav>
  );
};

export default Navbar;