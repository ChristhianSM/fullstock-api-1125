-- migrate:up
CREATE TABLE session(
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IDX_session_expire ON session (expire);

-- migrate:down
DROP TABLE session
