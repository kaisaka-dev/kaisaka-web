import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddressesModel } from '$lib/models/addressesModel.js';
import { supabase } from '$lib/types/client.js';
import type { error } from 'console';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
    return {
        supabase: {
            from: vi.fn()
        }
    };
});

describe('AddressesModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleAddress = {
        barangay_id: 1,
        street_id: 2,
        address: '25 Hop Avenue',
        id: 'uuid-some-unique-id',
    };

    // Create methods

    // insertAddress
    it('insertAddress should insert a new address', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleAddress, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: mockInsert
        });

        const result = await AddressesModel.instance.insertAddress('25 Hop Avenue', 1, 2);
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toEqual(sampleAddress);
    });



    // Update methods

    // findById
    it('findById should return barangay by city', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleAddress], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findById('uuid-some-unique-id');
        expect(result).toEqual([sampleAddress]);
    });

    it('findById should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findById('NonExistent');
        expect(result).toEqual([]);
    });

    it('findById should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findById('uuid-some-unique-id');
        expect(result).toBeNull();
    });

    // findByAddress
    it('findByAddress should return addresses by address name', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleAddress], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByAddress('25 Hop Avenue');
        expect(result).toEqual([sampleAddress]);
    });

    it('findByAddress should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByAddress('NonExistent Address');
        expect(result).toEqual([]);
    });

    it('findByAddress should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByAddress('25 Hop Avenue');
        expect(result).toBeNull();
    });


    //findByBarangayId
    it('findByBarangayId should return addresses by barangay id', async () =>
    {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleAddress], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByBarangayId(1);
        expect(result).toEqual([sampleAddress]);
    });

    it('findByBarangayId should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByBarangayId(999);
        expect(result).toEqual([]);
    });

    it('findByBarangayId should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByBarangayId(1);
        expect(result).toBeNull();
    });


    // findByStreetId
    it('findByStreetId should return addresses by street id', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleAddress], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByStreetId(2);
        expect(result).toEqual([sampleAddress]);
    });

    it('findByStreetId should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByStreetId(999);
        expect(result).toEqual([]);
    });

    it('findByStreetId should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await AddressesModel.instance.findByStreetId(2);
        expect(result).toBeNull();
    });



    
    // Update methods
    it('updateAddress should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateAddress('uuid-some-unique-id', 'Updated');
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(true);
    });

    it('updateAddress should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateAddress('uuid-some-unique-id', 'Updated');
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(false);
    });


    // updateBarangayId
    it('updateBarangayId should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateBarangayId('uuid-some-unique-id', 1);
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(true);
    });

    it('updateBarangayId should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateBarangayId('uuid-some-unique-id', 1);
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(false);
    });


    // updateStreetId
    it('updateStreetId should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateStreetId('uuid-some-unique-id', 2);
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(true);
    });

    it('updateStreetId should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateStreetId('uuid-some-unique-id', 2);
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteAddress
    it('deleteAddress should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).deleteOne = mockDelete;

        const result = await AddressesModel.instance.deleteById('uuid-some-unique-id');
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(true);
    });

    it('deleteAddress should return false on unsuccessful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).deleteOne = mockDelete;

        const result = await AddressesModel.instance.deleteById('uuid-some-unique-id');
        expect(supabase.from).toHaveBeenCalledWith('addresses');
        expect(result).toBe(false);
    });
});
