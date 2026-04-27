package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectRoleService {
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<ProjectRoleStatusResponse> getProjectRolesStatus(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND));
        
        return project.getRoles().stream()
                .map(ProjectRoleStatusResponse::from)
                .collect(Collectors.toList());
    }
}
