import type { LayoutServerData } from './$types.ts'


export const load: LayoutServerData = async ({ locals, cookies }: LayoutServerData) => {
  const { safeGetSession } = locals
  const { session, user } = await safeGetSession()
  return {
    session: session,
    user: user,
    cookies: cookies.getAll(),
  }
}