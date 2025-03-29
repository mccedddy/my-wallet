import React from 'react';
import PlusIcon from '../assets/icons/plus.svg';
import GraphIcon from '../assets/icons/graph.svg';
import RecordIcon from '../assets/icons/note.svg';
import WalletIcon from '../assets/icons/wallet.svg';
import SettingsIcon from '../assets/icons/gear.svg';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";
import { current } from '@reduxjs/toolkit';

function Navbar() {
	const dispatch = useDispatch();
	const currentPage = useSelector((state: any) => state.global.currentPage);
	const currentAdd = currentPage == 'Wallets' ? 'Add Wallet' : 'Add Record';
	
  return (
    <nav className="navbar">
			<div className="navbar-item">
				<button className='navbar-btn' onClick={() => {dispatch(setCurrentPage('Graphs'))}}>
				  <img src={GraphIcon} className='navbar-btn-img' alt='Graph Icon' />
				</button>
				<p className='navbar-btn-text'>Graphs</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn' onClick={() => {dispatch(setCurrentPage('Records'))}}>
				  <img src={RecordIcon} className='navbar-btn-img' alt='Record Icon' />
				</button>
				<p className='navbar-btn-text'>Records</p>
			</div>
			<div className="navbar-item hidden"></div>
			<div className="navbar-item add">
				<button className='navbar-btn' onClick={() => {dispatch(setCurrentPage(currentAdd))}}>
					<img src={PlusIcon} className='navbar-btn-img' alt='Plus Icon' />
				</button>
				<p className='navbar-btn-text'>{currentAdd}</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn' onClick={() => {dispatch(setCurrentPage('Wallets'))}}>
					<img src={WalletIcon} className='navbar-btn-img' alt='Wallet Icon' />
				</button>
				<p className='navbar-btn-text'>Wallets</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn' onClick={() => {dispatch(setCurrentPage('Settings'))}}>
				  <img src={SettingsIcon} className='navbar-btn-img' alt='Settings Icon' />
				</button>
				<p className='navbar-btn-text'>Settings</p>
			</div>
    </nav>
  );
}

export default Navbar;
