package com.pingme.server.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.exceptions.JwtUnauthorizedException;
import com.pingme.server.utils.Impl.JwtUtilsImpl;
import com.pingme.server.utils.Impl.ResponderImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
    private JwtUtilsImpl jwtUtils;

    @Autowired
    private ResponderImpl responder;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

            if(request.getRequestURI().startsWith("/oauth/callback")){
                filterChain.doFilter(request, response);
                return;
            }

            String token = null;

            if(request.getCookies() != null)
                for(Cookie i : request.getCookies()) {
                    if("token".equals(i.getName())) {
                        token = i.getValue();
                        break;
                    }
                }

//            String authHeader = request.getHeader("Authorization");

            if (token == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(objectMapper.writeValueAsString(responder.createResponse(false, "Missing or invalid Authorization header", null)));
                return;
            }
//
//            String token = authHeader.substring(7);

            try{
                UserResponseDTO user = jwtUtils.validateToken(token);

                UsernamePasswordAuthenticationToken auth = new
                        UsernamePasswordAuthenticationToken(user, null, List.of());

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtUnauthorizedException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(objectMapper.writeValueAsString(responder.createResponse(false, "Invalid token: " + e.getMessage(), null)));
                response.sendRedirect("http://localhost:5173");
            }


            filterChain.doFilter(request, response);

    }
}
