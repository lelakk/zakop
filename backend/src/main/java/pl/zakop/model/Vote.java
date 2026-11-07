package pl.zakop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "votes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_vote_post_user", columnNames = {"post_id", "user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private VoteType type;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Vote(Post post, User user, VoteType type) {
        this.post = post;
        this.user = user;
        this.type = type;
        this.createdAt = Instant.now();
    }
}
