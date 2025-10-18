package gov.mf.dgb.personnel.personne;

import org.hibernate.annotations.EmbeddedColumnNaming;

import jakarta.persistence.Embeddable;


@Embeddable
public record ContactPersonnel(@EmbeddedColumnNaming("contact_adresse_%s")
                                Adresse adressePrincipal,
                               String email,
                               String numeroPortable) {
}
