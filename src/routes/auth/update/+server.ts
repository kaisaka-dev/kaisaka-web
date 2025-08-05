import { supabase } from '$lib/types/supabase.js';
import { json, redirect } from '@sveltejs/kit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST({ request, locals }) {
  console.log('[Server] Login Hit')
  if(!locals.user){
    throw redirect(302, '/')
  }

  try {
    const body = await request.json();
    const current_profile = locals.profile

    const {username, email, password} = body
    console.log(current_profile)
    // Create user in Supabase Auth

    if (!username && !email && !password) {
      const err_missing_requirements = 'User, Email, or Password is required'
      return json({ error: err_missing_requirements}, { status: 400, statusText: err_missing_requirements} )
    }

    if(username !== current_profile.accountName){
        const { data: existingUser } = await supabase.from('user_profiles').select('*').eq('username', username);

        if (existingUser.length !== 0) {
            return json(
                { error: 'Username is already taken.' },
                { status: 400, statusText: 'Username is already taken.' }
            );
        }
    }

    if(email !== current_profile.email){
        if (!isValidEmail(email)) {
        return json(
            { error: 'Email format is invalid.' },
            { status: 400, statusText: 'Email format is invalid.' }
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
    }

    const { data, error } = await supabase.auth.admin.updateUserById( current_profile.id, { 
      email: email,
      password: password,
      user_metadata: {
        username: username
      }
    });

    console.log('[Server] Auth Update Result:', data, error?.message)

    if (error) {
      return json(
        { error: error.message },
        { status: 400, statusText: error.message }
      );
    }

    if(username){
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ username: username }) // Fields to update
        .eq('user_id', current_profile.id); // Match condition

      if (error) {
        console.error('Error updating user:', error);
      } else {
        console.log('Updated user:', data);
      }
    }
    return json({ success: true });

  } catch (error) {
    console.error('User Update error:', error);
    return json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}