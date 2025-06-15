-- Insert sample institutions
INSERT INTO institutions (id, name, type, address, region, city, phone, email, principal_name, registration_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Université de Yaoundé I', 'university', 'BP 812 Yaoundé', 'Centre', 'Yaoundé', '+237222234567', 'contact@uy1.cm', 'Prof. Jean Tabi', 'UNI-YAO-001'),
('550e8400-e29b-41d4-a716-446655440002', 'Lycée Général Leclerc', 'secondary_school', 'Avenue Kennedy, Yaoundé', 'Centre', 'Yaoundé', '+237222345678', 'leclerc@education.cm', 'M. Pierre Kouam', 'LYC-YAO-001'),
('550e8400-e29b-41d4-a716-446655440003', 'Lycée de Douala', 'secondary_school', 'Boulevard de la Liberté, Douala', 'Littoral', 'Douala', '+237233456789', 'douala@education.cm', 'Mme Marie Ngono', 'LYC-DLA-001'),
('550e8400-e29b-41d4-a716-446655440004', 'Collège Vogt', 'secondary_school', 'Rue Joss, Yaoundé', 'Centre', 'Yaoundé', '+237222567890', 'vogt@education.cm', 'M. Paul Biya', 'COL-YAO-001');

-- Insert sample exam centers
INSERT INTO exam_centers (id, name, address, region, city, capacity, contact_person, phone) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Centre d''Examen Yaoundé Centre', 'Lycée Général Leclerc, Yaoundé', 'Centre', 'Yaoundé', 500, 'M. Jean Mbarga', '+237222111111'),
('660e8400-e29b-41d4-a716-446655440002', 'Centre d''Examen Douala', 'Lycée de Douala', 'Littoral', 'Douala', 400, 'Mme Sylvie Ngo', '+237233222222'),
('660e8400-e29b-41d4-a716-446655440003', 'Centre d''Examen Bafoussam', 'Lycée Technique de Bafoussam', 'Ouest', 'Bafoussam', 300, 'M. Paul Kamga', '+237233333333'),
('660e8400-e29b-41d4-a716-446655440004', 'Centre d''Examen Bamenda', 'Government High School Bamenda', 'Nord-Ouest', 'Bamenda', 350, 'Mr. John Fru', '+237233444444');

-- Insert sample users (passwords are hashed version of 'password123')
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, institution_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'ministry@education.cm', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ministry', 'Jean', 'Mbarga', '+237677111111', NULL),
('770e8400-e29b-41d4-a716-446655440002', 'admin@leclerc.cm', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'institution_admin', 'Pierre', 'Kouam', '+237677222222', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', 'student1@example.cm', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Marie', 'Ngono', '+237677333333', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440004', 'teacher1@leclerc.cm', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'Paul', 'Biya', '+237677444444', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440005', 'examboard@gce.cm', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'exam_body', 'John', 'Fru', '+237677555555', NULL);

-- Insert sample exams
INSERT INTO exams (id, name, type, level, subjects, start_date, end_date, registration_deadline, status, exam_fee, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Baccalauréat A4 2024', 'BAC', 'secondary', '["Philosophie", "Français", "Histoire", "Géographie", "Anglais", "Mathématiques"]', '2024-06-15', '2024-06-22', '2024-04-30', 'upcoming', 25000, '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'BEPC 2024', 'BEPC', 'secondary', '["Mathématiques", "Français", "Anglais", "Sciences", "Histoire-Géographie"]', '2024-06-08', '2024-06-12', '2024-04-15', 'upcoming', 15000, '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'GCE Advanced Level 2024', 'GCE_AL', 'secondary', '["Mathematics", "Physics", "Chemistry", "Biology", "Economics"]', '2024-05-20', '2024-06-05', '2024-03-31', 'active', 30000, '770e8400-e29b-41d4-a716-446655440005');

-- Insert sample registrations
INSERT INTO registrations (id, student_id, exam_id, exam_center_id, registration_number, subjects, status, payment_status, payment_amount) VALUES
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'BAC2024001', '["Philosophie", "Français", "Histoire", "Géographie", "Anglais"]', 'approved', 'paid', 25000),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'BEPC2024001', '["Mathématiques", "Français", "Anglais", "Sciences"]', 'pending', 'pending', 15000);

-- Insert sample results
INSERT INTO results (id, student_id, exam_id, registration_id, subject_scores, total_score, percentage, grade, is_published) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', '{"Mathematics": 85, "Physics": 78, "Chemistry": 82, "Biology": 88}', 83.25, 83.25, 'B+', true);

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'Registration Approved', 'Your registration for Baccalauréat A4 2024 has been approved.', 'success'),
('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 'Exam Reminder', 'Your BEPC 2024 exam starts in 7 days. Please prepare accordingly.', 'info');
