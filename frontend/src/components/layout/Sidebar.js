import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './Sidebar.css';

const NAV_CONFIG = {
  student: [
    { label: 'Overview', path: '/student/dashboard', icon: '🏠' },
    { label: 'Daily Logs', path: '/student/logbook', icon: '📖' },
    { label: 'Progress', path: '/student/progress', icon: '📈' },
    { label: 'Schedule', path: '/student/schedule', icon: '📅' },
    { label: 'Documents', path: '/student/documents', icon: '📄' },
    { label: 'My Profile', path: '/student/profile', icon: '👤' },
  
  ],

  workplace_supervisor: [
    { label: 'Dashboard', path: '/supervisor/dashboard', icon: '🏠' },
    { label: 'My Students', path: '/supervisor/students', icon: '👥' },
    { label: 'Evaluations', path: '/supervisor/evaluation', icon: '⭐' },
    { label: 'My Profile', path: '/supervisor/profile', icon: '👤' },

  ],

  academic_supervisor: [
    { label: 'Dashboard', path: '/academic/dashboard', icon: '🏠' },
    { label: 'Evaluations', path: '/academic/evaluation', icon: '⭐' },
    { label: 'Students', path: '/academic/students', icon: '👥' },
    
  ],

  internship_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { label: 'Placements', path: '/admin/placements', icon: '🏢' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Criteria', path: '/admin/criteria', icon: '📋' },
  ],
};

function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = NAV_CONFIG[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="sidebar-name">{user?.username}</p>
          <p className="sidebar-role">{user?.role}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
          key={item.path}
          to={item.path}
          className={({isActive}) =>
            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
        }
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        🚪 Sign Out
      </button>
    </aside>
  );
}

export default Sidebar