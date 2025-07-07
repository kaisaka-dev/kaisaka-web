import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MembershipPaymentModel } from '$lib/models/MembershipPaymentModel.js';
import { supabase } from '$lib/types/supabase.js';

vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('MembershipPaymentModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const samplePayment = {
        annual_program_id: 1,
        family_id: 'uuid-family-id',
        amount_paid: 1000,
        date_paid: '2025-06-01T00:00:00.000Z',
        date_created: '2025-06-01T00:00:00.000Z',
        remarks: 'Paid in full'
    };

    // insertPayment
    it('insertPayment should return created record on success', async () => {
        const mockInsert = vi.fn().mockResolvedValue(samplePayment);
        (MembershipPaymentModel.instance as any).insertOne = mockInsert;

        const result = await MembershipPaymentModel.instance.insertPayment(1, 'uuid-family-id', 1000, '2025-06-01T00:00:00.000Z', 'Paid in full');
        expect(result).toEqual(samplePayment);
    });

    it('insertPayment should return null on failure', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).insertOne = mockInsert;

        const result = await MembershipPaymentModel.instance.insertPayment(1, 'uuid-family-id');
        expect(result).toBeNull();
    });

    // findByFamilyId
    it('findByFamilyId should return records on success', async () => {
        const mockFind = vi.fn().mockResolvedValue([samplePayment]);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByFamilyId('uuid-family-id');
        expect(result).toEqual([samplePayment]);
    });

    it('findByFamilyId should return null on failure', async () => {
        const mockFind = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByFamilyId('uuid-family-id');
        expect(result).toBeNull();
    });

    // findByAnnualProgramId
    it('findByAnnualProgramId should return records on success', async () => {
        const mockFind = vi.fn().mockResolvedValue([samplePayment]);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByAnnualProgramId(1);
        expect(result).toEqual([samplePayment]);
    });

    it('findByAnnualProgramId should return null on failure', async () => {
        const mockFind = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByAnnualProgramId(1);
        expect(result).toBeNull();
    });

    // findByFamilyAndProgram
    it('findByFamilyAndProgram should return records on success', async () => {
        const mockFind = vi.fn().mockResolvedValue([samplePayment]);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByFamilyAndProgram('uuid-family-id', 1);
        expect(result).toEqual([samplePayment]);
    });

    it('findByFamilyAndProgram should return null on failure', async () => {
        const mockFind = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findByFamilyAndProgram('uuid-family-id', 1);
        expect(result).toBeNull();
    });

    // findByAmountRange
    it('findByAmountRange should return results in range', async () => {
        const mockQuery = {
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ data: [samplePayment], error: null })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findByAmountRange(500, 2000);
        expect(result).toEqual([samplePayment]);
    });

    it('findByAmountRange should return null on query error', async () => {
        const mockQuery = {
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ data: null, error: {} })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findByAmountRange(500, 2000);
        expect(result).toBeNull();
    });

    // findByDateRange
    it('findByDateRange should return records within date range', async () => {
        const mockQuery = {
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ data: [samplePayment], error: null })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findByDateRange('2025-01-01', '2025-12-31');
        expect(result).toEqual([samplePayment]);
    });

    it('findByDateRange should return null on error', async () => {
        const mockQuery = {
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ data: null, error: {} })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findByDateRange('2025-01-01', '2025-12-31');
        expect(result).toBeNull();
    });

    // findUnpaidRecords
    it('findUnpaidRecords should return unpaid records with program ID', async () => {
        const mockFind = vi.fn().mockResolvedValue([samplePayment]);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findUnpaidRecords(1);
        expect(result).toEqual([samplePayment]);
    });

    it('findUnpaidRecords should return null on error', async () => {
        const mockFind = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.findUnpaidRecords();
        expect(result).toBeNull();
    });

    // findPaidRecords
    it('findPaidRecords should return paid records', async () => {
        const mockQuery = {
            not: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [samplePayment], error: null })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findPaidRecords(1);
        expect(result).toEqual([samplePayment]);
    });

    it('findPaidRecords should return null on error', async () => {
        const mockQuery = {
            not: vi.fn().mockResolvedValue({ data: null, error: {} })
        };
        (MembershipPaymentModel.instance as any).getQuery = vi.fn().mockReturnValue(mockQuery);

        const result = await MembershipPaymentModel.instance.findPaidRecords();
        expect(result).toBeNull();
    });


    // getAll
    it('getAll should return all records with filter', async () => {
        const mockFind = vi.fn().mockResolvedValue([samplePayment]);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.getAll({ family_id: 'uuid-family-id' });
        expect(result).toEqual([samplePayment]);
    });

    it('getAll should return null when no records found', async () => {
        const mockFind = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).findMany = mockFind;

        const result = await MembershipPaymentModel.instance.getAll();
        expect(result).toBeNull();
    });

    // updateAmountPaid
    it('updateAmountPaid should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateAmountPaid(1, 'uuid-family-id', 500);
        expect(result).toBe(true);
    });

    it('updateAmountPaid should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateAmountPaid(1, 'uuid-family-id', 500);
        expect(result).toBe(false);
    });

    // updateDatePaid
    it('updateDatePaid should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateDatePaid(1, 'uuid-family-id', '2025-06-20');
        expect(result).toBe(true);
    });

    it('updateDatePaid should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateDatePaid(1, 'uuid-family-id', '2025-06-20');
        expect(result).toBe(false);
    });

    // updateRemarks
    it('updateRemarks should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateRemarks(1, 'uuid-family-id', 'Updated remarks');
        expect(result).toBe(true);
    });

    it('updateRemarks should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updateRemarks(1, 'uuid-family-id', 'Updated remarks');
        expect(result).toBe(false);
    });

    // recordPayment
    it('recordPayment should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.recordPayment(1, 'uuid-family-id', 800, '2025-06-20');
        expect(result).toBe(true);
    });

    it('recordPayment should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.recordPayment(1, 'uuid-family-id', 800);
        expect(result).toBe(false);
    });

    // updatePayment
    it('updatePayment should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updatePayment(1, 'uuid-family-id', {
            amount_paid: 1200,
            remarks: 'Paid late'
        });
        expect(result).toBe(true);
    });

    it('updatePayment should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (MembershipPaymentModel.instance as any).updateOne = mockUpdate;

        const result = await MembershipPaymentModel.instance.updatePayment(1, 'uuid-family-id', {
            amount_paid: 1200
        });
        expect(result).toBe(false);
    });

    // deleteByFamilyAndProgram
    it('deleteByFamilyAndProgram should return true when deleted', async () => {
        const mockDelete = vi.fn().mockResolvedValue(samplePayment);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByFamilyAndProgram(1, 'uuid-family-id');
        expect(result).toBe(true);
    });

    it('deleteByFamilyAndProgram should return false when not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByFamilyAndProgram(1, 'uuid-family-id');
        expect(result).toBe(false);
    });

    // deleteByFamilyId
    it('deleteByFamilyId should return true when deleted', async () => {
        const mockDelete = vi.fn().mockResolvedValue(samplePayment);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByFamilyId('uuid-family-id');
        expect(result).toBe(true);
    });

    it('deleteByFamilyId should return false when not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByFamilyId('uuid-family-id');
        expect(result).toBe(false);
    });

    // deleteByAnnualProgramId
    it('deleteByAnnualProgramId should return true when deleted', async () => {
        const mockDelete = vi.fn().mockResolvedValue(samplePayment);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByAnnualProgramId(1);
        expect(result).toBe(true);
    });

    it('deleteByAnnualProgramId should return false when not found', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (MembershipPaymentModel.instance as any).deleteOne = mockDelete;

        const result = await MembershipPaymentModel.instance.deleteByAnnualProgramId(1);
        expect(result).toBe(false);
    });
});