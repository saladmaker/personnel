package gov.mf.dgb.personnel.personne;


import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public record Emploi(
    @Column(name = "numero_securite_social")
    String numeroSecuriteSocial,
    
    @Column(name = "numero_mutuelle")
    String numeroMutuelle,
        
    @Column(name = "date_recrutement")
    LocalDate dateRecrutement,

    @Column(name = "contrat_type")
    @Enumerated(EnumType.STRING)
    ContratType typeContrat,

    @Column(name = "temps_type")
    @Enumerated(EnumType.STRING)
    Temps temps,
    
    @ManyToOne
    @JoinColumn(name = "grade_origine_id", nullable = false)
    Grade gradeOrigine,

    @ManyToOne
    @JoinColumn(name = "grade_actuel_id", nullable = false)
    Grade gradeActuel,
    
    @ManyToOne
    @JoinColumn(name = "fonction_id", nullable = false)
    Fonction fonction) {
}
