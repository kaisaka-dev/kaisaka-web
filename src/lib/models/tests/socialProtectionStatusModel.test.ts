import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socialProtectionStatusModel } from '$lib/models/socialProtectionStatusModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('socialProtectionStatusModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleStatus = {
        id: 1,
        fam_year_accessed: 2024,
        date_created: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        child_id: 'uuid-child-id',
        participates_family_life: true,
        participates_community_club: true,
        comm_year_accessed: 2025
    };

    // findByChildId
    it('findByChildId should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toEqual([sampleStatus]);
    });

    it('findByChildId should return null when no records found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByChildId('uuid-child-id');
        expect(result).toBeNull();
    });

    // findByFamYearAccessed
    it('findByFamYearAccessed should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByFamYearAccessed(2024);
        expect(result).toEqual([sampleStatus]);
    });

    it('findByFamYearAccessed should return empty array when no records found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByFamYearAccessed(2000);
        expect(result).toEqual([]);
    });

    // findByCommYearAccessed
    it('findByCommYearAccessed should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByCommYearAccessed(2000);
        expect(result).toEqual([sampleStatus]);
    });

    it('findByCommYearAccessed should return empty array when no records found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByCommYearAccessed(2024);
        expect(result).toEqual([]);
    });

    // findByParticipatesCommunityClub
    it('findByParticipatesCommunityClub should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByParticipatesCommunityClub(true);
        expect(result).toEqual([sampleStatus]);
    });

    it('findByParticipatesCommunityClub should return empty array when no records found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByParticipatesFamilyLife(true);
        expect(result).toEqual([]);
    });

    // findByParticipatesFamilyLife
    it('findByParticipatesFamilyLife should return matching records when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByParticipatesFamilyLife(true);
        expect(result).toEqual([sampleStatus]);
    });

    it('findByParticipatesFamilyLife should return empty array when no records found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (socialProtectionStatusModel.instance as any).findMany = mockFindMany;

        const result = await socialProtectionStatusModel.instance.findByParticipatesFamilyLife(true);
        expect(result).toEqual([]);
    });

    // insertStatus
    it('insertStatus should return created record on success', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleStatus);
        (socialProtectionStatusModel.instance as any).insertOne = mockInsert;

        const result = await socialProtectionStatusModel.instance.insertStatus({
            child_id: 'uuid-child-id',
        });
        expect(result).toEqual(sampleStatus);
    });

    it('insertStatus should return null if insert fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (socialProtectionStatusModel.instance as any).insertOne = mockInsert;

        const result = await socialProtectionStatusModel.instance.insertStatus({
            child_id: 'uuid-child-id',
        });
        expect(result).toBeNull();
    });

    // updateFamYearAccessed
    it('updateFamYearAccessed should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateFamYearAccessed(1, 2024);
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ fam_year_accessed: 2024 }));
        expect(result).toBe(true);
    });

    it('updateFamYearAccessed should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateFamYearAccessed(1, 2024);
        expect(result).toBe(false);
    });

    // updateYearAccessed - NOTE: Updates comm_year_accessed
    it('updateYearAccessed should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateYearAccessed(1, 2024);
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ comm_year_accessed: 2024 }));
        expect(result).toBe(true);
    });

    it('updateYearAccessed should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateYearAccessed(1, 2024);
        expect(result).toBe(false);
    });

    // updateChildReference
    it('updateChildReference should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateChildReference(1, 'uuid-new-child');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining({ child_id: 'uuid-new-child' }));
        expect(result).toBe(true);
    });

    it('updateChildReference should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateChildReference(1, 'uuid-new-child');
        expect(result).toBe(false);
    });

    // updateStatus
    it('updateStatus should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateStatus(1, {
            child_id: 'uuid-child-id',
            fam_year_accessed: 2025,
            comm_year_accessed: 2024
        });

        expect(mockUpdate).toHaveBeenCalledWith(
            { id: 1 },
            expect.objectContaining({
                child_id: 'uuid-child-id',
                fam_year_accessed: 2025,
                comm_year_accessed: 2024
            })
        );
        expect(result).toBe(true);
    });

    it('updateStatus should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (socialProtectionStatusModel.instance as any).updateOne = mockUpdate;

        const result = await socialProtectionStatusModel.instance.updateStatus(1, {
            child_id: 'uuid-child-id',
            fam_year_accessed: 2025,
            comm_year_accessed: 2024
        });
        expect(result).toBe(false);
    });

    /*
    // deleteById
    it('deleteById should return true on successful deletion', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleStatus);
        (socialProtectionStatusModel.instance as any).deleteOne = mockDelete;

        const result = await socialProtectionStatusModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false when record does not exist', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (socialProtectionStatusModel.instance as any).deleteOne = mockDelete;

        const result = await socialProtectionStatusModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(false);
    });

    // deleteByChildId
    it('deleteByChildId should return deleted records array on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue([sampleStatus]);
        (socialProtectionStatusModel.instance as any).deleteMany = mockDelete;

        const result = await socialProtectionStatusModel.instance.deleteByChildId('uuid-child-id');
        expect(mockDelete).toHaveBeenCalledWith({ child_id: 'uuid-child-id' });
        expect(result).toEqual([sampleStatus]);
    });

    it('deleteByChildId should return empty array when no matching records', async () => {
        const mockDelete = vi.fn().mockResolvedValue([]);
        (socialProtectionStatusModel.instance as any).deleteMany = mockDelete;

        const result = await socialProtectionStatusModel.instance.deleteByChildId('uuid-child-id');
        expect(mockDelete).toHaveBeenCalledWith({ child_id: 'uuid-child-id' });
        expect(result).toEqual([]);
    });
    */

});
