package com.pingme.server.utils.Impl;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.exceptions.JwtUnauthorizedException;
import com.pingme.server.mappers.Impl.UserToObject;
import com.pingme.server.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtilsImpl implements JwtUtils {

    @Value("${jwt.secret}")
    private String secret;
    private Key secretKey;
    private final int Expiration = 1000 * 60 * 60 * 10;

    @Autowired
    private UserToObject userToObject;

    @Override
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generateToken(UserResponseDTO user) {
        return Jwts.
                builder().
                setSubject(user.getUsername()).
                setClaims(userToObject.mapFrom(user)).
                setIssuedAt(new Date(System.currentTimeMillis())).
                setExpiration(new Date(System.currentTimeMillis() + Expiration)).
                signWith(SignatureAlgorithm.HS256, secretKey).
                compact();
    }

    @Override
    public Claims extractUser (String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        return claims;
    }

    @Override
    public UserResponseDTO validateToken(String token) {

        try {

            Claims claims = extractUser(token);
            if(claims.isEmpty())
                return null;

            Date expiration = claims.getExpiration();
            if(expiration.before(new Date()))
                return null;

            return userToObject.mapTo(claims);

        } catch (Exception e) {
            System.out.println(e.toString() + this.getClass());
            throw new JwtUnauthorizedException("you are unauthorized to access this");
        }

    }

}
