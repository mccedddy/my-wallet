import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";
import DateIcon from "./DateIcon";
import Loader from "./Loader";
import { toastSuccess, toastError } from "../toastUtils";
import DeleteIcon from "../assets/icons/trashRed.svg";
import EditIcon from "../assets/icons/pencil.svg";
import { useSelector, useDispatch } from "react-redux";
import { toggleReRender } from "../reducers/walletSlice";

const Records = ({ openCreateWallet }) => {
  const user = useSelector((state) => state.user.value);
  const wallets = useSelector((state) => state.wallet.wallets);
  const records = useSelector((state) => state.wallet.records);
  const loadingWallets = useSelector((state) => state.wallet.loadingWallets);
  const loadingRecords = useSelector((state) => state.wallet.loadingRecords);

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [modify, setModify] = useState(null);

  const recordsPerPage = 10;

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
      toastSuccess("Deleted record successfully");
      dispatch(toggleReRender());
    } catch (error) {
      toastError(`Error deleting record: ${error}`);
    }
  };

  const handleEditRecord = async (recordId) => {};

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModify = (type) => {
    type === modify ? setModify(null) : setModify(type);
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

  return (
    <div className="h-full w-full flex flex-col items-center">
      {loadingWallets ? (
        <Loader />
      ) : !wallets.length ? (
        <div className="w-full flex">
          <p className="pr-1">You have no wallet.</p>
          <p onClick={openCreateWallet} className="text-primary cursor-pointer">
            Create one
          </p>
          <p>.</p>
        </div>
      ) : loadingRecords ? (
        <Loader />
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
          <div className="flex gap-2">
            <button
              onClick={toggleModal}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              ADD RECORD
            </button>
            <p className="text-text-dark">|</p>
            <button
              onClick={() => toggleModify("edit")}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              EDIT RECORD
            </button>
            <p className="text-text-dark">|</p>
            <button
              onClick={() => toggleModify("delete")}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              DELETE RECORD
            </button>
          </div>

          <div className="w-full flex justify-center items-start mt-2 text-sm">
            {/* Date table */}
            <table className="w-8 text-center">
              <thead>
                <tr>
                  <th className="h-10 bg-background-light rounded px-2">
                    DATE
                  </th>
                </tr>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <>
                    <tr key={index}>
                      <td className="w-12 h-16 bg-background-light rounded">
                        <DateIcon
                          date={record.date}
                          index={index}
                          setHoveredRecord={setHoveredRecord}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            {/* Wallets table */}
            <div className="w-full overflow-x-auto scrollbar-hidden mx-1">
              <table className="whitespace-nowrap w-full">
                <thead>
                  <tr>
                    {wallets.map((wallet, index) => (
                      <th
                        key={wallet}
                        className={`h-10 min-w-16 bg-background-light px-4 ${
                          index === 0
                            ? `rounded-l`
                            : index === wallets.length - 1
                            ? `rounded-r`
                            : ``
                        }`}
                      >
                        {wallet.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record, index) => (
                    <>
                      <tr>
                        {wallets.map((wallet, index) => (
                          <td
                            key={wallet}
                            className={`h-8 min-w-16 bg-background-light px-4 text-center ${
                              index === 0
                                ? `rounded-tl`
                                : index === wallets.length - 1
                                ? `rounded-tr`
                                : ``
                            }`}
                          >
                            ₱ {record.wallets[wallet] || 0}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td
                          colSpan={wallets.length}
                          className="h-8 bg-background-light rounded-b px-4 text-left text-xs text-text-dark"
                        >
                          {hoveredRecord === index
                            ? `${record.date} | ${record.time}`
                            : record.description}
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total table */}
            <table className="lg:w-32 w-24 text-center">
              <thead>
                <tr>
                  <th className="h-10 bg-background-light rounded px-3">
                    TOTAL
                  </th>
                </tr>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => {
                  const globalIndex =
                    (currentPage - 1) * recordsPerPage + index;
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
                    <>
                      <tr key={index}>
                        <td className="h-16 bg-background-light rounded">
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-nowrap">
                              ₱ {currentTotal.toFixed(0)}
                            </p>
                            <p className={`text-xs ${totalDiffColor}`}>
                              {totalDiffText}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>

            {/* Modify table */}
            <table
              className={`w-10 text-center ml-1 mx-0 ${modify ? "" : "hidden"}`}
            >
              <thead>
                <tr>
                  <th className="h-10 bg-background-light rounded"></th>
                </tr>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td
                          onClick={() =>
                            modify === "edit"
                              ? handleEditRecord(record.id)
                              : handleDeleteRecord(record.id)
                          }
                          className="h-16 align-center cursor-pointer bg-background-light justify-center items-center rounded px-3"
                        >
                          <img
                            src={modify === "edit" ? EditIcon : DeleteIcon}
                            alt="trash"
                            className="min-h-5 min-w-5 flex justify-center"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Add record modal */}
      {showModal && <Modal toggleModal={toggleModal} type="addRecord" />}
    </div>
  );
};

export default Records;
