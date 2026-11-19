package com.template.auth.dto;

import java.util.List;

public record PreguntaResponse(Long id, String codigo, String enunciado, List<String> opciones) {
}
