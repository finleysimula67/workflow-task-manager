-- Add last_login_at column for tracking user login times
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
