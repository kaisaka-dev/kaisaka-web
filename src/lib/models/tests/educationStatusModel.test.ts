import { describe, it, expect, vi, beforeEach } from 'vitest';
import { educationStatusModel } from '$lib/models/educationStatusModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('educationStatusModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleEducationStatus = {
        id: 1,
        education_type: 'Home Program',
        year_start: 6,
        year_end: 12,
        grade_level: 7,
        date_created: '2025-02-01T00:00:00Z',
        last_updated: '2025-02-01T00:00:00Z',
        child_id: 'uuid-child-id'
    };

    // Create methods

    // insertEducationStatus
    it('insertEducationStatus should create and return a new education status record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleEducationStatus);
        (educationStatusModel.instance as any).insertOne = mockInsert;

        const result = await educationStatusModel.instance.insertEducationStatus({
            education_type: 'Home Program',
            year_start: 6,
            year_end: 12,
            grade_level: 7,
            child_id: 'uuid-child-id'
        });
        expect(result).toEqual(sampleEducationStatus);
    });

    it('insertEducationStatus should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (educationStatusModel.instance as any).insertOne = mockInsert;

        const result = await educationStatusModel.instance.insertEducationStatus({
            education_type: 'Home Program',
            year_start: 6,
            year_end: 12,
            grade_level: 7,
            child_id: 'uuid-child-id'
        });
        expect(result).toBeNull();
    });




    // Read methods

    // findByChildId
    it('findByChildId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleEducationStatus]);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toEqual([sampleEducationStatus]);
    });

    it('findByChildId should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toEqual([]);
    });

    it('findByChildId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toBeNull();
    });

    // findByEducationType
    it('findByEducationType should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleEducationStatus]);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByEducationType('Home Program');
        expect(result).toEqual([sampleEducationStatus]);
    });
    
    it('findByChildId should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByEducationType('Home Program');
        expect(result).toEqual([]);
    });

    it('findByEducationType should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByEducationType(null);
        expect(result).toBeNull();
    });

    // findByYearRange
    it('findByYearRange should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue({ data: [sampleEducationStatus], error: null });
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByYearRange(6, 12);
        expect(result).toEqual([sampleEducationStatus]);
    });

    it('findByYearRange should return empty array when none are found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue({ data: [], error: null });
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByYearRange(6, 12);
        expect(result).toEqual([]);
    });

    it('findByYearRange should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue({ data: [], error: null });
        (educationStatusModel.instance as any).findMany = mockFindMany;

        const result = await educationStatusModel.instance.findByYearRange(6, 12);
        expect(result).toBeNull();
    });




    // Update methods

    // updateEducationDetails
    it('updateEducationDetails should return true if update is successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (educationStatusModel.instance as any).updateOne = mockUpdate;

        const result = await educationStatusModel.instance.updateEducationDetails(1, {'education_type': 'Nonformal'})
        expect(mockUpdate).toHaveBeenCalledWith({id: 1}, expect.objectContaining({'education_type': 'Nonformal'}));
        expect(result).toBe(true);
    });

    it('updateEducationDetails should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (educationStatusModel.instance as any).updateOne = mockUpdate;

        const result = await educationStatusModel.instance.updateEducationDetails(1, {'education_type': 'Nonformal'})
        expect(result).toBe(true);
    });

    // updateGradeLevel
    it('updateGradeLevel should return true if update is successful', async () => {
            const mockUpdate = vi.fn().mockResolvedValue(true);
            (educationStatusModel.instance as any).updateOne = mockUpdate;
    
            const result = await educationStatusModel.instance.updateGradeLevel(1, 11);
            expect(result).toBe(true);
    });

    it('updateGradeLevel should return false if update fails', async () => {
            const mockUpdate = vi.fn().mockResolvedValue(false);
            (educationStatusModel.instance as any).updateOne = mockUpdate;
    
            const result = await educationStatusModel.instance.updateGradeLevel(0, 11);
            expect(result).toBe(false);
    });

    // updateChildReference
    it('updateChildReference should return true if update is successful', async () => {
            const mockUpdate = vi.fn().mockResolvedValue(true);
            (educationStatusModel.instance as any).updateOne = mockUpdate;
    
            const result = await educationStatusModel.instance.updateChildReference(1, 'uuid-new-child-id');
            expect(result).toBe(true);
    });

    it('updateChildReference should return false if update fails', async () => {
            const mockUpdate = vi.fn().mockResolvedValue(false);
            (educationStatusModel.instance as any).updateOne = mockUpdate;
    
            const result = await educationStatusModel.instance.updateChildReference(0, 'uuid-new-child-id');
            expect(result).toBe(false);
    });




});