import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MembersModel } from '$lib/models/members.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('MembersModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleMember = {
    id: 1,
    first_name: 'Test',
    middle_name: 'M',
    last_name: 'User',
    birthday: '2000-01-01',
    sex: 'Male',
    street_id: 101,
    barangay: 5,
    admission_date: '2020-01-01',
    date_created: '2020-01-01',
    last_updated: '2021-01-01',
    last_approved: '2021-06-01'
  };

  // get_caregiver
  it('get_caregiver should return a member when found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 1, first_name: 'Test', last_name: 'User' },
      error: null
    });

    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await MembersModel.instance.get_caregiver(1);

    expect(result).toEqual({ id: 1, first_name: 'Test', last_name: 'User' });
    expect(supabase.from).toHaveBeenCalledWith('caregivers');
    expect(mockMatch).toHaveBeenCalledWith({ id: 1 });
  });

  it('get_caregiver should return null when member not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Not found' }
    });

    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await MembersModel.instance.get_caregiver(999);
    expect(result).toBeNull();
  });

  it('get_caregiver should throw if ID is invalid', async () => {
    const mockMatch = vi.fn();
    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    await expect(MembersModel.instance.get_caregiver('invalid' as any)).rejects.toThrow();
  });

  // get_caregivers
  it('get_caregivers should return an array of members', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [
        { id: 1, first_name: 'Test', last_name: 'User' },
        { id: 2, first_name: 'John', last_name: 'Doe' }
      ],
      error: null
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await MembersModel.instance.get_caregivers();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].first_name).toBe('Test');
  });

  it('get_caregivers should return an empty array if no members found', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await MembersModel.instance.get_caregivers();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('get_caregivers should throw if query fails', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'DB error' }
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    await expect(MembersModel.instance.get_caregivers()).rejects.toThrow();
  });

  // get_member
  it('get_member should return a member object when found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: sampleMember, error: null });
    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await MembersModel.instance.get_member(1);

    expect(supabase.from).toHaveBeenCalledWith('members');
    expect(mockMatch).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(sampleMember);
  });

  it('get_member should return null when not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
    const mockMatch = vi.fn().mockReturnValue({ single: mockSingle });

    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    const result = await MembersModel.instance.get_member(999);
    expect(result).toBeNull();
  });

  it('get_member should throw on invalid ID type', async () => {
    const mockMatch = vi.fn();
    (supabase.from as any).mockReturnValue({
      select: () => ({ match: mockMatch })
    });

    await expect(MembersModel.instance.get_member('invalid-id' as any)).rejects.toThrow();
  });

  // get_all_members
  it('get_all_members should return a list of members', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [sampleMember, { ...sampleMember, id: 2 }],
      error: null
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await MembersModel.instance.get_all_members();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('get_all_members should return an empty array when no data found', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });

    (supabase.from as any).mockReturnValue({
      select: mockSelect
    });

    const result = await MembersModel.instance.get_all_members();
    expect(result).toEqual([]);
  });

  // create_member
  it('create_member should insert and return the new member', async () => {
    const newMember = { ...sampleMember, id: undefined };
    const mockInsert = vi.fn().mockReturnValue({
      select: () => Promise.resolve({ data: [{ id: 10, ...newMember }], error: null })
    });

    (supabase.from as any).mockReturnValue({ insert: mockInsert });

    const result = await MembersModel.instance.create_member(newMember);

    expect(supabase.from).toHaveBeenCalledWith('members');
    expect(mockInsert).toHaveBeenCalledWith(newMember);
    expect(result).toEqual({ id: 10, ...newMember });
  });

  it('create_member should return null on insertion error', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: { message: 'Invalid fields' } });
    (supabase.from as any).mockReturnValue({ insert: mockInsert });

    const result = await MembersModel.instance.create_member({} as any);
    expect(result).toBeNull();
  });

  // update_member
  it('update_member should update and return the updated record', async () => {
    const updates = { first_name: 'Updated' };
    const mockUpdate = vi.fn().mockReturnValue({
      eq: () => ({ select: () => Promise.resolve({ data: [{ id: 1, ...updates }], error: null }) })
    });

    (supabase.from as any).mockReturnValue({ update: mockUpdate });

    const result = await MembersModel.instance.update_member(1, updates);
    expect(result).toEqual({ id: 1, ...updates });
  });

  it('update_member should return null on update failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } });
    (supabase.from as any).mockReturnValue({
      update: () => ({ eq: () => ({ update: mockUpdate }) })
    });

    const result = await MembersModel.instance.update_member(1, { unknown: 'field' });
    expect(result).toBeNull();
  });

  // delete_member
  it('delete_member should return true when successful', async () => {
    const mockDelete = vi.fn().mockReturnValue({
      eq: () => Promise.resolve({ data: [{ id: 1 }], error: null })
    });

    (supabase.from as any).mockReturnValue({ delete: mockDelete });

    const result = await MembersModel.instance.delete_member(1);
    expect(result).toBe(true);
  });

  it('delete_member should return false when no such member exists', async () => {
    const mockDelete = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
    (supabase.from as any).mockReturnValue({ delete: () => ({ eq: () => ({ delete: mockDelete }) }) });

    const result = await MembersModel.instance.delete_member(999);
    expect(result).toBe(false);
  });
});