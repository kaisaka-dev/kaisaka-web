import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaregiversModel } from '$lib/models/caregiversModel.js';
import { supabase } from '$lib/types/supabase.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('caregiversModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleCaregiver = {
    id: 'uuid-caregiver-id',
    member_id: 'uuid-member-id',
    income_id: 123456789,
    caregiver_group_id: 1,
    contact_number: '09123456789',
    facebook_link: 'https://facebook.com/test',
    email: 'test@gmail.com',
    occupation: 'Housewife',
  };

  // insertCaregiver
  it('insertCaregiver should return created caregiver on success', async () => {
    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({ data: sampleCaregiver, error: null })
        })
      })
    });

    const result = await CaregiversModel.instance.insertCaregiver(
      sampleCaregiver.member_id,
      sampleCaregiver.income_id,
      sampleCaregiver.contact_number,
      sampleCaregiver.facebook_link,
      sampleCaregiver.email,
      sampleCaregiver.occupation,
    );

    expect(result).toEqual(sampleCaregiver);
  });

  it('insertCaregiver should return null on failure', async () => {
    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } })
        })
      })
    });

    const result = await CaregiversModel.instance.insertCaregiver(sampleCaregiver.member_id, sampleCaregiver.income_id, sampleCaregiver.contact_number);
    expect(result).toBeNull();
  });

  // findById
  it('findById should return caregiver if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findOne = mockFind;

    const result = await CaregiversModel.instance.findById(sampleCaregiver.id);
    expect(mockFind).toHaveBeenCalledWith({ id: sampleCaregiver.id });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findById should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).findOne = mockFind;

    const result = await CaregiversModel.instance.findById('non-existent-id');
    expect(result).toBeNull();
  });

  // findByMemberId
  it('findByMemberId should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findOne = mockFind;

    const result = await CaregiversModel.instance.findByMemberId(sampleCaregiver.member_id);
    expect(mockFind).toHaveBeenCalledWith({ member_id: sampleCaregiver.member_id });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findByMemberId should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).findOne = mockFind;

    const result = await CaregiversModel.instance.findByMemberId('non-existent-member-id');
    expect(result).toBeNull();
  });

  // findByContactNumber
  it('findByContactNumber should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByContactNumber(sampleCaregiver.contact_number);
    expect(mockFind).toHaveBeenCalledWith({ contact_number: sampleCaregiver.contact_number });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findByContactNumber should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByContactNumber('non-existent-contact-number');
    expect(result).toBeNull();
  });

  // findByEmail
  it('findByEmail should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByEmail(sampleCaregiver.email);
    expect(mockFind).toHaveBeenCalledWith({ email: sampleCaregiver.email });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findByEmail should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByEmail('non-existent-email');
    expect(result).toBeNull();
  });

  // findByOccupation
  it('findByOccupation should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue([sampleCaregiver]);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByOccupation(sampleCaregiver.occupation);
    expect(mockFind).toHaveBeenCalledWith({ occupation: sampleCaregiver.occupation });
    expect(result).toEqual([sampleCaregiver]);
  });

  it('findByOccupation should return empty array if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue([]);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByOccupation('non-existent-occupation');
    expect(result).toEqual([]);
  });

  // findByFacebookLink
  it('findByFacebookLink should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByFacebookLink(sampleCaregiver.facebook_link);
    expect(mockFind).toHaveBeenCalledWith({ facebook_link: sampleCaregiver.facebook_link });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findByFacebookLink should return null if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByFacebookLink('non-existent-facebook-link');
    expect(result).toBeNull();
  });

  // findByIncomeId
  it('findByIncomeId should return caregivers if found', async () => {
    const mockFind = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByIncomeId(sampleCaregiver.income_id);
    expect(mockFind).toHaveBeenCalledWith({ income_id: sampleCaregiver.income_id });
    expect(result).toEqual(sampleCaregiver);
  });

  it('findByIncomeId should return empty array if not found', async () => {
    const mockFind = vi.fn().mockResolvedValue([]);
    (CaregiversModel.instance as any).findMany = mockFind;

    const result = await CaregiversModel.instance.findByIncomeId(1);
    expect(result).toEqual([]);
  });

  // getAll
  it('getAll should return caregiver records', async () => {
    const sampleCaregivers = [
      {
        id: 'uuid-1',
        member_id: 'member-1',
        contact_number: '09123456789',
        facebook_link: 'https://facebook.com/caregiver1',
        email: 'caregiver1@gmail.com',
        occupation: 'Housewife',
        remarks: 'Remark 1'
      },
      {
        id: 'uuid-2',
        member_id: 'member-2',
        contact_number: '09179876543',
        facebook_link: 'https://facebook.com/caregiver2',
        email: 'caregiver2@gmail.com',
        occupation: 'Teacher',
        remarks: 'Remark 2'
      }
    ];

    const mockFindMany = vi.fn().mockResolvedValue(sampleCaregivers);
    (CaregiversModel.instance as any).findMany = mockFindMany;

    const result = await CaregiversModel.instance.getAll();
    expect(mockFindMany).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(sampleCaregivers);
  });

  it('getAll should return empty array when no caregivers found', async () => {
    const mockFindMany = vi.fn().mockResolvedValue([]);
    (CaregiversModel.instance as any).findMany = mockFindMany;

    const result = await CaregiversModel.instance.getAll();
    expect(mockFindMany).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([]);
  });

  // updateContactNumber
  it('updateContactNumber should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateContactNumber(sampleCaregiver.id, '09998887777');
    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      { contact_number: '09998887777' }
    );
    expect(result).toBe(true);
  });

  it('updateContactNumber should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateContactNumber(sampleCaregiver.id, '09998887777');
    expect(result).toBe(false);
  });

  // updateOccupation
  it('updateOccupation should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateOccupation(sampleCaregiver.id, 'new-occupation');
    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      { occupation: 'new-occupation' }
    );
    expect(result).toBe(true);
  });

  it('updateOccupation should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateOccupation(sampleCaregiver.id, 'new-occupation');
    expect(result).toBe(false);
  });

  // updateEmail
  it('updateEmail should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateEmail(sampleCaregiver.id, 'new-email');
    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      { email: 'new-email' }
    );
    expect(result).toBe(true);
  });

  it('updateEmail should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateEmail(sampleCaregiver.id, 'new-email');
    expect(result).toBe(false);
  });

  // updateFacebookLink
  it('updateFacebookLink should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateFacebookLink(sampleCaregiver.id, 'new-facebook-link');
    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      { facebook_link: 'new-facebook-link' }
    );
    expect(result).toBe(true);
  });

  it('updateFacebookLink should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateFacebookLink(sampleCaregiver.id, 'new-facebook-link');
    expect(result).toBe(false);
  });

  // updateContactInfo
  it('updateContactInfo should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateContactInfo(sampleCaregiver.id, {
      contact_number: '09999999999',
      facebook_link: 'https://facebook.com/updated',
      email: 'updated@example.com'
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      {
        contact_number: '09999999999',
        facebook_link: 'https://facebook.com/updated',
        email: 'updated@example.com'
      }
    );

    expect(result).toBe(true);
  });

  it('updateContactInfo should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateContactInfo(sampleCaregiver.id, {
      contact_number: '09999999999',
      facebook_link: 'https://facebook.com/updated',
      email: 'updated@example.com'
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      { id: sampleCaregiver.id },
      {
        contact_number: '09999999999',
        facebook_link: 'https://facebook.com/updated',
        email: 'updated@example.com'
      }
    );

    expect(result).toBe(false);
  });

  // updateCaregiver
  it('updateCaregiver should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateCaregiver(sampleCaregiver.id, {
      contact_number: '09999999999',
      facebook_link: 'https://facebook.com/updated',
      email: 'updated@example.com',
      occupation: 'Nurse',
      remarks: 'Updated remarks again'
    });
    expect(result).toBe(true);
  });

  it('updateCaregiver should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateCaregiver(sampleCaregiver.id, {
      contact_number: '09999999999',
      facebook_link: 'https://facebook.com/updated',
      email: 'updated@example.com',
      occupation: 'Nurse',
      remarks: 'Updated remarks again'
    });
    expect(result).toBe(false);
  });

  // updateRemarks
  it('updateRemarks should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateRemarks(sampleCaregiver.id, 'Updated remarks');
    expect(mockUpdate).toHaveBeenCalledWith({ id: sampleCaregiver.id }, { remarks: 'Updated remarks' });
    expect(result).toBe(true);
  });

  it('updateRemarks should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateRemarks(sampleCaregiver.id, 'Updated remarks');
    expect(result).toBe(false);
  });

  // updateIncomeId
  it('updateIncomeId should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateIncomeId(sampleCaregiver.id, 123456788);
    expect(mockUpdate).toHaveBeenCalledWith({ id: sampleCaregiver.id }, { income_id: 123456788 });
    expect(result).toBe(true);
  });

  it('updateIncomeId should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (CaregiversModel.instance as any).updateOne = mockUpdate;

    const result = await CaregiversModel.instance.updateIncomeId(sampleCaregiver.id, -1);
    expect(result).toBe(false);
  });

  // deleteById
  it('deleteById should return true when caregiver is deleted', async () => {
    const mockDelete = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).deleteOne = mockDelete;

    const result = await CaregiversModel.instance.deleteById(sampleCaregiver.id);
    expect(mockDelete).toHaveBeenCalledWith({ id: sampleCaregiver.id });
    expect(result).toBe(true);
  });

  it('deleteById should return false when no caregiver found', async () => {
    const mockDelete = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).deleteOne = mockDelete;

    const result = await CaregiversModel.instance.deleteById(sampleCaregiver.id);
    expect(result).toBe(false);
  });

  // deleteByMemberId
  it('deleteByMemberId should return true when deletion succeeds', async () => {
    const mockDelete = vi.fn().mockResolvedValue(sampleCaregiver);
    (CaregiversModel.instance as any).deleteOne = mockDelete;

    const result = await CaregiversModel.instance.deleteByMemberId(sampleCaregiver.member_id);
    expect(result).toBe(true);
  });

  it('deleteByMemberId should return false when no record found', async () => {
    const mockDelete = vi.fn().mockResolvedValue(null);
    (CaregiversModel.instance as any).deleteOne = mockDelete;

    const result = await CaregiversModel.instance.deleteByMemberId(sampleCaregiver.member_id);
    expect(result).toBe(false);
  });
});