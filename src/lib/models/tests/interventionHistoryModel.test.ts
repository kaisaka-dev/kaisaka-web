import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterventionHistoryModel } from '$lib/models/interventionHistoryModel.js';
import { type tableRow } from '$lib/types/manager.js';

type InterventionHistoryRow = tableRow<"intervention_history">;


// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('InterventionHistoryModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

     const sampleInterventionHistory: InterventionHistoryRow = {
        id: 'uuid-history-id',
        intervention_id: 'uuid-intervention-id',
        improvement: '2025-05-01T00:00:00Z',
        status: 'Improved',
        remarks: 'Remarkable progress',
        date_checked: '2025-05-01'
    };


    // Create methods

    // recordInterventionHistory
    it('recordInterventionHistory should insert and return new history record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleInterventionHistory);
        (InterventionHistoryModel.instance as any).insertOne = mockInsert;

        const result = await InterventionHistoryModel.instance.recordInterventionHistory(
            'uuid-intervention-id',
            '2025-05-01T00:00:00Z',
            'Improved',
            'Remarkable progress',
            '2025-05-01'
        );
        expect(result).toEqual(sampleInterventionHistory);
    });

    it('recordInterventionHistory should return null on error', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).insertOne = mockInsert;

        const result = await InterventionHistoryModel.instance.recordInterventionHistory(
            'uuid-intervention-id',
            '2025-05-01T00:00:00Z',
            'Improved',
            'Remarkable progress',
            '2025-05-01'
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleInterventionHistory);
        (InterventionHistoryModel.instance as any).findOne = mockFindOne;

        const result = await InterventionHistoryModel.instance.findById('uuid-history-id');
        expect(result).toEqual(sampleInterventionHistory);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).findOne = mockFindOne;

        const result = await InterventionHistoryModel.instance.findById('uuid-history-id');
        expect(result).toBeNull();
    });

    // findByInterventionId
    it('findByInterventionId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleInterventionHistory]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByInterventionId('uuid-intervention-id');
        expect(result).toEqual([sampleInterventionHistory]);
    });

    it('findByInterventionId should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByInterventionId('uuid-intervention-id');
        expect(result).toEqual([]);
    });

    it('findByInterventionId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByInterventionId('uuid-intervention-id');
        expect(result).toBeNull();
    });

    // findByStatus
    it('findByStatus should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleInterventionHistory]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Improved');
        expect(result).toEqual([sampleInterventionHistory]);
    });

    it('findByStatus should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Improved');
        expect(result).toEqual([]);
    });

    it('findByStatus should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Improved');
        expect(result).toBeNull();
    });



    
    // Update methods

    // updateHistoryRecord
    it('updateHistoryRecord should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (InterventionHistoryModel.instance as any).updateOne = mockUpdate;

        const updates: Partial<InterventionHistoryRow> = {
            improvement: '2025-06-01T00:00:00Z',
            status: 'Improved',
            remarks: 'Great improvement',
            date_checked: '2025-06-01'
        };

        const result = await InterventionHistoryModel.instance.updateHistoryRecord('uuid-history-id', updates);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-history-id' }, updates);
        expect(result).toBe(true);
    });

    it('updateHistoryRecord should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (InterventionHistoryModel.instance as any).updateOne = mockUpdate;

        const updates: Partial<InterventionHistoryRow> = {
            improvement: '2025-06-01T00:00:00Z',
            status: 'Improved',
            remarks: 'Great improvement',
            date_checked: '2025-06-01'
        };

        const result = await InterventionHistoryModel.instance.updateHistoryRecord('uuid-history-id', updates);

        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (InterventionHistoryModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionHistoryModel.instance.deleteById('uuid-history-id');
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionHistoryModel.instance.deleteById('uuid-history-id');
        expect(result).toBe(false);
    });
});