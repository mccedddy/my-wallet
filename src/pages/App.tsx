import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Home from './Home';
import LogIn from './LogIn';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      const { data }: any = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false); 
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return <>{user ? <Home /> : <LogIn />}</>;
}

export default App;