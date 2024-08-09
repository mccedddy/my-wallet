import React, { useState } from "react";

const Sidebar = ({ user }) => {
  const [walletName, setWalletName] = useState("");
  const [wallets, setWallets] = useState(["Wallet", "Gcash"]);
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);

  const handleAddWallet = async (e) => {
    e.preventDefault();
    if (walletName && !wallets.includes(walletName)) {
      setWallets([...wallets, walletName]);
      console.log("Added wallet:", walletName);
      setWalletName("");
    }
  };

  const handleDeleteWallet = (walletToDelete) => {
    // Remove wallet
    const updatedWallets = wallets.filter(
      (wallet) => wallet !== walletToDelete
    );
    setWallets(updatedWallets);

    // Remove records
    const updatedRecords = records.filter(
      (record) => record.wallet !== walletToDelete
    );

    setRecords(updatedRecords);
    console.log("Deleted wallet:", walletToDelete);
  };

  const handleAddRecord = () => {
    setRecords([...records, { wallet: "", balance: "" }]);
  };

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Save only unique records
    const uniqueRecords = records.reduce((acc, curr) => {
      acc[curr.wallet] = curr;
      return acc;
    }, {});

    const filteredRecords = Object.values(uniqueRecords);

    setRecords([{ wallet: "", balance: "" }]);

    console.log("Saving records:", filteredRecords);
  };

  return (
    <div className="h-full w-3/12 flex flex-col bg-red-200 py-2 px-4 gap-2">
      <form onSubmit={handleAddWallet} className="flex flex-col gap-1">
        <h1 className="font-bold">WALLETS</h1>
        <ul className="flex flex-col gap-1">
          {wallets.map((wallet) => (
            <div className="flex justify-between">
              <h1 key={wallet} value={wallet}>
                {wallet}
              </h1>
              <button
                type="button"
                onClick={() => handleDeleteWallet(wallet)}
                className="bg-red-500 rounded px-1"
              >
                +
              </button>
            </div>
          ))}
        </ul>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Wallet Name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            required
            className="w-full border rounded px-1"
          />
          <button type="submit" className="bg-red-500 rounded px-1">
            +
          </button>
        </div>
      </form>

      <form onSubmit={handleSave} className="flex flex-col gap-1">
        <h1 className="font-bold">RECORD</h1>
        {records.map((record, index) => (
          <div key={index} className="flex gap-1 items-center">
            <select
              className="border rounded"
              value={record.wallet}
              onChange={(e) =>
                handleRecordChange(index, "wallet", e.target.value)
              }
              required
            >
              <option value="" disabled>
                Select
              </option>
              {wallets.map((wallet) => (
                <option key={wallet} value={wallet}>
                  {wallet}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Balance"
              value={record.balance}
              onChange={(e) =>
                handleRecordChange(index, "balance", e.target.value)
              }
              required
              className="w-full border rounded px-1"
            />
            {records.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteRecord(index)}
                className="bg-red-500 rounded px-1"
              >
                +
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleAddRecord}
            className="w-5/12 px-1 rounded bg-red-500"
          >
            +
          </button>
          <button type="submit" className="w-full rounded px-1 bg-red-500">
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sidebar;
