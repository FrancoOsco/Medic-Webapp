package com.template.auth.controller;

import com.template.auth.dto.PreguntaResponse;
import com.template.auth.service.PreguntaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/preguntas")
@RequiredArgsConstructor
public class PreguntaController {
    private final PreguntaService service;

    @GetMapping
    public List<PreguntaResponse> listar() { return service.listarActivas(); }
}
