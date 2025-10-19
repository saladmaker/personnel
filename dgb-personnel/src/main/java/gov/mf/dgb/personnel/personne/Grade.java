package gov.mf.dgb.personnel.personne;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Grade {

    @Id
    @GeneratedValue
    @Column(name = "grade_id")
    private Long id;

    @Column(name = "grade_nom", nullable = false, unique = true)
    String nom;

}
