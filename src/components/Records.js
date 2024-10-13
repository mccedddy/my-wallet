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
import DateIcon from "./DateIcon";
import Loader from "./Loader";
import { toastSuccess, toastError } from "../toastUtils";
import trashRedIcon from "../assets/icons/trashRed.svg";

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
    return <Loader />;
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
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              ADD RECORD
            </button>
            <button
              onClick={toggleShowDelete}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              DELETE RECORD
            </button>
          </div>
          <table className="my-2 w-full text-xs sm:text-sm bg-background-light rounded-lg">
            <thead>
              <tr className="h-10">
                <td className="w-16">DATE</td>
                {wallets.map((wallet, index) => (
                  <td key={wallet}>{wallet.toUpperCase()}</td>
                ))}
                <td className="w-24">TOTAL</td>
                <td
                  className={`w-12 bg-background-light rounded-lg ${
                    showDelete ? "" : "hidden"
                  }`}
                ></td>
              </tr>
              <tr className="border-t-2 border-background"></tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => {
                const globalIndex = (currentPage - 1) * recordsPerPage + index;
                const previousRecord = records[globalIndex + 1] || {};

                const currentTotal = wallets.reduce((acc, wallet) => {
                  const balance = parseFloat(record.wallets[wallet] || 0);
                  return acc + balance;
                }, 0);

                const previousTotal = wallets.reduce((acc, wallet) => {
                  const prevBalance = parseFloat(
                    previousRecord.wallets?.[wallet] || 0
                  );
                  return acc + prevBalance;
                }, 0);

                const totalDiff = currentTotal - previousTotal;
                const totalDiffText =
                  totalDiff > 0
                    ? `(+${totalDiff.toFixed(0)})`
                    : totalDiff < 0
                    ? `(${totalDiff.toFixed(0)})`
                    : "(+0)";

                const totalDiffColor =
                  totalDiff > 0
                    ? "text-primary"
                    : totalDiff < 0
                    ? "text-accent"
                    : "text-text-dark";

                return (
                  <React.Fragment key={index}>
                    <tr className="h-8 text-center">
                      {/* Upper part: date, wallet balances, total */}
                      <td className="text-xs" rowSpan={2}>
                        <DateIcon
                          date={record.date}
                          index={index}
                          setHoveredRecord={setHoveredRecord}
                        />
                      </td>
                      {wallets.map((wallet) => (
                        <td key={wallet}>
                          <div className="flex justify-center items-center gap-1">
                            <h1>₱</h1>
                            {record.wallets[wallet]}
                          </div>
                        </td>
                      ))}
                      <td className="text-md">
                        <div className="flex justify-center items-center gap-1">
                          <h1>₱</h1>
                          {currentTotal.toFixed(0)}
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
                      {/* Lower part: description and change*/}
                      <td
                        colSpan={wallets.length}
                        className="text-left text-text-dark px-2 text-xs"
                      >
                        {hoveredRecord === index
                          ? `${record.date} | ${record.time}`
                          : record.description}
                      </td>
                      <td>
                        <span className={`text-xs ${totalDiffColor}`}>
                          {totalDiffText}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b-2 border-background"></tr>
                  </React.Fragment>
                );
              })}
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
            <span className="text-sm text-text">{`Page ${currentPage} of ${Math.ceil(
              records.length / recordsPerPage
            )}`}</span>
            <button
              onClick={handleNextPage}
              className="w-16 h-6 text-sm bg-secondary rounded disabled:bg-background-light"
              disabled={indexOfLastRecord >= records.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
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
