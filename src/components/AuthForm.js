import React, { useState } from "react";

const AuthForm = ({ handleSignUp, handleLogIn }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await handleLogIn(email, password);
      } catch (error) {
        console.error("Log-in error:", error);
      }
    } else {
      try {
        await handleSignUp(username, email, password);
      } catch (error) {
        console.error("Sign-up error:", error);
      }
    }
  };

  return (
    <div>
      <h1>{isLogin ? "Log In" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
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
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
      </form>
      <button onClick={toggleForm}>
        {isLogin ? "Switch to Sign Up" : "Switch to Log In"}
      </button>
    </div>
  );
};

export default AuthForm;
