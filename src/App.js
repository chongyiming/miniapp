import { useState, useEffect } from "react";
import { supabase } from "./createClient";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

// Modal component for file preview
function PreviewModal({ file, onClose }) {
  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {file.type === "pdf" ? (
          <iframe
            src={`${file.url}#toolbar=0`}
            className="preview-iframe"
            title={file.name}
          />
        ) : (
          <img src={file.url} alt={file.name} className="preview-image" />
        )}
      </div>
    </div>
  );
}

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
  const [submittedQuests, setSubmittedQuests] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState();

  useEffect(() => {
    tele.ready();
    auth();
    fetchUsers();
    fetchAgents();
    fetchSubmittedQuests();
    setUserId(localStorage.getItem("id"));
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
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function isPDF(filename) {
    return filename.toLowerCase().endsWith(".pdf");
  }

  async function fetchSubmittedQuests() {
    const { data: quests, error } = await supabase
      .from("AgentSubmittedQuests")
      .select("*")
      .eq("status", false);

    if (error) {
      console.error("Error fetching quests:", error);
      return;
    }

    const updatedQuests = await Promise.all(
      quests.map(async (quest) => {
        if (quest.photo_required) {
          const { data: files, error: storageError } = await supabase.storage
            .from("test")
            .list(`${quest.agent_id}/quest/${quest.quest_id}/`, { limit: 10 });

          if (storageError) {
            console.error(
              `Error fetching files for quest ${quest.id}:`,
              storageError
            );
            return { ...quest, files: [] };
          }

          const fileUrls = files.map((file) => {
            const publicUrl = supabase.storage
              .from("test")
              .getPublicUrl(
                `${quest.agent_id}/quest/${quest.quest_id}/${file.name}`
              ).data.publicUrl;

            return {
              url: publicUrl,
              name: file.name,
              type: isPDF(file.name) ? "pdf" : "image",
            };
          });

          return { ...quest, files: fileUrls };
        }

        return { ...quest, files: [] };
      })
    );

    setSubmittedQuests(updatedQuests);
  }

  async function approveQuest(questId, questPoint, agent_id) {
    await supabase
      .from("AgentSubmittedQuests")
      .update({ status: true })
      .eq("id", questId);
    const data = await supabase
      .from("AgentLeaderboard")
      .select("score")
      .eq("agent_id", userId);

    await supabase
      .from("AgentLeaderboard")
      .update({ score: data.data[0].score + questPoint })
      .eq("agent_id", agent_id);
    fetchSubmittedQuests();
  }

  async function rejectQuest(questId) {
    try {
      const { data: quest, error: fetchError } = await supabase
        .from("AgentSubmittedQuests")
        .select("*")
        .eq("id", questId)
        .single();

      if (fetchError) {
        console.error("Error fetching quest details:", fetchError);
        return;
      }

      if (quest.photo_required) {
        const folderPath = `${quest.agent_id}/quest/${quest.quest_id}/`;

        const { data: files, error: listError } = await supabase.storage
          .from("test")
          .list(folderPath);

        if (listError) {
          console.error("Error listing files for deletion:", listError);
          return;
        }

        if (files.length > 0) {
          const filePaths = files.map((file) => `${folderPath}${file.name}`);
          const { error: deleteError } = await supabase.storage
            .from("test")
            .remove(filePaths);

          if (deleteError) {
            console.error("Error deleting files:", deleteError);
            return;
          }
        }
      }

      const { error: deleteQuestError } = await supabase
        .from("AgentSubmittedQuests")
        .delete()
        .eq("id", questId);

      if (deleteQuestError) {
        console.error("Error deleting quest:", deleteQuestError);
        return;
      }

      console.log("Quest and associated folder deleted successfully!");
      fetchSubmittedQuests();
    } catch (error) {
      console.error("Unexpected error during rejection:", error);
    }
  }

  // ... [Previous functions remain unchanged]

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Pending Approvals</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td className="action-buttons">
                      <button
                        className="btn btn-approve"
                        onClick={() => approveUser(user.id, user.tg_username)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => deleteUser(user.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Approved Agents</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
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
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Submitted Quests</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Quest ID</th>
                  <th>Quest Header</th>
                  <th>Photo Required</th>
                  <th>Actions</th>
                  <th>Files</th>
                </tr>
              </thead>
              <tbody>
                {submittedQuests.map((quest) => (
                  <tr key={quest.id}>
                    <td>{quest.id}</td>
                    <td>{quest.header}</td>
                    <td>{quest.photo_required ? "Yes" : "No"}</td>
                    <td className="action-buttons">
                      <button
                        className="btn btn-approve"
                        onClick={() =>
                          approveQuest(
                            quest.id,
                            quest.quest_points,
                            quest.agent_id
                          )
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => rejectQuest(quest.id)}
                      >
                        Reject
                      </button>
                    </td>
                    <td>
                      {quest.files &&
                        quest.files.map((file, index) => (
                          <div key={index} className="file-preview">
                            {file.type === "pdf" ? (
                              <div className="pdf-preview">
                                <span
                                  className="pdf-link"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  View PDF: {file.name}
                                </span>
                              </div>
                            ) : (
                              <img
                                src={file.url}
                                alt={`Quest ${quest.id} File ${index + 1}`}
                                className="thumbnail"
                                onClick={() => setPreviewFile(file)}
                              />
                            )}
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Create New Quest</h2>
          </div>
          <div className="quest-form">
            <div className="form-group">
              <label>Quest Header</label>
              <input
                type="text"
                name="header"
                value={quest.header}
                onChange={handleQuestChange}
                placeholder="Enter quest header"
              />
            </div>
            <div className="form-group">
              <label>Quest Content</label>
              <textarea
                name="content"
                value={quest.content}
                onChange={handleQuestChange}
                placeholder="Enter quest content"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quest Date</label>
                <input
                  type="date"
                  name="date"
                  value={quest.date}
                  onChange={handleQuestChange}
                />
              </div>
              <div className="form-group">
                <label>Quest Points</label>
                <input
                  type="number"
                  name="points"
                  value={quest.points}
                  onChange={handleQuestChange}
                  placeholder="Enter quest points"
                />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="photo_required"
                  checked={quest.photo_required}
                  onChange={handleQuestChange}
                />
                Photo Required
              </label>
            </div>
            <button className="btn btn-primary" onClick={createQuest}>
              Create Quest
            </button>
          </div>
        </section>
      </main>

      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}

export default App;
