import { describe, it, expect, vi, beforeEach } from 'vitest';
import { philhealthIdsModel } from '$lib/models/philhealthIdsModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('philhealthIdsModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const samplePhilhealthId = {
        id: 'uuid-philhealth',
        exp_date: '2035-03-01T00:00:00Z',
        philhealth_id: 12345678
    };


    // Create methods

    // insertPhilhealthId
    it('insertPhilhealthId should create and return a new Philhealth ID record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(samplePhilhealthId);
        (philhealthIdsModel.instance as any).insertOne = mockInsert;

        const result = await philhealthIdsModel.instance.insertPhilhealthId(
            12345678,
            '2035-03-01T00:00:00Z'
        );
        expect(result).toEqual(samplePhilhealthId);
    });

    it('insertPhilhealthId should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (philhealthIdsModel.instance as any).insertOne = mockInsert;

        const result = await philhealthIdsModel.instance.insertPhilhealthId(
            12345678,
            '2035-03-01T00:00:00Z'
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findByPhilhealthId
    it('findByPhilhealthId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(samplePhilhealthId);
        (philhealthIdsModel.instance as any).findMany = mockFindMany;

        const result = await philhealthIdsModel.instance.findByPhilhealthId(12345678);
        expect(result).toEqual(samplePhilhealthId);
    });

    it('findByPhilhealthId should return null when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (philhealthIdsModel.instance as any).findMany = mockFindMany;

        const result = await philhealthIdsModel.instance.findByPhilhealthId(12345678);
        expect(result).toBeNull();
    });


    // findByExpDate
    it('findByExpDate should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([samplePhilhealthId]);
        (philhealthIdsModel.instance as any).findMany = mockFindMany;

        const result = await philhealthIdsModel.instance.findByExpDate('2035-03-01T00:00:00Z');
        expect(result).toEqual([samplePhilhealthId]);
    });

    it('findByExpDate should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (philhealthIdsModel.instance as any).findMany = mockFindMany;

        const result = await philhealthIdsModel.instance.findByExpDate('2035-03-01T00:00:00Z');
        expect(result).toEqual([]);
    });

    it('findByExpDate should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (philhealthIdsModel.instance as any).findMany = mockFindMany;

        const result = await philhealthIdsModel.instance.findByExpDate('2035-03-01T00:00:00Z');
        expect(result).toBeNull();
    });




    // Update methods

    // updatePhilhealthId
    it('updatePhilhealthId should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updatePhilhealthId('uuid-philhealth', 12345679);
        expect(result).toBe(true);
    });

    it('updatePhilhealthId should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updatePhilhealthId('uuid-philhealth', 12345679);
        expect(result).toBe(false);
    });

    // updateExpDate
    it('updateExpDate should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updateExpDate('uuid-philhealth', '2035-03-01T00:00:00Z');
        expect(result).toBe(true);
    });

    it('updateExpDate should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updateExpDate('uuid-philhealth', '2035-03-01T00:00:00Z');
        expect(result).toBe(false);
    });

    // updatePhilhealthRecord
    it('updatePhilhealthRecord should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updatePhilhealthRecord('uuid-philhealth', 12345679, '2035-03-01T00:00:00Z');
        expect(result).toBe(true);
    });

    it('updatePhilhealthRecord should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (philhealthIdsModel.instance as any).updateOne = mockUpdate;

        const result = await philhealthIdsModel.instance.updatePhilhealthRecord('uuid-philhealth', 12345679, '2035-03-01T00:00:00Z');
        expect(result).toBe(false);
    });

});