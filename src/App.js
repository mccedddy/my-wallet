import React, { useState, useEffect } from "react";
import { auth } from "./firebase/firebaseConfig";
import { signUp, logIn } from "./firebase/authService";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./components/AuthForm";
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
        <Home user={user} />
      )}
    </div>
  );
}

export default App;
