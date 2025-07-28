import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivityModel } from '$lib/models/activityModel.js';
import { supabase } from '$lib/types/supabase.js';

vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('ActivityModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });


    const sampleActivity = {
        id: 1,
        target_activity_id: 2,
        name: 'Activity',
        type: 'Dark',
        date_and_time_conducted: '2025-04-01T00:00:00Z',
        indicators: 'Indicator',
        outcome: 'Success',
        remarks: 'Remarkable',
        date_and_time_created: '2025-04-01T00:00:00Z',
        date_and_time_last_updated: '2025-04-01T00:00:00Z',
        completion_status: 'completed'
    };


    // Create methods


    // insertActivity
    it('insertActivity should create and return a new activity record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleActivity);
        (ActivityModel.instance as any).insertOne = mockInsert;

        const result = await ActivityModel.instance.insertActivity(
            'Activity',
            'Dark',
            2,
            '2025-04-01T00:00:00Z',
            'completed',
            'Indicator',
            'Success',
            'Remarkable'
        );
        expect(result).toEqual(sampleActivity);
    });

    it('insertActivity should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).insertOne = mockInsert;

        const result = await ActivityModel.instance.insertActivity(
            'Activity',
            'Dark',
            2,
            '2025-04-01T00:00:00Z',
            'completed',
            'Indicator',
            'Success',
            'Remarkable'
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleActivity);
        (ActivityModel.instance as any).findOne = mockFindOne;

        const result = await ActivityModel.instance.findById(1);
        expect(result).toEqual(sampleActivity);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).findOne = mockFindOne;

        const result = await ActivityModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByName
    it('findByName should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleActivity]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByName('Activity');
        expect(result).toEqual([sampleActivity]);
    });

    it('findByName should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByName('Activity');
        expect(result).toEqual([]);
    });

    it('findByName should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByName('Activity');
        expect(result).toBeNull();
    });

    // findByType
    it('findByType should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleActivity]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByType('Dark');
        expect(result).toEqual([sampleActivity]);
    });

    it('findByType should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByType('Dark');
        expect(result).toEqual([]);
    });

    it('findByType should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByType('Dark');
        expect(result).toBeNull();
    });

    // findByTargetActivityId
    it('findByTargetActivityId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleActivity]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByTargetActivityId(2);
        expect(result).toEqual([sampleActivity]);
    });

    it('findByTargetActivityId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByTargetActivityId(2);
        expect(result).toEqual([]);
    });

    it('findByTargetActivityId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).findMany = mockFindMany;

        const result = await ActivityModel.instance.findByTargetActivityId(2);
        expect(result).toBeNull();
    });




    // Update methods

    // updateName
    it('updateName should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateName(1, 'New Name');
        expect(result).toBe(true);
    });

    it('updateName should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateName(1, 'New Name');
        expect(result).toBe(false);
    });

    // updateCompletionStatus
    it('updateCompletionStatus should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateCompletionStatus(1, 'cancelled');
        expect(result).toBe(true);
    });

    it('updateCompletionStatus should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateCompletionStatus(1, 'cancelled');
        expect(result).toBe(false);
    });

    // updateOutcome
    it('updateOutcome should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateOutcome(1, 'New Outcome');
        expect(result).toBe(true);
    });

    it('updateOutcome should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (ActivityModel.instance as any).updateOne = mockUpdate;

        const result = await ActivityModel.instance.updateOutcome(1, 'New Outcome');
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ActivityModel.instance as any).deleteOne = mockDelete;

        const result = await ActivityModel.instance.deleteById(1);
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ActivityModel.instance as any).deleteOne = mockDelete;

        const result = await ActivityModel.instance.deleteById(1);
        expect(result).toBe(false);
    }); 
});