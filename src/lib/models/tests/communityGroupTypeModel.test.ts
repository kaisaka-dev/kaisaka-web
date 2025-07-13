import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommunityGroupTypeModel } from '$lib/models/communityGroupTypeModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('CommunityGroupTypeModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleCommunityGroupType = {
        id: 1,
        name: 'Name'
    };


    // Create methods

    // insertCommunityGroupType
    it('insertCommunityGroupType should create and return a new Philhealth ID record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleCommunityGroupType);
        (CommunityGroupTypeModel.instance as any).insertOne = mockInsert;

        const result = await CommunityGroupTypeModel.instance.insertCommunityGroupType('Name'
        );
        expect(result).toEqual(sampleCommunityGroupType);
    });

    it('insertCommunityGroupType should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).insertOne = mockInsert;

        const result = await CommunityGroupTypeModel.instance.insertCommunityGroupType('Name');
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleCommunityGroupType);
        (CommunityGroupTypeModel.instance as any).findOne = mockFindOne;

        const result = await CommunityGroupTypeModel.instance.findById(1);
        expect(result).toEqual(sampleCommunityGroupType);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findOne = mockFindOne;

        const result = await CommunityGroupTypeModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleCommunityGroupType);
        (CommunityGroupTypeModel.instance as any).findOne = mockFindOne;

        const result = await CommunityGroupTypeModel.instance.findByName('Name');
        expect(result).toEqual(sampleCommunityGroupType);
    });

    it('findByName should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findOne = mockFindOne;

        const result = await CommunityGroupTypeModel.instance.findByName('Name');
        expect(result).toBeNull();
    });

    // findByNameKeyword
    it('findByNameKeyword should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCommunityGroupType]);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.findByNameKeyword('Na');
        expect(result).toEqual([sampleCommunityGroupType]);
    });

    it('findByNameKeyword should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.findByNameKeyword('Na');
        expect(result).toEqual([]);
    });

    it('findByNameKeyword should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.findByNameKeyword('Na');
        expect(result).toBeNull();
    });

    // getAll
    it('getAll should return an array of families when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleCommunityGroupType]);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.getAll();
        expect(result).toEqual([sampleCommunityGroupType]);
    });

    it('getAll should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.getAll();
        expect(result).toEqual([]);
    });

    it('getAll should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findMany = mockFindMany;

        const result = await CommunityGroupTypeModel.instance.getAll();
        expect(result).toBeNull();
    });

    // exists
    it('exists should return true if a matching record is found', async () => {
        const mockFindByName = vi.fn().mockResolvedValue(sampleCommunityGroupType);
        (CommunityGroupTypeModel.instance as any).findByName = mockFindByName;

        const result = await CommunityGroupTypeModel.instance.exists('Name');
        expect(result).toBe(true);
    });

    it('exists should return false if a matching record is not found', async () => {
        const mockFindByName = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findByName = mockFindByName;

        const result = await CommunityGroupTypeModel.instance.exists('Name');
        expect(result).toBe(false);
    });

    // existsById
    it('existsById should return true if a matching record is found', async () => {
        const mockFindById = vi.fn().mockResolvedValue(sampleCommunityGroupType);
        (CommunityGroupTypeModel.instance as any).findById = mockFindById;

        const result = await CommunityGroupTypeModel.instance.existsById(1);
        expect(result).toBe(true);
    });

    it('existsById should return false if a matching record is not found', async () => {
        const mockFindById = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).findById = mockFindById;

        const result = await CommunityGroupTypeModel.instance.existsById(1);
        expect(result).toBe(false);
    });




    // Update methods

    // updateName
    it('updateName should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (CommunityGroupTypeModel.instance as any).updateOne = mockUpdate;

        const result = await CommunityGroupTypeModel.instance.updateName(1, 'New Name');
        expect(result).toBe(true);
    });

    it('updateName should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (CommunityGroupTypeModel.instance as any).updateOne = mockUpdate;

        const result = await CommunityGroupTypeModel.instance.updateName(1, 'New Name');
        expect(result).toBe(false);
    });



    
    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (CommunityGroupTypeModel.instance as any).deleteOne = mockDelete;

        const result = await CommunityGroupTypeModel.instance.deleteById(1);
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).deleteOne = mockDelete;

        const result = await CommunityGroupTypeModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByName
    it('deleteByName should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (CommunityGroupTypeModel.instance as any).deleteOne = mockDelete;

        const result = await CommunityGroupTypeModel.instance.deleteByName('Name');
        expect(result).toBe(true);
    });

    it('deleteByName should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (CommunityGroupTypeModel.instance as any).deleteOne = mockDelete;

        const result = await CommunityGroupTypeModel.instance.deleteByName('Name');
        expect(result).toBe(false);
    });
});