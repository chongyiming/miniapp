import Footer from "../../Components/Footer/Footer";
import "./Ranking.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../createClient";

function Ranking() {
  const [rank, setRank] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchRank();
    fetchLeaderboard();
  }, []);
  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from("AgentLeaderboard")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return;
    }

    setLeaderboard(data || []); // Ensure leaderboard is an array
    console.log(data);
  }
  async function fetchRank() {
    const { data, error } = await supabase
      .from("AgentLeaderboard")
      .select("*")
      .eq("agent_id", userId);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return;
    }

    setRank(data[0]);
    console.log("own", data);
  }
  return (
    <div>
      <div className="rankingContainer">
        <div className="ownRankingContainer">
          <span>{rank?.tg_username}</span>
          <span>{rank?.score} points</span>
        </div>
        <div className="bottomPart">
          <span className="header">LEADERBOARD</span>

          <div className="leaderboard-entries">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="leaderboard-row">
                <div className="user-info">
                  <span className="rank-number">{index + 1}</span>
                  <span className="username">{entry.tg_username}</span>
                </div>
                <span className="score">
                  {entry.score.toLocaleString()} points
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Ranking;
