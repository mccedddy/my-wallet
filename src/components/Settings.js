import React, { useState, useEffect } from "react";
import { toastSuccess, toastError } from "../toastUtils";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const Settings = ({ user, username, handleLogOut, onUpdate }) => {
  const [newUsername, setNewUsername] = useState(username);

  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  const checkUsernameExists = async (username) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", username))
    );
    return !querySnapshot.empty;
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();

    try {
      const usernameExists = await checkUsernameExists(newUsername);
      if (usernameExists) {
        toastError("Username is already taken. Please choose another one.");
        return;
      }

      const userDocRef = doc(db, "users", user.email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        await setDoc(userDocRef, { username: newUsername }, { merge: true });
      }
      toastSuccess(`Changed username to ${newUsername}`);
      onUpdate();
    } catch (error) {
      console.log("Error changing username:", error);
    }
  };

  const showSave =
    newUsername && newUsername.trim() !== "" && newUsername !== username;

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 text-sm">
        <form
          onSubmit={handleChangeUsername}
          className="p-4 flex flex-col gap-2 bg-background-light rounded-lg"
        >
          <h1 className="text-lg text-text-dark">ACCOUNT</h1>
          <div className="flex items-center gap-2">
            <h1 className="w-24 text-text-dark">Username:</h1>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-80 h-8 rounded px-2 text-text bg-background-lighter"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="w-24 text-text-dark">Email:</h1>
            <input
              type="text"
              placeholder="Email"
              value={user.email}
              className="w-80 h-8 rounded px-2 text-text bg-background-lighter"
              readOnly
            />
          </div>
          {showSave && (
            <button
              type="submit"
              className="h-8 w-36 mt-2 bg-accent text-background px-4 rounded"
            >
              SAVE CHANGES
            </button>
          )}
          <button
            onClick={handleLogOut}
            className="h-8 w-24 mt-2 bg-secondary px-4 rounded"
          >
            LOG OUT
          </button>
        </form>

        <div className="p-4 flex flex-col gap-2 bg-background-light rounded-lg">
          <h1 className="text-lg text-text-dark">RECORDS</h1>
          <h1 className="text-text-dark">Warning: Use at your own risk!</h1>
          <button className="h-8 w-36 bg-red-900 px-4 rounded">
            CLEAR RECORDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
