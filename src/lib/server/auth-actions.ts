import { fail, redirect, type Action } from "@sveltejs/kit"


export const login: Action = async ({ request, locals: { supabase } }) => {
    console.log('[Server] Login Hit')

    
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    console.log('[Server] Looking for: ', email)


    if (!email) return fail(400, { error: 'Email is required', email: email })
    
    if (!password) return fail(400, { error: 'Password is required', password: password })
    
    console.log('Signing...')
    
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
    
    console.log('Supabase', { data, error })

    if (error) {
      console.error(error)
      return fail(400, { error: error.message })
    } else {
      
      console.log('✅ Login successful:', data.session ? 'Session created' : 'No session')


      redirect(303, '/dashboard')
      return { success: true }
    }
  } 