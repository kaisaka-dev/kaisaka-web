import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttendanceLogModel } from '$lib/models/attendanceLogModel.js';
import { supabase } from '$lib/types/client.js';

vi.mock('$lib/types/client', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('AttendanceLogModel', () => {
    // prevent tests from affecting each other
    beforeEach(() => {
        vi.clearAllMocks();
    });


    const sampleAttendanceLog = {
        id: 1,
        conducted_activity_id: 2,
        participant_id: 'uuid-participant',
        is_late: false,
        participant_type: 'child',
        individual_intervention_plan: true,
        transition_graduation_plan: false,
        remarks: 'Remarkable'
    };


    // Create methods


    // insertAttendanceLog
    it('insertAttendanceLog should create and return a new activity record', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).insertOne = mockInsert;

        const result = await AttendanceLogModel.instance.insertAttendanceLog(
            2,
            'uuid-participant',
            false,
            'child',
            true,
            false,
            'Remarkable'
        );
        expect(result).toEqual(sampleAttendanceLog);
    });

    it('insertActivity should return null if insertion fails', async () => {
        const mockInsert = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).insertOne = mockInsert;

        const result = await AttendanceLogModel.instance.insertAttendanceLog(
            2,
            'uuid-participant',
            false,
            'child',
            true,
            false,
            'Remarkable'
        );
        expect(result).toBeNull();
    });




    // Read methods

    // findById
    it('findById should return a matching record when found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).findOne = mockFindOne;

        const result = await AttendanceLogModel.instance.findById(1);
        expect(result).toEqual(sampleAttendanceLog);
    });

    it('findById should return null when no record is found', async () => {
        const mockFindOne = vi.fn().mockResolvedValue(null);
        (AttendanceLogModel.instance as any).findOne = mockFindOne;

        const result = await AttendanceLogModel.instance.findById(1);
        expect(result).toBeNull();
    });

    // findByConductedActivityId
    it('findByConductedActivityId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByConductedActivityId(2);
        expect(result).toEqual([sampleAttendanceLog]);
    });

    it('findByConductedActivityId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByConductedActivityId(2);
        expect(result).toBe([]);
    });

    it('findByConductedActivityId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByConductedActivityId(2);
        expect(result).toBeNull();
    });

    // findByParticipantId
    it('findByParticipantId should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByParticipantId('uuid-participant');
        expect(result).toEqual([sampleAttendanceLog]);
    });

    it('findByParticipantId should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByParticipantId('uuid-participant');
        expect(result).toBe([]);
    });

    it('findByParticipantId should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findByParticipantId('uuid-participant');
        expect(result).toBeNull();
    });

    // findLateAttendances
    it('findLateAttendances should return a matching record when found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(sampleAttendanceLog);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findLateAttendances();
        expect(result).toEqual([sampleAttendanceLog]);
    });

    it('findLateAttendances should return empty array when no record is found', async () => {
        const mockFindMany = vi.fn().mockResolvedValue([]);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findLateAttendances();
        expect(result).toBe([]);
    });

    it('findLateAttendances should return null on error', async () => {
        const mockFindMany = vi.fn().mockResolvedValue(null);
        (AttendanceLogModel.instance as any).findMany = mockFindMany;

        const result = await AttendanceLogModel.instance.findLateAttendances();
        expect(result).toBeNull();
    });




    // Update methods
    
    // updateLateStatus
    it('updateLateStatus should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AttendanceLogModel.instance as any).updateOne = mockUpdate;

        const result = await AttendanceLogModel.instance.updateLateStatus(1, true);
        expect(result).toBe(true);
    });

    it('updateLateStatus should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AttendanceLogModel.instance as any).updateOne = mockUpdate;

        const result = await AttendanceLogModel.instance.updateLateStatus(1, false);
        expect(result).toBe(false);
    });

    // updateRemarks
    it('updateRemarks should return true if successful', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(true);
        (AttendanceLogModel.instance as any).updateOne = mockUpdate;

        const result = await AttendanceLogModel.instance.updateRemarks(1, 'New Remarks');
        expect(result).toBe(true);
    });

    it('updateRemarks should return false if update fails', async () => {
        const mockUpdate = vi.fn().mockResolvedValue(false);
        (AttendanceLogModel.instance as any).updateOne = mockUpdate;

        const result = await AttendanceLogModel.instance.updateRemarks(1, 'New Remarks');
        expect(result).toBe(false);
    });




    // Delete methods

    // deleteById
    it('deleteById should return true if deletion is successful', async () => {
        const mockDelete = vi.fn().mockResolvedValue(true);
        (AttendanceLogModel.instance as any).deleteOne = mockDelete;

        const result = await AttendanceLogModel.instance.deleteById(1);
        expect(result).toBe(true);
    });

    it('deleteById should return false if deletion fails', async () => {
        const mockDelete = vi.fn().mockResolvedValue(null);
        (AttendanceLogModel.instance as any).deleteOne = mockDelete;

        const result = await AttendanceLogModel.instance.deleteById(1);
        expect(result).toBe(false);
    }); 
});