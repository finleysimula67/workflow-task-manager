package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.TeamMemberRequestDTO;
import com.nabin.workflow.dto.request.TeamRequestDTO;
import com.nabin.workflow.dto.response.TeamMemberResponseDTO;
import com.nabin.workflow.dto.response.TeamResponseDTO;
import com.nabin.workflow.entities.Team;
import com.nabin.workflow.entities.TeamMember;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.repository.TeamMemberRepository;
import com.nabin.workflow.repository.TeamRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.EmailService;
import com.nabin.workflow.services.interfaces.TeamService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TeamResponseDTO createTeam(TeamRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Team team = Team.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .owner(owner)
                .build();

        Team saved = teamRepository.save(team);

        TeamMember ownerMember = TeamMember.builder()
                .team(saved)
                .user(owner)
                .role("OWNER")
                .build();
        memberRepository.save(ownerMember);

        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponseDTO> getMyTeams() {
        Long userId = SecurityUtil.getCurrentUserId();
        return teamRepository.findByOwnerId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponseDTO getTeam(Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        return toDTO(team);
    }

    @Override
    @Transactional
    public TeamResponseDTO updateTeam(Long id, TeamRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        team.setName(dto.getName());
        team.setDescription(dto.getDescription());
        return toDTO(teamRepository.save(team));
    }

    @Override
    @Transactional
    public void deleteTeam(Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        teamRepository.delete(team);
    }

    @Override
    @Transactional
    public TeamMemberResponseDTO addMember(Long teamId, TeamMemberRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));
        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        User member = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", dto.getEmail()));

        if (memberRepository.existsByTeamIdAndUserId(teamId, member.getId())) {
            throw new RuntimeException("User is already a member");
        }

        TeamMember tm = TeamMember.builder()
                .team(team)
                .user(member)
                .role(dto.getRole() != null ? dto.getRole() : "MEMBER")
                .build();

        TeamMemberResponseDTO saved = toMemberDTO(memberRepository.save(tm));

        emailService.sendTeamInvitationEmail(
                member.getEmail(),
                SecurityUtil.getCurrentUsername(),
                team.getName()
        );

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponseDTO> getMembers(Long teamId) {
        return memberRepository.findByTeamId(teamId).stream()
                .map(this::toMemberDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeMember(Long teamId, Long memberId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));
        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        TeamMember tm = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("TeamMember", "id", memberId));
        if ("OWNER".equals(tm.getRole())) {
            throw new RuntimeException("Cannot remove the owner");
        }
        memberRepository.delete(tm);
    }

    private TeamResponseDTO toDTO(Team team) {
        return TeamResponseDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .ownerId(team.getOwner().getId())
                .ownerName(team.getOwner().getUsername())
                .memberCount((int) memberRepository.countByTeamId(team.getId()))
                .createdAt(team.getCreatedAt())
                .build();
    }

    private TeamMemberResponseDTO toMemberDTO(TeamMember tm) {
        return TeamMemberResponseDTO.builder()
                .id(tm.getId())
                .teamId(tm.getTeam().getId())
                .userId(tm.getUser().getId())
                .username(tm.getUser().getUsername())
                .email(tm.getUser().getEmail())
                .role(tm.getRole())
                .joinedAt(tm.getJoinedAt())
                .build();
    }
}
