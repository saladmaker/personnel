package gov.mf.dgb.personnel.personne;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public record Adresse(

        @Column(name = "rue")
        String rue,

        @Column(name = "complement")
        String complement,

        @ManyToOne
        @JoinColumn(name = "commune_id")
        Commune commune,

        @ManyToOne
        @JoinColumn(name = "wilaya_id")
        Wilaya wilaya,

        @Column(name = "code_postal")
        String codePostal) {
}
