import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../Components/Header/Header";

const tele = window.Telegram.WebApp;

function SignUp() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  console.log(user);
  const navigate = useNavigate(); // Add this hook
  const [telegramUser, setTelegramUser] = useState({
    id: null,
    username: null,
  });
  useEffect(() => {
    const localUsername = localStorage.getItem("username");
    if (localUsername) {
      navigate("/homepage");
    }
    getTelegramUserData();
  }, [navigate]);

  function getTelegramUserData() {
    if (tele.initDataUnsafe && tele.initDataUnsafe.user) {
      const { id, username } = tele.initDataUnsafe.user; // Telegram ID and username
      setTelegramUser({ id, username });
      console.log("Telegram ID:", id);
      console.log("Telegram Username:", username);
    } else {
      console.log("No Telegram user data available.");
    }
  }
  function handleChange(event) {
    setUser((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function createUser(event) {
    event.preventDefault();

    const { id, username } = telegramUser; // Extract id and username from state

    if (!id || !username) {
      toast.error("Telegram user data is missing. Please try again.", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
      return;
    }
    try {
      const { error } = await supabase.from("SignUpUser").insert({
        username: user.name,
        email: user.email,
        password: user.password,
        status: "pending",
        tg_username: username,
        tg_id: id,
        contact: 0,
      });

      if (error) {
        throw error;
      }

      toast.success("Sign Up successful!", {
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "white",
        },
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(`Sign Up failed: ${error.message}`, {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
    }

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }
  return (
    <>
      <Toaster position="top-right" /> {/* Add this line */}
      {/* <Header /> */}
      <div className="container">
        <h1 className="heading">Sign Up</h1>

        <form onSubmit={createUser}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
          />
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
          <button type="submit">Sign Up</button>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </form>
      </div>
    </>
  );
}

export default SignUp;
