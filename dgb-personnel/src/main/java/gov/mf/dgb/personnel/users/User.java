package gov.mf.dgb.personnel.users;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import io.quarkus.elytron.security.common.BcryptUtil;


@Entity
@Table(name = "user_table")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ElementCollection
    @CollectionTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id", nullable = false)
    )
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    
    public User() {
    }

    
    public User(String name, String email, String password, Set<Role> roles) {
        this.name = name;
        this.email = email;
        setPassword(password);
        this.roles = roles;
    }
    public boolean checkPassword(String passwordToCheck){
        return BcryptUtil.matches(passwordToCheck, this.password);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = BcryptUtil.bcryptHash(password);
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void addRole(Role role){
        Objects.requireNonNull(role, "role can not be null");
        roles.add(role);
    }
    
    public void removeRole(Role role){
        Objects.requireNonNull(role, "role can not be null");
        roles.remove(role);
    }

}
