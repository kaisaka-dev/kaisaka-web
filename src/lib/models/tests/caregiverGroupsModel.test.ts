import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaregiverGroupsModel } from '$lib/models/caregiverGroupsModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('CaregiverGroupsModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleCaregiverGroup = {
    id: 1,
    caregiver_id: 'uuid-caregiver',
    community_group_id: 2,
    date_joined: '2025-04-01T00:00:00Z',
    date_left: '2025-04-01T00:00:00Z'
  };


    // Create methods


    // insertCaregiverGroup
    it('insertCaregiverGroup should create and return a new caregiver group record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleCaregiverGroup);
        (CaregiverGroupsModel.instance as any).insertOne = mockInsert;

        const result = await CaregiverGroupsModel.instance.insertCaregiverGroup(
            'uuid-caregiver',
            2,
            '2025-04-01T00:00:00Z',
            '2025-04-01T00:00:00Z',
        );
        expect(result).toEqual(sampleCaregiverGroup);
    });

    it('insertCaregiverGroup should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).insertOne = mockInsert;

        const result = await CaregiverGroupsModel.instance.insertCaregiverGroup(
            'uuid-caregiver',
            2,
            '2025-04-01T00:00:00Z',
            '2025-04-01T00:00:00Z',
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleCaregiverGroup);
        (CaregiverGroupsModel.instance as any).findOne = mockFindOne;

        const result = await CaregiverGroupsModel.instance.findById(1);
        expect(result).toEqual(sampleCaregiverGroup);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).findOne = mockFindOne;

        const result = await CaregiverGroupsModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByCaregiverId
    it('findByCaregiverId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCaregiverGroup]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCaregiverId('uuid-caregiver');
        expect(result).toEqual([sampleCaregiverGroup]);
    });

    it('findByCaregiverId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCaregiverId('uuid-caregiver');
        expect(result).toEqual([]);
    });

    it('findByCaregiverId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCaregiverId('uuid-caregiver');
        expect(result).toBeNull();
    });

    // findByCommunityGroupId
    it('findByCommunityGroupId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCaregiverGroup]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCommunityGroupId(2);
        expect(result).toEqual([sampleCaregiverGroup]);
    });

    it('findByCommunityGroupId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCommunityGroupId(2);
        expect(result).toEqual([]);
    });

    it('findByCommunityGroupId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findByCommunityGroupId(2);
        expect(result).toBeNull();
    });

    // findActiveMembers
    it('findActiveMembers should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCaregiverGroup]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findActiveMembers();
        expect(result).toEqual([sampleCaregiverGroup]);
    });

    it('findActiveMembers should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findActiveMembers();
        expect(result).toEqual([]);
    });

    it('findActiveMembers should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findActiveMembers();
        expect(result).toBeNull();
    }); 

    // findInactiveMembers
    it('findInactiveMembers should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCaregiverGroup]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findInactiveMembers();
        expect(result).toEqual([sampleCaregiverGroup]);
    });

    it('findInactiveMembers should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findInactiveMembers();
        expect(result).toEqual([]);
    });

    it('findInactiveMembers should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).findMany = mockFindMany;

        const result = await CaregiverGroupsModel.instance.findInactiveMembers();
        expect(result).toBeNull();
    });




    // Update methods
    
    // updateDateLeft
    it('updateDateLeft should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.updateDateLeft(1, '2025-04-02T00:00:00Z');
        expect(result).toBe(true);
    });

    it('updateDateLeft should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.updateDateLeft(1, '2025-04-02T00:00:00Z');
        expect(result).toBe(false);
    });
    
    // updateDateJoined
    it('updateDateJoined should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.updateDateJoined(1, '2025-04-02T00:00:00Z');
        expect(result).toBe(true);
    });

    it('updateDateJoined should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.updateDateJoined(1, '2025-04-02T00:00:00Z');
        expect(result).toBe(false);
    });

    // markAsLeft
    it('markAsLeft should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.markAsLeft(1);
        expect(result).toBe(true);
    });

    it('markAsLeft should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.markAsLeft(1);
        expect(result).toBe(false);
    });

    // reactivateMembership
    it('reactivateMembership should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.reactivateMembership(1);
        expect(result).toBe(true);
    });

    it('reactivateMembership should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CaregiverGroupsModel.instance as any).updateOne = mockUpdate;

        const result = await CaregiverGroupsModel.instance.reactivateMembership(1);
        expect(result).toBe(false);
    });



    
    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).deleteOne = mockDelete;

        const result = await CaregiverGroupsModel.instance.deleteById(1);
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).deleteOne = mockDelete;

        const result = await CaregiverGroupsModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByCaregiverId
    it('deleteByCaregiverId should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (CaregiverGroupsModel.instance as any).deleteOne = mockDelete;

        const result = await CaregiverGroupsModel.instance.deleteByCaregiverId('uuid-caregiver');
        expect(result).toBe(true);
    });

    it('deleteByCaregiverId should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (CaregiverGroupsModel.instance as any).deleteOne = mockDelete;

        const result = await CaregiverGroupsModel.instance.deleteByCaregiverId('uuid-caregiver');
        expect(result).toBe(false);
    }); 
});