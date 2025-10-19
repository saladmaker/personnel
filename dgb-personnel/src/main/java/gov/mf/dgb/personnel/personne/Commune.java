package gov.mf.dgb.personnel.personne;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Commune {

    @Id
    @Column(name = "commune_id")
    private Long id;

    @Column(name = "commune_nom", nullable = false, unique = true)
    private String nom;

    @ManyToOne
    @JoinColumn(name = "wilaya_id", nullable = false)
    private Wilaya wilaya;

    public Commune(){}

    public Commune(String name, Wilaya wilaya) {
        Objects.requireNonNull(name);
        Objects.requireNonNull(wilaya);
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
