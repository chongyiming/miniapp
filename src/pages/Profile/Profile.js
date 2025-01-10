import React,{useEffect,useState} from 'react'
import { Form } from 'react-bootstrap';
import { supabase } from "../../createClient";
import { v4 as uuidv4} from 'uuid';
import { Link,useNavigate } from 'react-router-dom';
import "./Profile.css";
function Profile() {
    const [images,setImages]=useState([])
    const navigate = useNavigate();  // Add this hook
    const userId=sessionStorage.getItem("id")
useEffect(() => {
    getImages();
  
    },[]);
    async function uploadImage(e) {
        let file = e.target.files[0];
        
        // Fetch existing files in the folder
        const { data: files, error: listError } = await supabase.storage
          .from('test')
          .list(`${userId}/`, { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } });
      
        if (listError) {
          console.error("Error listing files:", listError);
          return;
        }
      
        // Delete all files in the folder
        if (files && files.length > 0) {
          const filePaths = files.map(file => `${userId}/${file.name}`);
          const { error: deleteError } = await supabase.storage.from('test').remove(filePaths);
          if (deleteError) {
            console.error("Error deleting files:", deleteError);
            return;
          }
        }
      
        // Upload the new file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('test')
          .upload(`${userId}/${uuidv4()}`, file);
      
        if (uploadError) {
          console.error("Error uploading file:", uploadError);
        } else {
          console.log("File uploaded:", uploadData);
          getImages(); // Refresh the images
        }
      }

      async function getImages() {
          const { data, error } = await supabase.storage
            .from('test')
            .list(`${userId}/`, { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }); // Replace LFG with userId
        
          if (data) {
            const validFiles = data.slice(0, 1); // Exclude the last item

            const imageUrls = validFiles.map((file) =>
              supabase.storage.from('test').getPublicUrl(`${userId}/${file.name}`).data.publicUrl
            );

        
            setImages(imageUrls);
          } else {
            console.error("Error fetching images:", error);
          }
        }
  return (
    <div>
        <h1>Profile</h1>
        <div className='profilePicContainer'>
        <h2>Change Profile Picture</h2>
    {images.map((url, index) => (
      <img key={index} src={url}className="image" />
    ))}
        <div className="center-form-group">
        <Form.Group>
            <Form.Control
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => uploadImage(e)}
            />
        </Form.Group>
        </div>
        </div>
    </div>
  )
}

export default Profile