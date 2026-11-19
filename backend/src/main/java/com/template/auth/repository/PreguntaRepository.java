package com.template.auth.repository;

import com.template.auth.entity.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    List<Pregunta> findByActivoTrueOrderByOrdenAsc();
    boolean existsByCodigo(String codigo);
}
