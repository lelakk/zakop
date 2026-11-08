package pl.zakop.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import pl.zakop.model.Comment;
import pl.zakop.model.Post;
import pl.zakop.model.User;
import pl.zakop.model.Vote;
import pl.zakop.model.VoteType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class PersistenceMappingTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Test
    void persistsPostWithCommentAndVote() {
        User author = userRepository.save(new User("author", "author@zakop.pl", "hash"));
        Post post = postRepository.save(new Post("Title", "Content", "https://example.com", author));
        commentRepository.save(new Comment(post, author, "First comment"));
        voteRepository.save(new Vote(post, author, VoteType.WYKOP));
        entityManager.flush();
        entityManager.clear();

        Post reloaded = postRepository.findById(post.getId()).orElseThrow();
        assertThat(reloaded.getScore()).isZero();
        assertThat(reloaded.getCreatedAt()).isNotNull();
        assertThat(commentRepository.findAllByPostIdOrderByCreatedAtAsc(post.getId()))
                .extracting(Comment::getContent)
                .containsExactly("First comment");
        assertThat(voteRepository.findByPostIdAndUserId(post.getId(), author.getId()))
                .get()
                .extracting(Vote::getType)
                .isEqualTo(VoteType.WYKOP);
    }

    @Test
    void rejectsSecondVoteOfSameUserOnSamePost() {
        User voter = userRepository.save(new User("voter", "voter@zakop.pl", "hash"));
        Post post = postRepository.save(new Post("Title", null, null, voter));
        voteRepository.saveAndFlush(new Vote(post, voter, VoteType.WYKOP));

        assertThatThrownBy(() -> voteRepository.saveAndFlush(new Vote(post, voter, VoteType.ZAKOP)))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void rejectsDuplicateUserEmail() {
        userRepository.saveAndFlush(new User("first", "same@zakop.pl", "hash"));

        assertThatThrownBy(() -> userRepository.saveAndFlush(new User("second", "same@zakop.pl", "hash")))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
