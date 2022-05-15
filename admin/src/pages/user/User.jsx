import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import "./user.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";

export default function User() {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [users, setUsers] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState();

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get(
      "http://localhost:5000/api/users/find/" + userId,
      {
        headers: headers,
      }
    );

    setUsers(response.data);
  }, [users]);

  const handleClick = async (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          axios.put(
            "http://localhost:5000/api/users/" + userId,
            {
              username,
              email,
              password,
              isAdmin,
              img: downloadURL,
            },
            { headers: headers }
          );
          // window.location = "./users";
        });
      }
    );
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Add User</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img src={users.img} alt="" className="userShowImg" />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{users.username}</span>
              <span className="userShowUserTitle">
                {users.isAdmin ? "Admin User" : ""}
              </span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{users.username}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{users.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">
                {users.isAdmin ? "isAdmin:True" : "isAdmin:False"}
              </span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Update User Information</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder={users.username}
                  className="userUpdateInput"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder={users.email}
                  className="userUpdateInput"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Password</label>
                <input
                  type="password"
                  className="userUpdateInput"
                  placeholder="*****"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="userUpdateInput"
                  placeholder="*****"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img className="userUpdateImg" src={users.img} alt="" />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="userUpdateButton" onClick={handleClick}>
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
