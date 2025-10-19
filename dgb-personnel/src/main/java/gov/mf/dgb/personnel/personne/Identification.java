package gov.mf.dgb.personnel.personne;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

@Embeddable
public record Identification(
        @Column(name = "numero_identification_national", nullable = false, unique = true)
        String nin,

        @Column(name = "nom", nullable = false)
        String nom,

        @Column(name = "prenom", nullable = false)
        String prenom,

        @Column(name = "nom_jeunfils")
        String jeunfils,

        @Enumerated(EnumType.STRING) @Column(name = "sexe", nullable = false)
        Sexe sexe,

        @Enumerated(EnumType.STRING) @Column(name = "etat_civil", nullable = false)
        EtatCivil etatCivil,

        @Column(name = "date_naissance", nullable = false)
        LocalDate dateDeNaissance,

        @Column(name = "date_naissance_presume", nullable = false)
        boolean dateDeNaissancePresum,

        @ManyToOne
        @JoinColumn(name = "commune_naissance_id")
        Commune communeDeNaissance,

        @ManyToOne
        @JoinColumn(name = "wilaya_naissance_id")
        Wilaya wilayaDeNaissance,

        @Column(name = "pays_naissance", nullable = false)
        String paysDeNaissance,

        @Column(name = "numero_extrait_naissance", nullable = false)
        String numeroDeExtraitNaissance
        ) {
}
