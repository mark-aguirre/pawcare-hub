-- Add clinic_code to inventory_items table
ALTER TABLE inventory_items ADD COLUMN clinic_code VARCHAR(255);

-- Add clinic_code to invoices table  
ALTER TABLE invoices ADD COLUMN clinic_code VARCHAR(255);

-- Add clinic_code to lab_tests table
ALTER TABLE lab_tests ADD COLUMN clinic_code VARCHAR(255);

-- Update existing records with default clinic code
UPDATE inventory_items SET clinic_code = 'PC001' WHERE clinic_code IS NULL;
UPDATE invoices SET clinic_code = 'PC001' WHERE clinic_code IS NULL;
UPDATE lab_tests SET clinic_code = 'PC001' WHERE clinic_code IS NULL;

-- Add indexes for better performance
CREATE INDEX idx_inventory_items_clinic_code ON inventory_items(clinic_code);
CREATE INDEX idx_invoices_clinic_code ON invoices(clinic_code);
CREATE INDEX idx_lab_tests_clinic_code ON lab_tests(clinic_code);