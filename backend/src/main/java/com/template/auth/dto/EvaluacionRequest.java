package com.template.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record EvaluacionRequest(@NotEmpty List<@NotNull @Valid RespuestaRequest> respuestas) {
}
