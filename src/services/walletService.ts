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

export const fetchRecords = async (userId: string, startDateFilter: string, endDateFilter: string) => {
  const startDate = `${startDateFilter}T00:00:00`;
  const endDate = `${endDateFilter}T23:59:59`;
  const { data: recordsData, error: recordsError } = await supabase
    .from('records')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lte('created_at', endDate) 
    .order('created_at', { ascending: false }); 

  if (recordsError) {
    console.error("Error fetching records:", recordsError.message);
    return [];
  }

  return recordsData;
};

export const fetchWalletValues = async (recordIds: string[]) => {
  if (recordIds.length === 0) return [];

  const { data: walletValuesData, error: walletValuesError } = await supabase
    .from('wallet_values')
    .select('record_id, wallet_id, value')
    .in('record_id', recordIds);

  if (walletValuesError) {
    console.error("Error fetching wallet values:", walletValuesError.message);
    return [];
  }

  return walletValuesData;
};