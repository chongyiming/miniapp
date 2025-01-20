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
  const [quest, setQuest] = useState({
    header: "",
    content: "",
    date: "",
    points: 0,
    photo_required: false,
  });
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [submittedQuests, setSubmittedQuests] = useState([]); // Added for agent's submitted quests
  const navigate = useNavigate(); // Add this hook
  useEffect(() => {
    tele.ready();
    auth();
    const userId = localStorage.getItem("id");
    fetchUsers();
    fetchAgents();
    fetchSubmittedQuests(); // Fetch the agent-submitted quests
  }, []);

  async function auth() {
    const { signInData, error } = await supabase.auth.signInWithPassword({
      email: "admin@gmail.com",
      password: "admin0123",
    });
  }
  async function fetchUsers() {
    const { data } = await supabase
      .from("SignUpUser")
      .select("*")
      .eq("status", "pending");
    setUsers(data);
  }

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

  async function createUser() {
    await supabase.from("SignUpUser").insert({
      username: user.name,
      email: user.email,
      password: user.password,
      status: "pending",
    });
    fetchUsers();
  }

  async function deleteUser(userId) {
    const { data, error } = await supabase
      .from("SignUpUser")
      .delete()
      .eq("id", userId);
    fetchUsers();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  }

  async function approveUser(userId, userTg) {
    await supabase
      .from("SignUpUser")
      .update({ status: "approved" })
      .eq("id", userId);

    await supabase
      .from("AgentLeaderboard")
      .insert({ agent_id: userId, score: 0, tg_username: userTg });

    fetchUsers();
    fetchAgents();
  }

  async function createQuest() {
    await supabase.from("Quest").insert({
      header: quest.header,
      content: quest.content,
      date: quest.date,
      points: quest.points,
      photo_required: quest.photo_required,
    });
    fetchUsers();
  }

  function handleUserChange(event) {
    setUser((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function handleQuestChange(event) {
    const { name, value, type, checked } = event.target;
    setQuest((prevQuest) => ({
      ...prevQuest,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox for approval
    }));
  }

  async function fetchSubmittedQuests() {
    const { data: quests, error } = await supabase
      .from("AgentSubmittedQuests")
      .select("*")
      .eq("status", false); // Fetch quests with status 'false'

    if (error) {
      console.error("Error fetching quests:", error);
      return;
    }

    const updatedQuests = await Promise.all(
      quests.map(async (quest) => {
        if (quest.photo_required) {
          // Fetch images from the storage
          const { data: images, error: storageError } = await supabase.storage
            .from("test") // Replace "images" with your bucket name
            .list(`${quest.agent_id}/quest/${quest.quest_id}/`, { limit: 10 }); // Fetch images inside userId/questId

          if (storageError) {
            console.error(
              `Error fetching images for quest ${quest.id}:`,
              storageError
            );
            return { ...quest, images: [] }; // Return the quest with no images
          }

          // Generate public URLs for the images
          const imageUrls = images.map(
            (image) =>
              supabase.storage
                .from("test")
                .getPublicUrl(
                  `${quest.agent_id}/quest/${quest.quest_id}/${image.name}`
                ).data.publicUrl
          );
          console.log("images", images);
          return { ...quest, images: imageUrls }; // Add image URLs to the quest
        }

        return { ...quest, images: [] }; // If no photos required, return empty image array
      })
    );

    setSubmittedQuests(updatedQuests);
  }

  // Handle quest approval
  async function approveQuest(questId) {
    await supabase
      .from("AgentSubmittedQuests")
      .update({ status: true })
      .eq("id", questId);
    fetchSubmittedQuests(); // Refresh the quest list after approval
  }

  // Handle quest rejection
  async function rejectQuest(questId) {
    await supabase.from("AgentSubmittedQuests").delete().eq("id", questId);
    fetchSubmittedQuests(); // Refresh the quest list after rejection
  }

  return (
    <>
      <h1 className="heading">Admin Page</h1>
      <h1 className="heading">Pending Approval</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => {
                      approveUser(user.id, user.tg_username);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1 className="heading">Agent Table</h1>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.username}</td>
                <td>{agent.email}</td>
                <td>{agent.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="heading">Submitted Quests</h1>
      <table>
        <thead>
          <tr>
            <th>Quest Id</th>
            <th>Quest Header</th>
            <th>Photo Required</th>
            <th>Action</th>
            <th>Images</th> {/* Display images */}
          </tr>
        </thead>
        <tbody>
          {submittedQuests.map((quest) => (
            <tr key={quest.id}>
              <td>{quest.id}</td>
              <td>{quest.header}</td>
              <td>{quest.photo_required ? "Yes" : "No"}</td>
              <td>
                <button
                  className="approve-btn"
                  onClick={() => approveQuest(quest.id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => rejectQuest(quest.id)}
                >
                  Reject
                </button>
              </td>
              <td>
                {quest.images &&
                  quest.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Quest ${quest.id} Image ${index + 1}`}
                      width={100}
                    />
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className="heading">Create Quest</h1>
      <div className="quest-container">
        <label>
          Quest Header:
          <input
            type="text"
            name="header"
            value={quest.header}
            onChange={handleQuestChange}
            placeholder="Enter quest header"
          />
        </label>
        <label>
          Quest Content:
          <textarea
            name="content"
            value={quest.content}
            onChange={handleQuestChange}
            placeholder="Enter quest content"
          />
        </label>
        <label>
          Quest Date:
          <input
            type="date"
            name="date"
            value={quest.date}
            onChange={handleQuestChange}
          />
        </label>
        <label>
          Quest Points:
          <input
            type="number"
            name="points"
            value={quest.points}
            onChange={handleQuestChange}
            placeholder="Enter quest points"
          />
        </label>
        <label>
          Photo required:
          <input
            type="checkbox"
            name="photo_required"
            checked={quest.photo_required}
            onChange={handleQuestChange}
            className="checkbox"
          />
        </label>
        <button onClick={createQuest}>Create Quest</button>
      </div>
    </>
  );
}

export default App;
