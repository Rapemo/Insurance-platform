-- Create policies table
CREATE TABLE policies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    insured_name VARCHAR(255) NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    coverage_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Create claims table
CREATE TABLE claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    claim_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Create quotes table
CREATE TABLE quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    coverage_type VARCHAR(50) NOT NULL,
    vehicle_value DECIMAL(15,2),
    deductible DECIMAL(15,2),
    monthly_premium DECIMAL(15,2),
    total_coverage DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Create policy documents table
CREATE TABLE policy_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Create claim documents table
CREATE TABLE claim_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own policies" ON policies
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create policies" ON policies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for claims
CREATE POLICY "Users can view their own claims" ON claims
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create claims" ON claims
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for quotes
CREATE POLICY "Users can view their own quotes" ON quotes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create quotes" ON quotes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for documents
CREATE POLICY "Users can view their own policy documents" ON policy_documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create policy documents" ON policy_documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own claim documents" ON claim_documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create claim documents" ON claim_documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
