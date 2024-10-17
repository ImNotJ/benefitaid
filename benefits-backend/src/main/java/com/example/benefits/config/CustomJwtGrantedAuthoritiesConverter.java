package com.example.benefits.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;

/**
 * Custom converter to extract granted authorities from a JWT.
 * This class extends the default JwtGrantedAuthoritiesConverter to add custom logic
 * for extracting additional authorities from the JWT if needed.
 */
public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    /**
     * Converts the given JWT into a collection of GrantedAuthority.
     * 
     * @param jwt the JWT to convert
     * @return a collection of GrantedAuthority extracted from the JWT
     */
    @Override
    public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> authorities = defaultGrantedAuthoritiesConverter.convert(jwt);

        // Add custom logic to extract additional authorities from the JWT if needed
        // For example, you can extract roles or permissions from custom claims

        return authorities;
    }
}