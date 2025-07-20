import { supabase } from '$lib/types/supabase.js';
import { json } from '@sveltejs/kit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function POST({ request }) {
  console.log('[Server] Login Hit')
  try {
    const body = await request.json();

    const {username, email, password} = body
    // Create user in Supabase Auth

    if (!username || !email || !password) {
      const err_missing_requirements = 'User, Email, and Password is required'
      return json({ error: err_missing_requirements}, { status: 400, statusText: err_missing_requirements} )
    }

    const { data: existingUser } = await supabase.from('user_profiles').select('*').eq('username', username);
    console.log(existingUser)

    if (existingUser.length !== 0) {
      return json(
        { error: 'Username is already taken.' },
        { status: 400, statusText: 'Username is already taken.' }
      );
    }

    if (!isValidEmail(email)) {
      return json(
        { error: 'Email format is invalid.' },
        { status: 400 }
      );
    }

    const {data: existingEmail } = await supabase.from('user_profiles').select('*').eq('email',email);
    console.log(existingEmail)

    if (existingEmail.length !== 0) {
      return json(
        { error: 'Email is already taken.' },
        { status: 400, statusText: 'Email is already taken.' }
      );
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
      user_metadata: {
        username
      }
    });

    console.log('[Server] Auth Creation Result:', data, error?.message)

    if (error) {
      return json(
        { error: error.message },
        { status: 400, statusText: error.message }
      );
    }

    return json({
      user: {
        id: data.user.id,
        email: data.user.email,
        username
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}