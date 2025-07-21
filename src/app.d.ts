// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from "$lib/types/supabase-types.ts";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

export type safeGetSessionType = () =>  Promise<{session: Session | null; user: User | null}>

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>,
			session: Session | null,
			user: User | null,
			safeGetSession: safeGetSessionType,
			profile: Record<string, any> | null
		}
		interface PageData {
      session: Session | null
    }
	}
}

																										