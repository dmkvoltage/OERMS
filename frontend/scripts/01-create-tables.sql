-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('ministry', 'ministry_admin', 'institution_admin', 'teacher', 'student', 'exam_body');
CREATE TYPE exam_status AS ENUM ('draft', 'upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'exam_update', 'registration_update', 'result_published');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    place_of_birth VARCHAR(100),
    nationality VARCHAR(50) DEFAULT 'Cameroonian',
    institution_id UUID,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institutions table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'university', 'secondary_school', 'primary_school', 'technical_school'
    address TEXT NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    principal_name VARCHAR(255),
    registration_number VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'BAC', 'BEPC', 'GCE_OL', 'GCE_AL', 'UNIVERSITY_ENTRANCE'
    level VARCHAR(50) NOT NULL, -- 'primary', 'secondary', 'university'
    subjects JSONB NOT NULL, -- Array of subjects
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE NOT NULL,
    status exam_status DEFAULT 'draft',
    passing_score INTEGER DEFAULT 10,
    total_marks INTEGER DEFAULT 20,
    exam_fee INTEGER NOT NULL, -- In XAF (CFA Francs)
    description TEXT,
    instructions TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam Centers table
CREATE TABLE exam_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    facilities JSONB, -- Array of available facilities
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations table
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    exam_id UUID NOT NULL REFERENCES exams(id),
    exam_center_id UUID REFERENCES exam_centers(id),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    subjects JSONB NOT NULL, -- Selected subjects for this registration
    status registration_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_amount INTEGER NOT NULL,
    payment_reference VARCHAR(100),
    documents JSONB, -- Array of uploaded document URLs
    special_needs TEXT,
    emergency_contact JSONB, -- Contact information
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, exam_id)
);

-- Results table
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    exam_id UUID NOT NULL REFERENCES exams(id),
    registration_id UUID NOT NULL REFERENCES registrations(id),
    subject_scores JSONB NOT NULL, -- Object with subject: score pairs
    total_score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    rank INTEGER,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    certificate_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, exam_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    metadata JSONB, -- Additional data for the notification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Add foreign key constraint for institution_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_institution 
    FOREIGN KEY (institution_id) REFERENCES institutions(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_type ON exams(type);
CREATE INDEX idx_registrations_student ON registrations(student_id);
CREATE INDEX idx_registrations_exam ON registrations(exam_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_results_exam ON results(exam_id);
CREATE INDEX idx_results_published ON results(is_published);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
