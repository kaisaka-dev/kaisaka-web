import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StreetsModel } from '$lib/models/streetsModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
    return {
        supabase: {
            from: vi.fn()
        }
    };
});

describe('StreetsModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleStreet = {
        id: 1024,
        street: 'Hop Avenue',
        barangay_id: null,
    };

    // Create methods

    // insertStreet
    it('insertStreet should insert a new street', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleStreet, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await StreetsModel.instance.insertStreet(null, 'Hop Avenue');

        expect(result).toEqual(sampleStreet);
    });

    it('insertStreet should return null when there are missing required values', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Insert failed: missing required values' } })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await StreetsModel.instance.insertStreet(null, '');

        expect(result).toBeNull();
    });




    // Update methods

    // findById
    it('findById should return barangay by city', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleStreet);
        (StreetsModel.instance as any).findOne = mockMatch;

        const result = await StreetsModel.instance.findById(1024);
        expect(result).toEqual(sampleStreet);
    });

    it('findById should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (StreetsModel.instance as any).findOne = mockMatch;

        const result = await StreetsModel.instance.findById(1024);
        expect(result).toBeNull();
    });

    // findByStreet
    it('findByStreet should return streets by street name', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleStreet]);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByStreet('25 Hop Avenue');
        expect(result).toEqual([sampleStreet]);
    });

    it('findByStreet should return empty array when no streets are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByStreet('NonExistent Street');
        expect(result).toEqual([]);
    });

    it('findByStreet should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByStreet('25 Hop Avenue');
        expect(result).toBeNull();
    });


    //findByBarangayId
    it('findByBarangayId should return streets by barangay id', async () =>
    {
        const mockMatch = vi.fn().mockResolvedValue([sampleStreet]);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByBarangayId(1);
        expect(result).toEqual([sampleStreet]);
    });

    it('findByBarangayId should return empty array when no streets are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByBarangayId(999);
        expect(result).toEqual([]);
    });

    it('findByBarangayId should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (StreetsModel.instance as any).findMany = mockMatch;

        const result = await StreetsModel.instance.findByBarangayId(1);
        expect(result).toBeNull();
    });




    // Update methods

    // updateStreet
    it('updateStreet should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (StreetsModel.instance as any).updateOne = mockUpdate;

        const result = await StreetsModel.instance.updateStreet(1024, 'Updated');

        expect(result).toBe(true);
    });

    it('updateStreet should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (StreetsModel.instance as any).updateOne = mockUpdate;

        const result = await StreetsModel.instance.updateStreet(1024, 'Updated');

        expect(result).toBe(false);
    });


    // updateBarangay
    it('updateBarangay should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (StreetsModel.instance as any).updateOne = mockUpdate;

        const result = await StreetsModel.instance.updateBarangay(1024, 2048);

        expect(result).toBe(true);
    });

    it('updateBarangay should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (StreetsModel.instance as any).updateOne = mockUpdate;

        const result = await StreetsModel.instance.updateBarangay(1024, 2048);

        expect(result).toBe(false);
    });




    // Delete methods
    /*
    // deleteStreet
    it('deleteStreet should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (StreetsModel.instance as any).deleteOne = mockDelete;

        const result = await StreetsModel.instance.deleteStreet(1024);

        expect(result).toBe(true);
    });

    it('deleteStreet should return false on unsuccessful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (StreetsModel.instance as any).deleteOne = mockDelete;

        const result = await StreetsModel.instance.deleteStreet(1024);

        expect(result).toBe(false);
    });
    */
});
