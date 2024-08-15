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
                  hour12: true,
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
          <p onClick={toggleModal} className="text-primary cursor-pointer">
            Create one
          </p>
          <p>.</p>
          {/* TODO: onclick = go to wallets, open modal */}
        </div>
      ) : loadingRecords ? (
        <div className="flex flex-col justify-center items-center">
          <div className="w-6 mt-32 spinner"></div>
        </div>
      ) : !records.length ? (
        <div className="w-full flex">
          <p className="pr-1">No records found.</p>
          <p onClick={toggleModal} className="text-primary cursor-pointer">
            Create one
          </p>
          <p>.</p>
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={toggleModal}
            className="h-6 text-sm text-text-dark hover:text-text bg-background"
          >
            ADD RECORD
          </button>
          <table className="my-2 w-full text-sm">
            <thead>
              <tr className="h-8">
                <td className="w-24 rounded-lg border-r-4 border-background bg-primary text-background">
                  DATE
                </td>
                {wallets.map((wallet, index) => (
                  <td
                    key={wallet}
                    className={`bg-secondary ${
                      index === 0
                        ? "rounded-l-lg"
                        : index === wallets.length - 1
                        ? "rounded-r-lg"
                        : ""
                    }`}
                  >
                    {wallet.toUpperCase()}
                  </td>
                ))}
                <td className="rounded-lg border-l-4 border-background bg-accent text-background">
                  TOTAL
                </td>
              </tr>
              <tr className="h-3"></tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <React.Fragment key={index}>
                  <tr className="h-8 text-center bg-background-light">
                    {/* Upper part: date time, wallet balances, total */}
                    <td className="text-text-dark rounded-t-lg border-r-4 border-background">
                      {record.date}
                    </td>
                    {wallets.map((wallet, index) => (
                      <td
                        key={wallet}
                        className={`border-background ${
                          index === 0
                            ? "rounded-tl-lg"
                            : index === wallets.length - 1
                            ? "rounded-tr-lg"
                            : ""
                        }`}
                      >
                        {record.wallets[wallet] || "-"}
                      </td>
                    ))}
                    <td
                      className="rounded-lg text-md font-bold border-l-4 border-background"
                      rowSpan="2"
                    >
                      {wallets.reduce((acc, wallet) => {
                        const balance = parseFloat(record.wallets[wallet] || 0);
                        return acc + balance;
                      }, 0)}
                    </td>
                  </tr>
                  <tr className="h-8 text-center bg-background-light">
                    {/* Lower part: description */}
                    <td className="text-xs text-text-dark rounded-bl-lg border-r-4 border-background rounded-br-lg">
                      {record.time}
                    </td>
                    <td
                      colSpan={wallets.length}
                      className="text-left text-text-dark px-2 text-xs border-t border-background rounded-b-lg"
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
