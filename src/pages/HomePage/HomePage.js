import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [images, setImages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rank, setRank] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchTasks();
    // getImages();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("AgentCompletedTasks")
      .select("*")
      .eq("task_id", userId);
    setTasks(data);
  }

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("test")
      .list(`${userId}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      const validFiles = data.slice(0, 1);
      const imageUrls = validFiles.map(
        (file) =>
          supabase.storage.from("test").getPublicUrl(`${userId}/${file.name}`)
            .data.publicUrl
      );
      setImages(imageUrls);
    } else {
      console.error("Error fetching images:", error);
    }
  }

  async function clearSession() {
    await localStorage.removeItem("username");
    await localStorage.removeItem("email");
    await localStorage.removeItem("id");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  return (
    <div>
      <Footer />
    </div>
  );
}

export default HomePage;
