package com.template.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RespuestaRequest(@NotNull Long preguntaId, @NotBlank String valor) {
}
