import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceCategoriesModel } from '$lib/models/serviceCategoriesModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('serviceCategoriesModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleCategory = {
        id: 1,
        name: 'Category'
    };

    // insertServiceCategory
    it('insertServiceCategory should return inserted category on success', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleCategory);
        (ServiceCategoriesModel.instance as any).insertOne = mockInsert;

        const result = await ServiceCategoriesModel.instance.insertServiceCategory('Category');
        expect(mockInsert).toHaveBeenCalledWith({ name: 'Category' });
        expect(result).toEqual(sampleCategory);
    });

    it('insertServiceCategory should return null on failure', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).insertOne = mockInsert;

        const result = await ServiceCategoriesModel.instance.insertServiceCategory('Category');
        expect(result).toBeNull();
    });

    // getAll
    it('getAll should return list of categories when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCategory]);
        (ServiceCategoriesModel.instance as any).findMany = mockFindMany;

        const result = await ServiceCategoriesModel.instance.getAll();
        expect(result).toEqual([sampleCategory]);
    });

    it('getAll should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).findMany = mockFindMany;

        const result = await ServiceCategoriesModel.instance.getAll();
        expect(result).toBeNull();
    });

    // findById
    it('findById should return category when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleCategory);
        (ServiceCategoriesModel.instance as any).findOne = mockFindOne;

        const result = await ServiceCategoriesModel.instance.findById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(sampleCategory);
    });

    it('findById should return null when not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).findOne = mockFindOne;

        const result = await ServiceCategoriesModel.instance.findById(999);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return list when match found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCategory]);
        (ServiceCategoriesModel.instance as any).findMany = mockFindMany;

        const result = await ServiceCategoriesModel.instance.findByName('Health Support');
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Health Support' });
        expect(result).toEqual([sampleCategory]);
    });

    it('findByName should return null when no matches found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).findMany = mockFindMany;

        const result = await ServiceCategoriesModel.instance.findByName('Unknown');
        expect(result).toBeNull();
    });

    // updateName
    it('updateName should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ServiceCategoriesModel.instance as any).updateOne = mockUpdate;

        const result = await ServiceCategoriesModel.instance.updateName(1, 'New Name');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { name: 'New Name' });
        expect(result).toBe(true);
    });

    it('updateName should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ServiceCategoriesModel.instance as any).updateOne = mockUpdate;

        const result = await ServiceCategoriesModel.instance.updateName(1, 'New Name');
        expect(result).toBe(false);
    });

    // deleteById
    it('deleteById should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue({ id: 1, name: 'Health Support' });
        (ServiceCategoriesModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceCategoriesModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false when no record is deleted', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceCategoriesModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByName
    it('deleteByName should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue({ id: 2, name: 'Education' });
        (ServiceCategoriesModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceCategoriesModel.instance.deleteByName('Education');
        expect(mockDelete).toHaveBeenCalledWith({ name: 'Education' });
        expect(result).toBe(true);
    });

    it('deleteByName should return false when no matching record is found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ServiceCategoriesModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceCategoriesModel.instance.deleteByName('Nonexistent');
        expect(result).toBe(false);
    });
});