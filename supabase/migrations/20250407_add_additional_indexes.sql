-- Indexes for common queries
-- Policy search and filtering
CREATE INDEX idx_policies_coverage_type ON policies(coverage_type);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_status_coverage_type ON policies(status, coverage_type);
CREATE INDEX idx_policies_start_date ON policies(start_date);
CREATE INDEX idx_policies_end_date ON policies(end_date);

-- Claims search and filtering
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_policy_id_status ON claims(policy_id, status);
CREATE INDEX idx_claims_created_at ON claims(created_at);
CREATE INDEX idx_claims_claim_amount ON claims(claim_amount);

-- Quotes search and filtering
CREATE INDEX idx_quotes_coverage_type ON quotes(coverage_type);
CREATE INDEX idx_quotes_monthly_premium ON quotes(monthly_premium);
CREATE INDEX idx_quotes_total_coverage ON quotes(total_coverage);

-- Composite indexes for common joins
CREATE INDEX idx_claims_policy_id_user_id ON claims(policy_id, user_id);
CREATE INDEX idx_policy_documents_policy_id ON policy_documents(policy_id);
CREATE INDEX idx_claim_documents_claim_id ON claim_documents(claim_id);

-- Full-text search indexes
CREATE INDEX idx_policies_fts ON policies USING GIN(to_tsvector('english', insured_name));
CREATE INDEX idx_claims_fts ON claims USING GIN(to_tsvector('english', description));

-- Partial indexes for specific use cases
CREATE INDEX idx_active_policies ON policies(id) WHERE status = 'active';
CREATE INDEX idx_pending_claims ON claims(id) WHERE status = 'pending';
CREATE INDEX idx_approved_claims ON claims(id) WHERE status = 'approved';
