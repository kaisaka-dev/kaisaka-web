import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChildrenModel } from '$lib/models/childrenModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('ChildrenModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleChild = {
        id: 'uuid-child-id',
        has_barangay_cert: true,
        has_birth_cert: true,
        has_medical_cert: true,
        has_philhealth: true,
        is_active: true,
        member_id: 'uuid-member-id',
        philhealth_id: 'philhealth-123',
        pwd_id: 'pwd-123',
        remarks: 'Sample remarks'
    };



    // Create methods


    // insertChild
    it('insertChild should create a new child record', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleChild, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await ChildrenModel.instance.insertChild(true, true, true, true, 'uuid-member-id', 'philhealth-123', 'pwd-123', 'Sample remarks');

        expect(result).toEqual(sampleChild);
    });

    it('insertChild should return null when there are missing required values', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Insert failed: missing required values' } })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await ChildrenModel.instance.insertChild(true, true, true, true, 'uuid-member-id', null, null, 'Sample remarks');

        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return child by ID', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleChild);
        (ChildrenModel.instance as any).findOne = mockMatch;

        const result = await ChildrenModel.instance.findById('uuid-child-id');
        expect(result).toEqual(sampleChild);
    });

    it('findById should return null if no children are found', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findOne = mockMatch;

        const result = await ChildrenModel.instance.findById('non-existent-id');
        expect(result).toBeNull();
    });


    // findByMemberId
    it('findByMemberId should return child by member ID', async () => {
        const mockMatch = vi.fn().mockResolvedValue(sampleChild);
        (ChildrenModel.instance as any).findOne = mockMatch;

        const result = await ChildrenModel.instance.findByMemberId('uuid-member-id');
        expect(result).toEqual(sampleChild);
    });

    it('findByMemberId should return null if child does not exist', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findOne = mockMatch;

        const result = await ChildrenModel.instance.findByMemberId('non-existent-member-id');
        expect(result).toBeNull();
    });

    // findActiveChildren
    it('findActiveChildren should return all active children', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toEqual([sampleChild]);
    });

    it('findActiveChildren should return empty array if no active children', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toEqual([]);
    });

    it('findActiveChildren should return null if query fails', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toBeNull();
    });

    // getAll
    it('getAll should return all children with no filters', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.getAll();
        expect(result).toEqual([sampleChild]);
    });

    it('getAll should return all children matching the filter', async () => {
        const mockMatch = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.getAll({ remarks: 'Sample remarks' });
        expect(result).toEqual([sampleChild]);
    });

    it('getAll should return empty array if no children match the filter', async () => {
        const mockMatch = vi.fn().mockResolvedValue([]);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.getAll({ remarks: 'Nonexistent remarks' });
        expect(result).toEqual([]);
    });

    it('getAll should return null if query fails', async () => {
        const mockMatch = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findMany = mockMatch;

        const result = await ChildrenModel.instance.getAll();
        expect(result).toBeNull();
    });




    // Update methods
    
    //updateBarangayCert
    it('updateBarangayCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBarangayCert('uuid-child-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { has_barangay_cert: false });
        expect(result).toBe(true);
    });

    it('updateBarangayCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBarangayCert('uuid-nonexistent-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { has_barangay_cert: false });
        expect(result).toBe(false);
    });


    //updateBirthCert
    it('updateBirthCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBirthCert('uuid-child-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { has_birth_cert: false });
        expect(result).toBe(true);
    });

    it('updateBirthCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBirthCert('uuid-nonexistent-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { has_birth_cert: false });
        expect(result).toBe(false);
    });


    //updateMedCert
    it('updateMedCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateMedCert('uuid-child-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { has_medical_cert: false });
        expect(result).toBe(true);
    });

    it('updateMedCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateMedCert('uuid-nonexistent-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { has_medical_cert: false });
        expect(result).toBe(false);
    });


    // updatePhilHealthId
    it('updatePhilHealthId should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePhilHealthId('uuid-child-id', 'new-philhealth-id');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { philhealth_id: 'new-philhealth-id', has_philhealth: true });
        expect(result).toBe(true);
    });

    it('updatePhilHealthId should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePhilHealthId('uuid-nonexistent-id', 'new-philhealth-id');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { philhealth_id: 'new-philhealth-id', has_philhealth: true });
        expect(result).toBe(false);
    });

    // updateActiveStatus
    it('updateActiveStatus should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateActiveStatus('uuid-child-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { is_active: false });
        expect(result).toBe(true);
    });

    it('updateActiveStatus should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateActiveStatus('uuid-nonexistent-id', false);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { is_active: false });
        expect(result).toBe(false);
    });


    // updatePwdId
    it('updatePwdId should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePwdId('uuid-child-id', 'new-pwd-id');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { pwd_id: 'new-pwd-id' });
        expect(result).toBe(true);
    });

    it('updatePwdId should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePwdId('uuid-nonexistent-id', 'new-pwd-id');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { pwd_id: 'new-pwd-id' });
        expect(result).toBe(false);
    });


    // updateRemarks
    it('updateRemarks should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateRemarks('uuid-child-id', 'Updated remarks');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-child-id' }, { remarks: 'Updated remarks' });
        expect(result).toBe(true);
    });

    it('updateRemarks should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateRemarks('uuid-nonexistent-id', 'Updated remarks');

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-nonexistent-id' }, { remarks: 'Updated remarks' });
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteById('uuid-child-id');

        expect(mockDelete).toHaveBeenCalledWith({ id: 'uuid-child-id' });
        expect(result).toBe(true);
    });

    it('deleteById should return false when no such child exists', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteById('nonexistent-id');

        expect(mockDelete).toHaveBeenCalledWith({ id: 'nonexistent-id' });
        expect(result).toBe(false);
    });


    // deleteByMemberId
    it('deleteByMemberId should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteByMemberId('uuid-member-id');

        expect(mockDelete).toHaveBeenCalledWith({ id: 'uuid-member-id' });
        expect(result).toBe(true);
    });

    it('deleteByMemberId should return false when no such child exists', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteByMemberId('nonexistent-member-id');

        expect(mockDelete).toHaveBeenCalledWith({ id: 'nonexistent-member-id' });
        expect(result).toBe(false);
    });

});