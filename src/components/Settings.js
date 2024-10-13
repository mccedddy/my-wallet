import React, { useState, useEffect } from "react";
import { toastSuccess, toastError, toastInfo } from "../toastUtils";
import { db } from "../firebase/firebaseConfig";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Settings = ({ user, username, handleLogOut, onUpdate }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [openClearData, setOpenClearData] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

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

  const handleClearData = async () => {
    if (!password) {
      toastError("Please enter your password to clear data.");
      return;
    }

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);

      toastInfo("Clearing data...");
      const recordsCollectionRef = collection(
        db,
        "users",
        user.email,
        "records"
      );
      const querySnapshot = await getDocs(recordsCollectionRef);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, { wallets: [] });

      toastSuccess("Successfully cleared all data (records and wallets).");
      setOpenClearData(false);
      setPassword("");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toastError(`Incorrect password`);
      } else {
        toastError(`Error clearing data: ${error.message || error}`);
      }
    }
  };

  const handleChangePassword = async () => {
    if (newPassword1 !== newPassword2) {
      toastError("Passwords do not match.");
      return;
    }

    if (!currentPassword || !newPassword1 || !newPassword2) {
      toastError("Please fill out all password fields.");
      return;
    }

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword1);

      toastSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword1("");
      setNewPassword2("");
      setOpenChangePassword(false);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toastError("Incorrect current password");
      } else if (error.code === "auth/weak-password") {
        toastError("Password should be at least 6 characters");
      } else {
        toastError(`Error changing password: ${error.message || error}`);
      }
    }
  };

  const showSave =
    newUsername && newUsername.trim() !== "" && newUsername !== username;

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 text-sm">
        <div className="p-4 flex flex-col gap-2 bg-background-light rounded-lg">
          <h1 className="text-lg text-text-dark">ACCOUNT</h1>
          <div className="flex items-center gap-2">
            <h1 className="w-24 text-text-dark">Username:</h1>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
            />
          </div>
          {showSave && (
            <button
              onClick={handleChangeUsername}
              className="h-8 w-36 my-1 bg-accent text-background px-4 rounded"
            >
              SAVE CHANGES
            </button>
          )}
          <div className="flex items-center gap-2">
            <h1 className="w-24 text-text-dark">Email:</h1>
            <input
              type="text"
              placeholder="Email"
              value={user.email}
              className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
              readOnly
            />
          </div>
          {openChangePassword ? (
            <>
              <div className="flex items-center mt-1 gap-2">
                <h1 className="w-44 text-text-dark">Current Password:</h1>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
                />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="w-44 text-text-dark">New Password:</h1>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword1}
                  onChange={(e) => setNewPassword1(e.target.value)}
                  className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
                />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="w-44 text-text-dark">Confirm New Password:</h1>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                  className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
                />
              </div>
              <div className="w-full sm:w-80 flex gap-2 my-1">
                <button
                  onClick={handleChangePassword}
                  className="h-8 w-full bg-accent text-background px-4 rounded"
                >
                  CONFIRM
                </button>
                <button
                  onClick={() => {
                    setOpenChangePassword(false);
                  }}
                  className="h-8 w-full bg-secondary px-4 rounded"
                >
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setOpenChangePassword(true);
              }}
              className="h-6 flex text-sm text-text-dark hover:text-text bg-background-light"
            >
              CHANGE PASSWORD
            </button>
          )}
          <button
            onClick={handleLogOut}
            className="h-8 w-24 bg-secondary px-4 rounded"
          >
            LOG OUT
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2 bg-background-light rounded-lg">
          <h1 className="text-lg text-text-dark">DATA</h1>
          <h1 className="text-text-dark">Warning: Use at your own risk!</h1>
          {openClearData ? (
            <>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full sm:w-80 h-8 rounded px-2 text-text bg-background-lighter"
              />
              <div className="w-full sm:w-80 flex gap-2">
                <button
                  onClick={handleClearData}
                  className="h-8 w-full bg-red-900 px-4 rounded"
                >
                  CONFIRM
                </button>
                <button
                  onClick={() => {
                    setOpenClearData(false);
                  }}
                  className="h-8 w-full bg-secondary px-4 rounded"
                >
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setOpenClearData(true);
              }}
              className="h-8 w-36 bg-red-900 px-4 rounded"
            >
              CLEAR DATA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
