import { createLogSidecar, getLogSidecar } from '$lib/server/logging/log-sidecar.js'
import { supabaseAnonKey, supabaseURL } from '$lib/types/supabase.js'
import { createServerClient } from '@supabase/ssr'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

createLogSidecar({
  maxFileSize: '10m',
  maxFiles: '1d',
  logDir: './logs',
  enableSupabaseShipping: true,
  logLevel: 'info',
  compressionEnabled: true
});

export const supabase: Handle = async ({ event, resolve }) => {
  const logger = getLogSidecar();
  const start = Date.now();

  event.locals.supabase = createServerClient(supabaseURL, supabaseAnonKey, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  logger.info('Request received ', {
    method: event.request.method,
    url: event.url.pathname,
    userAgent: event.request.headers.get('user-agent'),
    ip: event.getClientAddress(),
    session_id: event.cookies.get('session')
  });

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const { data: { session }, } = await event.locals.supabase.auth.getSession()
    
    if (!session) return { session: null, user: null }
    
    const { data: { user }, error } = await event.locals.supabase.auth.getUser()
    
    // JWT validation has failed
    if (error) return { session: null, user: null }
    
    return { session, user }
  }
  
  let response: Response | Promise<Response>;

  try {
    response = await resolve(event, {filterSerializedResponseHeaders(name) { return name === 'content-range' || name === 'x-supabase-api-version'} })

    logger.info('Request completed', {
      method: event.request.method,
      url: event.url.pathname,
      status: response.status ?? 'Promise',
      duration: Date.now() - start,
      session_id: event.cookies.get('session')
    });
    
  } catch (error) {
    // Log error
    logger.error('Request failed    ', {
      method: event.request.method,
      url: event.url.pathname,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: Date.now() - start,
      session_id: event.cookies.get('session')
    });
    
    throw error;
  }

  return response;
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  const publicPaths = [
    '/', 
    '/registration/child', 
    `/registration/family-info`, 
    `/sign-up`, 
    `/dashboard/profile`, 
    '/?/login', 
    '/auth/', 
    '/auth/register', 
    '/auth/login'];
  const isPublic = publicPaths.includes(event.url.pathname);
  const isApi = event.url.pathname.startsWith('/api/');

  if (isPublic || isApi) {
    return resolve(event)
  }
  

  if (process.env.NODE_ENV === 'production' && !isPublic && !session) {
    // Not authenticated and accessing a private route
    throw redirect(303, '/');
  }

  return resolve(event)
}


export const profileLoader: Handle = async ({ event, resolve }) => {
  const session = event.locals.session;
  
  if (session?.user) {
    const { data: profile, error } = await event.locals.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (!error) {
      console.log(profile)
      event.locals.profile = {
        id: session.user.id,
        accountName: profile.username,
        email: profile.email,
      };
    } else {
      console.error('[ProfileLoader] Failed to fetch profile', error);
    }
  }

  return resolve(event);
};


export const handle: Handle = sequence(supabase, authGuard, profileLoader)

process.on('SIGTERM', async () => {
  const logger = getLogSidecar();
  await logger.shutdown();
  process.exit(0);
});