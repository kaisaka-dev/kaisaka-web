import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterventionModel } from '$lib/models/interventionModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('InterventionModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleIntervention = {
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


    // insertIntervention
    it('insertIntervention should create and return a new intervention record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleIntervention);
        (InterventionModel.instance as any).insertOne = mockInsert;

        const result = await InterventionModel.instance.insertIntervention(
            'uuid-child-id',
            'string',
            'Remarks',
            2,
            'Neutral',
            'education',
        );
        expect(result).toEqual(sampleIntervention);
    });

    it('insertIntervention should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).insertOne = mockInsert;

        const result = await InterventionModel.instance.insertIntervention(
            'uuid-child-id',
            'string',
            'Remarks',
            2,
            'Neutral',
            'education',
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleIntervention);
        (InterventionModel.instance as any).findOne = mockFindOne;

        const result = await InterventionModel.instance.findById('uuid-intervention-id');
        expect(result).toEqual(sampleIntervention);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).findOne = mockFindOne;

        const result = await InterventionModel.instance.findById('uuid-intervention-id');
        expect(result).toBeNull();
    });

    // findByChild
    it('findByChild should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleIntervention);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByChild('uuid-child-id');
        expect(result).toEqual(sampleIntervention);
    });

    it('findByChild should return null when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByChild('uuid-child-id');
        expect(result).toBeNull();
    });

    // findByServiceCategoryId
    it('findByServiceCategoryId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleIntervention]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByServiceCategoryId(2);
        expect(result).toEqual([sampleIntervention]);
    });

    it('findByServiceCategoryId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByServiceCategoryId(2);
        expect(result).toEqual([]);
    });

    it('findByServiceCategoryId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByServiceCategoryId(2);
        expect(result).toBeNull();
    });

    // findByStatus
    it('findByStatus should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleIntervention]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByStatus('Regressed');
        expect(result).toEqual([sampleIntervention]);
    });

    it('findByStatus should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByStatus('Regressed');
        expect(result).toEqual([]);
    });

    it('findByStatus should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByStatus('Regressed');
        expect(result).toBeNull();
    });

    // findByInterventionType
    it('findByInterventionType should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleIntervention]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByInterventionType('education');
        expect(result).toEqual([sampleIntervention]);
    });

    it('findByInterventionType should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByInterventionType('education');
        expect(result).toEqual([]);
    });

    it('findByInterventionType should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).findMany = mockFindMany;

        const result = await InterventionModel.instance.findByInterventionType('education');
        expect(result).toBeNull();
    });


    // Update methods

    // updateRemarks
    it('updateRemarks should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (InterventionModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionModel.instance.updateRemarks('uuid-intervention-id', 'New Remark');
        expect(result).toBe(true);
    });

    it('updateRemarks should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (InterventionModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionModel.instance.updateRemarks('uuid-intervention-id', 'New Remark');
        expect(result).toBe(false);
    });

    // updateInterventionType
    it('updateInterventionType should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (InterventionModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionModel.instance.updateInterventionType('uuid-intervention-id', 'social');
        expect(result).toBe(true);
    });

    it('updateInterventionType should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (InterventionModel.instance as any).updateOne = mockUpdate;

        const result = await InterventionModel.instance.updateInterventionType('uuid-intervention-id', 'social');
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (InterventionModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionModel.instance.deleteById('uuid-intervention-id');
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (InterventionModel.instance as any).deleteOne = mockDelete;

        const result = await InterventionModel.instance.deleteById('uuid-intervention-id');
        expect(result).toBe(false);
    });
});