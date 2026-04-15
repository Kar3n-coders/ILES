import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

const ROLE_NAV_LINKS = {
    student: [
        { path: "/student/dashboard", label: "Dashboard" },
        { path: "/student/logbook", label: "My Logbook" },
    ],
    workplace_supervisor: [
        { path: "/supervisor/dashboard", label: "Dashboard" },
        { path: "supervisor/evaluation", label: "Evaluations" },
    ],
    academic_supervisor: [
        { path: "/supervisor/dashboard", label: "Dashboard" },
        { path: "/supervisor/evaluation", label: "Evaluations" },
    ],
    internship_admin: [
        { path: "/admin", label: "Admin Dashboard" },
    ],
};

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navlinks = ROLE_NAV_LINKS[user?.role]?? [];

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="navbar" role="banner">
            <div className="navbar__brand">
                <link to="/" className="navbar__logo">
                ILES
                </link>
            </div>

            <a href="#main-content" className="visually-hidden">
                Skip to main content
            </a>

            {user && (
                <>
                <nav className="navbar__nav" aria-label="Main navigation">
                    <ul className="navbar__links" role="list">
                        {navlinks.map((link) => (
                            <li key={link.pth}>
                                <Link to={link.path} className="navbar__link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="navbar__user">
                    <span className="navbar__username">
                        {user.first_name} {user.last_name}
                    </span>
                    
                    <span className="navbar__role-badge">
                        {user.role.replace("_", " ")}
                    </span>
                    <button
                        className="navbar__logout-btn"
                        onClick={handleLogout}
                        type="button"
                    >
                        Sign Out
                    </button>
                </div>
                </>
            )}
        </header>
    );
}

export default Navbar;