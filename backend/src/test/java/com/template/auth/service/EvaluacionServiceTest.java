package com.template.auth.service;

import com.template.auth.dto.EvaluacionRequest;
import com.template.auth.dto.RespuestaRequest;
import com.template.auth.entity.Evaluacion;
import com.template.auth.entity.Pregunta;
import com.template.auth.entity.Usuario;
import com.template.auth.repository.EvaluacionRepository;
import com.template.auth.repository.PreguntaRepository;
import com.template.auth.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EvaluacionServiceTest {
    @Mock private EvaluacionRepository evaluacionRepository;
    @Mock private PreguntaRepository preguntaRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @InjectMocks private EvaluacionService service;

    private Usuario usuario() {
        Usuario u = new Usuario();
        u.setId(5L);
        u.setEmail("prueba@ariana.test");
        return u;
    }

    private Pregunta pregunta() {
        Pregunta p = new Pregunta("DESCANSO", "¿Cuántas horas duermes?",
                List.of("Menos de 6 horas", "Entre 6 y 8 horas"), 1);
        p.setId(1L);
        return p;
    }

    @Test
    void rechazaRespuestasIncompletas() {
        when(usuarioRepository.findByEmail("prueba@ariana.test")).thenReturn(Optional.of(usuario()));
        when(preguntaRepository.findByActivoTrueOrderByOrdenAsc()).thenReturn(List.of(pregunta()));
        assertThrows(ResponseStatusException.class, () ->
                service.crear("prueba@ariana.test", new EvaluacionRequest(List.of())));
        verify(evaluacionRepository, never()).saveAndFlush(any());
    }

    @Test
    void rechazaValoresFueraDeOpciones() {
        when(usuarioRepository.findByEmail("prueba@ariana.test")).thenReturn(Optional.of(usuario()));
        when(preguntaRepository.findByActivoTrueOrderByOrdenAsc()).thenReturn(List.of(pregunta()));
        assertThrows(ResponseStatusException.class, () ->
                service.crear("prueba@ariana.test", new EvaluacionRequest(
                        List.of(new RespuestaRequest(1L, "respuesta inventada")))));
        verify(evaluacionRepository, never()).saveAndFlush(any());
    }

    @Test
    void noPermiteConsultarEvaluacionDeOtroUsuario() {
        when(usuarioRepository.findByEmail("prueba@ariana.test")).thenReturn(Optional.of(usuario()));
        when(evaluacionRepository.findByIdAndUsuarioId(7L, 5L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.obtener("prueba@ariana.test", 7L));
        verify(evaluacionRepository).findByIdAndUsuarioId(7L, 5L);
    }

    @Test
    void guardaEvaluacionYGeneraOrientacionNoClinica() {
        when(usuarioRepository.findByEmail("prueba@ariana.test")).thenReturn(Optional.of(usuario()));
        when(preguntaRepository.findByActivoTrueOrderByOrdenAsc()).thenReturn(List.of(pregunta()));
        when(evaluacionRepository.saveAndFlush(any(Evaluacion.class))).thenAnswer(invocation -> {
            Evaluacion e = invocation.getArgument(0);
            e.setId(9L);
            return e;
        });
        var resultado = service.crear("prueba@ariana.test", new EvaluacionRequest(
                List.of(new RespuestaRequest(1L, "Menos de 6 horas"))));
        assertEquals(9L, resultado.id());
        assertEquals(1, resultado.respuestas().size());
        assertTrue(resultado.recomendaciones().stream().anyMatch(r -> r.contains("no constituye")));
        verify(evaluacionRepository).saveAndFlush(any(Evaluacion.class));
    }
}
