package com.template.auth.controller;

import com.template.auth.dto.*;
import com.template.auth.service.EvaluacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
public class EvaluacionController {
    private final EvaluacionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionResponse crear(Authentication authentication, @Valid @RequestBody EvaluacionRequest request) {
        return service.crear(authentication.getName(), request);
    }

    @GetMapping("/mis-evaluaciones")
    public List<EvaluacionResumenResponse> historial(Authentication authentication) {
        return service.historial(authentication.getName());
    }

    @GetMapping("/{id}")
    public EvaluacionResponse obtener(Authentication authentication, @PathVariable Long id) {
        return service.obtener(authentication.getName(), id);
    }
}
