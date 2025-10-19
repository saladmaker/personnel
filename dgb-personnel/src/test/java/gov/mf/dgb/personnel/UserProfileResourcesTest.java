package gov.mf.dgb.personnel;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.notNullValue;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.time.Duration;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import io.smallrye.jwt.build.Jwt;
import jakarta.ws.rs.core.Response;

@QuarkusTest
public class UserProfileResourcesTest {

  @ParameterizedTest
  @CsvSource({
      "khaled@mf.dz,1994,200",
      "khaled@mf.dz,1997,401" // wrong
  })
  void testLogin(String email, String password, int expectedStatus) {
    String loginBody = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";

    given()
        .contentType(ContentType.JSON)
        .body(loginBody)
        .when()
        .post("/api/users/login")
        .then()
        .statusCode(expectedStatus)
        .body(notNullValue())
        .extract()
        .asString();
  }
  @Test
  void testCorsPreflight() {
  given()
      .header("Origin", "http://localhost:4200")
      .header("Access-Control-Request-Method", "POST")
      .when()
      .options("/api/users/login")
      .then()
      .statusCode(200);
}

  @Test
  void test_privilege_token() {
    String loginBodyAdmin = "{\"email\":\"khaled@mf.dz\",\"password\":\"1994\"}";

    var adminToken = given()
        .contentType(ContentType.JSON)
        .body(loginBodyAdmin)
        .when()
        .post("/api/users/login")
        .then()
        .extract()
        .asString();
    given()
        .auth().oauth2(adminToken)
        .when()
        .get("/api/protected/admin")
        .then()
        .statusCode(200)
        .body(containsString("hello"));
    given()
        .auth().oauth2(adminToken)
        .when()
        .get("/api/protected/user")
        .then()
        .statusCode(200)
        .body(containsString("hello"));

    String loginBodyUser = "{\"email\":\"abdou@mf.dz\",\"password\":\"1990\"}";

    var userToken = given()
        .contentType(ContentType.JSON)
        .body(loginBodyUser)
        .when()
        .post("/api/users/login")
        .then()
        .extract()
        .asString();
    //access    
    given()
        .auth().oauth2(userToken)
        .when()
        .get("/api/protected/user")
        .then()
        .statusCode(200)
        .body(containsString("hello"));

    given()
        .auth().oauth2(userToken)
        .when()
        .get("/api/protected/admin")
        .then()
        .statusCode(403);    
  }
  @Test
  void testChangePassword(){
    String loginBodyUser = "{\"email\":\"ahmed@mf.dz\",\"password\":\"1990\"}";

    var userToken = given()
        .contentType(ContentType.JSON)
        .body(loginBodyUser)
        .when()
        .post("/api/users/login")
        .then()
        .extract()
        .asString();
    String changePasswordBody = "{\"oldPassword\":\"1990\",\"newPassword\":\"abdf$df3239\"}";
    given()
        .auth().oauth2(userToken)
        .contentType(ContentType.JSON)
        .body(changePasswordBody)
        .when()
        .post("/api/profile/updatePassword")
        .then()
        .statusCode(Response.Status.ACCEPTED.getStatusCode());

    String changePasswordBody2 = "{\"oldPassword\":\"abdf$df3239\",\"newPassword\":\"1234\"}";
    given()
        .auth().oauth2(userToken)
        .contentType(ContentType.JSON)
        .body(changePasswordBody2)
        .when()
        .post("/api/profile/updatePassword")
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());  
    
  }

  @Test
  void testProtectedEndpointWithInvalidToken() {
    PrivateKey privateKey = null;
    try {
      KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
      keyGen.initialize(2048);
      KeyPair keyPair = keyGen.generateKeyPair();
      privateKey = keyPair.getPrivate();
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }

    // invalid token: signed with wrong key
    String invalidToken = Jwt.issuer("http://localhost:8080")
        .audience("http://localhost:8080")
        .subject("khaled")
        .groups(Set.of("admin", "user"))
        .expiresIn(Duration.ofHours(1))
        .sign(privateKey);
    given()
        .auth().oauth2(invalidToken)
        .when()
        .get("/api/protected/user")
        .then()
        .statusCode(401);

  }

  @Test
  void testwithoutToken() {
    given()
        .when()
        .get("/api/protected/user")
        .then()
        .statusCode(401);
    given()
        .when()
        .get("/api/protected/admin")
        .then()
        .statusCode(401);

  }
}
