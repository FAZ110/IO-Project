package pl.edu.agh.project_manager.service.projectgroup;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.project_group.AllGroupsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupDetailsResponse;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.projectgroup.ProjectGroupRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.service.command.project.ProjectGroupCreationCommand;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectGroupServiceTest {

    @Mock
    private ProjectGroupRepository projectGroupRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectGroupsService projectGroupsService;

    @Test
    @DisplayName("Should return group details when group exists")
    void getGroupById_Success() {
        // Given
        UUID groupId = UUID.randomUUID();
        User owner = User.builder().name("John").surname("Doe").email("john@doe.com").build();
        ProjectGroup group = ProjectGroup.builder()
                .id(groupId)
                .name("Wallet Alpha")
                .description("Description")
                .owner(owner)
                .groupType(GroupType.WALLET)
                .build();

        when(projectGroupRepository.findById(groupId)).thenReturn(Optional.of(group));

        // When
        SingleGroupDetailsResponse response = projectGroupsService.getGroupById(groupId);

        // Then
        assertThat(response.id()).isEqualTo(groupId);
        assertThat(response.name()).isEqualTo("Wallet Alpha");
        assertThat(response.owner().email()).isEqualTo("john@doe.com");
        verify(projectGroupRepository).findById(groupId);
    }

    @Test
    @DisplayName("Should corect group types to WALLET and PROGRAMS")
    void getGroupTypes_Success() {
        UUID walletId = UUID.randomUUID();
        UUID programId = UUID.randomUUID();
        User owner = User.builder().name("John").surname("Doe").email("john@doe.com").build();

        ProjectGroup wallet = ProjectGroup.builder()
                .id(walletId)
                .name("Wallet Alpha")
                .description("Description")
                .owner(owner)
                .groupType(GroupType.WALLET)
                .build();

        ProjectGroup program = ProjectGroup.builder()
                .id(programId)
                .name("Program Betha")
                .description("Description")
                .owner(owner)
                .groupType(GroupType.PROGRAM)
                .build();

        when(projectGroupRepository.getSingleGroupByGroupType(GroupType.WALLET)).thenReturn(List.of(wallet));
        when(projectGroupRepository.getSingleGroupByGroupType(GroupType.PROGRAM)).thenReturn(List.of(program));

        // When
        AllGroupsResponse  response = projectGroupsService.getAllGroups();

        // Then
        assertThat(response.wallets()).hasSize(1);
        assertThat(response.programs()).hasSize(1);
        assertThat(response.wallets().getFirst().id()).isEqualTo(wallet.getId());
        assertThat(response.programs().getFirst().id()).isEqualTo(program.getId());
    }

    @Test
    @DisplayName("Should throw exception when group not found")
    void getGroupById_NotFound() {
        // Given
        UUID groupId = UUID.randomUUID();
        when(projectGroupRepository.findById(groupId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> projectGroupsService.getGroupById(groupId))
                .isInstanceOf(ApplicationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ApiErrorCode.PROJECT_GROUP_NOT_FOUND);
    }

    @Test
    @DisplayName("Should create group successfully")
    void createGroup_Success() {
        // Given
        UUID userId = UUID.randomUUID();
        ProjectGroupCreationCommand command = new ProjectGroupCreationCommand(
                "New Program", "Desc", GroupType.PROGRAM, userId
        );
        User owner = User.builder().id(userId).build();
        ProjectGroup savedGroup = ProjectGroup.builder().id(UUID.randomUUID()).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(owner));
        when(projectGroupRepository.save(any(ProjectGroup.class))).thenReturn(savedGroup);

        // When
        UUID resultId = projectGroupsService.createGroup(command);

        // Then
        assertThat(resultId).isEqualTo(savedGroup.getId());
        verify(projectGroupRepository).save(any(ProjectGroup.class));
    }

    @Test
    @DisplayName("Should throw exception when owner not found during creation")
    void createGroup_UserNotFound() {
        // Given
        UUID userId = UUID.randomUUID();
        ProjectGroupCreationCommand command = new ProjectGroupCreationCommand(
                "New Program", "Desc", GroupType.PROGRAM, userId
        );

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> projectGroupsService.createGroup(command))
                .isInstanceOf(ApplicationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ApiErrorCode.USER_NOT_FOUND);

        verify(projectGroupRepository, never()).save(any());
    }
}