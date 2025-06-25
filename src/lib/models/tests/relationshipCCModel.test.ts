import { describe, it, expect, vi, beforeEach } from 'vitest';
import { relationshipCCModel } from '$lib/models/relationshipCCModel.js';
import { supabase } from '$lib/types/client.js';

// create mock of the supabase client so tests never directly interact with the database
vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('relationshipCCModel', () => {
  // prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleRelationship = {
    caregiver: 'uuid-caregiver-id',
    child: 'uuid-child-id',
    relationship: 'Mother'
  };

  // findByCaregiver
  it('findByCaregiver should return a relationship when found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: () => ({
          single: vi.fn().mockResolvedValue({ data: sampleRelationship, error: null })
        })
      })
    });

    const result = await relationshipCCModel.instance.findByCaregiver('uuid-caregiver-id');
    expect(result).toEqual(sampleRelationship);
  });

  it('findByCaregiver should return null when not found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: () => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    });

    const result = await relationshipCCModel.instance.findByCaregiver('uuid-caregiver-id');
    expect(result).toBeNull();
  });

  // findByChild
  it('findByChild should return relationships when found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: vi.fn().mockResolvedValue({ data: [sampleRelationship], error: null })
      })
    });

    const result = await relationshipCCModel.instance.findByChild('uuid-child-id');
    expect(result).toEqual([sampleRelationship]);
  });

  it('findByChild should return empty array when no results found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    });

    const result = await relationshipCCModel.instance.findByChild('uuid-child-id');
    expect(result).toEqual([]);
  });

  // findByRelationship
  it('findByRelationship should return relationships when found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: vi.fn().mockResolvedValue({ data: [sampleRelationship], error: null })
      })
    });

    const result = await relationshipCCModel.instance.findByRelationship('Mother');
    expect(result).toEqual([sampleRelationship]);
  });

  it('findByRelationship should return empty array when not found', async () => {
    (supabase.from as any).mockReturnValue({
      select: () => ({
        match: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    });

    const result = await relationshipCCModel.instance.findByRelationship('Unknown');
    expect(result).toEqual([]);
  });

  // insertRelationship
  it('insertRelationship should return created record on success', async () => {
    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({ data: sampleRelationship, error: null })
        })
      })
    });

    const { caregiver, ...data } = sampleRelationship;
    const result = await relationshipCCModel.instance.insertRelationship({ ...data, caregiver });

    expect(result).toEqual(sampleRelationship);
  });

  it('insertRelationship should return null if insert fails', async () => {
    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } })
        })
      })
    });

    const { caregiver, ...data } = sampleRelationship;
    const result = await relationshipCCModel.instance.insertRelationship({ ...data, caregiver });

    expect(result).toBeNull();
  });

  // updateRelationshipType
  it('updateRelationshipType should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (relationshipCCModel.instance as any).updateOne = mockUpdate;

    const result = await relationshipCCModel.instance.updateRelationshipType('uuid-caregiver-id', 'Father');
    expect(mockUpdate).toHaveBeenCalledWith({ caregiver: 'uuid-caregiver-id' }, { relationship: 'Father' });
    expect(result).toBe(true);
  });

  it('updateRelationshipType should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (relationshipCCModel.instance as any).updateOne = mockUpdate;

    const result = await relationshipCCModel.instance.updateRelationshipType('uuid-caregiver-id', 'Father');
    expect(result).toBe(false);
  });

  // updateChildForCaregiver
  it('updateChildForCaregiver should return true on success', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (relationshipCCModel.instance as any).updateOne = mockUpdate;

    const result = await relationshipCCModel.instance.updateChildForCaregiver('uuid-caregiver-id', 'uuid-new-child');
    expect(mockUpdate).toHaveBeenCalledWith({ caregiver: 'uuid-caregiver-id' }, { child: 'uuid-new-child' });
    expect(result).toBe(true);
  });

  it('updateChildForCaregiver should return false on failure', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (relationshipCCModel.instance as any).updateOne = mockUpdate;

    const result = await relationshipCCModel.instance.updateChildForCaregiver('uuid-caregiver-id', 'uuid-new-child');
    expect(result).toBe(false);
  });

  // deleteRelationship
  it('deleteRelationship should return true on successful deletion', async () => {
    const mockDelete = vi.fn().mockResolvedValue(sampleRelationship);
    (relationshipCCModel.instance as any).deleteOne = mockDelete;

    const result = await relationshipCCModel.instance.deleteRelationship('uuid-caregiver-id');
    expect(mockDelete).toHaveBeenCalledWith({ caregiver: 'uuid-caregiver-id' });
    expect(result).toBe(true);
  });

  it('deleteRelationship should return false when no such relationship exists', async () => {
    const mockDelete = vi.fn().mockResolvedValue(null);
    (relationshipCCModel.instance as any).deleteOne = mockDelete;

    const result = await relationshipCCModel.instance.deleteRelationship('uuid-caregiver-id');
    expect(result).toBe(false);
  });
});