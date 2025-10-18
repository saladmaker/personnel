package gov.mf.dgb.personnel.personne;

import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;


@Repository
public interface PersonneRepo {

    @Save
    void create(Personne personne);



}
