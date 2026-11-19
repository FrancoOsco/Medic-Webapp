package com.template.auth.repository;

import com.template.auth.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    Optional<Evaluacion> findByIdAndUsuarioId(Long id, Long usuarioId);
}
