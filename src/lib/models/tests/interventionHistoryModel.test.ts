import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterventionHistoryModel } from '$lib/models/interventionHistoryModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('InterventionModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sample = {
        id: 
    };


    // Create methods


    //
    it




    // Read methods

    //
    it




    // Update methods

    //
    it
});