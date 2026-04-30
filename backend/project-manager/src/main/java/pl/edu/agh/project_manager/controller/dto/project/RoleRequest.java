//package pl.edu.agh.project_manager.controller.dto.project;
//
//import jakarta.validation.constraints.Max;
//import jakarta.validation.constraints.Min;
//import jakarta.validation.constraints.NotEmpty;
//import jakarta.validation.constraints.NotNull;
//import pl.edu.agh.project_manager.service.command.project.RoleCommand;
//
//import java.util.List;
//
//public record RoleRequest(
//        @NotEmpty(message = "Nazwa roli nie może być pusta")
//        String name,
//
//        @NotEmpty(message = "Lista zaangażowania musi zawierać co najmnej jeden element.")
//        List<@NotNull @Min(0) @Max(100) Integer> utilizationPercentages
//) {
//
//    public RoleCommand toCommand() {
//        return new RoleCommand(
//                name,
//                utilizationPercentages
//        );
//    }
//}
