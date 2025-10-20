package gov.mf.dgb.personnel;

import java.time.Duration;
import java.util.stream.Collectors;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import gov.mf.dgb.personnel.users.LoginCreateRequest;
import gov.mf.dgb.personnel.users.LoginRequest;
import gov.mf.dgb.personnel.users.Role;
import gov.mf.dgb.personnel.users.User;
import gov.mf.dgb.personnel.users.UserRepo;
import io.quarkus.logging.Log;
import io.smallrye.jwt.build.Jwt;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Transactional
@Path("users")
public class UserResource {

    @Inject
    UserRepo repo;

    @ConfigProperty(name = "personnel.token.duration")
    Duration duration;

    @Path("login")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {

        var optUser = repo.findUserWithRolesByEmail(request.email());

        if (optUser.isPresent()) {

            var user = optUser.get();
            if (user.checkPassword(request.password())) {

                return Response.ok(generateToken(user, duration)).build();
            }
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();

    }

    @RolesAllowed("admin")
    @POST
    @Path("create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid LoginCreateRequest request) {
        var optUser = repo.findUserByEmail(request.email());
        if (optUser.isEmpty()) {
            Log.info("empty### create");
            User newUser = new User(request.name(), request.email(), request.password(), request.roles());
            repo.save(newUser);
            return Response.status(Response.Status.CREATED).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    static String generateToken(User user, Duration duration) {
        return Jwt.issuer("http://localhost:8080")
                .audience("http://localhost:8080")
                .subject(user.getEmail())
                .groups(user.getRoles()
                        .stream()
                        .map(Role::name)
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet()))
                .expiresIn(duration)
                .sign();
    }

}
