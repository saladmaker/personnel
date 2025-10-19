package gov.mf.dgb.personnel.personne;

import java.util.List;
import java.util.Optional;

import jakarta.data.repository.Find;
import jakarta.data.repository.Insert;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;


@Repository
public interface LieuRepo {

    @Insert
    Commune insertCommune(Commune commune);

    @Insert
    Wilaya insertWilaya(Wilaya wilaya);

    @Find
    Optional<Commune> commune(String nom);

    @Find
    Optional<Wilaya> wilaya(String nom);

    @Query("""
            select c.nom from Commune c join c.wilaya w
            where w.nom = :nomWilaya
            """)
    List<String> communeNomsByWilaya(String nomWilaya);

    @Query("select w.nom from Wilaya w")
    List<String> wilayaNoms();

}
