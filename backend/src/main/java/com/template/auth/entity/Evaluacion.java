package com.template.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "evaluacion", indexes = @Index(name = "idx_evaluacion_usuario", columnList = "usuario_id"))
public class Evaluacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(nullable = false, length = 450)
    private String resumen;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recomendaciones;

    @OneToMany(mappedBy = "evaluacion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<RespuestaEvaluacion> respuestas = new ArrayList<>();

    public void agregarRespuesta(RespuestaEvaluacion respuesta) {
        respuesta.setEvaluacion(this);
        respuestas.add(respuesta);
    }
}
