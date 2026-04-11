import { describe, it, expect } from 'vitest';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  API_BASE_URL,
} from './constants';

describe('constants', () => {
  describe('TASK_STATUS', () => {
    it('should have TODO status', () => {
      expect(TASK_STATUS.TODO).toBe('TODO');
    });

    it('should have IN_PROGRESS status', () => {
      expect(TASK_STATUS.IN_PROGRESS).toBe('IN_PROGRESS');
    });

    it('should have DONE status', () => {
      expect(TASK_STATUS.DONE).toBe('DONE');
    });
  });

  describe('TASK_PRIORITY', () => {
    it('should have LOW priority', () => {
      expect(TASK_PRIORITY.LOW).toBe('LOW');
    });

    it('should have MEDIUM priority', () => {
      expect(TASK_PRIORITY.MEDIUM).toBe('MEDIUM');
    });

    it('should have HIGH priority', () => {
      expect(TASK_PRIORITY.HIGH).toBe('HIGH');
    });
  });

  describe('STATUS_OPTIONS', () => {
    it('should have 3 status options', () => {
      expect(STATUS_OPTIONS).toHaveLength(3);
    });

    it('should have correct TODO option', () => {
      const todo = STATUS_OPTIONS.find((s) => s.value === 'TODO');
      expect(todo).toEqual({ value: 'TODO', label: 'To Do', color: '#3498db' });
    });

    it('should have correct IN_PROGRESS option', () => {
      const inProgress = STATUS_OPTIONS.find((s) => s.value === 'IN_PROGRESS');
      expect(inProgress).toEqual({
        value: 'IN_PROGRESS',
        label: 'In Progress',
        color: '#f39c12',
      });
    });

    it('should have correct DONE option', () => {
      const done = STATUS_OPTIONS.find((s) => s.value === 'DONE');
      expect(done).toEqual({ value: 'DONE', label: 'Done', color: '#2ecc71' });
    });
  });

  describe('PRIORITY_OPTIONS', () => {
    it('should have 3 priority options', () => {
      expect(PRIORITY_OPTIONS).toHaveLength(3);
    });

    it('should have correct LOW option', () => {
      const low = PRIORITY_OPTIONS.find((p) => p.value === 'LOW');
      expect(low).toEqual({ value: 'LOW', label: 'Low', color: '#95a5a6' });
    });

    it('should have correct MEDIUM option', () => {
      const medium = PRIORITY_OPTIONS.find((p) => p.value === 'MEDIUM');
      expect(medium).toEqual({
        value: 'MEDIUM',
        label: 'Medium',
        color: '#f39c12',
      });
    });

    it('should have correct HIGH option', () => {
      const high = PRIORITY_OPTIONS.find((p) => p.value === 'HIGH');
      expect(high).toEqual({ value: 'HIGH', label: 'High', color: '#e74c3c' });
    });
  });

  describe('API_BASE_URL', () => {
    it('should have correct API base URL', () => {
      expect(API_BASE_URL).toBe('http://localhost:8080/api');
    });
  });
});