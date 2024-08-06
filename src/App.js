import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { signUp, logIn, logOut } from "./firebase/authService";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsersData(querySnapshot.docs.map((doc) => doc.data()));
      };

      fetchData();
    }
  }, [user]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
    } catch (error) {
      console.error("Log-in error:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Log-out error:", error);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <div>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>

          <h1>Log In</h1>
          <form onSubmit={handleLogIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleLogOut}>Log Out</button>

          <h2>User Data</h2>
          <ul>
            {usersData.map((data, index) => (
              <li key={index}>{JSON.stringify(data)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
