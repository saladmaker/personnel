package gov.mf.dgb.personnel.personne;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;

public class Structure {

    @Id
    @GeneratedValue
    @Column(name = "structure_id")
    private Long id;

    @Column(name = "structure_nom", nullable = false, unique = true)
    String nom;

    @OneToMany
    @JoinTable(
        name = "structure_personne",
        joinColumns = @JoinColumn(name = "structure_id"),
        inverseJoinColumns = @JoinColumn(name = "personne_id") 
    )
    Set<Personne> personnes = new HashSet<>();

}
