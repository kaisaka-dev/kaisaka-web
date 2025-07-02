import { describe, it, expect, vi, beforeEach } from 'vitest';
import { annualProgramModel } from '$lib/models/annualProgramModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('annualProgramModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleProgram = {
        id: 1,
        start_year: 2023,
        start_month: 1,
        start_date: 1,
        end_year: 2023,
        end_month: 12,
        end_date: 31,
        target_new_cwds: 50,
        general_reflection: 'Reflection',
        lessons_learned: 'Learned a lot',
        date_created: '2023-01-01T00:00:00.000Z'
    };

    // findByStartYear
    it('findByStartYear should return programs based on the start year', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleProgram], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByStartYear(2023);
        expect(result).toEqual([sampleProgram]);
    });

    it('findByStartYear should return empty array when no results found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByStartYear(2024);
        expect(result).toEqual([]);
    });

    it('findByStartYear should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByStartYear(2023);
        expect(result).toBeNull();
    });

    // findByEndYear
    it('findByEndYear should return programs based on the end year', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleProgram], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByEndYear(2023);
        expect(result).toEqual([sampleProgram]);
    });

    it('findByEndYear should return empty array when no results found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByEndYear(2024);
        expect(result).toEqual([]);
    });

    it('findByEndYear should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByEndYear(2023);
        expect(result).toBeNull();
    });

    // findByTargetCwds
    it('findByTargetCwds should return programs based on target CWD count', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [sampleProgram], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByTargetCwds(50);
        expect(result).toEqual([sampleProgram]);
    });

    it('findByTargetCwds should return empty array when no results found', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByTargetCwds(51);
        expect(result).toEqual([]);
    });

    it('findByTargetCwds should return null on query error', async () => {
        const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
        (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

        const result = await annualProgramModel.instance.findByTargetCwds(50);
        expect(result).toBeNull();
    });

    // insertAnnualProgram
    it('insertAnnualProgram should insert and return new program', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: sampleProgram, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const { id, date_created, ...newProgram } = sampleProgram;
        const result = await annualProgramModel.instance.insertAnnualProgram(newProgram);

        expect(result).toEqual(sampleProgram);
    });

    it('insertAnnualProgram should return null on insert error', async () => {
        const mockInsert = vi.fn().mockReturnValue({
            select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Insert failed' } })
            })
        });

        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        const { id, date_created, ...newProgram } = sampleProgram;
        const result = await annualProgramModel.instance.insertAnnualProgram(newProgram);

        expect(result).toBeNull();
    });

    // updateProgramDates
    it('updateProgramDates should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateProgramDates(1, { start_year: 2024 });
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { start_year: 2024 });
        expect(result).toBe(true);
    });

    it('updateProgramDates should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateProgramDates(1, { start_year: 2024 });
        expect(result).toBe(false);
    });

    // updateProgramContent
    it('updateProgramContent should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateProgramContent(1, { general_reflection: 'Updated' });
        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, { general_reflection: 'Updated' });
        expect(result).toBe(true);
    });

    it('updateProgramContent should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateProgramContent(1, { general_reflection: 'Updated' });
        expect(result).toBe(false);
    });

    // updateFullProgram
    const updates = {
        start_year: 2024,
        end_year: 2025,
        target_new_cwds: 100,
        general_reflection: 'Updated Reflection',
        lessons_learned: 'Learned a lot more'
    };

    it('updateFullProgram should return true on success with multiple fields', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateFullProgram(1, updates);

        expect(mockUpdate).toHaveBeenCalledWith({ id: 1 }, updates);
        expect(result).toBe(true);
    });

    it('updateFullProgram should return false on failure with multiple fields', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (annualProgramModel.instance as any).updateOne = mockUpdate;

        const result = await annualProgramModel.instance.updateFullProgram(1, updates);

        expect(result).toBe(false);
    });

    /*
    // deleteAnnualProgram
    it('deleteAnnualProgram should return true when successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (annualProgramModel.instance as any).deleteOne = mockDelete;

        const result = await annualProgramModel.instance.deleteAnnualProgram(1);

        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteAnnualProgram should return false when no such program exists', async () => {
        const mockDelete = vi.fn().mockResolvedValue(false);
        (annualProgramModel.instance as any).deleteOne = mockDelete;

        const result = await annualProgramModel.instance.deleteAnnualProgram(999);

        expect(mockDelete).toHaveBeenCalledWith({ id: 999 });
        expect(result).toBe(false);
    });
    */
});
