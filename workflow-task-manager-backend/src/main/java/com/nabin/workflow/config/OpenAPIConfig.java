package com.nabin.workflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("WorkFlow API")
                        .description("Task Management Application API - @Nabin Oli\n\n" +
                                "## Features\n" +
                                "- User authentication (JWT + OAuth2 Google)\n" +
                                "- Task CRUD with filtering, search, and statistics\n" +
                                "- Categories, comments, file attachments\n" +
                                "- Email verification & password reset\n" +
                                "- Activity logging & audit trail\n" +
                                "- In-app notifications\n" +
                                "- Admin dashboard & user management\n" +
                                "- Full-text search (PostgreSQL tsvector)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("WorkFlow Team")
                                .email("support@workflow.example.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT access token (obtained from POST /api/auth/login)")));
    }
}
