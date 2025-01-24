import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  CreditCard,
  Package,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./SideBar.css";
function SideBar({ isSidebarExpanded }) {
  const navigate = useNavigate(); // Add this hook

  const [activeNav, setActiveNav] = useState("dashboard");
  return (
    <aside className={`sidebar ${isSidebarExpanded ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <LayoutDashboard size={24} />
          <span className="logo-text">Admin Dashboard</span>
        </div>
      </div>
      <nav className="nav-menu">
        <a
          href="/homepage"
          className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveNav("dashboard")}
        >
          <LayoutDashboard size={20} />
          <span className="nav-text">Dashboard</span>
        </a>
        <a
          href="/homepage"
          className={`nav-item ${activeNav === "users" ? "active" : ""}`}
          onClick={() => setActiveNav("users")}
        >
          <Users size={20} />
          <span className="nav-text">Users</span>
        </a>
        <a
          href="/homepage"
          className={`nav-item ${activeNav === "invoices" ? "active" : ""}`}
          onClick={() => setActiveNav("invoices")}
        >
          <FileText size={20} />
          <span className="nav-text">Invoices</span>
        </a>
        <a
          href="/homepage"
          className={`nav-item ${activeNav === "settings" ? "active" : ""}`}
          onClick={() => setActiveNav("settings")}
        >
          <Settings size={20} />
          <span className="nav-text">Settings</span>
        </a>
      </nav>
    </aside>
  );
}

export default SideBar;
