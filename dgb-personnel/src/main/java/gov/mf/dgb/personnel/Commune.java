package gov.mf.dgb.personnel;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Commune {

    @Id
    @Column(name = "commune_id")
    private Long id;

    @Column(name = "commune_nom", nullable = false, unique = true)
    private String nom;

    public Commune(){}

    public Commune(String name) {
        setNom(name);
    }
    
    public Long getId(){
        return this.id;
    }

    public String getNom() {
        return nom;
    }

    void setNom(String newNom){
        Objects.requireNonNull(newNom, "nom can not be null");
        this.nom = newNom;
    }
}
