import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CitiesModel } from '$lib/models/citiesModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
    return {
        supabase: {
            from: vi.fn()
        }
    };
});

describe('CitiesModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleCity = {
        id: 10,
        city_name: 'City',
    };

    // Create methods

    // insertCity
    it('insertCity should insert a new city', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleCity, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await CitiesModel.instance.insertCity('City');

        expect(result).toEqual(sampleCity);
    });

    it('insertCity should return null when there are missing required values', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Insert failed: missing required values' } })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await CitiesModel.instance.insertCity('');

        expect(result).toBeNull();
    });




    // Update methods

    // getAll
    it('getAll should return city', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleCity);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.getAll({city_name: 'City'});
        expect(result).toEqual(sampleCity);
    });

    it('getAll should return empty array when no cities are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.getAll({city_name: 'City'});
        expect(result).toEqual([]);
    });

    it('getAll should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.getAll({city_name: 'City'});
        expect(result).toBeNull();
    });

    // findById
    it('findById should return city', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleCity);
        (CitiesModel.instance as any).findOne = mockMatch;

        const result = await CitiesModel.instance.findById(1024);
        expect(result).toEqual(sampleCity);
    });

    it('findById should return null when no cities are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (CitiesModel.instance as any).findOne = mockMatch;

        const result = await CitiesModel.instance.findById(1024);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return city', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleCity);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.findByName('City');
        expect(result).toEqual(sampleCity);
    });

    it('findByName should return empty array when no cities are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.findByName('City');
        expect(result).toEqual([]);
    });

    it('findByName should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (CitiesModel.instance as any).findMany = mockMatch;

        const result = await CitiesModel.instance.findByName('City');
        expect(result).toBeNull();
    });




    // Update methods

    // updateName
    it('updateName should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CitiesModel.instance as any).updateOne = mockUpdate;

        const result = await CitiesModel.instance.updateName(1024, 'Updated');

        expect(result).toBe(true);
    });

    it('updateName should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CitiesModel.instance as any).updateOne = mockUpdate;

        const result = await CitiesModel.instance.updateName(1024, 'Updated');

        expect(result).toBe(false);
    });




    // Delete methods
    /*
    // deleteCity
    it('deleteCity should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (CitiesModel.instance as any).deleteOne = mockDelete;

        const result = await CitiesModel.instance.deleteCity(10);

        expect(result).toBe(true);
    });

    it('deleteCity should return false on unsuccessful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (CitiesModel.instance as any).deleteOne = mockDelete;

        const result = await CitiesModel.instance.deleteCity(11);

        expect(result).toBe(false);
    });
    */
});
