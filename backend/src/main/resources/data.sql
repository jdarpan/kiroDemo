-- Insert initial users with BCrypt hashed passwords
-- Admin user: username=admin, password=admin123
-- Operator user: username=operator, password=operator123

-- Note: These are BCrypt hashed passwords with strength 10
-- admin123 -> $2a$10$8K1p/a0dL3.HNPWfUvjqMeP50Z0qKqKqKqKqKqKqKqKqKqKqKqKqK (placeholder - will be generated)
-- operator123 -> $2a$10$9L2q/b1eM4.IOQXgVwkrNfQ61A1rLrLrLrLrLrLrLrLrLrLrLrLrL (placeholder - will be generated)

INSERT INTO users (username, password, role, active, created_at, updated_at) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('operator', '$2a$10$VEjxo0jq2YT4EeX3caCO4uuVh3nhx9c/tu/KSMx/jYEXJGfi4tsMC', 'OPERATOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Note: The passwords are:
-- admin: admin123
-- operator: operator123
