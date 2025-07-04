import { supabase } from '$lib/types/supabase.js';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
  try {
    const body = await request.json();
    console.log("Body: ")
    console.log(body)
    const {username, email, password} = body
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for demo, remove in production
      user_metadata: {
        username
      }
    });

    if (error) {
      return json(
        { message: error.message },
        { status: 400 }
      );
    }

    // Create user profile in custom table
    const { error: profileError } = await supabase
      .schema('account')
      .from('user_profiles')
      .insert({
        user_id: data.user.id,
        username: username,
        is_active: true
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Optionally delete the auth user if profile creation fails
    }

    // Assign default role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role_id: '8685e227-0b98-45c7-8363-02100d8a18ce' // Your default role ID
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
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