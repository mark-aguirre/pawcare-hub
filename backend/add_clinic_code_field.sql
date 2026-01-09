-- Add clinic_code field to clinic_settings table
ALTER TABLE clinic_settings 
ADD COLUMN clinic_code VARCHAR(20) UNIQUE NOT NULL DEFAULT 'PC001';

-- Update existing record with the clinic code
UPDATE clinic_settings 
SET clinic_code = 'PC001' 
WHERE id = 1;