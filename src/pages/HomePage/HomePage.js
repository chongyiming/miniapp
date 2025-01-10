import React,{useEffect,useState,useRef,ChangeEvent, use} from 'react'
import { supabase } from "../../createClient";
import { Form } from 'react-bootstrap';
import { v4 as uuidv4} from 'uuid';
import "./HomePage.css";
import { Link,useNavigate } from 'react-router-dom';

function HomePage() {
    const [tasks,setTasks]=useState([])
    const [images,setImages]=useState([])
    const navigate = useNavigate();  // Add this hook
    const userId=sessionStorage.getItem("id")
    useEffect(() => {
    fetchTasks();
    getImages();
  
    },[]);

  async function fetchTasks(){
    const { data } = await supabase.from('AgentCompletedTasks').select('*')
    .eq('task_id', sessionStorage.getItem("id"));
    setTasks(data)

    
  }

  async function uploadImage(e){
    let file=e.target.files[0];
    const {data,error}=await supabase.storage.from('test').upload(userId+"/"+uuidv4(),file)
  if (data){
    getImages();
  }else{
    console.log(error)
  }
  
  }
  async function getImages() {
    const { data, error } = await supabase.storage
      .from('test')
      .list(`${userId}/`, { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }); // Replace LFG with userId
  
    if (data) {
      const validFiles = data.slice(0, -1); // Exclude the last item
  
      const imageUrls = validFiles.map((file) =>
        supabase.storage.from('test').getPublicUrl(`${userId}/${file.name}`).data.publicUrl
      );
  
      setImages(imageUrls);
    } else {
      console.error("Error fetching images:", error);
    }
  }
  
  
  

 async function clearSession(){
  await sessionStorage.removeItem("username")
  await sessionStorage.removeItem("email")
  await sessionStorage.removeItem("id")
  setTimeout(() => {
    navigate('/login');
}, 1000);

}
  return (
    <div>
      <button onClick={clearSession} className='logout'>Logout</button>

      <h1>Welcome, {sessionStorage.getItem("username")}
      
      </h1>
      <div>
    {images.map((url, index) => (
      <img key={index} src={url}className="image" />
    ))}
  </div>
      <h1>Tasks Completed: {tasks.length}
      </h1>
      <Form.Group><Form.Control type="file" accept="image/png,image/jpeg" onChange={(e)=>uploadImage(e)}/></Form.Group>
      <button onClick={() => navigate('/profile')}>Testing</button>
    </div>
    
  )
}

export default HomePage