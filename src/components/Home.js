import React from "react";
import { logOut } from "../firebase/authService";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Records from "./Records";

const Home = ({ user }) => {
  return (
    <div className="h-auto w-full flex flex-grow bg-red-100">
      <Sidebar user={user} />
      <div className="h-full w-full flex flex-col items-center">
        <Navbar handleLogOut={logOut} />
        <div className="w-11/12 flex flex-col">
          <div className="flex my-4 text-center font-bold gap-2">
            <button className="border-b-2 border-black">RECORDS</button>
            <button className="border-black">G</button>
            <button className="border-black">W</button>
            <button className="border-black">S</button>
          </div>
          <Records user={user} />
        </div>
      </div>
    </div>
  );
};

export default Home;
