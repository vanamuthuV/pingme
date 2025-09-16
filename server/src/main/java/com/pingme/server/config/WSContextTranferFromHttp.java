package com.pingme.server.config;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.exceptions.NoDataRecievedException;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;
import org.apache.naming.factory.BeanFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.security.Principal;

public class WSContextTranferFromHttp extends ServerEndpointConfig.Configurator {

    @Override
    public void modifyHandshake(
            ServerEndpointConfig sec,
            HandshakeRequest request,
            HandshakeResponse response
    ) {

        Principal principal = request.getUserPrincipal();

        if(principal instanceof UsernamePasswordAuthenticationToken) {

            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
            UserResponseDTO user = (UserResponseDTO) auth.getPrincipal();

            if(user != null)
                sec.getUserProperties().put("user", user);
            else
                throw new NoDataRecievedException("user not found : " + this.getClass());

        }

    }

}
