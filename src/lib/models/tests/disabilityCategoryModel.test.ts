import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DisabilityCategoryModel } from '$lib/models/disabilityCategoryModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('DisabilityCategoryModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleDisability = {
        id: 1,
        name: 'Disability1'
    };

    // insertDisabilityCategory
    it('insertDisabilityCategory should return created record on success', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleDisability);
        (DisabilityCategoryModel.instance as any).insertOne = mockInsert;

        const result = await DisabilityCategoryModel.instance.insertDisabilityCategory('Disability1');
        expect(result).toEqual(sampleDisability);
    });

    it('insertDisabilityCategory should return null on error', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (DisabilityCategoryModel.instance as any).insertOne = mockInsert;

        const result = await DisabilityCategoryModel.instance.insertDisabilityCategory('dus');
        expect(result).toBeNull();
    });

    // findById
    it('findById should return category when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleDisability);
        (DisabilityCategoryModel.instance as any).findOne = mockFindOne;

        const result = await DisabilityCategoryModel.instance.findById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(sampleDisability);
    });

    it('findById should return null when not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (DisabilityCategoryModel.instance as any).findOne = mockFindOne;

        const result = await DisabilityCategoryModel.instance.findById(-9999);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return category when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleDisability);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.findByName('Disability1');
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Disability1' });
        expect(result).toEqual(sampleDisability);
    });

    it('findByName should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.findByName('dus');
        expect(result).toEqual([]);
    });

    // getAll
    it('getAll should return filtered results when filter is provided', async () => {
        const mockData = [
            { sampleDisability },
            { id: 2, name: 'Disability1' }
        ];

        const mockFindMany = vi.fn().mockResolvedValue(mockData);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.getAll({ name: 'Disability1' });
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Disability1' });
        expect(result).toEqual(mockData);
    });

    it('getAll should return all records when no filter is provided', async () => {
        const mockData = [
            { sampleDisability },
            { id: 2, name: 'Disability2' }
        ];

        const mockFindMany = vi.fn().mockResolvedValue(mockData);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.getAll();
        expect(mockFindMany).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(mockData);
    });

    it('getAll should return an empty array when no records exist', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.getAll();
        expect(result).toEqual([]);
    });

    it('getAll should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (DisabilityCategoryModel.instance as any).findMany = mockFindMany;

        const result = await DisabilityCategoryModel.instance.getAll();
        expect(result).toBeNull();
    });

    // updateName
    it('updateName should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (DisabilityCategoryModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilityCategoryModel.instance.updateName(1, 'Disability2');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { name: 'Disability2' });
        expect(result).toBe(true);
    });

    it('updateName should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (DisabilityCategoryModel.instance as any).updateOne = mockUpdate;

        const result = await DisabilityCategoryModel.instance.updateName(1, 'Disability2');
        expect(result).toBe(false);
    });

    /*
    // deleteById
    it('deleteById should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (DisabilityCategoryModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityCategoryModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false on failure', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (DisabilityCategoryModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityCategoryModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByName
    it('deleteByName should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (DisabilityCategoryModel.instance as any).deleteOne = mockDelete;

        const result = await DisabilityCategoryModel.instance.deleteByName('Disability1');
        expect(mockDelete).toHaveBeenCalledWith({ name: 'Disability1' });
        expect(result).toBe(true);
    });
    */
});