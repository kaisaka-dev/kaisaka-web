import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterventionHistoryModel } from '$lib/models/interventionHistoryModel.js';
import TableManager, { type tableRow } from '$lib/types/manager.js';
import { InterventionModel } from '$lib/models/interventionModel.js';
import { supabase } from '$lib/types/supabase.js';

type InterventionRow = tableRow<"intervention">

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

    const sampleInterventionHistory = {
        id: 'uuid-history-id',
        created_at: '2025-05-01T00:00:00Z',
        intervention_id: 'uuid-intervention-id',
        intervention_created_at: '2025-04-01T00:00:00Z',
        intervention_modified_at: '2025-04-01T00:00:00Z',
        status: 'Neutral',
        child_id: 'uuid-child-id',
        remarks: 'Remarks',
        intervention_text: 'string'
    };

    const sampleIntervention: InterventionRow = {
        id: 'uuid-intervention-id',
        service_category_id: 2,
        intervention: 'string',
        date_created: '2025-04-01T00:00:00Z',
        last_updated: '2025-04-01T00:00:00Z',
        status: 'Neutral',
        remarks: 'Remarks',
        child_id: 'uuid-child-id',
        type: 'education'
    };

    // Create methods


    // recordIntervention
    it('recordIntervention should insert and return new program', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleInterventionHistory, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await InterventionHistoryModel.instance.recordIntervention(sampleIntervention);

        expect(result).toEqual(sampleInterventionHistory);
    });

    it('recordIntervention should return null on insert error', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Insert failed' } })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const result = await InterventionHistoryModel.instance.recordIntervention(sampleIntervention);

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

    // findByChild
    it('findByChild should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleInterventionHistory]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByChild('uuid-child-id');
        expect(result).toEqual([sampleInterventionHistory]);
    });

    it('findByChild should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByChild('uuid-child-id');
        expect(result).toEqual([]);
    });

    it('findByChild should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByChild('uuid-child-id');
        expect(result).toBeNull();
    });

    // findByStatus
    it('findByStatus should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleInterventionHistory]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Regressed');
        expect(result).toEqual([sampleInterventionHistory]);
    });

    it('findByStatus should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Regressed');
        expect(result).toEqual([]);
    });

    it('findByStatus should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionHistoryModel.instance as any).findMany = mockFindMany;

        const result = await InterventionHistoryModel.instance.findByStatus('Regressed');
        expect(result).toBeNull();
    });




    // Update methods

    const sampleInterventionHistoryUpdate = {
        intervention_id: 'uuid-intervention-id',
        intervention_created_at: '2025-05-01T00:00:00Z',
        intervention_modified_at: '2025-06-01T00:00:00Z',
        status: 'Improved',
        child_id: 'uuid-children-id',
        remarks: 'Remarkable',
        intervention_text: 'string'
    };

    const sampleInterventionUpdate: InterventionRow = {
        id: 'uuid-intervention-id',
        service_category_id: 2,
        intervention: 'string',
        date_created: '2025-05-01T00:00:00Z',
        last_updated: '2025-06-01T00:00:00Z',
        status: 'Improved',
        remarks: 'Remarkable',
        child_id: 'uuid-children-id',
        type: 'social'
    };

    // updateRecord

    it('updateRecord should return true on success with multiple fields', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (InterventionHistoryModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionHistoryModel.instance.updateRecord('uuid-history-id', sampleInterventionUpdate);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-history-id' }, sampleInterventionHistoryUpdate);
        expect(result).toBe(true)
    });

    it('updateRecord should return null on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (InterventionHistoryModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionHistoryModel.instance.updateRecord('uuid-history-id', sampleInterventionUpdate);

        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (InterventionModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionModel.instance.deleteById('uuid-history-id');
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionModel.instance.deleteById('uuid-history-id');
        expect(result).toBe(false);
    });
});