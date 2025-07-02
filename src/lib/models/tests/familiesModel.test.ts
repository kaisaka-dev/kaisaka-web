import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FamiliesModel } from '$lib/models/familiesModel.js';
import { supabase } from '$lib/types/supabase.js';

vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('FamiliesModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleFamily = {
    id: 'uuid-family-id',
    date_created: new Date().toISOString()
  };

  // createFamily
  it('createFamily should return the newly created family', async () => {
    const mockInsert = vi.fn().mockResolvedValue(sampleFamily);
    (FamiliesModel.instance as any).insertOne = mockInsert;

    const result = await FamiliesModel.instance.createFamily();
    expect(result).toEqual(sampleFamily);
    expect(mockInsert).toHaveBeenCalled();
  });

  it('createFamily should return null if insertion fails', async () => {
    const mockInsert = vi.fn().mockResolvedValue(null);
    (FamiliesModel.instance as any).insertOne = mockInsert;

    const result = await FamiliesModel.instance.createFamily();
    expect(result).toBeNull();
  });

  // findById
  it('findById should return a family record if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleFamily);
    (FamiliesModel.instance as any).findOne = mockFind;

    const result = await FamiliesModel.instance.findById('uuid-family-id');
    expect(result).toEqual(sampleFamily);
    expect(mockFind).toHaveBeenCalledWith({ id: 'uuid-family-id' });
  });

  it('findById should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (FamiliesModel.instance as any).findOne = mockFind;

    const result = await FamiliesModel.instance.findById('uuid-family-id');
    expect(result).toBeNull();
  });

  // getAll
  it('getAll should return an array of families when found', async () => {
    const mockFindMany = vi.fn().mockResolvedValue([sampleFamily]);
    (FamiliesModel.instance as any).findMany = mockFindMany;

    const result = await FamiliesModel.instance.getAll();
    expect(result).toEqual([sampleFamily]);
  });

  it('getAll should return null when no families found', async () => {
    const mockFindMany = vi.fn().mockResolvedValue(null);
    (FamiliesModel.instance as any).findMany = mockFindMany;

    const result = await FamiliesModel.instance.getAll();
    expect(result).toBeNull();
  });

  // deleteById
  it('deleteById should return true when deletion is successful', async () => {
    const mockDelete = vi.fn().mockResolvedValue(sampleFamily);
    (FamiliesModel.instance as any).deleteOne = mockDelete;

    const result = await FamiliesModel.instance.deleteById('uuid-family-id');
    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ id: 'uuid-family-id' });
  });

  it('deleteById should return false when family is not found', async () => {
    const mockDelete = vi.fn().mockResolvedValue(null);
    (FamiliesModel.instance as any).deleteOne = mockDelete;

    const result = await FamiliesModel.instance.deleteById('uuid-family-id');
    expect(result).toBe(false);
  });
});
