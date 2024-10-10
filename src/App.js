import React, { useState, useEffect } from "react";
import { auth } from "./firebase/firebaseConfig";
import { signUp, logIn } from "./firebase/authService";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import Loader from "./components/Loader";
import "./CustomToast.css";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {loadingUser ? (
        <Loader initial={true} />
      ) : !user ? (
        <AuthForm handleSignUp={signUp} handleLogIn={logIn} />
      ) : (
        <Home user={user} />
      )}
    </div>
  );
}

export default App;
