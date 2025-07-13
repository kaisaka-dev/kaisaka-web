import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChildrenModel } from '$lib/models/childrenModel.js';
import { supabase } from '$lib/types/client.js';

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
        has_philhealth: true,
        has_birth_cert: true,
        has_medical_cert: true,
        has_barangay_cert: true,
        remarks: 'Sample remarks',
        is_active: true,
        member_id: 'uuid-member-id',
        pwd_id: 'pwd-123',
        disability_id: 1,
        disability_nature: 'Nature',  
        has_vote: true,
        has_national_id: true
    };


    // Create methods

    // insertChild
    it('insertChild should create a new child record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleChild);
        (ChildrenModel.instance as any).insertOne = mockInsert;

        const result = await ChildrenModel.instance.insertChild(
            true, true, true, true, true, 'uuid-member-id', 'pwd-123', 1, 'Nature', 'Sample remarks', true, true
        );

        expect(result).toEqual(sampleChild);
    });
    
    it('insertChild should return null if insert fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).insertOne = mockInsert;

        const result = await ChildrenModel.instance.insertChild(
            true, true, true, true, true, 'uuid-member-id', 'pwd-123', 1, 'Nature', 'Sample remarks', true, true
        );

        expect(result).toBeNull();
    });

    // Read methods

    // findById
    it('findById should return child by ID', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleChild);
        (ChildrenModel.instance as any).findOne = mockFindOne;

        const result = await ChildrenModel.instance.findById('uuid-child-id');
        expect(result).toEqual(sampleChild);
    });

    it('findById should return null if not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findOne = mockFindOne;

        const result = await ChildrenModel.instance.findById('uuid-child-id');
        expect(result).toBeNull();
    });

    // findByMemberId
    it('findByMemberId should return child by member ID', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleChild);
        (ChildrenModel.instance as any).findOne = mockFindOne;

        const result = await ChildrenModel.instance.findByMemberId('uuid-member-id');
        expect(result).toEqual(sampleChild);
    });

    it('findByMemberId should return null if not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findOne = mockFindOne;

        const result = await ChildrenModel.instance.findByMemberId('uuid-member-id');
        expect(result).toBeNull();
    });

    // findByDisabilityId
    it('findByDisabilityId should return children with given disability', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findByDisabilityId(1);
        expect(result).toEqual([sampleChild]);
    });

    it('findByDisabilityId should return empty array if none found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findByDisabilityId(1);
        expect(result).toEqual([]);
    });

    it('findByDisabilityId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findByDisabilityId(1);
        expect(result).toBeNull();
    });

    // findActiveChildren
    it('findActiveChildren should return all active children', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toEqual([sampleChild]);
    });

    it('findActiveChildren should return empty array if none found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toEqual([]);
    });

    it('findActiveChildren should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.findActiveChildren();
        expect(result).toBeNull();
    });

    // getAll
    it('getAll should return all children with no filters', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.getAll();
        expect(result).toEqual([sampleChild]);
    });

    it('getAll should return all children matching the filter', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleChild]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.getAll({ remarks: 'Sample remarks' });
        expect(result).toEqual([sampleChild]);
    });

    it('getAll should return empty array if no children match the filter', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.getAll({ remarks: 'Sample remarks' });
        expect(result).toEqual([]);
    });

    it('getAll should return null if query fails', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).findMany = mockFindMany;

        const result = await ChildrenModel.instance.getAll();
        expect(result).toBeNull();
    });




    // Update methods

    // updateBarangayCert
    it('updateBarangayCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBarangayCert('uuid-child-id', false);

        expect(result).toBe(true);
    });

    it('updateBarangayCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBarangayCert('uuid-child-id', false);

        expect(result).toBe(false);
    });

    // updateBirthCert
    it('updateBirthCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBirthCert('uuid-child-id', false);

        expect(result).toBe(true);
    });

    it('updateBirthCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateBirthCert('uuid-child-id', false);

        expect(result).toBe(false);
    });

    // updateMedCert
    it('updateMedCert should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateMedCert('uuid-child-id', false);

        expect(result).toBe(true);
    });

    it('updateMedCert should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateMedCert('uuid-child-id', false);

        expect(result).toBe(false);
    });

    // updatePhilHealthId
    it('updatePhilHealthId should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePhilHealthId('uuid-child-id', true);

        expect(result).toBe(true);
    });

    it('updatePhilHealthId should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePhilHealthId('uuid-child-id', true);

        expect(result).toBe(false);
    });

    // updateActiveStatus
    it('updateActiveStatus should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateActiveStatus('uuid-child-id', false);

        expect(result).toBe(true);
    });

    it('updateActiveStatus should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateActiveStatus('uuid-child-id', false);

        expect(result).toBe(false);
    });

    // updatePwdId
    it('updatePwdId should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePwdId('uuid-child-id', 'new-pwd-id');

        expect(result).toBe(true);
    });

    it('updatePwdId should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updatePwdId('uuid-child-id', 'new-pwd-id');

        expect(result).toBe(false);
    });

    // updateDisabilityInfo
    it('updateDisabilityInfo should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateDisabilityInfo('uuid-child-id', 2, 'Updated Nature');

        expect(result).toBe(true);
    });

    it('updateDisabilityInfo should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateDisabilityInfo('uuid-child-id', 2, 'Updated Nature');

        expect(result).toBe(false);
    });

    // updateRemarks
    it('updateRemarks should return true when update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateRemarks('uuid-child-id', 'Updated remarks');

        expect(result).toBe(true);
    });

    it('updateRemarks should return false when update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ChildrenModel.instance as any).updateOne = mockUpdate;

        const result = await ChildrenModel.instance.updateRemarks('uuid-child-id', 'Updated remarks');

        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteById('uuid-child-id');

        expect(result).toBe(true);
    });

    it('deleteById should return false when no such child exists', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteById('child-id');

        expect(result).toBe(false);
    });

    // deleteByMemberId
    it('deleteByMemberId should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteByMemberId('uuid-member-id');

        expect(result).toBe(true);
    });

    it('deleteByMemberId should return false when no such child exists', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ChildrenModel.instance as any).deleteOne = mockDelete;

        const result = await ChildrenModel.instance.deleteByMemberId('child-member-id');

        expect(result).toBe(false);
    });

});