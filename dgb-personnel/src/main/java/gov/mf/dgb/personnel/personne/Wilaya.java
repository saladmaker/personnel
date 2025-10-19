package gov.mf.dgb.personnel.personne;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Wilaya {

    @Id
    private Long id;

    @Column(name = "wilaya_nom", nullable = false, unique = true)
    String nom;

    Wilaya(){}

    public Wilaya(String nom) {
        setNom(nom);
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }
    void setNom(String newNom){
        Objects.requireNonNull(newNom);
        this.nom = newNom;
    }

    
}
