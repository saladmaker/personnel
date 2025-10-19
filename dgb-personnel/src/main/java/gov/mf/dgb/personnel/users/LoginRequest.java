package gov.mf.dgb.personnel.users;

import jakarta.validation.constraints.Email;

public record LoginRequest(@Email String email, @ValidPassword String password) {}
