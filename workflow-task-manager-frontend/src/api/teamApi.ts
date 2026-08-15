import axiosInstance from './axios';
import type { ApiResponse } from '../types';

export interface Team {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  ownerName: string;
  memberCount: number;
  createdAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  username: string;
  email: string;
  role: string;
  joinedAt: string;
}

export const teamApi = {
  getTeams: (): Promise<ApiResponse<Team[]>> =>
    axiosInstance.get('/teams'),

  getTeam: (id: number): Promise<ApiResponse<Team>> =>
    axiosInstance.get(`/teams/${id}`),

  createTeam: (data: { name: string; description?: string }): Promise<ApiResponse<Team>> =>
    axiosInstance.post('/teams', data),

  updateTeam: (id: number, data: { name: string; description?: string }): Promise<ApiResponse<Team>> =>
    axiosInstance.put(`/teams/${id}`, data),

  deleteTeam: (id: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/teams/${id}`),

  getMembers: (id: number): Promise<ApiResponse<TeamMember[]>> =>
    axiosInstance.get(`/teams/${id}/members`),

  addMember: (id: number, data: { email: string; role?: string }): Promise<ApiResponse<TeamMember>> =>
    axiosInstance.post(`/teams/${id}/members`, data),

  removeMember: (teamId: number, memberId: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/teams/${teamId}/members/${memberId}`),
};
