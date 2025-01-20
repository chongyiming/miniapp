import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../../Components/Footer/Footer";
import logo from "./icon.png";
import camera from "./camera.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [images, setImages] = useState([logo]); // Initialize with default logo
  const [agents, setAgents] = useState(); // Agents data
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
  }); // Form data
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    async function fetchData() {
      await getImages();
      await fetchAgents();
      setLoading(false);
    }
    fetchData();
  }, []);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("test")
      .list(`${userId}/pfp/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Error fetching images:", error);
      setImages([logo]);
      return;
    }

    if (data && data.length > 0) {
      const validFiles = data.slice(0, 1);
      const imageUrls = validFiles.map(
        (file) =>
          supabase.storage
            .from("test")
            .getPublicUrl(`${userId}/pfp/${file.name}`).data.publicUrl
      );
      setImages(imageUrls);
    } else {
      setImages([logo]);
    }
  }

  async function uploadImage(e) {
    let file = e.target.files[0];

    // Fetch the list of files in the "pfp" folder
    const { data: files, error: listError } = await supabase.storage
      .from("test")
      .list(`${userId}/pfp/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (listError) {
      console.error("Error listing files:", listError);
      return;
    }

    // Remove any existing files in the "pfp" folder
    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${userId}/pfp/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from("test")
        .remove(filePaths);

      if (deleteError) {
        console.error("Error deleting files:", deleteError);
        return;
      }
    }

    // Upload the new file to the "pfp" folder
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("test")
      .upload(`${userId}/pfp/${uuidv4()}`, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      setImages([logo]);
      toast.error("Error uploading profile image!");
    } else {
      console.log("File uploaded:", uploadData);
      getImages(); // Refresh the images after upload
      toast.success("Profile image uploaded successfully!");
    }
  }

  async function fetchAgents() {
    const { data } = await supabase
      .from("SignUpUser")
      .select("*")
      .eq("id", userId);
    setAgents(data);
    if (data && data[0]) {
      setFormData({
        name: data[0].tg_username || "",
        contact: data[0].contact || "",
        email: data[0].email || "",
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSave() {
    const { name, contact, email } = formData;

    // Update the agent details in the database
    const { error } = await supabase
      .from("SignUpUser")
      .update({ tg_username: name, email: email, contact: contact })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    } else {
      toast.success("Profile updated successfully!");
      fetchAgents(); // Refresh agent data
      setIsModalOpen(false); // Close the modal
    }
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <div>
          <img src={images[0]} className="image" alt="Profile" />
          <div className="center-form-group">
            <label htmlFor="file-upload">
              <img src={camera} className="cameraImage" alt="Upload" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => uploadImage(e)}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="profile">
          <div>
            <h2>Name</h2>
            <p>{agents[0].tg_username}</p>
          </div>
          <div>
            <h2>Contact</h2>
            <p>{agents[0].contact ? agents[0].contact : "-"}</p>
          </div>
          <div>
            <h2>Email Address</h2>
            <p>{agents[0].email}</p>
          </div>
          <button
            className="edit-profile-button"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Contact:
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Profile;
