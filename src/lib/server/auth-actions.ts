import { redirect, type Action } from "@sveltejs/kit"
import { error } from "@sveltejs/kit"

export const login: Action = async ({ request, locals: { supabase } }) => {
  console.log('[Server] Login Hit')
  
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  console.log('[Server] Looking for: ', email)

  
  if (!email) return redirect(404, `/?error=${encodeURIComponent('Email is required')}`)
  
  if (!password) return redirect(404, `/?error=${encodeURIComponent('Password is required')}`)
  
  console.log('Signing...')
  
  const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email, password: password })
  
  console.log('Supabase', { data, error })

  if (authError) {
    console.error(authError)
    return redirect(404, `/?error=${encodeURIComponent(`${authError.name} ${authError.message} ${authError.cause}`)}`)
  } else {
    console.log('✅ Login successful:', data.session ? 'Session created' : 'No session')
  
    redirect(303, '/dashboard')
  }
} 