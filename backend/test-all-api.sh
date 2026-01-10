#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8082/api"
PASS_COUNT=0
FAIL_COUNT=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local name=$5
    
    if [ "$method" = "GET" ]; then
        if curl -s $headers "$url" > /dev/null 2>&1; then
            printf "  %-30s ${GREEN}✓ PASS${NC}\n" "$name"
            PASS_COUNT=$((PASS_COUNT + 1))
        else
            printf "  %-30s ${RED}✗ FAIL${NC}\n" "$name"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    else
        if curl -s -X $method $headers -H "Content-Type: application/json" -d "$data" "$url" > /dev/null 2>&1; then
            printf "  %-30s ${GREEN}✓ PASS${NC}\n" "$name"
            PASS_COUNT=$((PASS_COUNT + 1))
        else
            printf "  %-30s ${RED}✗ FAIL${NC}\n" "$name"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    fi
}

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     PawCare Hub Backend API Test     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo

# Step 1: Create unique user and clinic
TIMESTAMP=$(date +%s)
echo -e "${YELLOW}👤 Creating owner account...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Test Owner","email":"owner'$TIMESTAMP'@test.com","password":"password123","role":"ADMINISTRATOR"}' "$BASE_URL/auth/signup")
echo "Signup Response: $SIGNUP_RESPONSE"

USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$USER_ID" ]; then
    echo -e "${RED}❌ Failed to extract user ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Created user with ID: $USER_ID${NC}"

