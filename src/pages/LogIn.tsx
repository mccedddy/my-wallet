import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function LogIn() {
  const [page, setPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, 
      },
    });

    if (signUpError) {
      setMessage(signUpError.message);
      return;
    }

    // Insert user data into the custom `users` table
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: signUpData.user?.id, 
          email,
          username,
        },
      ]);

    if (insertError) {
      setMessage(insertError.message);
    } else {
      setMessage('Sign-up successful! Please check your email to confirm your account.');
    }
  };

  const handleLogIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Login successful!');
      window.location.href = '/my-wallet';
    }
  };

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
              <input
                type="text"
                placeholder="Username"
                className='login-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}
          <h6>Email</h6>
          <input
            type="text"
            placeholder="Email"
            className='login-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h6>Password</h6>
          <input
            type="password"
            placeholder="Password"
            className='login-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='login-button'
            onClick={page === 'login' ? handleLogIn : handleSignUp}
          >
            {page === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          {message && <p>{message}</p>}
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