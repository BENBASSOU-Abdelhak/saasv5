import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Users, BarChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../App';

const menuItems = [
  { icon: <Search className="w-5 h-5" />, label: 'Leads Searcher', path: '/leads-searcher' },
  { icon: <Users className="w-5 h-5" />, label: 'Leads Manager', path: '/leads-manager' },
  { icon: <BarChart className="w-5 h-5" />, label: 'Analytics', path: '/analytics' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Lead Generator</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.subscription_plan}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;