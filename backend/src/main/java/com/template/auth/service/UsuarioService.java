package com.template.auth.service;

import com.template.auth.dto.ActualizarUsuarioRequest;
import com.template.auth.dto.UsuarioResponse;
import com.template.auth.entity.Usuario;
import com.template.auth.exception.UsuarioNoEncontradoException;
import com.template.auth.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EvaluacionRepository evaluacionRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream().map(this::convertirAResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long id) {
        return convertirAResponse(usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id)));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorEmail(String email) {
        return convertirAResponse(usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Usuario no encontrado.")));
    }

    @Transactional
    public UsuarioResponse actualizarPorEmail(String email, ActualizarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Usuario no encontrado."));
        return guardarCambios(usuario, request);
    }

    @Transactional
    public UsuarioResponse actualizarPorId(Long id, ActualizarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));
        return guardarCambios(usuario, request);
    }

    private UsuarioResponse guardarCambios(Usuario usuario, ActualizarUsuarioRequest request) {
        usuario.setNombre(request.nombre().trim());
        usuario.setApellido(request.apellido().trim());
        return convertirAResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));
        // Eliminar evaluaciones como entidades para ejecutar cascada de sus respuestas.
        evaluacionRepository.deleteAll(evaluacionRepository.findByUsuarioIdOrderByFechaDesc(id));
        evaluacionRepository.flush();
        emailVerificationTokenRepository.deleteByUsuarioId(id);
        passwordResetTokenRepository.deleteByUsuarioId(id);
        refreshTokenRepository.deleteByUsuarioId(id);
        usuarioRepository.delete(usuario);
    }

    private UsuarioResponse convertirAResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getApellido(),
                usuario.getEmail(), usuario.getRol());
    }
}
