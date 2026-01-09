-- Add payment_records table for tracking invoice payments
CREATE TABLE IF NOT EXISTS payment_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH', 'CARD', 'CHECK', 'INSURANCE', 'ONLINE') NOT NULL,
    transaction_id VARCHAR(255),
    paid_date DATETIME NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_payment_invoice (invoice_id),
    INDEX idx_payment_date (paid_date),
    INDEX idx_payment_method (payment_method)
);

-- Update invoices table to ensure proper relationships
ALTER TABLE invoices 
ADD INDEX IF NOT EXISTS idx_invoice_status (status),
ADD INDEX IF NOT EXISTS idx_invoice_due_date (due_date),
ADD INDEX IF NOT EXISTS idx_invoice_issue_date (issue_date);