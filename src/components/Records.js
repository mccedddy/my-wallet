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
// import upIcon from "../assets/icons/up.svg";
// import midIcon from "../assets/icons/mid.svg";
// import downIcon from "../assets/icons/down.svg";

const Records = ({ user, openCreateWallet }) => {
  const [records, setRecords] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

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
          <p onClick={openCreateWallet} className="text-primary cursor-pointer">
            Create one
          </p>
          <p>.</p>
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
          <div className="flex gap-4">
            <button
              onClick={toggleModal}
              className="h-6 text-sm text-text-dark hover:text-text bg-background"
            >
              ADD RECORD
            </button>
            <button
              onClick={toggleModal}
              className="h-6 text-sm text-text-dark hover:text-text bg-background"
            >
              DELETE RECORD
            </button>
            {/* TODO: Delete record */}
          </div>
          <table className="my-2 w-full text-sm">
            <thead>
              <tr className="h-8">
                <td className="w-24 rounded-lg border-r-4 border-background bg-primary text-background">
                  DATE
                </td>
                {wallets.map((wallet, index) => (
                  <td
                    key={wallet}
                    className={`bg-secondary border-r border-background ${
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
                <td className="w-24 rounded-lg border-l-4 border-background bg-accent text-background">
                  TOTAL
                </td>
              </tr>
              <tr className="h-3"></tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <React.Fragment key={index}>
                  <tr className="h-8 text-center bg-background-light">
                    {/* Upper part: date time, wallet balances, total */}
                    <td className="text-text-dark text-xs pt-2 rounded-t-lg border-r-4 border-background">
                      {record.date}
                    </td>
                    {wallets.map((wallet, index) => (
                      <td
                        key={wallet}
                        className={`border-background border-r border-background ${
                          index === 0
                            ? "rounded-tl-lg"
                            : index === wallets.length - 1
                            ? "rounded-tr-lg"
                            : ""
                        }`}
                      >
                        <div className="flex justify-center items-center gap-1">
                          {/* <img src={upIcon} alt="up" className="w-5 h-5" />
                          <img src={midIcon} alt="up" className="w-5 h-5" />
                          <img src={downIcon} alt="up" className="w-5 h-5" /> */}
                          <h1>₱</h1>
                          {record.wallets[wallet] || "-"}
                        </div>
                      </td>
                    ))}
                    <td
                      className="rounded-lg text-md border-l-4 border-background"
                      rowSpan="2"
                    >
                      <div className="flex justify-center items-center gap-1 ">
                        {/* <img src={upIcon} alt="up" className="w-5 h-5" />
                        <img src={midIcon} alt="up" className="w-5 h-5" />
                        <img src={downIcon} alt="up" className="w-5 h-5" /> */}
                        <h1>₱</h1>
                        {wallets.reduce((acc, wallet) => {
                          const balance = parseFloat(
                            record.wallets[wallet] || 0
                          );
                          return acc + balance;
                        }, 0)}
                      </div>
                    </td>
                  </tr>
                  <tr className="h-8 text-center bg-background-light">
                    {/* Lower part: description */}
                    <td className="text-xs text-text-dark pb-2 rounded-bl-lg border-r-4 border-background rounded-br-lg">
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
          <div className="flex justify-center items-center gap-4 my-4">
            <button
              onClick={handlePrevPage}
              className="w-16 h-6 text-sm bg-secondary rounded disabled:bg-background-light"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-sm text-text">
              Page {currentPage} of {Math.ceil(records.length / recordsPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              className="w-16 h-6 text-sm bg-secondary rounded disabled:bg-background-light"
              disabled={
                currentPage === Math.ceil(records.length / recordsPerPage)
              }
            >
              Next
            </button>
          </div>
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
