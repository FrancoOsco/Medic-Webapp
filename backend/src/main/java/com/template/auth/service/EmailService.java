package com.template.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailHabilitado;

    private void enviar(SimpleMailMessage mensaje, String enlaceDeDesarrollo) {
        if (emailHabilitado) {
            mailSender.send(mensaje);
        } else if (enlaceDeDesarrollo != null) {
            log.warn("MODO DESARROLLO: correo no enviado a {}. Abre para continuar: {}", java.util.Arrays.toString(mensaje.getTo()), enlaceDeDesarrollo);
        } else {
            log.info("MODO DESARROLLO: notificación de seguridad simulada.");
        }
    }

    @Value("${spring.mail.username}")
    private String remitente;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void enviarRecuperacionPassword(String destinatario, String token) {
        String enlace = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de contraseña");
        mensaje.setText("""
                Se solicitó un cambio de contraseña para tu cuenta.

                Utiliza el siguiente enlace:

                %s

                Este enlace expirará en 30 minutos.

                Si no solicitaste este cambio, ignora este correo.
                """.formatted(enlace));

        enviar(mensaje, enlace);
    }

    public void enviarVerificacionEmail(String destinatario, String token) {
        String enlace = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Verifica tu correo electrónico");
        mensaje.setText("""
                Gracias por registrarte.

                Para verificar tu correo electrónico utiliza el siguiente enlace:

                %s

                Este enlace expirará en 24 horas.

                Si no creaste esta cuenta, ignora este correo.
                """.formatted(enlace));

        enviar(mensaje, enlace);
    }

    public void enviarCambioPasswordConfirmado(String destinatario) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Tu contraseña fue cambiada");
        mensaje.setText("""
                La contraseña de tu cuenta fue cambiada correctamente.

                Por seguridad, las sesiones activas fueron cerradas.

                Si realizaste este cambio, no necesitas hacer nada.

                Si no reconoces este cambio, inicia inmediatamente el proceso de recuperación de contraseña.
                """);

        enviar(mensaje, null);
    }
}