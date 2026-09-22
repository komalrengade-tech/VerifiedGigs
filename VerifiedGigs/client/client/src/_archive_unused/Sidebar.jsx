import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/** Sidebar navigation shown on protected pages. Links vary by user role. */
const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!isAuthenticated) return null;

  const role = user?.role;
  const commonLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/client/dashboard', label: 'Dashboard' },
    { to: '/admin/dashboard', label: 'Dashboard' },
  ];

  const roleLinks = {
    STUDENT: [
      { to: '/student/gigs', label: 'Browse Gigs' },
      { to: '/student/applications', label: 'My Applications' },
      { to: '/student/projects', label: 'My Projects' },
      { to: '/student/portfolio', label: 'Portfolio' },
      { to: '/student/favorites', label: 'Favorites' },
      { to: '/student/notifications', label: 'Notifications' },
      { to: '/student/messages', label: 'Messages' },
      { to: '/student/reports', label: 'Reports' },
      { to: '/student/reviews', label: 'Reviews' },
      { to: '/student/payments', label: 'Payments' },
      { to: '/student/profile', label: 'Profile' },
    ],
    CLIENT: [
      { to: '/client/gigs', label: 'My Gigs' },
      { to: '/client/gigs/new', label: 'Post Gig' },
      { to: '/client/projects', label: 'My Projects' },
      { to: '/client/messages', label: 'Messages' },
      { to: '/client/notifications', label: 'Notifications' },
      { to: '/client/reports', label: 'Reports' },
      { to: '/client/reviews', label: 'Reviews' },
      { to: '/client/profile', label: 'Profile' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/students', label: 'Students' },
      { to: '/admin/clients', label: 'Clients' },
      { to: '/admin/gigs', label: 'Gigs' },
      { to: '/admin/projects', label: 'Projects' },
      { to: '/admin/payments', label: 'Payments' },
      { to: '/admin/verifications', label: 'Verifications' },
      { to: '/admin/reports', label: 'Reports' },
      { to: '/admin/catalog', label: 'Categories & Skills' },
      { to: '/admin/profile', label: 'Profile' },
    ],
  };

  const links = roleLinks[role] || [];

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 hidden md:block overflow-y-auto">
      <nav className="space-y-2">
        {links.map((ln) => (
          <NavLink
            key={ln.to}
            to={ln.to}
            className={({ isActive }) =>
              isActive
                ? 'block py-2 px-3 bg-blue-500 text-white rounded'
                : 'block py-2 px-3 text-gray-700 rounded hover:bg-gray-200'
            }
          >
            {ln.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-3 text-red-600 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;

