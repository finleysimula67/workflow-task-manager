package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.TeamMemberRequestDTO;
import com.nabin.workflow.dto.request.TeamRequestDTO;
import com.nabin.workflow.dto.response.TeamMemberResponseDTO;
import com.nabin.workflow.dto.response.TeamResponseDTO;
import com.nabin.workflow.services.interfaces.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TeamResponseDTO>> createTeam(@Valid @RequestBody TeamRequestDTO dto) {
        return new ResponseEntity<>(ApiResponse.success("Team created", teamService.createTeam(dto)), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TeamResponseDTO>>> getMyTeams() {
        return ResponseEntity.ok(ApiResponse.success("Teams retrieved", teamService.getMyTeams()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TeamResponseDTO>> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Team retrieved", teamService.getTeam(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TeamResponseDTO>> updateTeam(@PathVariable Long id, @Valid @RequestBody TeamRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Team updated", teamService.updateTeam(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok(ApiResponse.success("Team deleted"));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TeamMemberResponseDTO>> addMember(@PathVariable Long id, @Valid @RequestBody TeamMemberRequestDTO dto) {
        return new ResponseEntity<>(ApiResponse.success("Member added", teamService.addMember(id, dto)), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TeamMemberResponseDTO>>> getMembers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Members retrieved", teamService.getMembers(id)));
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable Long teamId, @PathVariable Long memberId) {
        teamService.removeMember(teamId, memberId);
        return ResponseEntity.ok(ApiResponse.success("Member removed"));
    }
}
