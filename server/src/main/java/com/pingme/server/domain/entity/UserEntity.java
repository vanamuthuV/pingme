package com.pingme.server.domain.entity;

import com.pingme.server.types.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(generator = "cuid")
    @GenericGenerator(
            name="cuid",
            strategy = "com.pingme.server.utils.Impl.CuidGeneratorUtilImpl"
    )
    @Column(unique = true, nullable = false, updatable = false, columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    private String firstname;

    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    private String profile_picture;

    @Column(columnDefinition = "TEXT")
    private String access_token;

    @Column(columnDefinition = "TEXT")
    private String refresh_token;

    private Instant last_logged_in;

    private Instant created_at;

    private Instant updated_at;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String about;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MessageEntity> sendMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MessageEntity> recievedMessages = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        created_at = Instant.now();
        updated_at = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updated_at = Instant.now();
    }

}
