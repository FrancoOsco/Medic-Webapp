package com.template.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "pregunta")
public class Pregunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String codigo;

    @Column(nullable = false, length = 350)
    private String enunciado;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String opcionesTexto;

    @Column(nullable = false)
    private int orden;

    @Column(nullable = false)
    private boolean activo = true;

    public Pregunta(String codigo, String enunciado, List<String> opciones, int orden) {
        this.codigo = codigo;
        this.enunciado = enunciado;
        this.opcionesTexto = String.join("|", opciones);
        this.orden = orden;
        this.activo = true;
    }

    @Transient
    public List<String> getOpciones() {
        return Arrays.asList(opcionesTexto.split("\\|", -1));
    }
}
