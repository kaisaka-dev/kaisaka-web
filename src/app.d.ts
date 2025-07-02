// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from "$lib/types/supabase-types.ts";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>,
			session: Session | null,
			user: User | null,
			safeGetSession: () =>  Promise<{session: Session | null; user: User | null}>,
		}
		interface PageData {
      session: Session | null
    }
	}
}

																										