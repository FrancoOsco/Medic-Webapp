package com.template.auth.dto;

import java.time.LocalDateTime;
import java.util.List;

public record EvaluacionResponse(Long id, LocalDateTime fecha, String resumen,
                                 List<String> recomendaciones, List<RespuestaEvaluacionResponse> respuestas) {
}
