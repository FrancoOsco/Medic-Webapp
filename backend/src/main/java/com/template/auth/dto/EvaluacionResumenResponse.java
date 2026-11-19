package com.template.auth.dto;

import java.time.LocalDateTime;

public record EvaluacionResumenResponse(Long id, LocalDateTime fecha, String resumen) {
}
