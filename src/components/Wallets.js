import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import Modal from "./Modal";

const Wallets = ({ user }) => {
  const [wallets, setWallets] = useState([]);
  const [latestBalances, setLatestBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fetch wallet names and latest balances
  useEffect(() => {
    if (user?.email) {
      const fetchWalletData = async () => {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setWallets(data.wallets || []);
        }

        const latestDocRef = doc(db, "users", user.email, "records", "latest");
        const latestDocSnap = await getDoc(latestDocRef);
        if (latestDocSnap.exists()) {
          setLatestBalances(latestDocSnap.data());
        }

        setLoading(false);
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
      console.log("Deleted wallet:", walletToDelete);
      triggerRefresh();

      // Remove the wallet field from the latest document
      const recordRef = doc(db, "users", user.email, "records", "latest");
      await updateDoc(recordRef, {
        [walletToDelete]: deleteField(),
      });

      triggerRefresh();
    } catch (error) {
      console.error("Error deleting wallet: ", error);
    }
  };

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
          <p onClick={toggleModal} className="text-customBlue cursor-pointer">
            Create one
          </p>
          .
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={toggleModal}
            className="h-6 px-2 text-xs bg-customBlue rounded"
          >
            ADD WALLET
          </button>
          <table className="my-2 w-full text-sm">
            <thead>
              <tr>
                <th className="w-24">WALLET NAME</th>
                <th className="w-24">CURRENT BALANCE</th>
                <th className="w-2">D</th>
              </tr>
              <tr className="h-2"></tr>
            </thead>
            <tbody>
              {wallets.map((wallet, index) => (
                <React.Fragment key={index}>
                  <tr className="text-center">
                    <td>{wallet}</td>
                    <td>{latestBalances[wallet] || 0}</td>
                    <td
                      onClick={() => handleDeleteWallet(wallet)}
                      className="cursor-pointer text-customBlack-lighter font-bold"
                    >
                      D
                    </td>
                  </tr>
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
          type="addWallet"
        />
      )}
    </div>
  );
};

export default Wallets;