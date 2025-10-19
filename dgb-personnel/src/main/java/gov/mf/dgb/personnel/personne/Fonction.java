package gov.mf.dgb.personnel.personne;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Fonction {
    @Id
    @GeneratedValue
    @Column(name = "fonction_id")
    private Long id;

    @Column(name = "fonction_nom", nullable = false, unique = true)
    String nom;

}
