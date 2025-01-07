import React,{useEffect,useState} from 'react'
import { supabase } from "../../createClient";
function HomePage() {
        const [tasks,setTasks]=useState([])
    
useEffect(() => {
    fetchTasks();
    },[]);

  async function fetchTasks(){
    const { data } = await supabase.from('AgentCompletedTasks').select('*')
    .eq('task_id', sessionStorage.getItem("id"));
    setTasks(data)

    
  }
  return (
    <div>
      <h1>Welcome, {sessionStorage.getItem("username")};
      </h1>
      <h1>You have done {tasks.length} tasks;
      </h1>
    </div>
  )
}

export default HomePage