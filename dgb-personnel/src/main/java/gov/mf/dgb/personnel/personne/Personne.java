package gov.mf.dgb.personnel.personne;

import org.hibernate.annotations.EmbeddedColumnNaming;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Personne {

    @Id
    Long id;

    @Embedded
    @EmbeddedColumnNaming("personne_%s")
    Identification personneIdentification;

    @Embedded
    @EmbeddedColumnNaming("personne_%s")
    ContactPersonnel contactPersonnel;

    Personne(){}
    public Personne(Identification personneIdentification, ContactPersonnel contactPersonnel ) {
        this.personneIdentification = personneIdentification;
        this.contactPersonnel = contactPersonnel;
    }
}
