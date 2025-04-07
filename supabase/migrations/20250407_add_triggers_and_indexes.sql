-- Create indexes for better performance
CREATE INDEX idx_policies_user_id ON policies(user_id);
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_quotes_user_id ON quotes(user_id);

-- Create trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for each table
CREATE TRIGGER update_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
    BEFORE UPDATE ON claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger function for policy status changes
CREATE OR REPLACE FUNCTION notify_policy_status_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('policy_status_change', 
        json_build_object(
            'policy_id', NEW.id,
            'status', NEW.status,
            'updated_at', NEW.updated_at
        )::text
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for policy status changes
CREATE TRIGGER notify_policy_status
    AFTER UPDATE OF status ON policies
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION notify_policy_status_change();

-- Create trigger function for claim status changes
CREATE OR REPLACE FUNCTION notify_claim_status_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('claim_status_change', 
        json_build_object(
            'claim_id', NEW.id,
            'status', NEW.status,
            'updated_at', NEW.updated_at
        )::text
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for claim status changes
CREATE TRIGGER notify_claim_status
    AFTER UPDATE OF status ON claims
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION notify_claim_status_change();
