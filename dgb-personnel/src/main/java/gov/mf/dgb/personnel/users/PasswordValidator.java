package gov.mf.dgb.personnel.users;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String>{

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (null == value) {
            return false;
        }

        boolean hasMinLength = value.length() >= 8;
        boolean hasFourDigits = value.chars().filter(Character::isDigit).count() >= 4;
        boolean hasSpecialChar = value.matches(".*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?].*");

        return hasMinLength && hasFourDigits && hasSpecialChar;
    }


}
