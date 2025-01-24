import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar/SideBar";

function HomePage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSignOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      trend: "+20.1%",
    },
    { title: "Subscriptions", value: "+2350", icon: Users, trend: "+180.1%" },
    { title: "Sales", value: "+12,234", icon: CreditCard, trend: "+19.1%" },
    { title: "Active Now", value: "+573", icon: Package, trend: "+201.1%" },
  ];

  const recentSales = [
    {
      name: "John Doe",
      email: "john@example.com",
      amount: "$250.00",
      status: "pending",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      amount: "$120.00",
      status: "processing",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      amount: "$450.00",
      status: "completed",
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      amount: "$320.00",
      status: "completed",
    },
    {
      name: "Tom Brown",
      email: "tom@example.com",
      amount: "$200.00",
      status: "pending",
    },
  ];

  return (
    <div className="app-container">
      <SideBar isSidebarExpanded={isSidebarExpanded} />
      <main className={`main-content ${isSidebarExpanded ? "" : "expanded"}`}>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
        <header className="header">
          <h1 className="page-title">Dashboard</h1>
          <div className="header-actions">
            <button
              className="theme-switch"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="profile-container" ref={profileRef}>
              <div
                className="profile-menu"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="profile-image">
                  <User size={20} />
                </div>
                <span>Admin User</span>
              </div>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div
                    className="dropdown-item"
                    // onClick={() => navigate("/profile")}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </div>
                  <div className="dropdown-item" onClick={handleSignOut}>
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="stat-title">{stat.title}</p>
                <stat.icon size={20} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="stat-value">{stat.value}</p>
                <div className="trend-value">
                  <ArrowUpRight size={16} />
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="chart-section">
          <div className="chart-header">
            <h2 className="chart-title">Overview</h2>
            <BarChart3 size={20} />
          </div>
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Chart will be rendered here
          </div>
        </section>

        <section className="recent-sales">
          <h2 className="chart-title" style={{ marginBottom: "1.5rem" }}>
            Recent Sales
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.name}</td>
                    <td>{sale.email}</td>
                    <td>{sale.amount}</td>
                    <td>
                      <span className={`status-badge ${sale.status}`}>
                        {sale.status.charAt(0).toUpperCase() +
                          sale.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
export default HomePage;
