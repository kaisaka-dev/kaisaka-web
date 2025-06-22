import { describe, it, expect, vi, beforeEach } from 'vitest';
import { membersModel } from '$lib/models/membersModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('membersModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleMember = {
    id: 'uuid-member-id',
    first_name: 'Test',
    middle_name: 'M',
    last_name: 'User',
    birthday: '2000-01-01',
    sex: 'Male',
    admission_date: '2020-01-01',
    date_created: '2020-01-01',
    last_updated: '2021-01-01',
    last_approved: '2021-06-01',
    address_id: 'uuid-address-id'
  };

  // findByFirstName
  it('findByFirstName should return members by first name', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [sampleMember], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByFirstName('Test');
    expect(result).toEqual([sampleMember]);
  });

  it('findByFirstName should return empty array when no results found', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByFirstName('Nonexistent');
    expect(result).toEqual([]);
  });

  it('findByFirstName should return null when query fails', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByFirstName('Test');
    expect(result).toBeNull();
  });

  // findByLastName
  it('findByLastName should return members by last name', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [sampleMember], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByLastName('User');
    expect(result).toEqual([sampleMember]);
  });

  it('findByLastName should return empty array when no results found', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByLastName('Nonexistent');
    expect(result).toEqual([]);
  });

  it('findByLastName should return null when query fails', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByLastName('User');
    expect(result).toBeNull();
  });

  // findByBirthday
  it('findByBirthday should return members by birthday', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [sampleMember], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByBirthday('2000-01-01');
    expect(result).toEqual([sampleMember]);
  });

  it('findByBirthday should return empty array when no results found', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: [], error: null });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByBirthday('1999-01-01');
    expect(result).toEqual([]);
  });

  it('findByBirthday should return null when query fails', async () => {
    const mockMatch = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    (supabase.from as any).mockReturnValue({ select: () => ({ match: mockMatch }) });

    const result = await membersModel.instance.findByBirthday('2000-01-01');
    expect(result).toBeNull();
  });

  // insertMember
  it('insertMember should insert and return new member', async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: () => ({
        single: () => Promise.resolve({ data: sampleMember, error: null })
      })
    });

    (supabase.from as any).mockReturnValue({ insert: mockInsert });

    const { id, ...newMember } = sampleMember as any;
    const result = await membersModel.instance.insertMember(newMember);

    expect(result).toEqual(sampleMember);
  });

  it('insertMember should return null if insertion fails', async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Insert failed' } })
      })
    });

    (supabase.from as any).mockReturnValue({ insert: mockInsert });

    const { id, ...newMember } = sampleMember as any;
    const result = await membersModel.instance.insertMember(newMember);

    expect(result).toBeNull();
  });

  // updateMemberInfo
  it('updateMemberInfo should update and return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateMemberInfo('uuid-member-id', { first_name: 'Update' });

    expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-member-id' }, { first_name: 'Update' });
    expect(result).toBe(true);
  });

  it('updateMemberInfo should return false on update failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateMemberInfo('uuid-member-id', { first_name: 'Update' });
    expect(result).toBe(false);
  });

  // updateAddress
  it('updateAddress should update and return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateAddress('uuid-member-id', 'uuid-address-id');
    expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-member-id' }, { address_id: 'uuid-address-id' });
    expect(result).toBe(true);
  });

  it('updateAddress should return false on update failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateAddress('uuid-member-id', 'uuid-address-id');
    expect(result).toBe(false);
  });

  // updateAdmissionDate
  it('updateAdmissionDate should update and return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateAdmissionDate('uuid-member-id', '2024-01-01');
    expect(mockUpdate).toHaveBeenCalledWith({ id: 'uuid-member-id' }, { admission_date: '2024-01-01' });
    expect(result).toBe(true);
  });

  it('updateAdmissionDate should return false on update failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (membersModel.instance as any).updateOne = mockUpdate;

    const result = await membersModel.instance.updateAdmissionDate('uuid-member-id', '2024-01-01');
    expect(result).toBe(false);
  });

  // deleteMember
  it('deleteMember should return true when successful', async () => {
    const mockDelete = vi.fn().mockResolvedValue(true);
    (membersModel.instance as any).deleteOne = mockDelete;

    const result = await membersModel.instance.deleteMember('uuid-member-id');

    expect(mockDelete).toHaveBeenCalledWith({ id: 'uuid-member-id' });
    expect(result).toBe(true);
  });

  it('deleteMember should return false when no such member exists', async () => {
    const mockDelete = vi.fn().mockResolvedValue(false);
    (membersModel.instance as any).deleteOne = mockDelete;

    const result = await membersModel.instance.deleteMember('nonexistent-id');

    expect(mockDelete).toHaveBeenCalledWith({ id: 'nonexistent-id' });
    expect(result).toBe(false);
  });

});