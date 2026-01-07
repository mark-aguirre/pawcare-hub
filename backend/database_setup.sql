-- PawCare Hub Database Setup Script
-- Run this script in PostgreSQL to create the database

-- Create the database
CREATE DATABASE pawcare_hub;

-- Connect to the database
\c pawcare_hub;

-- Create a user (optional, if you want a dedicated user)
-- CREATE USER pawcare_user WITH PASSWORD 'pawcare_password';
-- GRANT ALL PRIVILEGES ON DATABASE pawcare_hub TO pawcare_user;

-- The Spring Boot application will automatically create the tables
-- when it starts up due to the JPA configuration

-- You can verify the tables are created by running:
-- \dt

-- Sample queries to check data after application startup:
-- SELECT * FROM owners;
-- SELECT * FROM pets;
-- SELECT * FROM veterinarians;
-- SELECT * FROM appointments;
-- SELECT * FROM medical_records;
-- SELECT * FROM inventory_items;
-- SELECT * FROM invoices;