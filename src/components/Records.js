import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import Modal from "./Modal";
import { toastSuccess, toastError } from "../toastUtils";
import trashRedIcon from "../assets/icons/trashRed.svg";
// import upIcon from "../assets/icons/up.svg";
// import midIcon from "../assets/icons/mid.svg";
// import downIcon from "../assets/icons/down.svg";

const Records = ({ user, openCreateWallet }) => {
  const [records, setRecords] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRecord, setHoveredRecord] = useState(null);

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
          const data = doc.data();
          const { timestamp, description, id, ...walletBalances } = data;

          const hasRelevantWallets = Object.keys(walletBalances).some(
            (wallet) => wallets.includes(wallet)
          );

          if (hasRelevantWallets) {
            fetchedRecords.push({
              id: id,
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
        });

        setRecords(fetchedRecords);
        setLoadingRecords(false);
      };

      fetchRecords();
    }
  }, [user, wallets, refresh]);

  const handleDeleteRecord = async (recordId) => {
    try {
      const recordDocRef = doc(
        db,
        "users",
        user.email,
        "records",
        recordId.toString()
      );
      await deleteDoc(recordDocRef);
      triggerRefresh();
      toastSuccess("Deleted record successfully");
    } catch (error) {
      toastError(`Error deleting record: ${error}`);
    }
  };

  // Month display
  const getMonthColor = (dateString) => {
    const month = new Date(dateString).getMonth();
    const monthColors = [
      "bg-red-500 border-red-500", // Jan
      "bg-orange-500 border-orange-500", // Feb
      "bg-yellow-500 border-yellow-500", // Mar
      "bg-green-500 border-green-500", // Apr
      "bg-teal-500 border-teal-500", // May
      "bg-blue-500 border-blue-500", // Jun
      "bg-indigo-500 border-indigo-500", // Jul
      "bg-purple-500 border-purple-500", // Aug
      "bg-pink-500 border-pink-500", // Sep
      "bg-red-700 border-red-700", // Oct
      "bg-orange-700 border-orange-700", // Nov
      "bg-yellow-700 border-yellow-700", // Dec
    ];
    return monthColors[month];
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
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
              onClick={toggleShowDelete}
              className="h-6 text-sm text-text-dark hover:text-text bg-background"
            >
              DELETE RECORD
            </button>
          </div>
          <table className="my-2 w-full text-sm bg-background-light rounded-xl">
            <thead>
              <tr className="h-10">
                <td className="w-16">DATE</td>
                {wallets.map((wallet, index) => (
                  <td key={wallet} className="">
                    {wallet.toUpperCase()}
                  </td>
                ))}
                <td className="w-24">TOTAL</td>
                <td
                  className={`w-12 bg-background-light rounded-xl ${
                    showDelete ? "" : "hidden"
                  }`}
                ></td>
              </tr>
              <tr className="border-t-2 border-background"></tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="h-8 text-center"
                    onMouseEnter={() => setHoveredRecord(index)}
                    onMouseLeave={() => setHoveredRecord(null)}
                  >
                    {/* Upper part: date time, wallet balances, total */}
                    <td className="text-xs" rowSpan={2}>
                      <div
                        className={`w-12 flex flex-col m-1 pt-0 border-2 border-t-0 ${getMonthColor(
                          record.date
                        )} rounded items-center justify-center relative`}
                      >
                        <h1 className="text-xs">
                          {new Date(record.date).toLocaleString("default", {
                            month: "short",
                          })}
                        </h1>
                        <div className="w-full rounded bg-text">
                          <h1 className="text-lg text-background">
                            {new Date(record.date).getDate()}
                          </h1>
                        </div>
                      </div>
                    </td>
                    {wallets.map((wallet) => (
                      <td key={wallet} className="">
                        <div className="flex justify-center items-center gap-1">
                          <h1>₱</h1>
                          {record.wallets[wallet] || "0"}
                        </div>
                      </td>
                    ))}
                    <td className="text-md" rowSpan="2">
                      <div className="flex justify-center items-center gap-1">
                        <h1>₱</h1>
                        {wallets.reduce((acc, wallet) => {
                          const balance = parseFloat(
                            record.wallets[wallet] || 0
                          );
                          return acc + balance;
                        }, 0)}
                      </div>
                    </td>
                    <td
                      onClick={() => handleDeleteRecord(record.id)}
                      className={`align-center cursor-pointer bg-background-light text-text-dark justify-center items-center py-2 font-bold ${
                        showDelete ? "" : "hidden"
                      }`}
                      rowSpan={2}
                    >
                      <img
                        src={trashRedIcon}
                        alt="trash"
                        className="h-5 w-full flex justify-center"
                      />
                    </td>
                  </tr>
                  <tr className="h-8 text-center">
                    {/* Lower part: description */}
                    <td
                      colSpan={wallets.length}
                      className="text-left text-text-dark px-2 text-xs"
                    >
                      {hoveredRecord === index
                        ? `${record.date} | ${record.time}`
                        : record.description}
                    </td>
                  </tr>
                  <tr className="border-b-2 border-background"></tr>
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
