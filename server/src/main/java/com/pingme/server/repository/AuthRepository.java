package com.pingme.server.repository;

import com.pingme.server.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<UserEntity, String> {

    public Optional<UserEntity> findByEmail(String email);

}
