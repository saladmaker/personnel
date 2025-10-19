package gov.mf.dgb.personnel;

import java.util.Set;

import gov.mf.dgb.personnel.users.Role;
import gov.mf.dgb.personnel.users.User;
import gov.mf.dgb.personnel.users.UserRepo;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
@Transactional
public class RegisterDefaultUser {
    
    User UNPRIVILEGED_USER = new User("abdou", "abdou@mf.dz", "1990", Set.of(Role.USER));
    User PRIVILEGED_USER = new User("khaled", "khaled@mf.dz", "1994", Set.of(Role.ADMIN, Role.USER));
    User CHANGE_PASSWORD_USER = new User("ahmed", "ahmed@mf.dz", "1990", Set.of(Role.USER));

    @Inject
    UserRepo repo;

    public void onStartUp(@Observes StartupEvent event){
        repo.save(UNPRIVILEGED_USER);
        repo.save(PRIVILEGED_USER);
        repo.save(CHANGE_PASSWORD_USER);
    }
}
