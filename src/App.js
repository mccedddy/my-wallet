import React, { useEffect } from "react";
import { db, auth } from "./firebase/firebaseConfig";
import { signUp, logIn } from "./firebase/authService";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import Loader from "./components/Loader";
import "./CustomToast.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "./reducers/userSlice";
import { setUserName, setUserEmail } from "./reducers/userSlice";

function App() {
  const user = useSelector((state) => state.user.value);
  const loadingUser = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        dispatch(setUserEmail(user.email));

        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          dispatch(setUserName(data.username || "Guest"));
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      console.log(user);
      if (user) {
        fetchUserData();
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [user, dispatch]);

  return (
    <div className="App">
      <ToastContainer />
      {loadingUser ? (
        <Loader initial={true} />
      ) : !user ? (
        <AuthForm handleSignUp={signUp} handleLogIn={logIn} />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;
