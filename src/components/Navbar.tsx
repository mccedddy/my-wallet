import React from 'react';
import PlusIcon from '../assets/icons/plus.svg';
import GraphIcon from '../assets/icons/graph.svg';
import RecordIcon from '../assets/icons/note.svg';
import WalletIcon from '../assets/icons/wallet.svg';
import SettingsIcon from '../assets/icons/gear.svg';

function Navbar() {
  return (
    <nav className="navbar">
			<div className="navbar-item">
				<button className='navbar-btn'>
				<img src={GraphIcon} className='navbar-btn-img' alt='Graph Icon' />
				</button>
				<p className='navbar-btn-text'>Graphs</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn'>
				<img src={RecordIcon} className='navbar-btn-img' alt='Record Icon' />
				</button>
				<p className='navbar-btn-text'>Records</p>
			</div>
			<div className="navbar-item hidden"></div>
			<div className="navbar-item add">
				<button className='navbar-btn'>
					<img src={PlusIcon} className='navbar-btn-img' alt='Plus Icon' />
				</button>
				<p className='navbar-btn-text'>Add Record</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn'>
					<img src={WalletIcon} className='navbar-btn-img' alt='Wallet Icon' />
				</button>
				<p className='navbar-btn-text'>Wallets</p>
			</div>
			<div className="navbar-item">
				<button className='navbar-btn'>
				<img src={SettingsIcon} className='navbar-btn-img' alt='Settings Icon' />
				</button>
				<p className='navbar-btn-text'>Settings</p>
			</div>
    </nav>
  );
}

export default Navbar;
