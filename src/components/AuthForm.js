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
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-10/12 md:w-6/12 lg:w-3/12 border border-black flex flex-col justify-center items-center gap-2 py-4 px-6 rounded-lg">
        <h1 className="text-2xl mb-2">{isLogin ? "Log In" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-black rounded py-1 px-2"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-black rounded py-1 px-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-black rounded py-1 px-2"
          />
          <button
            type="submit"
            className="border border-black rounded py-1 px-2 mt-2 bg-red-500"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        {isLogin ? (
          <div className="flex gap-1 mt-2">
            <p className="text-xs">Don't have an account?</p>
            <button onClick={toggleForm} className="underline text-xs">
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex gap-1 mt-2">
            <p className="text-xs">Already have an account?</p>
            <button onClick={toggleForm} className="underline text-xs">
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
