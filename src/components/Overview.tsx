import React from 'react';

function Overview() {
  return (
    <div className='overview'>
      <div className='overview-total'>
          <h2 className='bold'>Total</h2>
          <h1 className='bold'>P13,000</h1>
      </div>
			<div className='overview-wallets'>
				<div className='wallet'>
					<p>Wallet</p>
					<p>P13,000</p>
				</div>
				<div className='wallet'>
					<p>Wallet</p>
					<p>P13,000</p>
				</div>
				<div className='wallet'>
					<p>Wallet</p>
					<p>P13,000</p>
				</div>
			</div>
			<p>Last Updated: 11/03/2025</p>
    </div>
  );
}

export default Overview;
