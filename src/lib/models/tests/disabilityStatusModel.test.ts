import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DisabilityStatusModel } from '$lib/models/disabilityStatusModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('DisabilitiesModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleDisability = {
        id: 11000000,
        disability_id: 10000000,
        disability_nature: 'Disability Nature',
        child_id: 'uuid-child-id',
    };


    // Create methods


    it



    // Read methods

    it




    // Update methods

    it




    // Delete methods
});