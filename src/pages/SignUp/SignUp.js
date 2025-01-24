import "./SignUp.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import { Link, useNavigate } from "react-router-dom";
import { Building } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tele = window.Telegram.WebApp;

function SignUp() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // Default active tab is now "login"

  useEffect(() => {
    const localUsername = localStorage.getItem("username");
    if (localUsername) {
      navigate("/homepage");
    }
  }, [navigate]);

  function handleChange(event) {
    setUser((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function register(event) {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from("SignUpUser")
        .select("*")
        .eq("email", user.email);

      if (data && data.length > 0) {
        toast.error("User is already registered!", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      const { error: insertError } = await supabase.from("SignUpUser").insert({
        username: user.name,
        email: user.email,
        password: user.password,
        status: "pending",
        contact: 0,
      });

      if (insertError) throw insertError;

      toast.success("Sign Up successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error(`Sign Up failed: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  async function login(event) {
    event.preventDefault();

    try {
      const { data } = await supabase
        .from("SignUpUser")
        .select("*")
        .eq("status", "approved")
        .eq("email", user.email)
        .eq("password", user.password);

      if (data && data.length > 0) {
        // Store user data in localStorage
        window.localStorage.setItem("userId", data[0].id);
        window.localStorage.setItem("username", data[0].username);
        window.localStorage.setItem("email", data[0].email);

        // Redirect or show a success message
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Optionally redirect after login
        setTimeout(() => {
          navigate("/homepage"); // Replace with your desired route
        }, 2000);
      } else {
        // Show an error message if no matching user is found
        toast.error("Invalid email or password, or account not approved.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Handle unexpected errors
      toast.error(`An error occurred: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  return (
    <>
      <div className="container">
        <div className="left-panel">
          <div className="logo">Your Logo</div>
          <div className="testimonial">
            <div className="testimonial-text">
              "This platform has revolutionized how I track my commissions and
              stay motivated. The gamification elements make it fun to hit
              targets!"
            </div>
            <div className="testimonial-author">Amaci, Top Lengzai 2025</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="login-container">
            <div className="welcome-text">
              <h1>Welcome back</h1>
              <p>Sign in to your account to continue</p>
            </div>
            <div className="auth-options">
              <button
                className={`auth-option ${
                  activeTab === "login" ? "active" : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`auth-option ${
                  activeTab === "register" ? "active" : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>
            {activeTab === "register" ? (
              <form onSubmit={register} className="login-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Sign Up
                </button>
              </form>
            ) : (
              <form onSubmit={login} className="login-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default SignUp;
