package gov.mf.dgb.personnel.users;

import jakarta.validation.constraints.NotEmpty;

public record PasswordChangeRequest(@NotEmpty String oldPassword, @ValidPassword String newPassword) {

}
