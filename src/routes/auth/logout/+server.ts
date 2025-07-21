import { json, redirect } from '@sveltejs/kit'

export async function POST({ locals: { supabase } }) {
  const { error } = await supabase.auth.signOut();
  console.log("[Server] Logout");

  if (error) {
    return new Response('Failed to logout', { status: 500 });
  }

  return json({ success: true });
}