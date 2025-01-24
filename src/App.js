import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
import { supabase } from "./createClient";
import Button from "./Components/Button/Button";
import { Login, SignUp, HomePage, Profile, Ranking, Tasks } from "./pages";
import { Route, Routes } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Components/Header/Header";

const tele = window.Telegram.WebApp;
function App() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    tele.ready();
    auth();
    // fetchUsers();
    // fetchAgents();
    const userId = localStorage.getItem("id");
  }, []);

  async function auth() {
    const { signInData, error } = await supabase.auth.signInWithPassword({
      email: "bot@gmail.com",
      password: "bot0123",
    });
  }
  // async function fetchUsers() {
  // const { data } = await supabase.from('SignUpUser').select('*').eq('status', "pending");
  // alert(data[0].username)
  // setUsers(data);
  // }

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

  // async function createUser() {
  //   await supabase.from("SignUpUser").insert({
  //     username: user.name,
  //     email: user.email,
  //     password: user.password,
  //     status: "pending",
  //   });
  //   fetchUsers();
  // }

  // async function deleteUser(userId) {
  //   const { data, error } = await supabase
  //     .from("SignUpUser")
  //     .delete()
  //     .eq("id", userId);
  //   fetchUsers();
  //   if (error) {
  //     console.log(error);
  //   }
  //   if (data) {
  //     console.log(data);
  //   }
  // }

  // async function approveUser(userId) {
  //   await supabase
  //     .from("SignUpUser")
  //     .update({ status: "approved" })
  //     .eq("id", userId);
  //   fetchUsers();
  //   fetchAgents();
  // }

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path={"/"} element={<SignUp />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/homepage"} element={<HomePage />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/ranking"} element={<Ranking />} />
        <Route path={"/tasks"} element={<Tasks />} />
      </Routes>
    </>
  );
}

export default App;
