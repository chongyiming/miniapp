import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
import { supabase } from "./createClient";
import Button from "./Components/Button/Button";
import { Login,SignUp,HomePage } from "./pages";
import { Route,Routes } from "react-router-dom";

const tele = window.Telegram.WebApp;
function App() {
  const [user,setUser]=useState({name:'',email:'',password:''})
 const [users,setUsers]=useState([])
 const [agents,setAgents]=useState([])
  useEffect(() => {
    tele.ready();
    auth();
    // fetchUsers();
    fetchAgents();
  },[]);


  async function auth(){
    const { signInData, error } = await supabase.auth.signInWithPassword({ email: 'bot@gmail.com', password: 'bot0123' });
  }
  async function fetchUsers(){
    // const { data } = await supabase.from('SignUpUser').select('*').eq('status', "pending");
    // alert(data[0].username)
    // setUsers(data);
    
  }

  async function fetchAgents(){
    const {data}= await supabase.from('SignUpUser').select('*').eq('status',"approved");

    setAgents(data);
  }
  
  function handleChange(event){
    setUser(prevFormData=>{return {
      ...prevFormData,[event.target.name]:event.target.value
    }})
  }

  async function createUser(){

    await supabase.from('SignUpUser').insert({username: user.name,email:user.email,password:user.password,status:"pending"});
    fetchUsers()
  }



  async function deleteUser(userId){
    
    const {data,error}=await supabase.from('SignUpUser').delete().eq('id',userId);
    fetchUsers();
    if(error){console.log(error)}
    if(data){console.log(data)}
  }

  async function approveUser(userId){
    await supabase.from('SignUpUser').update({status:"approved"}).eq("id",userId);
    fetchUsers()
    fetchAgents()
  }


  return (
    <>

    <Routes>
      <Route path={'/'} element={<SignUp/>}/>
      <Route path={'/login'} element={<Login/>}/>
      <Route path={'/homepage'} element={<HomePage/>}/>
    </Routes>
          {/* <h1 className="heading">User Page</h1>

    <form onSubmit={createUser}>
      <input 
      type="text"
      placeholder="Name"
      name='name'
      onChange={handleChange}/>
      <input 
      type="text"
      placeholder="Password"
      name='password'
      onChange={handleChange}/>
      <input 
      type="text"
      placeholder="Email"
      name='email'
      onChange={handleChange}/>
      <button type="submit">Create</button>
    </form>
    
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
      {users.map((user)=> 
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>
        <button className="approve-btn" onClick={() => approveUser(user.id)}>Approve</button>
<button className="reject-btn" onClick={() => deleteUser(user.id)}>Reject</button>
        </td>
      </tr>)}
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
      {agents.map((agent)=> 
      <tr key={agent.id}>
        <td>{agent.id}</td>
        <td>{agent.username}</td>
        <td>{agent.email}</td>
        <td>{agent.password}</td>
      </tr>)}
    </tbody>
  </table>
</div> */}
    </>
  );
}

export default App;
