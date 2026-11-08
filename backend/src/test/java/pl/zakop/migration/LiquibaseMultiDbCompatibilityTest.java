package pl.zakop.migration;

import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.OfflineConnection;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.io.StringWriter;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class LiquibaseMultiDbCompatibilityTest {

    @TempDir
    Path tempDir;

    @ParameterizedTest
    @ValueSource(strings = {"postgresql", "h2", "mysql", "mariadb", "oracle", "mssql"})
    void generatesValidDdlForDatabaseEngine(String dbms) throws Exception {
        Path changeLogCsv = tempDir.resolve("changelog-" + dbms + ".csv");
        String offlineUrl = "offline:" + dbms + "?changeLogFile=" + changeLogCsv.toUri().getPath();

        try (ClassLoaderResourceAccessor resourceAccessor = new ClassLoaderResourceAccessor();
             OfflineConnection connection = new OfflineConnection(offlineUrl, resourceAccessor)) {

            Database database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(connection);
            Liquibase liquibase = new Liquibase(
                    "db/changelog/db.changelog-master.xml",
                    resourceAccessor,
                    database
            );

            StringWriter sqlOutput = new StringWriter();
            liquibase.update(new Contexts(), sqlOutput);

            String ddl = sqlOutput.toString().toLowerCase();
            assertThat(ddl)
                    .contains("users")
                    .contains("posts")
                    .contains("comments")
                    .contains("votes")
                    .contains("uk_vote_post_user");
        }
    }
}
