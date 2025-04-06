import { supabase } from './supabaseClient';

export const fetchWallets = async (userId: string) => {
  const { data: walletsData, error: walletsError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId);

  if (walletsError) {
    console.error("Error fetching wallets:", walletsError.message);
    return [];
  }

  // Sort wallets by position in ascending order
  const sortedWallets = (walletsData || []).sort((a, b) => a.position - b.position);

  return sortedWallets;
};