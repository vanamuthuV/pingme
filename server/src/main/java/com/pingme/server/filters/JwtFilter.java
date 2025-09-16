package com.pingme.server.filters;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.exceptions.JwtUnauthorizedException;
import com.pingme.server.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            if(request.getRequestURI().startsWith("/oauth/callback")){
                filterChain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");

            if(authHeader != null)
                if(authHeader.startsWith("Bearer")){
                    String token = authHeader.substring(7);

                    UserResponseDTO user = jwtUtils.validateToken(token);

                    UsernamePasswordAuthenticationToken auth = new
                            UsernamePasswordAuthenticationToken(user, null, List.of());

                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else
                    throw new JwtUnauthorizedException("token is not structured");
            else
                throw new JwtUnauthorizedException("cannot find token");
            filterChain.doFilter(request, response);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }



    }
}
