import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase.js';

export async function POST({ request, cookies }) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for demo, remove in production
      user_metadata: {
        firstName,
        lastName
      }
    });

    if (error) {
      return json(
        { message: error.message },
        { status: 400 }
      );
    }

    // Create user profile in custom table
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        is_active: true
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Optionally delete the auth user if profile creation fails
    }

    // Assign default role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role_id: 'default-role-uuid' // Your default role ID
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
    }

    return json({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName
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