package com.pingme.server.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;

@Entity
@Table(name = "messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageEntity {

    @Id
    @GeneratedValue(generator = "cuid")
    @GenericGenerator(
            name = "cuid",
            strategy = "com.pingme.server.utils.CuidGeneratorUtil"
    )
    private String id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false, updatable = false)
    private UserEntity sender;

    @ManyToOne
    @JoinColumn(name = "reciever_id", nullable = false, updatable = false)
    private UserEntity receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private Boolean isEdited = false;

    @Column(nullable = false)
    private boolean isDelivered = true;

    @Column(nullable = false)
    private boolean isSeen =  false;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        isEdited = false;
        isDelivered = true;
        isSeen = false;
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

}
