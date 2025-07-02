import type { LayoutServerData } from './$types.ts'

export const load: LayoutServerData = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession()
  return {
    session,
    user,
    cookies: cookies.getAll(),
  }
}