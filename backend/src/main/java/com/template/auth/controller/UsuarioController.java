package com.template.auth.controller;

import com.template.auth.dto.ActualizarUsuarioRequest;
import com.template.auth.dto.UsuarioResponse;
import com.template.auth.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/me")
    public UsuarioResponse miPerfil(Authentication auth) {
        return usuarioService.obtenerPorEmail(auth.getName());
    }

    @PutMapping("/me")
    public UsuarioResponse actualizarMiPerfil(Authentication auth, @Valid @RequestBody ActualizarUsuarioRequest request) {
        return usuarioService.actualizarPorEmail(auth.getName(), request);
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtenerUsuario(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizarUsuario(@PathVariable Long id, @Valid @RequestBody ActualizarUsuarioRequest request) {
        return usuarioService.actualizarPorId(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
