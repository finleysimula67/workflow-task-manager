package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.TeamMemberRequestDTO;
import com.nabin.workflow.dto.request.TeamRequestDTO;
import com.nabin.workflow.dto.response.TeamMemberResponseDTO;
import com.nabin.workflow.dto.response.TeamResponseDTO;

import java.util.List;

public interface TeamService {
    TeamResponseDTO createTeam(TeamRequestDTO dto);
    List<TeamResponseDTO> getMyTeams();
    TeamResponseDTO getTeam(Long id);
    TeamResponseDTO updateTeam(Long id, TeamRequestDTO dto);
    void deleteTeam(Long id);
    TeamMemberResponseDTO addMember(Long teamId, TeamMemberRequestDTO dto);
    List<TeamMemberResponseDTO> getMembers(Long teamId);
    void removeMember(Long teamId, Long memberId);
}
