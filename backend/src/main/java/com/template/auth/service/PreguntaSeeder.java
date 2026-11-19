package com.template.auth.service;

import com.template.auth.entity.Pregunta;
import com.template.auth.repository.PreguntaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PreguntaSeeder implements CommandLineRunner {
    private final PreguntaRepository preguntas;

    @Override
    public void run(String... args) {
        // Inserción idempotente: se crean únicamente las preguntas ausentes.
        agregar("DESCANSO", "¿Cuántas horas duermes habitualmente?",
                List.of("Menos de 6 horas", "Entre 6 y 8 horas", "Más de 8 horas"), 1);
        agregar("ACTIVIDAD", "¿Con qué frecuencia realizas actividad física durante la semana?",
                List.of("Casi nunca", "1 o 2 días", "3 o más días"), 2);
        agregar("ALIMENTACION", "¿Con qué frecuencia incluyes frutas o verduras en tus comidas?",
                List.of("Casi nunca", "Algunos días", "Todos los días"), 3);
        agregar("HIDRATACION", "¿Sueles beber agua a lo largo del día?",
                List.of("Rara vez", "A veces", "Frecuentemente"), 4);
        agregar("PAUSAS", "¿Haces pausas o descansos cuando estudias o trabajas muchas horas?",
                List.of("Rara vez", "A veces", "Frecuentemente"), 5);
    }

    private void agregar(String codigo, String texto, List<String> opciones, int orden) {
        if (!preguntas.existsByCodigo(codigo)) {
            preguntas.save(new Pregunta(codigo, texto, opciones, orden));
        }
    }
}
