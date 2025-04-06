import { supabase } from './supabaseClient';

export const fetchWallets = async (userId: string) => {
  const { data: walletsData, error: walletsError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true });

  if (walletsError) {
    console.error("Error fetching wallets:", walletsError.message);
    return [];
  }

  return walletsData;
};

export const fetchRecords = async (userId: string) => {
  const { data: recordsData, error: recordsError } = await supabase
    .from('records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); 

  if (recordsError) {
    console.error("Error fetching records:", recordsError.message);
    return [];
  }

  return recordsData;
};