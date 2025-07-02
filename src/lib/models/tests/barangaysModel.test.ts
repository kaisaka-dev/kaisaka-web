import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BarangayModel } from '$lib/models/barangaysModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
    return {
        supabase: {
            from: vi.fn()
        }
    };
});

describe('BarangayModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleBarangay = {
        id: 1,
        name: 'Test',
        num: '1234567890',
        city_id: 10
    };

    // Create methods
    

    //insertBarangay
    it('insertBarangay should insert a barangay', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleBarangay, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await BarangayModel.instance.insertBarangay('Test', 10, '1234567890');

        expect(result).toEqual(sampleBarangay);
    });

    
    it('insertBarangay should return null when there are missing required values', async () => {
        const mockInsert = vi.fn().mockReturnValue({
                select: () => ({
                    single: () => Promise.resolve({ data: null, error: { message: 'Insert failed: missing required values' } })
                })
            });
    
            (supabase.from as any).mockReturnValue({
                insert: mockInsert
            });
    
            const result = await BarangayModel.instance.insertBarangay('Test', 10, '1234567890');
    
            expect(result).toBeNull();
    });



    //Read


    //findByName
    it('findByName should return barangay by name', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleBarangay], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByName('Test');
        expect(result).toEqual([sampleBarangay]);
    });

    it('findByName should return null when no barangays are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: { message: 'No such ID' }  });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByName('NonExistent');
        expect(result).toBeNull();
    });

    it('findByName should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByName('Test');
        expect(result).toBeNull();
    });


    //findByCityId
    it('findByCityId should return barangay by city', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleBarangay], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByCityId(10);
        expect(result).toEqual([sampleBarangay]);
    });

    it('findByCityId should return empty array when no barangays are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByCityId(1);
        expect(result).toEqual([]);
    });

    it('findByCityId should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByCityId(10);
        expect(result).toBeNull();
    });


    //findByNum
    it('findByNum should return barangay by number', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleBarangay], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByNum('1234567890');
        expect(result).toEqual([sampleBarangay]);
    });

    it('findByNum should return empty array when no barangays are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByNum('0000000000');
        expect(result).toEqual([]);
    });

    it('findByNum should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await BarangayModel.instance.findByNum('1234567890');
        expect(result).toBeNull();
    });




    //Update


    //updateName
    it('updateName should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateName(1, 'Updated');

        expect(result).toBe(true);
    });

    it('updateName should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateName(1, 'Updated');

        expect(result).toBe(false);
    });


    //updateCityId
    it('updateCityId should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateCityId(1, 12);

        expect(result).toBe(true);
    });

    it('updateCityId should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateCityId(1, 12);

        expect(result).toBe(false);
    });


    //updateNum
    it('updateNum should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateNum(1, '9876543210');

        expect(result).toBe(true);
    });

    it('updateNum should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (BarangayModel.instance as any).updateOne = mockUpdate;

        const result = await BarangayModel.instance.updateNum(1, '9876543210');

        expect(result).toBe(false);
    });



    //Delete
    it('deleteBarangay should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (BarangayModel.instance as any).deleteOne = mockDelete;

        const result = await BarangayModel.instance.deleteBarangay(1);

        expect(result).toBe(true);
    });

    it('deleteBarangay should return false on unsuccessful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (BarangayModel.instance as any).deleteOne = mockDelete;

        const result = await BarangayModel.instance.deleteBarangay(1);

        expect(result).toBe(false);
    });



});