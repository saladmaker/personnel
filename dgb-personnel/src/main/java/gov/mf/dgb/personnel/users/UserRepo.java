package gov.mf.dgb.personnel.users;

import java.util.Optional;

import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;

@Repository
public interface UserRepo {

    @Save
    void save(User user);

    @Query("""
            select u from User u
            where u.email = :email
            """)
    Optional<User> findUserByEmail(String email);

    @Query("""
            select u from User u join fetch u.roles
            where u.email = :email
            """)
    Optional<User> findUserWithRolesByEmail(String email);
}
