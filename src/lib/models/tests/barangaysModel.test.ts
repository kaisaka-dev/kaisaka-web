import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BarangaysModel } from '$lib/models/barangaysModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('BarangaysModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleBarangay = {
    id: 1,
    name: 'Test',
    city: 'City',
    barangay: 'User',
    num: '09121231234'
  };

  //Create

  it('create_barangay should return null when there are missing required fields', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Missing required fields' }
      });
  
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });
  
      const result = await BarangaysModel.instance.create_barangay({} as any);
      expect(result).toBeNull();
    });


  //Read

  it('get_barangay should return a Barangay when ID is found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: sampleBarangay,
      error: null
    });

    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await BarangaysModel.instance.get_barangay(1);

    expect(supabase.from).toHaveBeenCalledWith('barangays');
    expect(mockMatch).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(sampleBarangay);
  });

  it('get_barangay should return null when ID is not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await BarangaysModel.instance.get_barangay(999);
    expect(result).toBeNull();
  });
  
  it('get_barangay should throw an error when given a non-numeric ID', async () => {
    const mockMatch = vi.fn();
    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    await expect(BarangaysModel.instance.get_barangay('ID' as any)).rejects.toThrow();
  });

  it('get_all_barangays should return an array of barangays', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [
        sampleBarangay,
        { id: 2, name: 'Test2', city: 'Ci2' }
      ],
      error: null
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await BarangaysModel.instance.get_all_barangays();

    expect(supabase.from).toHaveBeenCalledWith('barangays');
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('get_all_barangays should return an empty array when no data found', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await BarangaysModel.instance.get_all_barangays();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  //Update

it('update_barangay should update a barangay and return updated record', async () => {
    const updates = { num: '09999999999' };

    const mockUpdate = vi.fn().mockReturnValue({
      eq: () => ({
        select: () => Promise.resolve({
          data: [{ id: 1, ...updates }],
          error: null
        })
      })
    });

    (supabase.from as any).mockReturnValue({
      update: mockUpdate
    });

    const result = await BarangaysModel.instance.update_barangay(1, updates);

    expect(supabase.from).toHaveBeenCalledWith('barangays');
    expect(result).toEqual({ id: 1, ...updates });
  });

  it('update_barangay should handle invalid update fields', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Invalid field' }
    });

    const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });

    (supabase.from as any).mockReturnValue({
      update: () => ({ eq: mockEq })
    });

    const result = await BarangaysModel.instance.update_barangay(1, { unknown: 'field' });
    expect(result).toBeNull();
  });

  //Delete

  it('delete_barangay should delete a barangay and return true', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: () => Promise.resolve({
          data: sampleBarangay,
          error: null
        })
      });
  
      (supabase.from as any).mockReturnValue({
        delete: mockDelete
      });
  
      const result = await BarangaysModel.instance.delete_barangay(1);
  
      expect(supabase.from).toHaveBeenCalledWith('barangays');
      expect(result).toBe(true);
    });

  it('delete_barangay should return false when ID does not exist', async () => {
      const mockDelete = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      });
  
      const mockEq = vi.fn().mockReturnValue({ delete: mockDelete });
  
      (supabase.from as any).mockReturnValue({
        delete: () => ({ eq: mockEq })
      });
  
      const result = await BarangaysModel.instance.delete_barangay(999);
      expect(result).toBe(false);
    });
});