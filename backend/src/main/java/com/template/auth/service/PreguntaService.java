package com.template.auth.service;

import com.template.auth.dto.PreguntaResponse;
import com.template.auth.repository.PreguntaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PreguntaService {
    private final PreguntaRepository preguntaRepository;

    @Transactional(readOnly = true)
    public List<PreguntaResponse> listarActivas() {
        return preguntaRepository.findByActivoTrueOrderByOrdenAsc().stream()
                .map(p -> new PreguntaResponse(p.getId(), p.getCodigo(), p.getEnunciado(), p.getOpciones()))
                .toList();
    }
}
