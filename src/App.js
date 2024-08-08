import React, { useState, useEffect } from "react";
import { auth } from "./firebase/firebaseConfig";
import { signUp, logIn, logOut } from "./firebase/authService";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {!user ? (
        <AuthForm handleSignUp={signUp} handleLogIn={logIn} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar handleLogOut={logOut} />
          <Home user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
