import React from 'react';
import Header from '../components/Header';
import Overview from '../components/Overview';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';

function Home() {
  return (
    <div className='home'>
      <Header />
      <Overview />
      <Navbar />
      <PageContainer />
    </div>
  );
}

export default Home;
