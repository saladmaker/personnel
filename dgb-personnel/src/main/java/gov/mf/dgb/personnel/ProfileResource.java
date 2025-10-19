package gov.mf.dgb.personnel;

import org.eclipse.microprofile.jwt.JsonWebToken;

import gov.mf.dgb.personnel.users.PasswordChangeRequest;
import gov.mf.dgb.personnel.users.UserRepo;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/profile")
@Transactional
public class ProfileResource {

    @Inject
    UserRepo repo;

    @Inject
    JsonWebToken token;

    @RolesAllowed({"user"})
    @Path("updatePassword")
    @POST
    public Response updatePassword(@Valid PasswordChangeRequest request){

        var email = token.getSubject();
        var optUser = repo.findUserByEmail(email);

        if(optUser.isPresent()){

            var user = optUser.get();
            if(user.checkPassword(request.oldPassword())){
                user.setPassword(request.newPassword());
                repo.save(user);
                return Response.accepted().build();
            }
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

}
