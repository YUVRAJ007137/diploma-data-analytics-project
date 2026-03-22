import { describe, it, expect } from 'vitest';
import { getStudentBacklogHistory, getBacklogSummary } from '../lib/analyzeData';

describe('backlog helpers', () => {
  it('handles numeric backCount and summarizes correctly', () => {
    const dataset = {
      year: '2025',
      session: 'Winter',
      semesters: {
        CO1K: [
          { seatNumber: 'S1', studentName: 'Alice', backCount: 2, semester: 'CO1K' },
          { seatNumber: 'S2', studentName: 'Bob', backCount: 0, semester: 'CO1K' }
        ]
      }
    };

    const history = getStudentBacklogHistory(dataset);
    expect(history).toHaveLength(2);
    const a = history.find((h) => h.studentName === 'Alice');
    const b = history.find((h) => h.studentName === 'Bob');
    expect(a.totalBacks).toBe(2);
    expect(a.completedDiploma).toBe(false);
    expect(b.totalBacks).toBe(0);
    expect(b.completedDiploma).toBe(true);

    const summary = getBacklogSummary(dataset);
    expect(summary.totalStudents).toBe(2);
    expect(summary.studentsWithNoBacks).toBe(1);
    expect(summary.studentsWithAnyBack).toBe(1);
    expect(summary.distribution['0']).toBe(1);
    expect(summary.distribution['2'] || 0).toBe(1);
  });

  it('detects backs from failedSubjects array', () => {
    const dataset = {
      semesters: {
        CO1K: [
          { seatNumber: 'S3', studentName: 'Carol', failedSubjects: ['Math', 'Physics'], semester: 'CO1K' }
        ]
      }
    };
    const history = getStudentBacklogHistory(dataset);
    expect(history).toHaveLength(1);
    expect(history[0].totalBacks).toBe(2);
  });

  it('derives back count from subjectTotals using PASS_PERCENTAGE threshold', () => {
    const dataset = {
      semesters: {
        CO1K: [
          {
            seatNumber: 'S4',
            studentName: 'Dan',
            subjectTotals: { Math: 30, Eng: 45, Sci: 35 },
            semester: 'CO1K'
          }
        ]
      }
    };
    // Default PASS_PERCENTAGE is 40 => Math (30) and Sci (35) are backs => 2
    const history = getStudentBacklogHistory(dataset);
    expect(history[0].totalBacks).toBe(2);
  });
});
