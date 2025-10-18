package gov.mf.dgb.personnel.users;

import java.util.Optional;

import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;
import jakarta.data.repository.Update;

@Repository
public interface UserRepo {

    @Save
    void save(User user);

    @Update
    void updateUser(User user);

    @Find
    Optional<User> findUserByEmail(String email);

}
