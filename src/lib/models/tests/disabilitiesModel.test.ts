import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DisabilitiesModel } from '$lib/models/disabilitiesModel.js';
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
        id: 10000000,
        name: 'Sample Disability'
    };


    // Create methods


    // insertDisability
    it('insertDisability should create and return a new disability record', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleDisability, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await DisabilitiesModel.instance.insertDisability('Sample Disability');
        expect(result).toEqual(sampleDisability);
    });

    it('insertDisability should return null on error', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: new Error('Insert error') })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await DisabilitiesModel.instance.insertDisability('Sample Disability');
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a disability by id', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleDisability);

        (DisabilitiesModel.instance as any).findOne = mockMatch;

        const result = await DisabilitiesModel.instance.findById(10000000);
        expect(result).toEqual(sampleDisability);
    });

    it('findById should return null if no disabilities are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);

        (DisabilitiesModel.instance as any).findOne = mockMatch;

        const result = await DisabilitiesModel.instance.findById(0);
        expect(result).toBeNull();
    });


    // findByName
    it('findByName should return disabilities by name', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleDisability]);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.findByName('Sample Disability');
        expect(result).toEqual([sampleDisability]);
    });

    it('findByName should return empty array if no disabilities found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.findByName('Nonexistent Disability');
        expect(result).toEqual([]);
    });

    it('findByName should return null on error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.findByName('Sample Disability');
        expect(result).toBeNull();
    });

    // getAll
    it('getAll should return all disabilities with no filters', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleDisability]);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.getAll();
        expect(result).toEqual([sampleDisability]);
    });

    it('getAll should return all disabilities matching the filter', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleDisability]);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.getAll({ name: 'Sample Disability' });
        expect(result).toEqual([sampleDisability]);
    });

    it('getAll should return empty array if no disabilities match the filter', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.getAll({ name: 'Nonexistent Disability' });
        expect(result).toEqual([]);
    });

    it('getAll should return null on error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);

        (DisabilitiesModel.instance as any).findMany = mockMatch;

        const result = await DisabilitiesModel.instance.getAll();
        expect(result).toBeNull();
    });




    // Update methods

    // updateName
    it('updateName should return true if update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (DisabilitiesModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilitiesModel.instance.updateName(10000000, 'Updated Disability');
        expect(result).toBe(true);
    });

    it('updateName should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (DisabilitiesModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilitiesModel.instance.updateName(0, 'Updated Disability');
        expect(result).toBe(false);
    });
});