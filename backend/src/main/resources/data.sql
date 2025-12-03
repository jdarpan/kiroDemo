-- Insert initial users with BCrypt hashed passwords
-- Admin user: username=admin, password=admin123
-- Operator user: username=operator, password=operator123

-- Note: These are BCrypt hashed passwords with strength 10
-- admin123 -> $2a$10$8K1p/a0dL3.HNPWfUvjqMeP50Z0qKqKqKqKqKqKqKqKqKqKqKqKqK (placeholder - will be generated)
-- operator123 -> $2a$10$9L2q/b1eM4.IOQXgVwkrNfQ61A1rLrLrLrLrLrLrLrLrLrLrLrLrL (placeholder - will be generated)

INSERT INTO users (username, password, role, active, created_at, updated_at) VALUES
('admin', '$2a$10$98jL8sHV.bmVzYmuaY/CN.Qx3CPuQhSSuYsh7zkvrKiHI4epHvCrK', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('operator', '$2a$10$zbrXe4tuZCrJcPfruWPHHesfx/kH0Guq7i3CG2IS2Om14p.ZSWvP6', 'OPERATOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Note: The passwords are:
-- admin: admin123
-- operator: operator123

-- Insert sample dormant accounts for testing
INSERT INTO dormant_accounts (account_number, bank_name, balance, customer_name, customer_email, reclaim_status, reclaim_date, clawback_date, comments, created_at, updated_at) VALUES
('ACC001234567', 'First National Bank', 15000.00, 'John Smith', 'john.smith@email.com', 'PENDING', NULL, NULL, 'Initial assessment pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC002345678', 'First National Bank', 8500.50, 'Sarah Johnson', 'sarah.j@email.com', 'IN_PROGRESS', '2024-01-15', NULL, 'Customer contacted, awaiting response', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC003456789', 'City Trust Bank', 25000.00, 'Michael Brown', 'mbrown@email.com', 'COMPLETED', '2024-02-01', '2024-03-15', 'Successfully reclaimed and transferred', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC004567890', 'City Trust Bank', 3200.75, 'Emily Davis', 'emily.davis@email.com', 'PENDING', NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC005678901', 'Metro Bank', 12000.00, 'Robert Wilson', 'rwilson@email.com', 'IN_PROGRESS', '2024-01-20', NULL, 'Documentation being verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC006789012', 'Metro Bank', 45000.00, 'Jennifer Martinez', 'jmartinez@email.com', 'FAILED', '2024-01-10', NULL, 'Customer disputed claim', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC007890123', 'Coastal Bank', 7800.25, 'David Anderson', 'danderson@email.com', 'PENDING', NULL, NULL, 'Account flagged for review', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC008901234', 'Coastal Bank', 19500.00, 'Lisa Taylor', 'ltaylor@email.com', 'COMPLETED', '2024-02-10', '2024-03-20', 'Funds transferred to state treasury', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC009012345', 'First National Bank', 5600.00, 'James Thomas', 'jthomas@email.com', 'IN_PROGRESS', '2024-02-15', NULL, 'Legal review in progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC010123456', 'City Trust Bank', 31000.00, 'Patricia White', 'pwhite@email.com', 'PENDING', NULL, NULL, 'High value account - priority review', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC011234567', 'Metro Bank', 2100.50, 'Christopher Harris', 'charris@email.com', 'COMPLETED', '2024-01-25', '2024-03-01', 'Reclaim completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC012345678', 'Coastal Bank', 16800.00, 'Mary Clark', 'mclark@email.com', 'IN_PROGRESS', '2024-02-20', NULL, 'Awaiting final approval', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC013456789', 'First National Bank', 9200.00, 'Daniel Lewis', 'dlewis@email.com', 'PENDING', NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC014567890', 'Metro Bank', 22000.00, 'Barbara Lee', 'blee@email.com', 'FAILED', '2024-01-30', NULL, 'Insufficient documentation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ACC015678901', 'City Trust Bank', 11500.00, 'Joseph Walker', 'jwalker@email.com', 'COMPLETED', '2024-02-05', '2024-03-10', 'Successfully processed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
