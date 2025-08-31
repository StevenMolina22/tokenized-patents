// utils/utils.js
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =========================
// Función: crear usuario
// =========================
export async function createUser(user) {
  // user = { wallet_address, profile_name, user_type }
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select(); // select() devuelve los datos insertados
  if (error) throw error;
  return data;
}

// =========================
// Función: obtener usuario por wallet
// =========================
export async function getUserByWallet(wallet_address) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', wallet_address);
  if (error) throw error;
  return data;
}

// =========================
// Función: crear propuesta (invención)
// =========================
export async function createProposal(proposal) {
  // proposal = { inventor_id, title, encrypted_abstract_cid, status, patent_nft_token_id }
  const { data, error } = await supabase
    .from('inventions')
    .insert([proposal])
    .select();
  if (error) throw error;
  return data;
}

// =========================
// Función: obtener propuestas de un inventor
// =========================
export async function getProposalsByInventor(inventor_id) {
  const { data, error } = await supabase
    .from('inventions')
    .select('*')
    .eq('inventor_id', inventor_id);
  if (error) throw error;
  return data;
}
