import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pwdIdsModel } from '$lib/models/pwdIdsModel.js';
import { supabase } from '$lib/types/client.js';

vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('pwdIdsModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const samplePwd = {
        id: 'uuid-pwd-id',
        pwd_id: 'PWD-12345',
        expiry_date: '2025-12-31'
    };

    function mockFindMany(result: { data: any, error: any }) {
        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnValue({
                match: vi.fn().mockResolvedValue(result)
            })
        });
    }

    // findById
    it('findById should return a record when found', async () => {
        mockFindMany({ data: [samplePwd], error: null });

        const result = await pwdIdsModel.instance.findById('PWD-12345');
        expect(result).toEqual([samplePwd]);
    });

    it('findById should return null when not found', async () => {
        mockFindMany({ data: null, error: null });

        const result = await pwdIdsModel.instance.findById('PWD-12345');
        expect(result).toBeNull();
    });

    // findByExpiryDate
    it('findByExpiryDate should return records when found', async () => {
        mockFindMany({ data: [samplePwd], error: null });

        const result = await pwdIdsModel.instance.findByExpiryDate('2025-12-31');
        expect(result).toEqual([samplePwd]);
    });

    it('findByExpiryDate should return null when not found', async () => {
        mockFindMany({ data: null, error: null });

        const result = await pwdIdsModel.instance.findByExpiryDate('2025-12-31');
        expect(result).toBeNull();
    });

    // insertPwdId
    it('insertPwdId should return created record on success', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: samplePwd, error: null })
                })
            })
        });

        const result = await pwdIdsModel.instance.insertPwdId('PWD-12345', '2025-12-31');
        expect(result).toEqual(samplePwd);
    });

    it('insertPwdId should return null if insert fails', async () => {
        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: () => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } })
                })
            })
        });

        const result = await pwdIdsModel.instance.insertPwdId('PWD-12345', '2025-12-31');
        expect(result).toBeNull();
    });

    // updateId
    it('updateId should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (pwdIdsModel.instance as any).updateOne = mockUpdate;

        const result = await pwdIdsModel.instance.updateId('uuid-pwd-id', 'PWD-67890');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-pwd-id' }, { pwd_id: 'PWD-67890' });
        expect(result).toBe(true);
    });

    it('updateId should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (pwdIdsModel.instance as any).updateOne = mockUpdate;

        const result = await pwdIdsModel.instance.updateId('uuid-pwd-id', 'PWD-67890');
        expect(result).toBe(false);
    });

    // updateExpiryDate
    it('updateExpiryDate should return true on success', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (pwdIdsModel.instance as any).updateOne = mockUpdate;

        const result = await pwdIdsModel.instance.updateExpiryDate('uuid-pwd-id', '2026-01-01');
        expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-pwd-id' }, { expiry_date: '2026-01-01' });
        expect(result).toBe(true);
    });

    it('updateExpiryDate should return false on failure', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (pwdIdsModel.instance as any).updateOne = mockUpdate;

        const result = await pwdIdsModel.instance.updateExpiryDate('uuid-pwd-id', '2026-01-01');
        expect(result).toBe(false);
    });

    function mockDeleteOne(result: any) {
        (pwdIdsModel.instance as any).deleteOne = vi.fn().mockResolvedValue(result);
    }

    // deleteById
    it('deleteById should return true on success', async () => {
        mockDeleteOne(samplePwd);

        const result = await pwdIdsModel.instance.deleteById('uuid-id');
        expect(result).toBe(true);
    });

    it('deleteById should return false if not found', async () => {
        mockDeleteOne(null);

        const result = await pwdIdsModel.instance.deleteById('uuid-id');
        expect(result).toBe(false);
    });

    // deleteByPwdId
    it('deleteByPwdId should return true on success', async () => {
        mockDeleteOne(samplePwd);

        const result = await pwdIdsModel.instance.deleteByPwdId('PWD-123');
        expect(result).toBe(true);
    });

    it('deleteByPwdId should return false if not found', async () => {
        mockDeleteOne(null);

        const result = await pwdIdsModel.instance.deleteByPwdId('PWD-123');
        expect(result).toBe(false);
    });

    // deleteByExpiryDate
    it('deleteByExpiryDate should return true on success', async () => {
        mockDeleteOne(samplePwd);

        const result = await pwdIdsModel.instance.deleteByExpiryDate('2025-12-31');
        expect(result).toBe(true);
    });

    it('deleteByExpiryDate should return false if not found', async () => {
        mockDeleteOne(null);

        const result = await pwdIdsModel.instance.deleteByExpiryDate('2025-12-31');
        expect(result).toBe(false);
    });
});
