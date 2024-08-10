import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Records from "./Records";

const Home = ({ user }) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="h-full w-full flex bg-red-100">
      <Sidebar user={user} onUpdate={triggerRefresh} />
      <div className="h-full w-full flex flex-col items-center">
        <div className="w-10/12 flex flex-col">
          <div className="flex mt-8 mb-4 text-center font-bold gap-2">
            <button className="border-b-2 border-black">RECORDS</button>
            <button className="border-black">GRAPH</button>
          </div>
          <Records user={user} refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default Home;
