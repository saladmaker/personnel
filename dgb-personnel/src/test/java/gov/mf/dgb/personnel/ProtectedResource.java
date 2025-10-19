package gov.mf.dgb.personnel;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("protected")
public class ProtectedResource {

    @GET
    @Path("admin")
    @RolesAllowed("admin")
    public String adminConstrained(){
        return "hello";
    }

    @GET
    @Path("user")
    @RolesAllowed({"admin", "user"})
    public String userConstrained(){
        return "hello";
    }
}
