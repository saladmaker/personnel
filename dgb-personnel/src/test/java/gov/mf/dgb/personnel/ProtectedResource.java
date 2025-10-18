package gov.mf.dgb.personnel;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("protected")
public class ProtectedResource {

    @RolesAllowed("admin")
    @GET
    public String hello(){
        return "hello";
    }
}
