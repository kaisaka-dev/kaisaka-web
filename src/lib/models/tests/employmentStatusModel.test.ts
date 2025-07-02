import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmploymentStatusModel } from '$lib/models/employmentStatusModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('EmploymentStatusModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleEmployment = {
        id: 1,
        able_to_work: true,
        employment_type: 'Wage Employed',
        member_id: 'uuid-member-id'
    };

    // insertEmploymentStatus
    it('insertEmploymentStatus should return created record on success', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleEmployment, error: null })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.insertEmploymentStatus(true, 'Wage Employed', 'uuid-member-id');
        expect(result).toEqual(sampleEmployment);
    });

    it('insertEmploymentStatus should return null if insert fails', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.insertEmploymentStatus(true, 'Wage Employed', 'uuid-member-id');
        expect(result).toBeNull();
    });

    // findById
    it('findById should return record when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleEmployment, error: null })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.findById(1);
        expect(result).toEqual(sampleEmployment);
    });

    it('findById should return null when not found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByMemberId
    it('findByMemberId should return record when found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: sampleEmployment, error: null })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.findByMemberId('uuid-member-id');
        expect(result).toEqual(sampleEmployment);
    });

    it('findByMemberId should return null when not found', async () => {
        (supabase.from as any).mockReturnValue({
            select: () => ({
                match: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null })
                })
            })
        });

        const result = await EmploymentStatusModel.instance.findByMemberId('uuid-member-id');
        expect(result).toBeNull();
    });

    // updateEmploymentStatus
    it('updateEmploymentStatus should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (EmploymentStatusModel.instance as any).updateOne = mockUpdate;

        const result = await EmploymentStatusModel.instance.updateEmploymentStatus(1, true, 'Self-Employed');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { able_to_work: true, employment_type: 'Self-Employed' });
        expect(result).toBe(true);
    });

    it('updateEmploymentStatus should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (EmploymentStatusModel.instance as any).updateOne = mockUpdate;

        const result = await EmploymentStatusModel.instance.updateEmploymentStatus(1, true, 'Self-Employed');
        expect(result).toBe(false);
    });

    // deleteById
    it('deleteById should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleEmployment);
        (EmploymentStatusModel.instance as any).deleteOne = mockDelete;

        const result = await EmploymentStatusModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false when deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (EmploymentStatusModel.instance as any).deleteOne = mockDelete;

        const result = await EmploymentStatusModel.instance.deleteById(1);
        expect(result).toBe(false);
    });

    // deleteByMemberId
    it('deleteByMemberId should return true when deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(sampleEmployment);
        (EmploymentStatusModel.instance as any).deleteOne = mockDelete;

        const result = await EmploymentStatusModel.instance.deleteByMemberId('uuid-member-id');
        expect(mockDelete).toHaveBeenCalledWith({ member_id: 'uuid-member-id' });
        expect(result).toBe(true);
    });

    it('deleteByMemberId should return false when deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (EmploymentStatusModel.instance as any).deleteOne = mockDelete;

        const result = await EmploymentStatusModel.instance.deleteByMemberId('uuid-member-id');
        expect(result).toBe(false);
    });
});
