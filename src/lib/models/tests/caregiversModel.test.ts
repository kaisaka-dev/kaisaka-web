import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaregiversModel } from '$lib/models/caregiversModel.ts';
import { supabase } from '$lib/types/client.ts';

vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('CaregiversModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // get_caregiver
  it('get_caregiver should return a caregiver object when found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        id: 1,
        member_id: 1,
        contact_number: '09123456789',
        facebook_link: 'fb.com/test',
        email: 'test@example.com',
        occupation: 'Test',
        Remarks: 'Test'
      },
      error: null
    });

    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await CaregiversModel.instance.get_caregiver(1);

    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(mockMatch).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({
      id: 1,
      member_id: 1,
      contact_number: '09123456789',
      facebook_link: 'fb.com/test',
      email: 'test@example.com',
      occupation: 'Test',
      Remarks: 'Test'
    });
  });

  it('get_caregiver should return null when not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await CaregiversModel.instance.get_caregiver(999);
    expect(result).toBeNull();
  });

  it('get_caregiver should throw an error when given a non-numeric ID', async () => {
    const mockMatch = vi.fn();
    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    await expect(CaregiversModel.instance.get_caregiver('invalid-id' as any)).rejects.toThrow();
  });

  // get_all_caregivers 
  it('get_all_caregivers should return a list of caregivers', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [
        { id: 1, member_id: 1 },
        { id: 2, member_id: 2 }
      ],
      error: null
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await CaregiversModel.instance.get_all_caregivers();

    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('get_all_caregivers should return an empty array when no data found', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await CaregiversModel.instance.get_all_caregivers();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  // create_caregiver
  it('create_caregiver should insert caregiver and return the created record', async () => {
    const newCaregiver = {
      member_id: 3,
      contact_number: '09998887777',
      facebook_link: 'fb.com/new',
      email: 'new@example.com',
      occupation: 'Nurse',
      Remarks: 'New'
    };

    const mockInsert = vi.fn().mockReturnValue({
      select: () => Promise.resolve({
        data: [{ id: 10, ...newCaregiver }],
        error: null
      })
    });

    (supabase.from as any).mockReturnValue({
      insert: mockInsert
    });

    const result = await CaregiversModel.instance.create_caregiver(newCaregiver);

    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(mockInsert).toHaveBeenCalledWith(newCaregiver);
    expect(result).toEqual({ id: 10, ...newCaregiver });
  });

  it('create_caregiver should handle missing fields', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Missing required fields' }
    });

    (supabase.from as any).mockReturnValue({
      insert: mockInsert
    });

    const result = await CaregiversModel.instance.create_caregiver({} as any);
    expect(result).toBeNull();
  });

  // update_caregiver
  it('update_caregiver should update a caregiver and return updated record', async () => {
    const updates = { contact_number: '09999999999' };

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

    const result = await CaregiversModel.instance.update_caregiver(1, updates);

    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(result).toEqual({ id: 1, ...updates });
  });

  it('update_caregiver should handle invalid update fields', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Invalid field' }
    });

    const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });

    (supabase.from as any).mockReturnValue({
      update: () => ({ eq: mockEq })
    });

    const result = await CaregiversModel.instance.update_caregiver(1, { unknown: 'field' });
    expect(result).toBeNull();
  });

  // delete_caregiver
  it('delete_caregiver should delete a caregiver and return true', async () => {
    const mockDelete = vi.fn().mockReturnValue({
      eq: () => Promise.resolve({
        data: [{ id: 1 }],
        error: null
      })
    });

    (supabase.from as any).mockReturnValue({
      delete: mockDelete
    });

    const result = await CaregiversModel.instance.delete_caregiver(1);

    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(result).toBe(true);
  });

  it('delete_caregiver should return false when ID does not exist', async () => {
    const mockDelete = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Not found' }
    });

    const mockEq = vi.fn().mockReturnValue({ delete: mockDelete });

    (supabase.from as any).mockReturnValue({
      delete: () => ({ eq: mockEq })
    });

    const result = await CaregiversModel.instance.delete_caregiver(999);
    expect(result).toBe(false);
  });
});
