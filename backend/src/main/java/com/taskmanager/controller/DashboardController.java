package com.taskmanager.controller;

import com.taskmanager.dto.DashboardStats;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TaskService taskService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardStats stats = taskService.getDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }
}
