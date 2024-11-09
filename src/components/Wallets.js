import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayRemove,
  deleteField,
  query,
  orderBy,
  limit,
  getDocs,
  collection,
} from "firebase/firestore";
import Modal from "./Modal";
import { toastSuccess, toastError } from "../toastUtils";
import DeleteIcon from "../assets/icons/trashRed.svg";
import WalletIcon from "../assets/icons/wallet.svg";
import EditIcon from "../assets/icons/pencil.svg";
import { useSelector } from "react-redux";

const Wallets = () => {
  const user = useSelector((state) => state.user.value);
  const wallets = useSelector((state) => state.wallet.wallets);

  const [latestBalances, setLatestBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modify, setModify] = useState(null);

  // Fetch latest balances
  useEffect(() => {
    const fetchLatestRecord = async () => {
      try {
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );
        const latestRecordQuery = query(
          recordsCollectionRef,
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(latestRecordQuery);

        if (!snapshot.empty) {
          const latestRecordData = snapshot.docs[0].data();
          const { timestamp, description, id, ...walletBalances } =
            latestRecordData;

          setLatestBalances(walletBalances);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data: ", error);
        setLoading(false);
      }
    };

    fetchLatestRecord();
  }, [user]);

  const handleEditWallet = async (walletToEdit) => {
    toastSuccess(`Edit wallet: ${walletToEdit}`);
    // TODO
  };

  const handleDeleteWallet = async (walletToDelete) => {
    try {
      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, {
        wallets: arrayRemove(walletToDelete),
      });

      // Remove the wallet field from the latest document
      try {
        const recordRef = doc(db, "users", user.email, "records", "latest");
        await updateDoc(recordRef, {
          [walletToDelete]: deleteField(),
        });
        toastSuccess(
          `'${walletToDelete}' wallet and records deleted successfully`
        );
      } catch (error) {
        toastSuccess(`'${walletToDelete}' wallet deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting wallet: ", error);
      toastError(`Error deleting wallet: ${error}`);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModify = (type) => {
    type === modify ? setModify(null) : setModify(type);
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
        </div>
      ) : (
        <div className="w-full">
          <div className="flex gap-4">
            <button
              onClick={toggleModal}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              ADD WALLET
            </button>
            <button
              onClick={() => toggleModify("edit")}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              EDIT WALLET
            </button>
            <button
              onClick={() => toggleModify("delete")}
              className="h-6 text-xs sm:text-sm text-text-dark hover:text-text bg-background"
            >
              DELETE WALLET
            </button>
          </div>
          <div className="w-full my-2 flex flex-col gap-2">
            {wallets.map((wallet, index) => (
              <div
                className="h-16 p-4 w-full flex justify-between items-center text-center bg-background-light rounded-lg"
                key={index}
              >
                <div className="flex gap-4 items-center justify-center">
                  <img src={WalletIcon} alt="wallet" className="h-8 w-8" />
                  <div className="flex flex-col items-start">
                    <h1 className="">{wallet}</h1>
                    <h1 className="text-xs text-text-dark">
                      Current Balance: ₱ {latestBalances[wallet] || 0}
                    </h1>
                  </div>
                </div>
                <div
                  onClick={() =>
                    modify === "edit"
                      ? handleEditWallet(wallet)
                      : handleDeleteWallet(wallet)
                  }
                  className={`align-center cursor-pointer bg-background-light text-text-dark justify-center py-2 font-bold rounded-lg ${
                    modify ? "" : "hidden"
                  }`}
                >
                  <img
                    src={modify === "edit" ? EditIcon : DeleteIcon}
                    alt="modify"
                    className="h-5 w-full flex justify-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          user={user}
          toggleModal={toggleModal}
          wallets={wallets}
          type="addWallet"
        />
      )}
    </div>
  );
};

export default Wallets;
