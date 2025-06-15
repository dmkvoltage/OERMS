-- Create document templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('certificate', 'admission_card', 'transcript')),
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  
  -- Layout configuration
  layout JSONB DEFAULT '{
    "pageSize": "a4",
    "orientation": "portrait",
    "margins": {
      "top": 20,
      "bottom": 20,
      "left": 20,
      "right": 20
    }
  }'::jsonb,
  
  -- Header configuration
  header JSONB DEFAULT '{
    "showLogo": true,
    "logoPosition": "left",
    "institutionName": true,
    "ministryHeader": true,
    "customText": "",
    "height": 80
  }'::jsonb,
  
  -- Footer configuration
  footer JSONB DEFAULT '{
    "showSignatures": true,
    "showDocumentNumber": true,
    "showGeneratedDate": true,
    "customText": "",
    "height": 60
  }'::jsonb,
  
  -- Styling configuration
  styling JSONB DEFAULT '{
    "primaryColor": "#003366",
    "secondaryColor": "#0066cc",
    "accentColor": "#ff6600",
    "fontFamily": "helvetica",
    "fontSize": {
      "title": 18,
      "subtitle": 14,
      "body": 12,
      "small": 10
    }
  }'::jsonb,
  
  -- Content configuration
  content JSONB DEFAULT '{
    "watermark": {
      "enabled": true,
      "text": "OFFICIAL DOCUMENT",
      "opacity": 0.1
    },
    "seal": {
      "enabled": true,
      "position": "bottom-right"
    },
    "qrCode": {
      "enabled": false,
      "position": "bottom-left"
    }
  }'::jsonb,
  
  -- Institution branding
  branding JSONB DEFAULT '{
    "logo": null,
    "motto": "",
    "address": "",
    "website": "",
    "phone": "",
    "email": ""
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  UNIQUE(institution_id, template_type, name)
);

-- Create template assets table for storing logos and images
CREATE TABLE IF NOT EXISTS template_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('logo', 'seal', 'signature', 'background')),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_document_templates_institution ON document_templates(institution_id);
CREATE INDEX idx_document_templates_type ON document_templates(template_type);
CREATE INDEX idx_document_templates_default ON document_templates(is_default);
CREATE INDEX idx_template_assets_template ON template_assets(template_id);

-- Insert default templates for each institution
INSERT INTO document_templates (institution_id, template_type, name, is_default, created_by)
SELECT 
  i.id,
  template_type.type,
  'Default ' || INITCAP(template_type.type) || ' Template',
  true,
  (SELECT id FROM users WHERE role = 'ministry_admin' LIMIT 1)
FROM institutions i
CROSS JOIN (
  VALUES ('certificate'), ('admission_card'), ('transcript')
) AS template_type(type);

-- Enable RLS
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view templates for their institution" ON document_templates
  FOR SELECT USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ministry_admin', 'admin')
    )
  );

CREATE POLICY "Institution admins can manage their templates" ON document_templates
  FOR ALL USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid() AND role = 'institution_admin'
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ministry_admin', 'admin')
    )
  );

CREATE POLICY "Users can view template assets" ON template_assets
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM document_templates WHERE 
        institution_id IN (
          SELECT institution_id FROM users WHERE id = auth.uid()
        ) OR
        EXISTS (
          SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ministry_admin', 'admin')
        )
    )
  );

CREATE POLICY "Users can manage template assets" ON template_assets
  FOR ALL USING (
    template_id IN (
      SELECT id FROM document_templates WHERE 
        institution_id IN (
          SELECT institution_id FROM users WHERE id = auth.uid() AND role = 'institution_admin'
        ) OR
        EXISTS (
          SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ministry_admin', 'admin')
        )
    )
  );
