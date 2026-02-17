CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL CHECK (length(content) > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_messages_chat
        FOREIGN KEY (chat_id)
        REFERENCES chats(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_messages_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
