import React from 'react';
import Header from '../components/Header';
import Overview from '../components/Overview';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';

import { useSelector, useDispatch } from "react-redux";
import { toggleOverview } from "../reducers/globalSlice";

function Home() {
  const dispatch = useDispatch();
  const overviewShown = useSelector((state: any) => state.global.overviewShown);

  return (
    <div className='home'>
      <Header />

      {overviewShown && <Overview /> }
      <Navbar />
      <PageContainer />
    </div>
  );
}

export default Home;
