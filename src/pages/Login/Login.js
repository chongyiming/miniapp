import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../Components/Header/Header";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    id: "",
    name: "",
  });
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate(); // Add this hook

  console.log(user);
  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    const { data } = await supabase
      .from("SignUpUser")
      .select("*")
      .eq("status", "approved");
    setAgents(data);
  }
  function handleChange(event) {
    setUser((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function signIn(event) {
    event.preventDefault();

    let isAuthenticated = false;

    for (let i = 0; i < agents.length; i++) {
      if (
        agents[i].password === user.password &&
        agents[i].email === user.email &&
        agents[i].status === "approved"
      ) {
        isAuthenticated = true;
        user.id = agents[i].id;
        user.name = agents[i].tg_username;
        break;
      }
    }

    if (isAuthenticated) {
      toast.success("Login successful!", {
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "white",
        },
      });
      // window.sessionStorage.setItem("email", user.email);
      window.localStorage.setItem("id", user.id);
      window.localStorage.setItem("username", user.name);

      setTimeout(() => {
        navigate("/homepage");
      }, 1000);
    } else {
      toast.error("Invalid credentials or account not approved", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
    }
  }

  return (
    <>
      <Toaster position="top-right" /> {/* Add this line */}
      {/* <Header /> */}
      <div className="container">
        <h1 className="heading">Login</h1>
        <form onSubmit={signIn}>
          {/* <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
          /> */}
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <button type="submit">Login</button>
          Haven't create an account?
          <Link to="/" className="link">
            Sign Up
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
