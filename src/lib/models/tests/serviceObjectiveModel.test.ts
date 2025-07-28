import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceObjectiveModel } from '$lib/models/serviceObjectiveModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('ServiceObjectiveModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const sampleServiceObjective = {
        id: 1,
        annual_program_id: 1,
        service_category_id: 1,
        name: 'Service Objective'
    };

    // insertServiceObjective
    it('insertServiceObjective should return inserted service objective', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleServiceObjective);
        (ServiceObjectiveModel.instance as any).insertOne = mockInsert;

        const result = await ServiceObjectiveModel.instance.insertServiceObjective(1, 1, 'Service Objective');
        expect(mockInsert).toHaveBeenCalledWith({ annual_program_id: 1, service_category_id: 1, objective_description: 'Service Objective' });
        expect(result).toEqual(sampleServiceObjective);
    });

    it('insertServiceObjective should return null if insert fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).insertOne = mockInsert;

        const result = await ServiceObjectiveModel.instance.insertServiceObjective(1, 1, 'Service Objective');
        expect(result).toBeNull();
    })

    // findById
    it('findById should return found service objective', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleServiceObjective);
        (ServiceObjectiveModel.instance as any).findOne = mockFindOne;

        const result = await ServiceObjectiveModel.instance.findById(1);
        expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(sampleServiceObjective);
    });

    it('findById should return null if not found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).findOne = mockFindOne;

        const result = await ServiceObjectiveModel.instance.findById(1);
        expect(result).toBeNull();
    })

    // findByAnnualProgramId
    it('findByAnnualProgramId should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(ServiceObjectiveModel);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByAnnualProgramId(1);
        expect(mockFindMany).toHaveBeenCalledWith({ annual_program_id: 1 });
        expect(result).toEqual(ServiceObjectiveModel);
    });

    it('findByAnnualProgramId should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByAnnualProgramId(999);
        expect(result).toEqual([]);
    });

    // findByServiceCategoryId
    it('findByServiceCategoryId should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(ServiceObjectiveModel);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByServiceCategoryId(1);
        expect(mockFindMany).toHaveBeenCalledWith({ service_category_id: 1 });
        expect(result).toEqual(ServiceObjectiveModel);
    });

    it('findByServiceCategoryId should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByServiceCategoryId(999);
        expect(result).toEqual([]);
    });

    // findByDescriptionKeyword
    it('findByDescriptionKeyword should return major target activity when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(ServiceObjectiveModel);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByDescriptionKeyword('Service');
        expect(mockFindMany).toHaveBeenCalledWith({ objective_description: 'Service' });
        expect(result).toEqual(ServiceObjectiveModel);
    });

    it('findByDescriptionKeyword should return empty array when not found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (ServiceObjectiveModel.instance as any).findMany = mockFindMany;

        const result = await ServiceObjectiveModel.instance.findByDescriptionKeyword('dus');
        expect(result).toEqual([]);
    });

    // updateObjectiveDescription
    it('updateObjectiveDescription should return updated service objective', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(sampleServiceObjective);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateObjectiveDescription(1, 'Service Objective');
        expect(mockUpdateOne).toHaveBeenCalledWith({ id: 1 }, { objective_description: 'Service Objective' });
        expect(result).toEqual(sampleServiceObjective);
    });

    it('updateObjectiveDescription should return null if not found', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateObjectiveDescription(1, 'Service Objective');
        expect(result).toBeNull();
    })

    // updateServiceCategoryId
    it('updateServiceCategoryId should return updated service objective', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(sampleServiceObjective);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateServiceCategoryId(1, 1);
        expect(mockUpdateOne).toHaveBeenCalledWith({ id: 1 }, { service_category_id: 1 });
        expect(result).toEqual(sampleServiceObjective);
    });

    it('updateServiceCategoryId should return null if not found', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateServiceCategoryId(1, 1);
        expect(result).toBeNull();
    })

    // updateAnnualProgramId
    it('updateAnnualProgramId should return updated service objective', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(sampleServiceObjective);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateAnnualProgramId(1, 1);
        expect(mockUpdateOne).toHaveBeenCalledWith({ id: 1 }, { annual_program_id: 1 });
        expect(result).toEqual(sampleServiceObjective);
    });

    it('updateAnnualProgramId should return null if not found', async () => {
        const mockUpdateOne = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).updateOne = mockUpdateOne;

        const result = await ServiceObjectiveModel.instance.updateAnnualProgramId(1, 1);
        expect(result).toBeNull();
    })

    // deleteById
    it('deleteById should return true on success', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (ServiceObjectiveModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceObjectiveModel.instance.deleteById(1);
        expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(true);
    });

    it('deleteById should return false on failure', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (ServiceObjectiveModel.instance as any).deleteOne = mockDelete;

        const result = await ServiceObjectiveModel.instance.deleteById(1);
        expect(result).toBe(false);
    });
});