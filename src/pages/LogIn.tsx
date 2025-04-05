import React, { useState } from 'react';

function LogIn() {
  const [page, setPage] = useState('login'); // State to toggle between login and signup

  return (
    <div className='login'>
      <div className='login-banner'>
        <h1>My Wallet</h1>
        <h6>Track your wallets</h6>
      </div>
      <div className='page-container login-container'>
        <h2>{page === 'login' ? 'Log In' : 'Sign Up'}</h2>

        <div className='login-form'>
          {page === 'signup' && (
            <>
              <h6>Username</h6>
              <input type="text" placeholder="Username" className='login-input' minLength={3} maxLength={20}/>
            </>
          )}
          <h6>Email</h6>
          <input type="text" placeholder="Email" className='login-input' minLength={3} maxLength={50}/>
          <h6>Password</h6>
          <input type="password" placeholder="Password" className='login-input' minLength={8} maxLength={50} /> 
          <button className='login-button'>
            {page === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          {page === 'login' ? (
            <h6 className='signup-text'>
              Don't have an account? <a onClick={() => setPage('signup')}>Sign Up</a>
            </h6>
          ) : (
            <h6 className='signup-text'>
              Already have an account? <a onClick={() => setPage('login')}>Log In</a>
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogIn;