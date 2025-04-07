-- Insert mock users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'john.doe@example.com', NOW(), NOW(), NOW()),
    ('123e4567-e89b-12d3-a456-426614174001', 'jane.smith@example.com', NOW(), NOW(), NOW());

-- Insert mock policies
INSERT INTO policies (
    id, policy_number, insured_name, coverage_amount, coverage_type, 
    start_date, end_date, status, created_at, updated_at, user_id
) VALUES 
    ('123e4567-e89b-12d3-a456-426614174002', 'POL123456', 'John Doe', 100000, 'auto',
     '2025-01-01', '2026-01-01', 'active', NOW(), NOW(), '123e4567-e89b-12d3-a456-426614174000'),
    ('123e4567-e89b-12d3-a456-426614174003', 'POL789101', 'Jane Smith', 500000, 'home',
     '2025-01-01', '2026-01-01', 'active', NOW(), NOW(), '123e4567-e89b-12d3-a456-426614174001');

-- Insert mock claims
INSERT INTO claims (
    id, policy_id, claim_number, description, claim_amount, status, created_at, updated_at, user_id
) VALUES 
    ('123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174002', 'CLM123456',
     'Car accident damage', 5000, 'pending', NOW(), NOW(), '123e4567-e89b-12d3-a456-426614174000'),
    ('123e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174003', 'CLM789101',
     'Water damage in basement', 25000, 'approved', NOW(), NOW(), '123e4567-e89b-12d3-a456-426614174001');

-- Insert mock quotes
INSERT INTO quotes (
    id, quote_number, coverage_type, vehicle_value, deductible, monthly_premium, total_coverage, created_at, user_id
) VALUES 
    ('123e4567-e89b-12d3-a456-426614174006', 'Q-20250407001', 'auto', 25000, 500, 20.83, 25000, NOW(), '123e4567-e89b-12d3-a456-426614174000'),
    ('123e4567-e89b-12d3-a456-426614174007', 'Q-20250407002', 'home', 500000, 1000, 208.33, 500000, NOW(), '123e4567-e89b-12d3-a456-426614174001');

-- Insert mock policy documents
INSERT INTO policy_documents (
    id, policy_id, document_name, document_url, created_at, user_id
) VALUES 
    ('123e4567-e89b-12d3-a456-426614174008', '123e4567-e89b-12d3-a456-426614174002', 'Policy Agreement.pdf',
     'https://storage.example.com/policy-docs/POL123456.pdf', NOW(), '123e4567-e89b-12d3-a456-426614174000'),
    ('123e4567-e89b-12d3-a456-426614174009', '123e4567-e89b-12d3-a456-426614174003', 'Home Inventory.pdf',
     'https://storage.example.com/home-inventory/JANE123.pdf', NOW(), '123e4567-e89b-12d3-a456-426614174001');

-- Insert mock claim documents
INSERT INTO claim_documents (
    id, claim_id, document_name, document_url, created_at, user_id
) VALUES 
    ('123e4567-e89b-12d3-a456-426614174010', '123e4567-e89b-12d3-a456-426614174004', 'Accident Report.pdf',
     'https://storage.example.com/claim-docs/CLM123456.pdf', NOW(), '123e4567-e89b-12d3-a456-426614174000'),
    ('123e4567-e89b-12d3-a456-426614174011', '123e4567-e89b-12d3-a456-426614174005', 'Damage Assessment.pdf',
     'https://storage.example.com/claim-docs/CLM789101.pdf', NOW(), '123e4567-e89b-12d3-a456-426614174001');
