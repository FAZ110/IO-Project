package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.controller.dto.user.BasicUserResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMember;

import java.util.List;

public record ProjectMembersResponse (
    List<BasicUserResponse> sponsors,
    List<BasicUserResponse> committees,
    List<BasicUserResponse> employees
){
    public static ProjectMembersResponse from(Project project) {
        return new ProjectMembersResponse(
                project.getSponsors().stream().map(BasicUserResponse::from).toList(),
                project.getCommittees().stream().map(BasicUserResponse::from).toList(),
                project.getMembers().stream()
                        .map(ProjectMember::getUser)
                        .map(BasicUserResponse::from)
                        .toList()
        );
    }
}