echo -e "${YELLOW}🏥 Creating clinic...${NC}"
CLINIC_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"userId":'$USER_ID',"name":"Test Clinic","address":"123 Test St","phone":"555-0123","email":"test@clinic.com"}' "$BASE_URL/clinics")
echo "Clinic Response: $CLINIC_RESPONSE"
CLINIC_CODE=$(echo "$CLINIC_RESPONSE" | grep -o '"clinicCode":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CLINIC_CODE" ]; then
    echo -e "${YELLOW}⚠️ Clinic creation failed, using test clinic code${NC}"
    CLINIC_CODE="TEST123"
fi

echo -e "${GREEN}✅ Using clinic code: ${PURPLE}$CLINIC_CODE${NC}"
echo

echo -e "${BLUE}📊 Testing GET Endpoints${NC}"
echo -e "${BLUE}─────────────────────────${NC}"

# Core entities
test_endpoint "GET" "$BASE_URL/owners" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Owners"
test_endpoint "GET" "$BASE_URL/pets" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Pets"
test_endpoint "GET" "$BASE_URL/veterinarians" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Veterinarians"

# Appointments
test_endpoint "GET" "$BASE_URL/appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Appointments"
test_endpoint "GET" "$BASE_URL/appointments/today" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Today Appointments"
test_endpoint "GET" "$BASE_URL/appointments/upcoming" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Upcoming Appointments"

# Medical Records
test_endpoint "GET" "$BASE_URL/medical-records" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Medical Records"
test_endpoint "GET" "$BASE_URL/medical-records/stats" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Records Stats"

# Prescriptions & Vaccinations
test_endpoint "GET" "$BASE_URL/prescriptions" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Prescriptions"
test_endpoint "GET" "$BASE_URL/vaccinations" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Vaccinations"
test_endpoint "GET" "$BASE_URL/vaccinations/due" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Due Vaccinations"
test_endpoint "GET" "$BASE_URL/vaccinations/upcoming" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Upcoming Vaccinations"

# Lab Tests
test_endpoint "GET" "$BASE_URL/lab-tests" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Lab Tests"
test_endpoint "GET" "$BASE_URL/lab-tests/stats" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Lab Test Stats"

# Inventory
test_endpoint "GET" "$BASE_URL/inventory" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Inventory"
test_endpoint "GET" "$BASE_URL/inventory/low-stock" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Low Stock Items"

# Billing & Financial
test_endpoint "GET" "$BASE_URL/invoices" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Billing/Invoices"
test_endpoint "GET" "$BASE_URL/invoices/analytics" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Billing Analytics"
test_endpoint "GET" "$BASE_URL/payments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Payments"

# Reports
test_endpoint "GET" "$BASE_URL/reports" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Reports"
test_endpoint "GET" "$BASE_URL/reports?type=revenue" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Revenue Reports"
test_endpoint "GET" "$BASE_URL/reports?type=appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Appointment Reports"

# Dashboard
test_endpoint "GET" "$BASE_URL/dashboard/stats" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Dashboard Stats"
test_endpoint "GET" "$BASE_URL/dashboard/recent-activity" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Recent Activity"
test_endpoint "GET" "$BASE_URL/dashboard/recent-pets" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Recent Pets"
test_endpoint "GET" "$BASE_URL/dashboard/upcoming-appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Upcoming Appointments"
test_endpoint "GET" "$BASE_URL/dashboard/inventory-alerts" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Inventory Alerts"
test_endpoint "GET" "$BASE_URL/dashboard/revenue" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Revenue Data"
test_endpoint "GET" "$BASE_URL/dashboard/performance" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Performance Data"

# Activities
test_endpoint "GET" "$BASE_URL/activities/recent" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Recent Activities"
test_endpoint "GET" "$BASE_URL/activities/medical-records" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Medical Record Activities"

# Settings
test_endpoint "GET" "$BASE_URL/settings" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings"
test_endpoint "GET" "$BASE_URL/settings/users" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings Users"
test_endpoint "GET" "$BASE_URL/settings/permissions" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings Permissions"

# Clinics
test_endpoint "GET" "$BASE_URL/clinics" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Clinics"

# Portal endpoints
test_endpoint "GET" "$BASE_URL/portal/pets" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Portal Pets"
test_endpoint "GET" "$BASE_URL/portal/appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Portal Appointments"
test_endpoint "GET" "$BASE_URL/portal/records" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Portal Records"
test_endpoint "GET" "$BASE_URL/portal/billing" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Portal Billing"

echo
echo -e "${BLUE}📝 Testing POST Endpoints${NC}"
echo -e "${BLUE}──────────────────────────${NC}"

# Auth endpoints
test_endpoint "POST" "$BASE_URL/auth/login" '{"identifier":"owner@test.com","password":"password123"}' "" "Auth Login"
test_endpoint "POST" "$BASE_URL/auth/signup" '{"name":"New User","email":"newuser@test.com","password":"password123","clinicCode":"'$CLINIC_CODE'"}' "" "Auth Signup with Clinic"
test_endpoint "POST" "$BASE_URL/auth/forgot-password" '{"email":"owner@test.com"}' "" "Forgot Password"

# Core entity creation
test_endpoint "POST" "$BASE_URL/owners" '{"firstName":"Test","lastName":"Owner","email":"test@test.com","phone":"1234567890"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Owner"
test_endpoint "POST" "$BASE_URL/pets" '{"name":"TestPet","species":"Dog","breed":"Lab","age":3,"ownerId":1}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Pet"
test_endpoint "POST" "$BASE_URL/veterinarians" '{"firstName":"Dr.","lastName":"Test","email":"vet@test.com","phone":"1234567890","specialization":"General"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Vet"

# Appointments
test_endpoint "POST" "$BASE_URL/appointments" '{"petId":1,"veterinarianId":1,"date":"2024-02-01","time":"10:00","type":"checkup"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Appointment"

# Medical Records
test_endpoint "POST" "$BASE_URL/medical-records" '{"petId":1,"veterinarianId":1,"type":"CHECKUP","title":"Routine Checkup","description":"Annual checkup"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Medical Record"

# Prescriptions
test_endpoint "POST" "$BASE_URL/prescriptions" '{"petId":1,"veterinarianId":1,"medication":"Antibiotics","dosage":"10mg","frequency":"twice daily"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Prescription"

# Vaccinations
test_endpoint "POST" "$BASE_URL/vaccinations" '{"petId":1,"veterinarianId":1,"vaccine":"Rabies","dateAdministered":"2024-01-15","nextDue":"2025-01-15"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Vaccination"

# Lab Tests
test_endpoint "POST" "$BASE_URL/lab-tests" '{"petId":1,"testType":"Blood Test","veterinarianId":1,"notes":"Routine checkup"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Lab Test"

# Inventory
test_endpoint "POST" "$BASE_URL/inventory" '{"name":"Test Item","category":"MEDICATION","currentStock":100,"minStock":10,"unitPrice":25.50}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Inventory Item"

# Billing
test_endpoint "POST" "$BASE_URL/invoices" '{"petId":1,"ownerId":1,"veterinarianId":1,"items":[{"description":"Checkup","quantity":1,"unitPrice":50.00}],"total":50.00}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Invoice"

echo
echo -e "${CYAN}📊 Test Summary${NC}"
echo -e "${CYAN}─────────────${NC}"
echo -e "${GREEN}✓ Passed: $PASS_COUNT${NC}"
echo -e "${RED}✗ Failed: $FAIL_COUNT${NC}"
echo -e "${BLUE}Total: $((PASS_COUNT + FAIL_COUNT))${NC}"