package com.example.benefits.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and() // Enable CORS
            .authorizeRequests(authorizeRequests ->
                authorizeRequests
                    .antMatchers("/api/admins/login").permitAll() // Allow unauthenticated access to login
                    .antMatchers("/api/admins/**").hasRole("ADMIN")
                    .antMatchers("/api/questions/**").hasAnyRole("ADMIN", "ROOT_ADMIN") // Allow access to questions for ADMIN and ROOT_ADMIN roles
                    .antMatchers("/api/benefits/**").hasAnyRole("ADMIN", "ROOT_ADMIN") // Allow access to benefits for ADMIN and ROOT_ADMIN roles
                    .antMatchers("/api/quizzes/**").hasAnyRole("ADMIN", "ROOT_ADMIN") // Allow access to quizzes for ADMIN and ROOT_ADMIN roles
                    .antMatchers("/api/**").authenticated()
                    .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf
                .ignoringAntMatchers("/api/admins/login", "/api/questions/**", "/api/benefits/**", "/api/quizzes/**") // Disable CSRF protection for login, questions, and benefits endpoints
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://fairbenefits.org")); // Allow both testing and production environments
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "remember-me"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}