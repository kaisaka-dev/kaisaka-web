import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MajorTargetActivityModel } from '$lib/models/majorTargetActivityModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('MajorTargetActivityModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleMajorTargetActivity = {
        id: 1,
        service_objective_id: 1,
        name: 'Major Target Activity',
        type: 'Activity',
        target_no_of_participants: 10,
        date_and_time_created: new Date().toISOString(),
        date_and_time_last_updated: new Date().toISOString(),
        remarks: 'Additional remarks'
    };

    // insertMajorTargetActivity
    it('insertMajorTargetActivity should return inserted major target activity on success', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleMajorTargetActivity);
        (MajorTargetActivityModel.instance as any).insertOne = mockInsert;

        const result = await MajorTargetActivityModel.instance.insertMajorTargetActivity(
            'Major Target Activity',
            'Activity',
            1,
            10
        );

        expect(result).toEqual(sampleMajorTargetActivity);
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Major Target Activity',
            type: 'Activity',
            service_objective_id: 1,
            target_no_of_participants: 10,
        }));
    });

    it('insertMajorTargetActivity should return null on failure', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (MajorTargetActivityModel.instance as any).insertOne = mockInsert;

        const result = await MajorTargetActivityModel.instance.insertMajorTargetActivity(
            'Major Target Activity',
            'Activity',
            1,
            10
        );
        expect(result).toBeNull();
    });

    // findById
    it('findById should return major target activity when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleMajorTargetActivity);
        (MajorTargetActivityModel.instance as any).findOne = mockFindOne;

        const result = await MajorTargetActivityModel.instance.findById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(sampleMajorTargetActivity);
    });

    it('findById should return null when not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (MajorTargetActivityModel.instance as any).findOne = mockFindOne;

        const result = await MajorTargetActivityModel.instance.findById(999);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleMajorTargetActivity);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByName('Major Target Activity');
        expect(mockFindMany).toHaveBeenCalledWith({ name: 'Major Target Activity' });
        expect(result).toEqual(sampleMajorTargetActivity);
    });

    it('findByName should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByName('dus');
        expect(result).toEqual([]);
    });

    // findByType
    it('findByType should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleMajorTargetActivity);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByType('Activity');
        expect(mockFindMany).toHaveBeenCalledWith({ type: 'Activity' });
        expect(result).toEqual(sampleMajorTargetActivity);
    });

    it('findByType should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByType('dus');
        expect(result).toEqual([]);
    });

    // findByServiceObjectiveId
    it('findByServiceObjectiveId should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleMajorTargetActivity);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByServiceObjectiveId(1);
        expect(mockFindMany).toHaveBeenCalledWith({ service_objective_id: 1 });
        expect(result).toEqual(sampleMajorTargetActivity);
    });

    it('findByServiceObjectiveId should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (MajorTargetActivityModel.instance as any).findMany = mockFindMany;

        const result = await MajorTargetActivityModel.instance.findByServiceObjectiveId(999);
        expect(result).toEqual([]);
    });

    // updateName
    it('updateName should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateName(1, 'New Major Target Activity');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ name: 'New Major Target Activity' }));
        expect(result).toBe(true);
    });

    it('updateName should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateName(1, 'New Major Target Activity');
        expect(result).toBe(false);
    });

    // updateTargetParticipants
    it('updateTargetParticipants should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateTargetParticipants(1, 10);
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ target_no_of_participants: 10 }));
        expect(result).toBe(true);
    });

    it('updateTargetParticipants should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateTargetParticipants(1, 10);
        expect(result).toBe(false);
    });

    // updateRemarks
    it('updateRemarks should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateRemarks(1, 'Anyone see this remark?');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ remarks: 'Anyone see this remark?' }));
        expect(result).toBe(true);
    });

    it('updateRemarks should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MajorTargetActivityModel.instance as any).updateOne = mockUpdate;

        const result = await MajorTargetActivityModel.instance.updateRemarks(1, 'You will never see this remark');
        expect(result).toBe(false);
    });

    // deleteById
    it('deleteById should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (MajorTargetActivityModel.instance as any).deleteOne = mockDelete;

        const result = await MajorTargetActivityModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false on failure', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MajorTargetActivityModel.instance as any).deleteOne = mockDelete;

        const result = await MajorTargetActivityModel.instance.deleteById(1);
        expect(result).toBe(false);
    });
});