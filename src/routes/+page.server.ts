import { login } from "$lib/server/auth-actions.js"
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
  login: login,
} satisfies Actions