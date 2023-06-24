/* 
       e                   888 ,e,                 e88~~\                                     
      d8b     888-~\  e88~\888  "  Y88b  /        d888     888-~\  e88~-_  888  888 888-~88e  
     /Y88b    888    d888  888 888  Y88b/         8888 __  888    d888   i 888  888 888  888b 
    /  Y88b   888    8888  888 888   Y88b         8888   | 888    8888   | 888  888 888  8888 
   /____Y88b  888    Y888  888 888   /Y88b        Y888   | 888    Y888   ' 888  888 888  888P 
  /      Y88b 888     "88_/888 888  /  Y88b        "88__/  888     "88_-~  "88_-888 888-_88"  
  📣 Version BETA - Xlator & SkyX [ID FR] - Copyright© 2023                         88   
.
*/

import { useEffect, useState } from "react";
import { updatePassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { logout, useAuth, upload, updateDisplayName, updateUserEmail, ResetPassword } from "../config/FirebaseConfig.js";
import { useRouter } from 'next/navigation';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import Drawer from '@mui/material/Drawer';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import $ from 'jquery';
import LoadingPage from "../pages/LoadingPage.js";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}  

export default function NavBar() {
    const storage = getStorage();
    const { push } = useRouter();
    const currentUser = useAuth();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://images.nightcafe.studio//assets/profile.png");
    const [error, setError] = useState(false);
    const [valueTitle, setValueTitle] = useState('');
    const [valueDescription, setValueDescription] = useState('');
    const db = getFirestore();
    const [imageDataURLs, setImageDataURLs] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        const updatedDataURLs = [...imageDataURLs];
        const updatedFileNames = [...fileNames]; 
        
        if (updatedDataURLs.length + files.length > 3) {
          alert('Désolé, mais vous ne pouvez télécharger que trois photos au maximum ! 😪');
          return;
        }
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          
          reader.onload = function (e) {
            const imageDataURL = e.target.result;
            updatedDataURLs.push(imageDataURL);
            setImageDataURLs(updatedDataURLs);
            
            const fileName = file.name; 
            updatedFileNames.push(fileName); 
            setFileNames(updatedFileNames); 
          };
          
          reader.readAsDataURL(file);
        }
    };      

    const handleRemoveImage = (index) => {
        const updatedDataURLs = [...imageDataURLs];
        updatedDataURLs.splice(index, 1);
        setImageDataURLs(updatedDataURLs);
    };
    
    if (typeof document !== 'undefined') {
        $(document).ready(function() {
            $("#new-content").hide();
      
            $('#personnal_settings').click(function() {
                $("#new-content").fadeIn(400);
                $('#current-content').hide();
                $(".popup-content").animate({
                    width: "500"
                }, 300);
            });
        
            $('#back_button').click(function() {
                $("#current-content").fadeIn(400);
                $("#new-content").hide();
                $(".popup-content").animate({
                    width: "350"
                }, 300);
            });
        });
    }  
    
    /* 📦 Post function with Firestore Firebase : 📦 */
    const handleChangeTitle = (event) => { setValueTitle(event.target.value); };
    const handleChangeDescription = (event) => { setValueDescription(event.target.value); };

    /* 📋 Generate one ID for the post : 📋 */
    var today  = new Date();
    function generateId() { var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var id = ''; for (var i = 0; i < 20; i++) { var randomIndex = Math.floor(Math.random() * chars.length); id += chars.charAt(randomIndex); } return id; }
    async function createPost() {
        var generatedId = generateId();
        const imageURLs = [];
      
        if (imageDataURLs.length > 0) {
            try {
                setUploading(true);
                for (let i = 0; i < imageDataURLs.length; i++) {
                    const imageDataURL = imageDataURLs[i];
                    const fileName = fileNames[i];

                    const response = await fetch(imageDataURL);
                    const blob = await response.blob();
                    const storageRef = ref(storage, 'post_images_' + generatedId + '/' + fileName);

                    await uploadBytes(storageRef, blob);
                    const downloadURL = await getDownloadURL(storageRef);
                    imageURLs.push(downloadURL);
                }
                setUploading(false);
        
                const data = {
                    title: valueTitle,
                    description: valueDescription,
                    images_uploaded: imageURLs,
                    authors_name: currentUser.displayName,
                    authors_img: photoURL,
                    publish_data: today.toLocaleDateString("FR")
                };
        
                await setDoc(doc(db, "post", generatedId), data);
                window.location.reload();
            } catch (error) {
                setUploading(false);
                console.error(error);
            }
        } else {
          alert("Please upload one image for your post... 🧐");
        }
    }      

    /* 📦 Focus Function Input add post/modal : 📦 */
    function setFocus(on) {
        var element = document.activeElement;
        if (on) {
          setTimeout(function () {
            element.parentNode.classList.add("focus");
          });
        } else {
          let box = document.querySelector(".input-box");
          box.classList.remove("focus");
          $("input").each(function () {
            var $input = $(this);
            var $parent = $input.closest(".input-box");
            if ($input.val()) $parent.addClass("focus");
            else $parent.removeClass("focus");
          });
        }
    }

    /* ✨ The source link of the image of the user profile picture was replaced by the one of the actual Firebase's Database : ✨ */
    useEffect(() => { 
        if (currentUser?.photoURL) { setPhotoURL(currentUser.photoURL); }  
    }, [currentUser]);

    /* 📦 Referring to the upload file functions : 📦 */
    function UploadNewPicturePush() { 
        upload(photo, currentUser, setLoading); 
    }

    function UploadNewPictureChange(e) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById("profile_pic").src = event.target.result;
            $("#new-content").show();
        }

        reader.readAsDataURL(e.target.files[0]);
        if (e.target.files[0]) { setPhoto(e.target.files[0]) }; 
    }

    /* 🙏 Update a new name : 🙏 */
    function UpdateName() {
        var newDisplayName = prompt("📝 • Write your new name :");
        if (newDisplayName === null) {
            return;
        } else {
            updateDisplayName(newDisplayName);
        }
    }

    /* 📬 Update a new email : 📬 */
    function promptUpdateEmail() {
        var newEmail = prompt("📬 • Write your new email :");
        if (newEmail === null) {
          return;
        } else {
          updateUserEmail(newEmail);
        }
    }  
    
    /* 💬 Change your password : 💬 */
    function resetPassword() {
        var newPassword = prompt("💬 • Write your new password :");
        if (newPassword === null) {
            return;
        } else {
            updatePassword(currentUser, newPassword).then(() => {
                alert("Your password is updated ! ✔");
                window.location.reload();
            }).catch((error) => {
             console.log(error);
            });
        }
    }

    /* 💨 Simple function to Logout(); the actual user (in browser cookies) : 💨 */
    async function Logout() {
        setLoading(true);
        try {
          await logout();
        } catch {
          alert("Error!");
        }
        setLoading(false);
        push('/');
    }

    /* ⛔ Function to remove the actual user profile picture : ⛔ */
    function RemovePhoto() {
        const desertRef = ref(storage, photoURL);
        if (currentUser?.photoURL) {
            deleteObject(desertRef).then(() => {
                alert("Ta photo a bien été supprimé ! 👋");
                window.location.reload();
            })
        } else {
            alert("On ne peut pas supprimer ta photo de profil : tu en as pas ! Mets en une et on verra après ! 🧐")
        }
    }

    return (
        <>{!currentUser && <LoadingPage/>}
        {currentUser && 
                <>
                        <div className="navbar">
                            <img className="app_logo" src="https://zupimages.net/up/23/13/vzzn.png" title="Ardix Group&copy; • Logo"/>
                            {error ? (
                                <a href="#user_popup">
                                    <div className="icon_arrow"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                                    <img src="https://images.nightcafe.studio//assets/profile.png" alt="avatar" onError={() => setError(true)} className="avatar"/>
                                </a>
                            ) : (
                                <a href="#user_popup">
                                    <div className="icon_arrow"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                                    <img style={{objectFit: "cover"}} src={photoURL} alt="avatar" onError={() => setError(true)} className="avatar"/>
                                </a>
                            )} 
                            
                            {/* 💨 Notifications Right Panel : 💨 */}
                            <button onClick={() => setOpen(true)} id="notif_button"><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                            <Drawer className="side_panel_notif" anchor="right" open={open} onClose={() => setOpen(false)}>
                                <button onClick={() => setOpen(false)} className="close_panel">&times;</button>
                                <h1 className="title_panel">Notifications : <Chip label="BETA"/></h1>
                                <span className="description_panel">Here is a complete panel, allowing you to manage, display and modify your personalized notifications.</span>

                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange}>
                                        <Tab label="All" {...a11yProps(0)} />
                                        <Tab label="Feed" {...a11yProps(1)} />
                                        <Tab label="Personnal" {...a11yProps(2)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <List className="notif_list_item">
                                        <ListItem  className="notif_item" alignItems="flex-start">
                                            <ListItemAvatar><Avatar alt="B" src="/static/images/avatar/1.jpg"/></ListItemAvatar>
                                            <ListItemText primary={<b>Bienvenue sur la version <Chip label="BETA"/> ! 👋</b>} secondary={<p>22 Juin • Vous êtes actuellement un des premiers utilisateurs à tester notre plateforme...</p>}/>
                                        </ListItem>
                                        {/* <Divider variant="inset" component="li"/> */}
                                    </List>
                                </TabPanel>
                                <TabPanel value={value} index={1}>There is nothing here. 😪</TabPanel>
                                <TabPanel value={value} index={2}>There is nothing here. 😪</TabPanel>
                            </Drawer>

                            {/* 💫 Add post button : 💫 */}
                            <a href="#add_post_popup">
                                <button id="plus_button">
                                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    <p>Add a new post</p>
                                </button>
                            </a>

                            {/* 💫 Add post modal/popup : 💫 */}
                            <div id="add_post_popup" className="add_post_popup">
                                <div className="popup-content2">
                                    <a href="#" className="close">&times;</a>
                                    <h1 className="title"><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg> Add a new post :</h1>
                                    <p className="description">Here is a popup allowing you to create a new post in the section/channel you want. Any post may be removed after his publication. This post must also comply with <a href="#">our terms of use and respect</a> and <a href="#">the privacy of others</a>.</p>
                                
                                    {/* <h2 className="background"><span>Choose a channel :</span></h2>  */}
                                    <h2 className="background"><span>Add some informations :</span></h2> 
                                    <p className="description">Here is a form allowing you to fill in all the essential information concerning your publication.</p>

                                    <div className="input-box">
                                        <label className="input-label">Write your title...</label>
                                        <input type="text" value={valueTitle} className={focus ? 'input-1 focus' : 'input-1'} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={handleChangeTitle}/>
                                    </div>
                                    <div className="input-box">
                                        <label className="input-label">Write your description...</label>
                                        <input type="text" value={valueDescription} className={focus ? 'input-1 focus' : 'input-1'} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={handleChangeDescription}/>
                                    </div>

                                    <div className="img_upload_box">
                                        <label className="upload_img_button">
                                            <input type="file" onChange={handleFileChange} className="input_img"/>
                                            Click here to upload some images !
                                        </label>
                                        <p>You can upload maximum three pictures...</p>

                                        <div className="img_list_selected">
                                            {imageDataURLs.map((imageDataURL, index) => (
                                                <div key={index}>
                                                    <img src={imageDataURL} alt={index} />
                                                    <button className="remove_button" onClick={() => handleRemoveImage(index)}><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={createPost} className="send_your_post">Send your publication online !</button>
                                    {uploading && <center><br/><p>Wait few seconds... 📬</p></center>}
                                </div>
                            </div>
                            
                            <div id="user_popup" className="new_user_popup">
                                <div className="popup-content">
                                    <a href="#" className="close">&times;</a>

                                    <div className="infos-box">
                                        <div className="content" id="current-content">
                                            <div className="image-container">
                                                {error ? (
                                                <img src="https://images.nightcafe.studio//assets/profile.png" alt="avatar" onError={() => setError(true)} className="user_pic"/>
                                                ) : (
                                                    <img style={{objectFit: "cover"}} src={photoURL} alt="avatar" onError={() => setError(true)} className="user_pic"/>
                                                )}
                                                <img className="circle-image" src="https://www.kataliz.fr/wp-content/uploads/2016/03/rond-blanc.png"/>
                                                <img className="verif_tag_img" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="verif_tag_img"/> 
                                            </div>

                                            <h1>{currentUser.displayName}</h1>
                                            <span>Id : {currentUser.uid}</span>

                                            <div className="followers_count" title="Ces chiffres sont (pour l'instant) tous fictifs ! ⛔">
                                                <div className="item"><h1>0</h1><p>Followers</p></div>
                                                <div className="item"><h1>0</h1><p>Posts</p></div>
                                            </div>  
                                            <button className="menu_button">
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                                <p className="text">View my profile page</p>
                                            </button>
                                            <button id="personnal_settings" className="menu_button">
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                                <p className="text">Personnal settings</p>
                                            </button>
                                            <button disabled={loading} onClick={Logout} className="menu_button">
                                                <svg className="icon" viewBox="0 0 24 24" troke-linecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                                <p className="text">Logout</p>
                                            </button>
                                        </div>

                                        <div id="new-content">
                                            <div className="avatar_box">
                                                {error ? (
                                                    <img src="https://images.nightcafe.studio//assets/profile.png" alt="avatar" onError={() => setError(true)} id="profile_pic"/>
                                                ) : (
                                                    <img style={{objectFit: "cover"}} src={photoURL} alt="avatar" onError={() => setError(true)} id="profile_pic"/>
                                                )}
                                                <div className="pic_icon"><img src="https://cdn-icons-png.flaticon.com/512/158/158715.png"/></div>
                                            </div>

                                            <input type="file" accept=".jpg,.png,.jpeg" name="file" id="file" className="upload_new_picture" onChange={UploadNewPictureChange}/>
                                            <label htmlFor="file">Choose a new user picture ! 📸</label><br/><br/>

                                            <button className="menu_button" id="confirm_button" disabled={loading || !photo} onClick={UploadNewPicturePush}>
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                                <p className="text">Confirm your new picture...</p>
                                            </button>

                                            <button className="menu_button" onClick={RemovePhoto}>
                                                <svg strokeLinecap="round" stroke="red" strokeLinejoin="round" className="icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                <p className="text"><font color="red">Remove your profile picture !</font></p>
                                            </button>

                                            <button className="menu_button" onClick={UpdateName}>
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                <p className="text">Update your name !</p>
                                            </button>

                                            <button className="menu_button" onClick={promptUpdateEmail}>
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                <p className="text">Update your email !</p>
                                            </button>

                                            <button className="menu_button" onClick={resetPassword}>
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                <p className="text">Change your password...</p>
                                            </button>
                                            
                                            <button id="back_button" className="menu_button">
                                                <svg strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                                <p className="text">Back to user's menu !</p>
                                            </button>
                                        </div>

                                        {loading && (
                                            <div id="loading_div">
                                                <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                                    <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                </>
            }
        </>
    )
}