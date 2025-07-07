import { redirect } from '@sveltejs/kit'

export async function POST({ locals: { supabase } }) {
  await supabase.auth.signOut()
  console.log("[Server] Logout")
  throw redirect(302, '/')
}