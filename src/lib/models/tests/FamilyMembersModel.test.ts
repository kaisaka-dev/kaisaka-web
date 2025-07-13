import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FamilyMembersModel } from '$lib/models/FamilyMembersModel.js';
import { supabase } from '$lib/types/client.js';

vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('FamilyMembersModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleFamilyMember = {
    family_id: 'family-uuid',
    member_id: 'member-uuid',
    is_child: false,
    relationship_type: 'Father',
    date_added: new Date().toISOString()
  };

  // insertFamilyMember
  it('insertFamilyMember should return inserted member on success', async () => {
    (FamilyMembersModel.instance as any).insertOne = vi.fn().mockResolvedValue(sampleFamilyMember);

    const result = await FamilyMembersModel.instance.insertFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      sampleFamilyMember.is_child,
      sampleFamilyMember.relationship_type
    );

    expect(result).toEqual(sampleFamilyMember);
  });

  it('insertFamilyMember should return null on failure', async () => {
    (FamilyMembersModel.instance as any).insertOne = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.insertFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      sampleFamilyMember.is_child,
      sampleFamilyMember.relationship_type
    );

    expect(result).toBeNull();
  });

  // findByFamilyId
  it('findByFamilyId should return members on success', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.findByFamilyId(sampleFamilyMember.family_id);
    expect(result).toEqual([sampleFamilyMember]);
  });

  it('findByFamilyId should return null on failure', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.findByFamilyId(sampleFamilyMember.family_id);
    expect(result).toBeNull();
  });

  // findByMemberId
  it('findByMemberId should return records on success', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.findByMemberId(sampleFamilyMember.member_id);
    expect(result).toEqual([sampleFamilyMember]);
  });

  it('findByMemberId should return null on failure', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.findByMemberId(sampleFamilyMember.member_id);
    expect(result).toBeNull();
  });

  // findByRelationshipType
  it('findByRelationshipType should return matches on success', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.findByRelationshipType('Father');
    expect(result).toEqual([sampleFamilyMember]);
  });

  it('findByRelationshipType should return null on failure', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.findByRelationshipType('Unknown');
    expect(result).toBeNull();
  });

  // findChildrenByFamilyId
  it('findChildrenByFamilyId should return children on success', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.findChildrenByFamilyId(sampleFamilyMember.family_id);
    expect(result).toEqual([sampleFamilyMember]);
  });

  it('findChildrenByFamilyId should return null on failure', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.findChildrenByFamilyId(sampleFamilyMember.family_id);
    expect(result).toBeNull();
  });

  // findAdultsByFamilyId
  it('findAdultsByFamilyId should return adults on success', async () => {
    const adultMember = { ...sampleFamilyMember, is_child: false };
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue([adultMember]);

    const result = await FamilyMembersModel.instance.findAdultsByFamilyId(adultMember.family_id);
    expect(result).toEqual([adultMember]);
  });

  it('findAdultsByFamilyId should return null on failure', async () => {
    (FamilyMembersModel.instance as any).findMany = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.findAdultsByFamilyId(sampleFamilyMember.family_id);
    expect(result).toBeNull();
  });

  // updateRelationshipType
  it('updateRelationshipType should return true on success', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(true);

    const result = await FamilyMembersModel.instance.updateRelationshipType(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      'Mother'
    );
    expect(result).toBe(true);
  });

  it('updateRelationshipType should return false on failure', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(false);

    const result = await FamilyMembersModel.instance.updateRelationshipType(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      'Mother'
    );
    expect(result).toBe(false);
  });

  // updateChildStatus
  it('updateChildStatus should return true on success', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(true);

    const result = await FamilyMembersModel.instance.updateChildStatus(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      false
    );
    expect(result).toBe(true);
  });

  it('updateChildStatus should return false on failure', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(false);

    const result = await FamilyMembersModel.instance.updateChildStatus(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      false
    );
    expect(result).toBe(false);
  });

  // updateFamilyMember
  it('updateFamilyMember should return true on success', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(true);

    const result = await FamilyMembersModel.instance.updateFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      { is_child: false, relationship_type: 'Uncle' }
    );
    expect(result).toBe(true);
  });

  it('updateFamilyMember should return false on failure', async () => {
    (FamilyMembersModel.instance as any).updateOne = vi.fn().mockResolvedValue(false);

    const result = await FamilyMembersModel.instance.updateFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id,
      { is_child: false, relationship_type: 'Uncle' }
    );
    expect(result).toBe(false);
  });

  // removeFamilyMember
  it('removeFamilyMember should return true on success', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue(sampleFamilyMember);

    const result = await FamilyMembersModel.instance.removeFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id
    );
    expect(result).toBe(true);
  });

  it('removeFamilyMember should return false when deletion fails', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.removeFamilyMember(
      sampleFamilyMember.family_id,
      sampleFamilyMember.member_id
    );
    expect(result).toBe(false);
  });

  // removeAllFamilyMembers
  it('removeAllFamilyMembers should return true on success', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.removeAllFamilyMembers(sampleFamilyMember.family_id);
    expect(result).toBe(true);
  });

  it('removeAllFamilyMembers should return false when deletion fails', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.removeAllFamilyMembers(sampleFamilyMember.family_id);
    expect(result).toBe(false);
  });

  // removeMemberFromAllFamilies
  it('removeMemberFromAllFamilies should return true on success', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue([sampleFamilyMember]);

    const result = await FamilyMembersModel.instance.removeMemberFromAllFamilies(sampleFamilyMember.member_id);
    expect(result).toBe(true);
  });

  it('removeMemberFromAllFamilies should return false when deletion fails', async () => {
    (FamilyMembersModel.instance as any).deleteOne = vi.fn().mockResolvedValue(null);

    const result = await FamilyMembersModel.instance.removeMemberFromAllFamilies(sampleFamilyMember.member_id);
    expect(result).toBe(false);
  });
});
