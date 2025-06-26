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

describe('DisabilityStatusModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleDisabilityStatus = {
        id: 11000000,
        disability_id: 10000000,
        disability_nature: 'Disability Nature',
        date_created: '2025-01-01T00:00:00Z',
        last_updated: '2025-01-01T00:00:00Z',
        child_id: 'uuid-child-id',
    };


    // Create methods

    // insertDisabilityStatus
    it('insertDisabilityStatus should create and return a new disability status record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleDisabilityStatus);
        (DisabilityStatusModel.instance as any).insertOne = mockInsert;

        const result = await DisabilityStatusModel.instance.insertDisabilityStatus(
            'uuid-child-id',
            10000000,
            'Disability Nature'
        );
        expect(result).toEqual(sampleDisabilityStatus);
    });

    it('insertDisabilityStatus should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (DisabilityStatusModel.instance as any).insertOne = mockInsert;

        const result = await DisabilityStatusModel.instance.insertDisabilityStatus(
            'uuid-child-id',
            10000000,
            'Disability Nature'
        );
        expect(result).toBeNull();
    });


    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleDisabilityStatus);
        (DisabilityStatusModel.instance as any).findOne = mockFindOne;

        const result = await DisabilityStatusModel.instance.findById(11000000);
        expect(result).toEqual(sampleDisabilityStatus);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (DisabilityStatusModel.instance as any).findOne = mockFindOne;

        const result = await DisabilityStatusModel.instance.findById(11000000);
        expect(result).toBeNull();
    });


    // findByChildId
    it('findByChildId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleDisabilityStatus]);
        (DisabilityStatusModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toEqual([sampleDisabilityStatus]);
    });

    it('findByChildId should return null when no records are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (DisabilityStatusModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toBeNull();
    });


    // findByDisabilityId
    it('findByDisabilityId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleDisabilityStatus]);
        (DisabilityStatusModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityStatusModel.instance.findByDisabilityId(10000000);
        expect(result).toEqual([sampleDisabilityStatus]);
    });

    it('findByDisabilityId should return null when no records are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (DisabilityStatusModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityStatusModel.instance.findByDisabilityId(10000000);
        expect(result).toBeNull();
    });




    // Update methods

    // updateDisabilityNature
    it('updateDisabilityNature should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (DisabilityStatusModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilityStatusModel.instance.updateDisabilityNature(11000000, 'Updated Nature');
        expect(result).toBe(true);
    });

    it('updateDisabilityNature should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (DisabilityStatusModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilityStatusModel.instance.updateDisabilityNature(11000000, 'Updated Nature');
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (DisabilityStatusModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityStatusModel.instance.deleteById(11000000);
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (DisabilityStatusModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityStatusModel.instance.deleteById(11000000);
        expect(result).toBe(false);
    });

    // deleteByChildId
    it('deleteByChildId should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (DisabilityStatusModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityStatusModel.instance.deleteByChildId('uuid-child-id');
        expect(result).toBe(true);
    });

    it('deleteByChildId should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (DisabilityStatusModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityStatusModel.instance.deleteByChildId('uuid-child-id');
        expect(result).toBe(false);
    });
});