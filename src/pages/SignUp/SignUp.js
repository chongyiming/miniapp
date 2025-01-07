import React,{useEffect,useState} from 'react'
import { supabase } from "../../createClient";
import { Link,useNavigate } from 'react-router-dom';
import "./SignUp.css";
import toast, { Toaster } from 'react-hot-toast';

function SignUp() {
    const [user,setUser]=useState({name:'',email:'',password:''})
    console.log(user)
    const navigate = useNavigate();  // Add this hook

    

    function handleChange(event){
        setUser(prevFormData=>{return {
          ...prevFormData,[event.target.name]:event.target.value
        }})
      }
    
      async function createUser(event){
        event.preventDefault();

        await supabase.from('SignUpUser').insert({username: user.name,email:user.email,password:user.password,status:"pending"});
        toast.success('Sign Up successful!', {
          duration: 2000,
          style: {
              background: '#22c55e',
              color: 'white',
          },
      });

      setTimeout(() => {
        navigate('/login');
    }, 1000);
  
      }
    return (
        <>
                            <Toaster position="top-right" />  {/* Add this line */}

            <h1 className="heading">Sign Up</h1>

          <form onSubmit={createUser}>
            <input 
              type="text"
              placeholder="Name"
              name='name'
              onChange={handleChange}
            />
            <input 
              type="text"
              placeholder="Password"
              name='password'
              onChange={handleChange}
            />
            <input 
              type="text"
              placeholder="Email"
              name='email'
              onChange={handleChange}
            />
            <button type="submit">Sign Up</button>
          Already have an account? <Link to='/login' className='link'>Login</Link>
          </form>
        </>
      );
      
}

export default SignUp