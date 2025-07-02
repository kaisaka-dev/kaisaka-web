import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MembershipAnnualRenewalModel } from '$lib/models/MemberShipAnnualRenewalModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('MembershipAnnualRenewalModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleRenewal = {
        id: 1,
        annual_program_id: 101,
        family_id: 'uuid-family',
        total_amount_due: 200,
        remarks: 'This is the ideal remark. You may not like it, but this is what peak remarking looks like.',
        date_created: '2025-01-01T00:00:00Z',
        last_updated: '2025-01-01T00:00:00Z'
    };

    // insertRenewal
    it('insertRenewal should return created record on success', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleRenewal, error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.insertRenewal(101, 'uuid-family', 200, 'Initial remarks');
        expect(result).toEqual(sampleRenewal);
    });

    it('insertRenewal should return null on insert failure', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.insertRenewal(101, 'uuid-family', 200, 'Initial remarks');
        expect(result).toBeNull();
    });

    // findById
    it('findById should return renewal when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleRenewal, error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findById(1);
        expect(result).toEqual(sampleRenewal);
    });

    it('findById should return null if not found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByFamilyId
    it('findByFamilyId should return results when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: [sampleRenewal], error: null })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByFamilyId('uuid-family');
        expect(result).toEqual([sampleRenewal]);
    });

    it('findByFamilyId should return null if error', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByFamilyId('uuid-family');
        expect(result).toBeNull();
    });

    // findByAnnualProgramId
    it('findByAnnualProgramId should return results when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: [sampleRenewal], error: null })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByAnnualProgramId(101);
        expect(result).toEqual([sampleRenewal]);
    });

    it('findByAnnualProgramId should return null if error', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: null, error: { message: 'Err' } })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByAnnualProgramId(101);
        expect(result).toBeNull();
    });

    // findByFamilyAndProgram
    it('findByFamilyAndProgram should return result when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleRenewal, error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByFamilyAndProgram('uuid-family', 101);
        expect(result).toEqual(sampleRenewal);
    });

    it('findByFamilyAndProgram should return null if not found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByFamilyAndProgram('uuid-family', 101);
        expect(result).toBeNull();
    });

    // findByAmountRange
    it('findByAmountRange should return records within range', async () => {
        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    lte: vi.fn().mockResolvedValue({ data: [sampleRenewal], error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByAmountRange(100, 300);
        expect(result).toEqual([sampleRenewal]);
    });


    it('findByAmountRange should return null on error', async () => {
        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    lte: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByAmountRange(100, 300);
        expect(result).toBeNull();
    });

    it('findByAmountRange should handle no max_amount', async () => {
        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ data: [sampleRenewal], error: null })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.findByAmountRange(100);
        expect(result).toEqual([sampleRenewal]);
    });

    // getAll
    it('getAll should return all records with no filters', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: [sampleRenewal], error: null })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.getAll();
        expect(result).toEqual([sampleRenewal]);
    });

    it('getAll should return null if query fails', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.getAll();
        expect(result).toBeNull();
    });

    // updateAmountDue
    it('updateAmountDue should return true on success', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: [{}], error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateAmountDue(1, 999);
        expect(result).toBe(true);
    });

    it('updateAmountDue should return false on failure', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Failed' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateAmountDue(1, 999);
        expect(result).toBe(false);
    });

    // updateRemarks
    it('updateRemarks should return true on success', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: [{}], error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateRemarks(1, 'Remark is no longer peak');
        expect(result).toBe(true);
    });

    it('updateRemarks should return false on failure', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Failed' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateRemarks(1, 'Remark will still be peak as this should fail');
        expect(result).toBe(false);
    });

    // updateAnnualProgram
    it('updateAnnualProgram should return true on success', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: [{}], error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateAnnualProgram(1, 888);
        expect(result).toBe(true);
    });

    it('updateAnnualProgram should return false on failure', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Failed' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateAnnualProgram(1, 888);
        expect(result).toBe(false);
    });

    // updateRenewal
    it('updateRenewal should return true on success', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: [{}], error: null })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateRenewal(1, {
            total_amount_due: 2000,
            remarks: 'Remark is no longer peak'
        });
        expect(result).toBe(true);
    });

    it('updateRenewal should return false on failure', async () => {
        (supabase.from as any).mockReturnValue({
            update: vi.fn().mockReturnValue({
                match: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Failed' } })
                })
            })
        });

        const result = await MembershipAnnualRenewalModel.instance.updateRenewal(1, {
            total_amount_due: 2000,
            remarks: 'Remark will still be peak as this should fail'
        });
        expect(result).toBe(false);
    });

    // deleteById
    it('deleteById should return true on successful delete', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleRenewal);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteById(1);
        expect(result).toBe(true);
    });

    it('deleteById should return false if record not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByFamilyId
    it('deleteByFamilyId should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleRenewal);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteByFamilyId('uuid-family');
        expect(result).toBe(true);
    });

    it('deleteByFamilyId should return false if not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteByFamilyId('uuid-family');
        expect(result).toBe(false);
    });

    // deleteByAnnualProgramId
    it('deleteByAnnualProgramId should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleRenewal);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteByAnnualProgramId(101);
        expect(result).toBe(true);
    });

    it('deleteByAnnualProgramId should return false if not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipAnnualRenewalModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipAnnualRenewalModel.instance.deleteByAnnualProgramId(101);
        expect(result).toBe(false);
    });
});