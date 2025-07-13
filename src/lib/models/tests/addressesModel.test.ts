import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddressesModel } from '$lib/models/addressesModel.js';

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
        address: '25 Hop Avenue',
        id: 'uuid-some-unique-id',
    };

    // Create methods

    // insertAddress
    it('insertAddress should insert a new address', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleAddress);
        (AddressesModel.instance as any).insertOne = mockInsert;
        
        const result = await AddressesModel.instance.insertAddress('25 Hop Avenue', 1);

        expect(result).toEqual(sampleAddress);
    });

    it('insertAddress should return null on insert error', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (AddressesModel.instance as any).insertOne = mockInsert;

        const result = await AddressesModel.instance.insertAddress('25 Hop Avenue', 1);

        expect(result).toBeNull();
    });



    // Update methods

    // findById
    it('findById should return barangay', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleAddress);
        (AddressesModel.instance as any).findOne = mockMatch;

        const result = await AddressesModel.instance.findById('uuid-some-unique-id');
        expect(result).toEqual(sampleAddress);
    });

    it('findById should return null when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (AddressesModel.instance as any).findOne = mockMatch;

        const result = await AddressesModel.instance.findById('uuid-some-unique-id');
        expect(result).toBeNull();
    });


    // findByAddress
    it('findByAddress should return addresses by address name', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleAddress]);
        (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByAddress('25 Hop Avenue');
        expect(result).toEqual([sampleAddress]);
    });

    it('findByAddress should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByAddress('25 Hop Avenue');
        expect(result).toEqual([]);
    });

    it('findByAddress should return null on error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
         (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByAddress('25 Hop Avenue');
        expect(result).toBeNull();
    });


    //findByBarangayId
    it('findByBarangayId should return addresses by barangay id', async () =>
    {
        const mockMatch = vi.fn().mockResolvedValue([sampleAddress]);
        (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByBarangayId(1);
        expect(result).toEqual([sampleAddress]);
    });

    it('findByBarangayId should return empty array when no addresses are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByBarangayId(1);
        expect(result).toEqual([]);
    });

    it('findByBarangayId should return null on error', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
         (AddressesModel.instance as any).findMany = mockMatch;

        const result = await AddressesModel.instance.findByBarangayId(1);
        expect(result).toBeNull();
    });




    
    // Update methods
    it('updateAddress should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateAddress('uuid-some-unique-id', 'Updated');

        expect(result).toBe(true);
    });

    it('updateAddress should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateAddress('uuid-some-unique-id', 'Updated');

        expect(result).toBe(false);
    });


    // updateBarangayId
    it('updateBarangayId should return true on successful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateBarangayId('uuid-some-unique-id', 2);

        expect(result).toBe(true);
    });

    it('updateBarangayId should return false on unsuccessful update', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AddressesModel.instance as any).updateOne = mockUpdate;

        const result = await AddressesModel.instance.updateBarangayId('uuid-some-unique-id', 2);

        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (AddressesModel.instance as any).deleteOne = mockDelete;

        const result = await AddressesModel.instance.deleteById('uuid-some-unique-id');

        expect(result).toBe(true);
    });

    it('deleteById should return false on unsuccessful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (AddressesModel.instance as any).deleteOne = mockDelete;

        const result = await AddressesModel.instance.deleteById('uuid-some-unique-id');

        expect(result).toBe(false);
    });
});
