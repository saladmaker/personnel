package gov.mf.dgb.personnel.users;

import java.util.Set;

import gov.mf.dgb.personnel.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
public record LoginCreateRequest(@NotBlank String name,
        @Email String email,
        @NotEmpty Set<Role> roles,
        @ValidPassword String password) {
}
