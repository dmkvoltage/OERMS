-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Ministry can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('ministry', 'ministry_admin')
        )
    );

CREATE POLICY "Institution admins can view their institution users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() 
            AND u.role = 'institution_admin'
            AND u.institution_id = users.institution_id
        )
    );

-- RLS Policies for institutions table
CREATE POLICY "Anyone can view institutions" ON institutions
    FOR SELECT USING (true);

CREATE POLICY "Ministry can manage institutions" ON institutions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('ministry', 'ministry_admin')
        )
    );

-- RLS Policies for exams table
CREATE POLICY "Anyone can view published exams" ON exams
    FOR SELECT USING (status != 'draft');

CREATE POLICY "Ministry and exam bodies can manage exams" ON exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('ministry', 'ministry_admin', 'exam_body')
        )
    );

-- RLS Policies for registrations table
CREATE POLICY "Students can view their own registrations" ON registrations
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create their own registrations" ON registrations
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Institution admins can view their students' registrations" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.id = auth.uid() 
            AND u1.role = 'institution_admin'
            AND u2.id = registrations.student_id
            AND u1.institution_id = u2.institution_id
        )
    );

CREATE POLICY "Ministry and exam bodies can manage all registrations" ON registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('ministry', 'ministry_admin', 'exam_body')
        )
    );

-- RLS Policies for results table
CREATE POLICY "Students can view their published results" ON results
    FOR SELECT USING (student_id = auth.uid() AND is_published = true);

CREATE POLICY "Ministry and exam bodies can manage all results" ON results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('ministry', 'ministry_admin', 'exam_body')
        )
    );

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);
