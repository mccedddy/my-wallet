import React, { use, useEffect } from 'react';
import Header from '../components/Header';
import Overview from '../components/Overview';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';

import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../reducers/userSlice";
import { setWallets } from "../reducers/walletsSlice";
import { setRecords } from "../reducers/recordsSlice";
import { supabase } from '../services/supabaseClient';
import { fetchWallets, fetchRecords } from '../services/walletService';

function Home() {
  const dispatch = useDispatch();
  const overviewShown = useSelector((state: any) => state.global.overviewShown);
  const navbarShown = useSelector((state: any) => state.global.navbarShown);
  const startDateFilter = useSelector((state: any) => state.global.startDate);
  const endDateFilter = useSelector((state: any) => state.global.endDate);

  useEffect(() => {
    const fetchUser = async () => {
      // Get the user id and email from Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Error fetching user from auth:", authError.message);
        return;
      }

      if (authData?.user) {
        const userId = authData.user.id;
        const userEmail = authData.user.email;

        // Fetch the username from the 'users' table using the user ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('username')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error("Error fetching user from users table:", userError.message);
          return;
        }

        // Update user slice
        dispatch(
          logIn({
            id: userId,
            email: userEmail,
            username: userData?.username || "",
          })
        );
        
        // Fetch wallets and records using the user ID
        dispatch(setWallets(await fetchWallets(userId)));
        dispatch(setRecords(await fetchRecords(userId, startDateFilter, endDateFilter)));
      }
    };

    fetchUser();
  }, [dispatch, startDateFilter, endDateFilter]);

  return (
    <div className='home'>
      <Header />

      {overviewShown && <Overview />}

      {navbarShown && <Navbar />}

      <PageContainer />
    </div>
  );
}

export default Home;