# PawCare Hub Backend

A Spring Boot REST API for the PawCare Hub veterinary practice management system.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ running on localhost:5432
- Database: `pawcare_hub`
- Username: `postgres`
- Password: `admin`

## Database Setup

1. Install PostgreSQL and start the service
2. Create the database:
```sql
CREATE DATABASE pawcare_hub;
```

## Running the Application

### Option 1: Using the batch file (Windows)
```bash
./run.bat
```

### Option 2: Using Maven directly
```bash
mvn spring-boot:run
```

### Option 3: Using IDE
Import the project and run `PawCareHubApplication.java`

## API Endpoints

The application runs on `http://localhost:8082`

### Core Entities

#### Owners
- `GET /api/owners` - Get all owners
- `GET /api/owners/{id}` - Get owner by ID
- `POST /api/owners` - Create new owner
- `PUT /api/owners/{id}` - Update owner
- `DELETE /api/owners/{id}` - Delete owner
- `GET /api/owners/search?name={name}` - Search owners by name

#### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet
- `GET /api/pets/owner/{ownerId}` - Get pets by owner
- `GET /api/pets/search?name={name}` - Search pets by name

#### Veterinarians
- `GET /api/veterinarians` - Get all veterinarians
- `GET /api/veterinarians/{id}` - Get veterinarian by ID
- `POST /api/veterinarians` - Create new veterinarian
- `PUT /api/veterinarians/{id}` - Update veterinarian
- `DELETE /api/veterinarians/{id}` - Delete veterinarian
- `GET /api/veterinarians/search?name={name}` - Search veterinarians
- `GET /api/veterinarians/specialization/{specialization}` - Get by specialization

#### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment
- `GET /api/appointments/pet/{petId}` - Get appointments by pet
- `GET /api/appointments/today` - Get today's appointments

#### Medical Records
- `GET /api/medical-records` - Get all medical records
- `GET /api/medical-records/{id}` - Get medical record by ID
- `POST /api/medical-records` - Create new medical record
- `PUT /api/medical-records/{id}` - Update medical record
- `DELETE /api/medical-records/{id}` - Delete medical record
- `GET /api/medical-records/pet/{petId}` - Get records by pet
- `GET /api/medical-records/type/{type}` - Get records by type

#### Invoices & Billing
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `GET /api/invoices/status/{status}` - Get invoices by status
- `GET /api/invoices/owner/{ownerId}` - Get invoices by owner
- `GET /api/invoices/overdue` - Get overdue invoices

#### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/{id}` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Delete inventory item
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/expiring?daysAhead={days}` - Get expiring items
- `POST /api/inventory/{id}/adjust-stock?quantity={qty}&reason={reason}` - Adjust stock

#### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/{id}` - Get prescription by ID
- `POST /api/prescriptions` - Create new prescription
- `PUT /api/prescriptions/{id}` - Update prescription
- `DELETE /api/prescriptions/{id}` - Delete prescription
- `GET /api/prescriptions/pet/{petId}` - Get prescriptions by pet
- `GET /api/prescriptions/status/{status}` - Get prescriptions by status

#### Vaccinations
- `GET /api/vaccinations` - Get all vaccinations
- `GET /api/vaccinations/{id}` - Get vaccination by ID
- `POST /api/vaccinations` - Create new vaccination
- `PUT /api/vaccinations/{id}` - Update vaccination
- `DELETE /api/vaccinations/{id}` - Delete vaccination
- `GET /api/vaccinations/pet/{petId}` - Get vaccinations by pet
- `GET /api/vaccinations/due` - Get due vaccinations
- `GET /api/vaccinations/upcoming?daysAhead={days}` - Get upcoming vaccinations

#### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `GET /api/lab-tests/{id}` - Get lab test by ID
- `POST /api/lab-tests` - Create new lab test
- `PUT /api/lab-tests/{id}` - Update lab test
- `DELETE /api/lab-tests/{id}` - Delete lab test
- `GET /api/lab-tests/pet/{petId}` - Get lab tests by pet
- `GET /api/lab-tests/status/{status}` - Get lab tests by status

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity

## API Documentation

Swagger UI is available at: `http://localhost:8082/swagger-ui/index.html`

## Sample Data

The application automatically creates sample data on startup including:
- 2 sample owners
- 2 sample pets
- 2 sample veterinarians
- 2 sample appointments
- 2 sample medical records
- 2 sample inventory items
- 1 sample invoice

## Configuration

Key configuration in `application.properties`:
- Server port: 8082
- Database URL: `jdbc:postgresql://localhost:5432/pawcare_hub`
- JPA DDL mode: `update` (creates/updates tables automatically)
- SQL logging: enabled for development

## CORS Configuration

The API allows cross-origin requests from `http://localhost:3000` for frontend integration.

## Security

Basic security configuration is in place. Authentication and authorization can be enhanced based on requirements.

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 404: Not Found
- 400: Bad Request
- 500: Internal Server Error