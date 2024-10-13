import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
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
import trashRedIcon from "../assets/icons/trashRed.svg";
import WalletIcon from "../assets/icons/wallet.svg";

const Wallets = ({ user }) => {
  const [wallets, setWallets] = useState([]);
  const [latestBalances, setLatestBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch wallet names and the latest record
  useEffect(() => {
    if (user?.email) {
      const fetchWalletData = async () => {
        try {
          const userDocRef = doc(db, "users", user.email);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setWallets(data.wallets || []);
          }

          // Fetch the latest record
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

      fetchWalletData();
    }
  }, [user, refresh]);

  const handleDeleteWallet = async (walletToDelete) => {
    try {
      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, {
        wallets: arrayRemove(walletToDelete),
      });
      triggerRefresh();

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

      triggerRefresh();
    } catch (error) {
      console.error("Error deleting wallet: ", error);
      toastError(`Error deleting wallet: ${error}`);
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
              onClick={toggleShowDelete}
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
                  onClick={() => handleDeleteWallet(wallet)}
                  className={`align-center cursor-pointer bg-background-light text-text-dark justify-center py-2 font-bold rounded-lg ${
                    showDelete ? "" : "hidden"
                  }`}
                >
                  <img
                    src={trashRedIcon}
                    alt="trash"
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
          setWallets={setWallets}
          onUpdate={triggerRefresh}
          type="addWallet"
        />
      )}
    </div>
  );
};

export default Wallets;
