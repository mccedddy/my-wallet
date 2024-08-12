import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Modal from "./Modal";

const Records = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fetch wallet names
  useEffect(() => {
    if (user?.email) {
      const fetchWalletNames = async () => {
        setLoading(true);
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setWallets(data.wallets || []);
        }
        setLoading(false);
      };

      fetchWalletNames();
    }
  }, [user, refresh]);

  // Fetch records based on wallet names
  useEffect(() => {
    if (user?.email && wallets.length > 0) {
      const fetchRecords = async () => {
        setLoadingRecords(true);
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );

        const recordsQuery = query(
          recordsCollectionRef,
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(recordsQuery);

        const fetchedRecords = [];

        snapshot.forEach((doc) => {
          if (doc.id !== "latest") {
            const data = doc.data();
            const { timestamp, description, ...walletBalances } = data;

            const hasRelevantWallets = Object.keys(walletBalances).some(
              (wallet) => wallets.includes(wallet)
            );

            if (hasRelevantWallets) {
              fetchedRecords.push({
                date: new Date(timestamp).toLocaleDateString(),
                time: new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
                wallets: walletBalances,
                description: description,
              });
            }
          }
        });

        setRecords(fetchedRecords);
        setLoadingRecords(false);
      };

      fetchRecords();
    }
  }, [user, wallets, refresh]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="w-6 mt-32 spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      {!wallets.length ? (
        <div className="w-full flex">
          <p className="pr-1">You have no wallet.</p>
          <p onClick={toggleModal} className="text-red-500 cursor-pointer">
            Create one
          </p>
          .
        </div>
      ) : loadingRecords ? (
        <div className="flex flex-col justify-center items-center">
          <div className="w-6 mt-32 spinner"></div>
        </div>
      ) : !records.length ? (
        <div className="w-full flex">
          <p className="pr-1">No records found.</p>
          <p onClick={toggleModal} className="text-red-500 cursor-pointer">
            Create one
          </p>
          .
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={toggleModal}
            className="h-6 px-2 text-xs bg-red-500 rounded text-white"
          >
            ADD RECORD
          </button>
          <table className="my-2 w-full text-sm">
            <thead>
              <tr>
                <th className="border-b w-24">DATE</th>
                {wallets.map((wallet) => (
                  <th key={wallet} className="border-b">
                    {wallet.toUpperCase()}
                  </th>
                ))}
                <th className="border-b w-24">TOTAL</th>
              </tr>
              <tr className="h-2"></tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <React.Fragment key={index}>
                  <tr className="text-center">
                    {/* Upper part: date time, wallet balances, total */}
                    <td className="border-b">{record.date}</td>
                    {wallets.map((wallet) => (
                      <td key={wallet} className="border-b">
                        {record.wallets[wallet] || "-"}
                      </td>
                    ))}
                    <td className="border-b" rowSpan="2">
                      {wallets.reduce((acc, wallet) => {
                        const balance = parseFloat(record.wallets[wallet] || 0);
                        return acc + balance;
                      }, 0)}
                    </td>
                  </tr>
                  <tr className="text-center">
                    {/* Lower part: description */}
                    <td className="border-b text-xs">{record.time}</td>
                    <td
                      colSpan={wallets.length}
                      className="border-b text-left px-2 text-xs"
                    >
                      {record.description}
                    </td>
                  </tr>
                  <tr className="h-2"></tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          user={user}
          toggleModal={toggleModal}
          wallets={wallets}
          setWallets={setWallets}
          onUpdate={triggerRefresh}
          type="addRecord"
        />
      )}
    </div>
  );
};

export default Records;
