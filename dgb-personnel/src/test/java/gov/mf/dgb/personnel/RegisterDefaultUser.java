package gov.mf.dgb.personnel;

import java.util.Set;

import gov.mf.dgb.personnel.users.User;
import gov.mf.dgb.personnel.users.UserRepo;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class RegisterDefaultUser {

    @Inject
    UserRepo repo;

    public void onStartUp(@Observes StartupEvent event){
        repo.save(new User("khaled", "df", "1994", Set.of("admin", "user")));
    }
}
