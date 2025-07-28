import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IncomeTypeModel } from '$lib/models/incomeTypeModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('IncomeTypeModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleIncomeType = {
        id: 1,
        name: 'Income Type 1'
    };

    // insertIncomeType
    it('insertIncomeType should insert a new income type', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleIncomeType);
        (IncomeTypeModel.instance as any).insertOne = mockInsert;

        const result = await IncomeTypeModel.instance.insertIncomeType('Income Type 1');
        expect(mockInsert).toHaveBeenCalledWith({ name: 'Income Type 1' });
        expect(result).toEqual(sampleIncomeType);
    });

    it('insertIncomeType should return null on failure', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).insertOne = mockInsert;

        const result = await IncomeTypeModel.instance.insertIncomeType('Income Type 1');
        expect(result).toBeNull();
    })

    // findById
    it('findById should return an income type when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleIncomeType);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.findById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(sampleIncomeType);
    });

    it('findById should return null when not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.findById(999);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return an income type when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleIncomeType);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.findByName('Income Type 1');
        expect(mockFindOne).toHaveBeenCalledWith({ name: 'Income Type 1' });
        expect(result).toEqual(sampleIncomeType);
    });

    it('findByName should return null when not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.findByName('Unknown');
        expect(result).toBeNull();
    });

    // findByNameKeyword
    it('findByNameKeyword should return income types when matches found', async () => {
        const mockData = [
            { sampleIncomeType },
            { id: 2, name: 'Income Type 2' }
        ];

        const mockFindMany = vi.fn().mockResolvedValue(mockData);
        (IncomeTypeModel.instance as any).findMany = mockFindMany;

        const result = await IncomeTypeModel.instance.findByNameKeyword('Income');
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Income' });
        expect(result).toEqual(mockData);
    });

    it('findByNameKeyword should return empty array when no matches are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (IncomeTypeModel.instance as any).findMany = mockFindMany;

        const result = await IncomeTypeModel.instance.findByNameKeyword('Nope');
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Nope' });
        expect(result).toEqual([]);
    });

    // getAll
    it('getAll should return all income types', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleIncomeType]);
        (IncomeTypeModel.instance as any).findMany = mockFindMany;

        const result = await IncomeTypeModel.instance.getAll();
        expect(result).toEqual([sampleIncomeType]);
    })

    it('getAll should return empty array when no records exist', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (IncomeTypeModel.instance as any).findMany = mockFindMany;

        const result = await IncomeTypeModel.instance.getAll();
        expect(result).toEqual([]);
    });

    // updateName
    it('updateName should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (IncomeTypeModel.instance as any).updateOne = mockUpdate;

        const result = await IncomeTypeModel.instance.updateName(1, 'New Income Type');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { name: 'New Income Type' });
        expect(result).toBe(true);
    });

    it('updateName should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (IncomeTypeModel.instance as any).updateOne = mockUpdate;

        const result = await IncomeTypeModel.instance.updateName(1, 'New Income Type');
        expect(result).toBe(false);
    });

    // deleteById
    it('deleteById should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue({ id: 1, name: 'Income Type 1' });
        (IncomeTypeModel.instance as any).deleteOne = mockDelete;

        const result = await IncomeTypeModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false when deletion is not successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).deleteOne = mockDelete;

        const result = await IncomeTypeModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByName
    it('deleteByName should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue({ id: 1, name: 'Income Type 1' });
        (IncomeTypeModel.instance as any).deleteOne = mockDelete;

        const result = await IncomeTypeModel.instance.deleteByName('Income Type 1');
        expect(mockDelete).toHaveBeenCalledWith({ name: 'Income Type 1' });
        expect(result).toBe(true);
    });

    it('deleteByName should return false when deletion is not successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).deleteOne = mockDelete;

        const result = await IncomeTypeModel.instance.deleteByName('Income Type 1');
        expect(result).toBe(false);
    });

    // exists
    it('exists should return true when record exists', async () => {
        const mockFindOne = vi.fn().mockResolvedValue({ id: 1, name: 'Income Type 1' });
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.exists('Income Type 1');
        expect(mockFindOne).toHaveBeenCalledWith({ name: 'Income Type 1' });
        expect(result).toBe(true);
    });

    it('exists should return false when record does not exist', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.exists('Income Type 1');
        expect(result).toBe(false);
    });

    // existsById
    it('existsById should return true when record exists', async () => {
        const mockFindOne = vi.fn().mockResolvedValue({ id: 1, name: 'Income Type 1' });
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.existsById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('existsById should return false when record does not exist', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (IncomeTypeModel.instance as any).findOne = mockFindOne;

        const result = await IncomeTypeModel.instance.existsById(1);
        expect(result).toBe(false);
    });
});