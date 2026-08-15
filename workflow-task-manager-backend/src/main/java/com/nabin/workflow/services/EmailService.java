package com.nabin.workflow.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String emailFrom;

    @Value("${app.email.from-name}")
    private String emailFromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Send verification email
     */
    @Async
    public void sendVerificationEmail(String to, String username, String token) {
        try {
            log.info("📧 Sending verification email to: {}", to);

            String verificationLink = frontendUrl + "/verify-email?token=" + token;
            String subject = "Verify Your Email - WorkFlow";
            String htmlContent = buildVerificationEmailHtml(username, verificationLink);

            sendHtmlEmail(to, subject, htmlContent);

            log.info("✅ Verification email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("❌ Failed to send verification email to {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Send password reset email
     */
    @Async
    public void sendPasswordResetEmail(String to, String username, String token) {
        try {
            log.info("📧 Sending password reset email to: {}", to);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            String subject = "Reset Your Password - WorkFlow";
            String htmlContent = buildPasswordResetEmailHtml(username, resetLink);

            sendHtmlEmail(to, subject, htmlContent);

            log.info("✅ Password reset email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Send welcome email
     */
    @Async
    public void sendWelcomeEmail(String to, String username) {
        try {
            log.info("📧 Sending welcome email to: {}", to);

            String subject = "Welcome to WorkFlow! 🎉";
            String htmlContent = buildWelcomeEmailHtml(username);

            sendHtmlEmail(to, subject, htmlContent);

            log.info("✅ Welcome email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("❌ Failed to send welcome email to {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Core method to send HTML email
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent)
            throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(emailFrom, emailFromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    /**
     * Build verification email HTML
     */
    private String buildVerificationEmailHtml(String username, String verificationLink) {
        String html = "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Verify Your Email</title>" +
                "</head>" +
                "<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;\">" +
                "    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">" +
                "        <tr>" +
                "            <td align=\"center\" style=\"padding: 40px 0;\">" +
                "                <table role=\"presentation\" style=\"width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">" +
                "                    <!-- Header -->" +
                "                    <tr>" +
                "                        <td style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;\">" +
                "                            <h1 style=\"color: #ffffff; margin: 0; font-size: 28px;\">Welcome to WorkFlow!</h1>" +
                "                            <p style=\"color: #ffffff; margin: 10px 0 0 0; font-size: 16px;\">Task Management Made Easy</p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Content -->" +
                "                    <tr>" +
                "                        <td style=\"padding: 40px 30px; background-color: #f9f9f9;\">" +
                "                            <h2 style=\"color: #333333; margin: 0 0 20px 0; font-size: 24px;\">Hi {{USERNAME}}! 👋</h2>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;\">" +
                "                                Thank you for registering with WorkFlow! We're excited to have you on board." +
                "                            </p>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;\">" +
                "                                To complete your registration and activate your account, please verify your email address by clicking the button below:" +
                "                            </p>" +
                "                            <!-- Button -->" +
                "                            <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">" +
                "                                <tr>" +
                "                                    <td align=\"center\" style=\"padding: 0;\">" +
                "                                        <a href=\"{{LINK}}\"" +
                "                                           style=\"display: inline-block; padding: 16px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;\">" +
                "                                            Verify Email Address" +
                "                                        </a>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 30px 0 10px 0; font-size: 14px;\">" +
                "                                Or copy and paste this link into your browser:" +
                "                            </p>" +
                "                            <p style=\"color: #667eea; word-break: break-all; margin: 0 0 20px 0; font-size: 12px;\">" +
                "                                {{LINK}}" +
                "                            </p>" +
                "                            <div style=\"background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;\">" +
                "                                <p style=\"color: #856404; margin: 0; font-size: 14px;\">" +
                "                                    <strong>⏰ Important:</strong> This link will expire in 24 hours." +
                "                                </p>" +
                "                            </div>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;\">" +
                "                                If you didn't create an account with WorkFlow, you can safely ignore this email." +
                "                            </p>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;\">" +
                "                                Best regards,<br>" +
                "                                <strong>The WorkFlow Team</strong>" +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Footer -->" +
                "                    <tr>" +
                "                        <td style=\"background-color: #333333; padding: 20px; text-align: center;\">" +
                "                            <p style=\"color: #ffffff; margin: 0; font-size: 12px;\">" +
                "                                © 2026 WorkFlow. All rights reserved." +
                "                            </p>" +
                "                            <p style=\"color: #999999; margin: 10px 0 0 0; font-size: 12px;\">" +
                "                                This email was sent to you because you registered on WorkFlow." +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";

        return html
                .replace("{{USERNAME}}", username)
                .replace("{{LINK}}", verificationLink);
    }

    /**
     * Build password reset email HTML
     */
    private String buildPasswordResetEmailHtml(String username, String resetLink) {
        String html = "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Reset Your Password</title>" +
                "</head>" +
                "<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;\">" +
                "    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">" +
                "        <tr>" +
                "            <td align=\"center\" style=\"padding: 40px 0;\">" +
                "                <table role=\"presentation\" style=\"width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">" +
                "                    <!-- Header -->" +
                "                    <tr>" +
                "                        <td style=\"background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; text-align: center;\">" +
                "                            <h1 style=\"color: #ffffff; margin: 0; font-size: 28px;\">Password Reset Request</h1>" +
                "                            <p style=\"color: #ffffff; margin: 10px 0 0 0; font-size: 16px;\">WorkFlow Account Security</p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Content -->" +
                "                    <tr>" +
                "                        <td style=\"padding: 40px 30px; background-color: #f9f9f9;\">" +
                "                            <h2 style=\"color: #333333; margin: 0 0 20px 0; font-size: 24px;\">Hi {{USERNAME}}! 🔒</h2>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;\">" +
                "                                We received a request to reset your password for your WorkFlow account." +
                "                            </p>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;\">" +
                "                                Click the button below to reset your password:" +
                "                            </p>" +
                "                            <!-- Button -->" +
                "                            <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">" +
                "                                <tr>" +
                "                                    <td align=\"center\" style=\"padding: 0;\">" +
                "                                        <a href=\"{{LINK}}\"" +
                "                                           style=\"display: inline-block; padding: 16px 40px; background-color: #f5576c; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;\">" +
                "                                            Reset Password" +
                "                                        </a>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 30px 0 10px 0; font-size: 14px;\">" +
                "                                Or copy and paste this link into your browser:" +
                "                            </p>" +
                "                            <p style=\"color: #f5576c; word-break: break-all; margin: 0 0 20px 0; font-size: 12px;\">" +
                "                                {{LINK}}" +
                "                            </p>" +
                "                            <!-- Warning Box -->" +
                "                            <div style=\"background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;\">" +
                "                                <p style=\"color: #856404; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;\">" +
                "                                    ⚠️ Important Security Information:" +
                "                                </p>" +
                "                                <ul style=\"color: #856404; margin: 0; padding-left: 20px; font-size: 14px;\">" +
                "                                    <li>This link will expire in 1 hour</li>" +
                "                                    <li>For security, this link can only be used once</li>" +
                "                                    <li>If you didn't request this, please ignore this email</li>" +
                "                                </ul>" +
                "                            </div>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;\">" +
                "                                If you didn't request a password reset, your account is still secure and no changes have been made." +
                "                            </p>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;\">" +
                "                                Best regards,<br>" +
                "                                <strong>The WorkFlow Team</strong>" +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Footer -->" +
                "                    <tr>" +
                "                        <td style=\"background-color: #333333; padding: 20px; text-align: center;\">" +
                "                            <p style=\"color: #ffffff; margin: 0; font-size: 12px;\">" +
                "                                © 2026 WorkFlow. All rights reserved." +
                "                            </p>" +
                "                            <p style=\"color: #999999; margin: 10px 0 0 0; font-size: 12px;\">" +
                "                                This email was sent because a password reset was requested for your account." +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";

        return html
                .replace("{{USERNAME}}", username)
                .replace("{{LINK}}", resetLink);
    }

    /**
     * Send team invitation email
     */
    @Async
    public void sendTeamInvitationEmail(String to, String invitedByUsername, String teamName) {
        try {
            log.info("Sending team invitation email to: {}", to);

            String inviteLink = frontendUrl + "/login";
            String subject = "You've been invited to " + teamName + " - WorkFlow";
            String htmlContent = buildTeamInvitationHtml(invitedByUsername, teamName, inviteLink);

            sendHtmlEmail(to, subject, htmlContent);

            log.info("Team invitation email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send team invitation email to {}: {}", to, e.getMessage(), e);
        }
    }

    private String buildTeamInvitationHtml(String invitedBy, String teamName, String inviteLink) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Team Invitation</title></head>" +
                "<body style=\"margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;\">" +
                "<table role=\"presentation\" style=\"width:100%;border-collapse:collapse;\">" +
                "<tr><td align=\"center\" style=\"padding:40px 0;\">" +
                "<table role=\"presentation\" style=\"width:600px;border-collapse:collapse;background-color:#ffffff;box-shadow:0 4px 6px rgba(0,0,0,0.1);\">" +
                "<tr><td style=\"background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px;text-align:center;\">" +
                "<h1 style=\"color:#ffffff;margin:0;font-size:28px;\">Team Invitation</h1>" +
                "<p style=\"color:#ffffff;margin:10px 0 0 0;font-size:16px;\">You've been invited to join a team</p>" +
                "</td></tr>" +
                "<tr><td style=\"padding:40px 30px;background-color:#f9f9f9;\">" +
                "<p style=\"color:#555555;line-height:1.6;margin:0 0 20px 0;font-size:16px;\">Hello,</p>" +
                "<p style=\"color:#555555;line-height:1.6;margin:0 0 20px 0;font-size:16px;\"><strong>" + invitedBy + "</strong> has invited you to join the team <strong>" + teamName + "</strong> on WorkFlow.</p>" +
                "<table role=\"presentation\" style=\"width:100%;border-collapse:collapse;\">" +
                "<tr><td align=\"center\" style=\"padding:20px 0;\">" +
                "<a href=\"" + inviteLink + "\" style=\"display:inline-block;padding:16px 40px;background-color:#667eea;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;\">View Team</a>" +
                "</td></tr></table>" +
                "<p style=\"color:#555555;line-height:1.6;margin:20px 0 0 0;font-size:14px;\">If you don't have an account yet, please sign up first to access the team.</p>" +
                "<p style=\"color:#555555;line-height:1.6;margin:30px 0 0 0;font-size:16px;\">Best regards,<br><strong>The WorkFlow Team</strong></p>" +
                "</td></tr>" +
                "<tr><td style=\"background-color:#333333;padding:20px;text-align:center;\">" +
                "<p style=\"color:#ffffff;margin:0;font-size:12px;\">&copy; 2026 WorkFlow. All rights reserved.</p>" +
                "</td></tr></table></td></tr></table></body></html>";
    }

    /**
     * Build welcome email HTML
     */
    private String buildWelcomeEmailHtml(String username) {
        String html = "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Welcome to WorkFlow</title>" +
                "</head>" +
                "<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;\">" +
                "    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">" +
                "        <tr>" +
                "            <td align=\"center\" style=\"padding: 40px 0;\">" +
                "                <table role=\"presentation\" style=\"width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">" +
                "                    <!-- Header -->" +
                "                    <tr>" +
                "                        <td style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;\">" +
                "                            <h1 style=\"color: #ffffff; margin: 0; font-size: 32px;\">Welcome to WorkFlow! 🎉</h1>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Content -->" +
                "                    <tr>" +
                "                        <td style=\"padding: 40px 30px; background-color: #f9f9f9;\">" +
                "                            <h2 style=\"color: #333333; margin: 0 0 20px 0; font-size: 24px;\">Hi {{USERNAME}}!</h2>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;\">" +
                "                                Your email has been verified successfully! Welcome to WorkFlow - your personal task management companion." +
                "                            </p>" +
                "                            <h3 style=\"color: #333333; margin: 30px 0 15px 0; font-size: 18px;\">🚀 Get Started:</h3>" +
                "                            <ul style=\"color: #555555; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px; font-size: 15px;\">" +
                "                                <li>Create your first task and stay organized</li>" +
                "                                <li>Set up categories to group your tasks</li>" +
                "                                <li>Set priorities and due dates to stay on track</li>" +
                "                                <li>Track your progress with our dashboard</li>" +
                "                            </ul>" +
                "                            <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse; margin: 30px 0;\">" +
                "                                <tr>" +
                "                                    <td align=\"center\" style=\"padding: 0;\">" +
                "                                        <a href=\"{{FRONTEND_URL}}/login\"" +
                "                                           style=\"display: inline-block; padding: 16px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;\">" +
                "                                            Start Using WorkFlow" +
                "                                        </a>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;\">" +
                "                                If you have any questions or need help getting started, feel free to reply to this email." +
                "                            </p>" +
                "                            <p style=\"color: #555555; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;\">" +
                "                                Happy task managing!<br>" +
                "                                <strong>The WorkFlow Team</strong>" +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <!-- Footer -->" +
                "                    <tr>" +
                "                        <td style=\"background-color: #333333; padding: 20px; text-align: center;\">" +
                "                            <p style=\"color: #ffffff; margin: 0; font-size: 12px;\">" +
                "                                © 2026 WorkFlow. All rights reserved." +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";

        return html
                .replace("{{USERNAME}}", username)
                .replace("{{FRONTEND_URL}}", frontendUrl);
    }
}