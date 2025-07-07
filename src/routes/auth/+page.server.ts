import type { Actions } from './$types.js'
import { login } from '$lib/server/auth-actions.js'

export const actions: Actions = {
  login: login,
} satisfies Actions