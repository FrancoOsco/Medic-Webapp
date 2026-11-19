package com.template.auth.service;

import com.template.auth.dto.*;
import com.template.auth.entity.*;
import com.template.auth.repository.EvaluacionRepository;
import com.template.auth.repository.PreguntaRepository;
import com.template.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluacionService {
    private final EvaluacionRepository evaluaciones;
    private final PreguntaRepository preguntas;
    private final UsuarioRepository usuarios;

    @Transactional
    public EvaluacionResponse crear(String email, EvaluacionRequest request) {
        Usuario usuario = usuarioActual(email);
        List<Pregunta> activas = preguntas.findByActivoTrueOrderByOrdenAsc();
        if (activas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No hay preguntas activas.");
        }
        Map<Long, Pregunta> porId = activas.stream()
                .collect(Collectors.toMap(Pregunta::getId, Function.identity()));
        Map<Long, String> respuestas = new HashMap<>();
        for (RespuestaRequest respuesta : request.respuestas()) {
            Pregunta pregunta = porId.get(respuesta.preguntaId());
            if (pregunta == null || !pregunta.getOpciones().contains(respuesta.valor())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Respuesta o pregunta no permitida.");
            }
            if (respuestas.putIfAbsent(respuesta.preguntaId(), respuesta.valor()) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se permiten preguntas repetidas.");
            }
        }
        if (respuestas.size() != activas.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Responde todas las preguntas.");
        }
        List<String> recomendaciones = recomendaciones(activas, respuestas);
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setUsuario(usuario);
        evaluacion.setResumen("Orientación general de hábitos y bienestar");
        evaluacion.setRecomendaciones(String.join("\n", recomendaciones));
        for (Pregunta pregunta : activas) {
            evaluacion.agregarRespuesta(new RespuestaEvaluacion(pregunta, respuestas.get(pregunta.getId())));
        }
        return detalle(evaluaciones.saveAndFlush(evaluacion));
    }

    @Transactional(readOnly = true)
    public List<EvaluacionResumenResponse> historial(String email) {
        Long usuarioId = usuarioActual(email).getId();
        return evaluaciones.findByUsuarioIdOrderByFechaDesc(usuarioId).stream()
                .map(e -> new EvaluacionResumenResponse(e.getId(), e.getFecha(), e.getResumen()))
                .toList();
    }

    @Transactional(readOnly = true)
    public EvaluacionResponse obtener(String email, Long id) {
        Long usuarioId = usuarioActual(email).getId();
        Evaluacion evaluacion = evaluaciones.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluación no encontrada."));
        return detalle(evaluacion);
    }

    private Usuario usuarioActual(String email) {
        return usuarios.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión inválida."));
    }

    private EvaluacionResponse detalle(Evaluacion evaluacion) {
        List<RespuestaEvaluacionResponse> respuestas = evaluacion.getRespuestas().stream()
                .map(r -> new RespuestaEvaluacionResponse(
                        r.getPregunta().getId(), r.getPregunta().getEnunciado(), r.getValor()))
                .toList();
        return new EvaluacionResponse(evaluacion.getId(), evaluacion.getFecha(), evaluacion.getResumen(),
                Arrays.asList(evaluacion.getRecomendaciones().split("\\n")), respuestas);
    }

    private List<String> recomendaciones(List<Pregunta> activas, Map<Long, String> respuestas) {
        List<String> consejos = new ArrayList<>();
        for (Pregunta pregunta : activas) {
            String valor = respuestas.get(pregunta.getId());
            switch (pregunta.getCodigo()) {
                case "DESCANSO" -> {
                    if ("Menos de 6 horas".equals(valor))
                        consejos.add("Considera mantener una rutina de descanso regular y consultar a un profesional si el sueño es una preocupación frecuente.");
                }
                case "ACTIVIDAD" -> {
                    if ("Casi nunca".equals(valor))
                        consejos.add("Valora incorporar actividades físicas suaves que se adapten a tu situación y posibilidades.");
                }
                case "ALIMENTACION" -> {
                    if (!"Todos los días".equals(valor))
                        consejos.add("Cuando sea posible, procura variar tus comidas incluyendo frutas y verduras.");
                }
                case "HIDRATACION" -> {
                    if (!"Frecuentemente".equals(valor))
                        consejos.add("Ten agua disponible a lo largo del día y adapta su consumo a tus necesidades personales.");
                }
                case "PAUSAS" -> {
                    if ("Rara vez".equals(valor))
                        consejos.add("Procura introducir pausas breves durante periodos prolongados de estudio o trabajo.");
                }
                default -> { }
            }
        }
        if (consejos.isEmpty()) {
            consejos.add("Continúa observando tus hábitos cotidianos y realizando ajustes cuando lo consideres necesario.");
        }
        consejos.add("Esta orientación es únicamente informativa; no constituye evaluación clínica ni diagnóstico. Ante síntomas o dudas sobre tu salud, busca atención profesional.");
        return consejos;
    }
}
