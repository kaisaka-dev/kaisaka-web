import { login } from "$lib/server/auth-actions.js"
import { redirect, type Actions} from "@sveltejs/kit"
import type { PageServerLoad} from '../../.svelte-kit/types/src/routes/$types.js';

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    console.log('[Server] Login Hit')
    
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    console.log('[Server] Looking for: ', email)
  
    
    if (!email) return redirect(303, `/?error=${encodeURIComponent('Email is required')}`)
    
    if (!password) return redirect(303, `/?error=${encodeURIComponent('Password is required')}`)
    
    console.log('Signing...')
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email, password: password })
    
    console.log('Supabase', { authError })
  
    if (authError) {
      console.error(authError)
      return redirect(303, `/?error=${encodeURIComponent(`${authError.message}`)}`)
    } else {
      console.log('✅ Login successful:', data.session ? 'Session created' : 'No session')
    
      return redirect(303, '/dashboard')
    }
  }
} satisfies Actions

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/dashboard');
  }

  return {
    error: '',
    ok: false
  };
};