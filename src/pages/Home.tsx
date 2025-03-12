import React from 'react';
import Header from '../components/Header';
import Overview from '../components/Overview';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className='home'>
      <Header />
      <Overview />
      <Navbar />
    </div>
  );
}

export default Home;
