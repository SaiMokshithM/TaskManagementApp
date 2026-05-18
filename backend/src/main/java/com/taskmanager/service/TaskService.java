package com.taskmanager.service;

import com.taskmanager.dto.DashboardStats;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.*;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    // ── Get all tasks for user with optional filters ─────────────────────────────
    public List<TaskResponse> getTasks(String email, TaskStatus status, TaskPriority priority, String search) {
        User user = getUserByEmail(email);
        return taskRepository.findByUserIdWithFilters(user.getId(), status, priority, search)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ── Get task by ID ───────────────────────────────────────────────────────────
    public TaskResponse getTaskById(Long taskId, String email) {
        Task task = findTaskAndVerifyOwnership(taskId, email);
        return taskMapper.toResponse(task);
    }

    // ── Create task ──────────────────────────────────────────────────────────────
    @Transactional
    public TaskResponse createTask(TaskRequest request, String email) {
        User user = getUserByEmail(email);
        Task task = taskMapper.toEntity(request);
        task.setUser(user);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    // ── Update task ──────────────────────────────────────────────────────────────
    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request, String email) {
        Task task = findTaskAndVerifyOwnership(taskId, email);
        taskMapper.updateEntity(task, request);
        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
    }

    // ── Delete task ──────────────────────────────────────────────────────────────
    @Transactional
    public void deleteTask(Long taskId, String email) {
        Task task = findTaskAndVerifyOwnership(taskId, email);
        taskRepository.delete(task);
    }

    // ── Dashboard stats ──────────────────────────────────────────────────────────
    public DashboardStats getDashboardStats(String email) {
        User user = getUserByEmail(email);
        Long userId = user.getId();

        List<TaskResponse> recent = taskRepository
                .findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalTasks(taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING)
                        + taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS)
                        + taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED))
                .pendingTasks(taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING))
                .inProgressTasks(taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS))
                .completedTasks(taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED))
                .highPriorityTasks(taskRepository.countByUserIdAndPriority(userId, TaskPriority.HIGH))
                .mediumPriorityTasks(taskRepository.countByUserIdAndPriority(userId, TaskPriority.MEDIUM))
                .lowPriorityTasks(taskRepository.countByUserIdAndPriority(userId, TaskPriority.LOW))
                .overdueTasks(taskRepository.countOverdueByUserId(userId, LocalDate.now()))
                .recentTasks(recent)
                .build();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Task findTaskAndVerifyOwnership(Long taskId, String email) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        if (!task.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("You don't have permission to access this task");
        }
        return task;
    }
}
