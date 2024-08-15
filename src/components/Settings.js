import React from "react";

const Settings = ({ user, handleLogOut }) => {
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-2">
        <h1>{user.email}</h1>
        <button className="h-8 w-40 my-2 bg-red-900 px-4 rounded">
          CLEAR RECORDS
        </button>
        <button
          onClick={handleLogOut}
          className="h-8 w-28 bg-secondary px-4 rounded"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default Settings;
