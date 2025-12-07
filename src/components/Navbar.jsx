import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, Briefcase, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/planner', label: 'Planner', icon: <Calendar size={20} /> },
        { path: '/opportunities', label: 'Opportunities', icon: <Briefcase size={20} /> },
        { path: '/tutors', label: 'Tutors', icon: <GraduationCap size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    CAMPULSE
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* User Section */}
                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">{user?.fullName || user?.full_name || 'Student'}</span>
                        <span className="user-level">{user?.level}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button className="mobile-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
