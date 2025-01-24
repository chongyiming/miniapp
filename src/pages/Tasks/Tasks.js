// import React, { useEffect, useState } from "react";
// import Footer from "../../Components/Footer/Footer";
// import { supabase } from "../../createClient";
// import "./Tasks.css";
// import { v4 as uuidv4 } from "uuid"; // Import UUID for unique file names
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Tasks() {
//   const [quests, setQuests] = useState([]);
//   const [activeQuestId, setActiveQuestId] = useState(null); // Track the selected quest for the popup
//   const userId = localStorage.getItem("id");
//   const [pendingQuests, setPendingQuests] = useState([]);
//   const [uploadedImages, setUploadedImages] = useState({}); // Track uploaded images for quests

//   useEffect(() => {
//     getQuests();
//     getPendingQuests();
//   }, []);

//   // Get all quests from the database
//   async function getQuests() {
//     const { data } = await supabase.from("Quest").select("*");
//     setQuests(data || []);
//     console.log("quests", data);
//   }

//   // Get pending quests from the database
//   async function getPendingQuests() {
//     const { data } = await supabase.from("AgentSubmittedQuests").select("*");
//     setPendingQuests(data || []);
//     console.log("pending quests", data);
//   }

//   async function postQuests(questId) {
//     // Find the quest to check if a photo is required
//     const quest = quests.find((quest) => quest.id === questId);

//     if (!quest) {
//       console.error("Quest not found");
//       return;
//     }

//     try {
//       const { error } = await supabase.from("AgentSubmittedQuests").insert({
//         quest_id: questId,
//         agent_id: userId,
//         photo_required: quest.photo_required, // Include the `photo_required` column
//         header: quest.header, // Include the `header`
//         content: quest.content, // Include the `content`
//         status: false,
//         quest_points: quest.points,
//       });

//       if (error) {
//         console.error("Error posting quest:", error);
//         toast.error("Error submitting the quest.");
//         return;
//       }

//       console.log("Quest completed and posted successfully.");
//       toast.success("Quest submitted successfully!");
//       getPendingQuests(); // Refresh pending quests
//     } catch (error) {
//       console.error("Unexpected error posting quest:", error);
//       toast.error("Unexpected error occurred.");
//     }
//   }

//   // Handle quest click and toggle the modal
//   const handleQuestClick = (questId) => {
//     setActiveQuestId((prevId) => (prevId === questId ? null : questId)); // Toggle the active quest state
//   };

//   // Close the popup modal
//   const closeModal = () => {
//     setActiveQuestId(null);
//   };

//   // Handle the complete button click
//   const handleCompleteClick = (questId) => {
//     const quest = quests.find((quest) => quest.id === questId);

//     // Check if photo is required and image is not uploaded
//     if (quest.photo_required && !uploadedImages[questId]) {
//       toast.error(
//         "Please upload at least one image before completing the quest."
//       );
//       return;
//     }

//     postQuests(questId); // Post the quest when validated
//     closeModal(); // Close the modal after completion
//   };

//   // Filter quests to exclude already completed ones
//   const filteredQuests = quests.filter(
//     (quest) => !pendingQuests.some((pending) => pending.quest_id === quest.id)
//   );

//   async function uploadImage(e, questId) {
//     const files = e.target.files;

//     if (!files || files.length === 0) {
//       console.error("No files selected.");
//       return;
//     }

//     // Define the quest folder path
//     const folderPath = `${userId}/quest/${questId}/`;

//     let uploadSuccess = true;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       // Generate a unique filename
//       const uniqueFileName = `${uuidv4()}_${file.name}`;

//       // Upload the file to the quest folder
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("test")
//         .upload(`${folderPath}${uniqueFileName}`, file);

//       if (uploadError) {
//         console.error("Error uploading file:", uploadError);
//         toast.error(`Error uploading ${file.name}`);
//         uploadSuccess = false;
//       } else {
//         console.log(`File uploaded: ${uploadData.path}`);
//       }
//     }

//     if (uploadSuccess) {
//       toast.success("Images uploaded successfully!");
//       // Mark this quest as having an uploaded image
//       setUploadedImages((prev) => ({ ...prev, [questId]: true }));
//     }
//   }

//   return (
//     <div className="container">
//       {filteredQuests.map((quest) => (
//         <div
//           key={quest.id}
//           className="box"
//           onClick={() => handleQuestClick(quest.id)}
//         >
//           <h2>{quest.header}</h2>
//           <p>
//             <strong>Points:</strong> {quest.points}
//           </p>
//         </div>
//       ))}

//       {/* Modal Popup */}
//       {activeQuestId && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>
//               {
//                 filteredQuests.find((quest) => quest.id === activeQuestId)
//                   ?.header
//               }
//             </h2>
//             <p>
//               {
//                 filteredQuests.find((quest) => quest.id === activeQuestId)
//                   ?.content
//               }
//             </p>
//             <p>
//               <strong>Points:</strong>{" "}
//               {
//                 filteredQuests.find((quest) => quest.id === activeQuestId)
//                   ?.points
//               }
//             </p>

//             {/* Show upload field if photo is required */}
//             {filteredQuests.find((quest) => quest.id === activeQuestId)
//               ?.photo_required && (
//               <div>
//                 <p>Upload images for this quest:</p>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple // Allow selecting multiple files
//                   onChange={(e) => uploadImage(e, activeQuestId)}
//                 />
//               </div>
//             )}

//             <div className="modal-buttons">
//               <button className="close-btn" onClick={closeModal}>
//                 Close
//               </button>
//               <button
//                 className="complete-btn"
//                 onClick={() => handleCompleteClick(activeQuestId)}
//               >
//                 Complete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//       <ToastContainer />
//     </div>
//   );
// }

// export default Tasks;
