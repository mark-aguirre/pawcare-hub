#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"
CLINIC_CODE="PC001"
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local name=$5
    
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    
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
echo -e "${CYAN}║     PawCare Hub Frontend API Test    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo

echo -e "${GREEN}🏥 Using clinic code: ${PURPLE}$CLINIC_CODE${NC}"
echo

echo -e "${BLUE}📊 Testing GET Endpoints${NC}"
echo -e "${BLUE}─────────────────────────${NC}"

# Core entities
test_endpoint "GET" "$BASE_URL/owners" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Owners"
test_endpoint "GET" "$BASE_URL/pets" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Pets"
test_endpoint "GET" "$BASE_URL/veterinarians" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Veterinarians"

# Appointments
test_endpoint "GET" "$BASE_URL/appointments" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Appointments"
test_endpoint "GET" "$BASE_URL/appointments/today" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Today Appointments"
test_endpoint "GET" "$BASE_URL/appointments/upcoming" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Upcoming Appointments"

# Medical Records
test_endpoint "GET" "$BASE_URL/records" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Medical Records"
test_endpoint "GET" "$BASE_URL/records/stats" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Records Stats"

# Prescriptions & Vaccinations
test_endpoint "GET" "$BASE_URL/prescriptions" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Prescriptions"
test_endpoint "GET" "$BASE_URL/vaccinations" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Vaccinations"
test_endpoint "GET" "$BASE_URL/vaccinations/due" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Due Vaccinations"
test_endpoint "GET" "$BASE_URL/vaccinations/upcoming" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Upcoming Vaccinations"

# Lab Tests
test_endpoint "GET" "$BASE_URL/lab-tests" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Lab Tests"
test_endpoint "GET" "$BASE_URL/lab-tests/stats" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Lab Test Stats"

# Inventory
test_endpoint "GET" "$BASE_URL/inventory" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Inventory"
test_endpoint "GET" "$BASE_URL/inventory/low-stock" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Low Stock Items"

# Billing & Financial
test_endpoint "GET" "$BASE_URL/billing" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Billing/Invoices"
test_endpoint "GET" "$BASE_URL/billing/analytics" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Billing Analytics"
test_endpoint "GET" "$BASE_URL/billing/payments" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Payments"

# Reports
test_endpoint "GET" "$BASE_URL/reports" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Reports"
test_endpoint "GET" "$BASE_URL/reports?type=revenue" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Revenue Reports"
test_endpoint "GET" "$BASE_URL/reports?type=appointments" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Appointment Reports"

# Dashboard
test_endpoint "GET" "$BASE_URL/dashboard/stats" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Dashboard Stats"
test_endpoint "GET" "$BASE_URL/dashboard/recent-activity" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Recent Activity"
test_endpoint "GET" "$BASE_URL/dashboard/recent-pets" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Recent Pets"
test_endpoint "GET" "$BASE_URL/dashboard/upcoming-appointments" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Upcoming Appointments"
test_endpoint "GET" "$BASE_URL/dashboard/inventory-alerts" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Inventory Alerts"
test_endpoint "GET" "$BASE_URL/dashboard/revenue" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Revenue Data"
test_endpoint "GET" "$BASE_URL/dashboard/performance" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Performance Data"

# Activities
test_endpoint "GET" "$BASE_URL/activities/recent" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Recent Activities"
test_endpoint "GET" "$BASE_URL/activities/medical-records" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Medical Record Activities"

# Settings
test_endpoint "GET" "$BASE_URL/settings" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Settings"
test_endpoint "GET" "$BASE_URL/settings/users" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Settings Users"
test_endpoint "GET" "$BASE_URL/settings/permissions" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Settings Permissions"

# Clinics
test_endpoint "GET" "$BASE_URL/clinics" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Clinics"

# Portal endpoints
test_endpoint "GET" "$BASE_URL/portal/pets" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Portal Pets"
test_endpoint "GET" "$BASE_URL/portal/appointments" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Portal Appointments"
test_endpoint "GET" "$BASE_URL/portal/records" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Portal Records"
test_endpoint "GET" "$BASE_URL/portal/billing" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Portal Billing"

echo
echo -e "${BLUE}📝 Testing POST Endpoints${NC}"
echo -e "${BLUE}──────────────────────────${NC}"

# Auth endpoints
test_endpoint "POST" "$BASE_URL/auth/login" '{"identifier":"test@test.com","password":"password"}' "" "Auth Login"
test_endpoint "POST" "$BASE_URL/auth/signup" '{"clinicCode":"'$CLINIC_CODE'","name":"Test User","email":"testuser@test.com","password":"password123"}' "" "Auth Signup"
test_endpoint "POST" "$BASE_URL/auth/forgot-password" '{"email":"test@test.com"}' "" "Forgot Password"

# Core entity creation
test_endpoint "POST" "$BASE_URL/owners" '{"firstName":"Test","lastName":"Owner","email":"test@test.com","phone":"1234567890"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Owner"
test_endpoint "POST" "$BASE_URL/pets" '{"name":"TestPet","species":"Dog","breed":"Lab","age":3,"ownerId":1}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Pet"
test_endpoint "POST" "$BASE_URL/veterinarians" '{"firstName":"Dr.","lastName":"Test","email":"vet@test.com","phone":"1234567890","specialization":"General"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Vet"

# Appointments
test_endpoint "POST" "$BASE_URL/appointments" '{"petId":1,"veterinarianId":1,"date":"2024-02-01","time":"10:00","type":"checkup"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Appointment"

# Medical Records
test_endpoint "POST" "$BASE_URL/records" '{"petId":1,"veterinarianId":1,"type":"CHECKUP","title":"Routine Checkup","description":"Annual checkup"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Medical Record"

# Prescriptions
test_endpoint "POST" "$BASE_URL/prescriptions" '{"petId":1,"veterinarianId":1,"medication":"Antibiotics","dosage":"10mg","frequency":"twice daily"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Prescription"

# Vaccinations
test_endpoint "POST" "$BASE_URL/vaccinations" '{"petId":1,"veterinarianId":1,"vaccine":"Rabies","dateAdministered":"2024-01-15","nextDue":"2025-01-15"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Vaccination"

# Lab Tests
test_endpoint "POST" "$BASE_URL/lab-tests" '{"petId":1,"testType":"Blood Test","veterinarianId":1,"notes":"Routine checkup"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Lab Test"

# Inventory
test_endpoint "POST" "$BASE_URL/inventory" '{"name":"Test Item","category":"MEDICATION","currentStock":100,"minStock":10,"unitPrice":25.50}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Inventory Item"

# Billing
test_endpoint "POST" "$BASE_URL/billing" '{"petId":1,"ownerId":1,"veterinarianId":1,"items":[{"description":"Checkup","quantity":1,"unitPrice":50.00}],"total":50.00}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Invoice"

# Clinics
test_endpoint "POST" "$BASE_URL/clinics" '{"clinicName":"Test Clinic","address":"123 Test St","phone":"555-0123","email":"test@clinic.com"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create Clinic"

# Settings
test_endpoint "POST" "$BASE_URL/settings/users" '{"name":"New User","email":"newuser@test.com","password":"password123","role":"NURSE"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Create User"

echo
echo -e "${BLUE}✏️  Testing PUT Endpoints${NC}"
echo -e "${BLUE}─────────────────────────${NC}"

test_endpoint "PUT" "$BASE_URL/owners/1" '{"firstName":"Updated","lastName":"Owner","email":"updated@test.com","phone":"9876543210"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Owner"
test_endpoint "PUT" "$BASE_URL/pets/1" '{"name":"UpdatedPet","species":"Cat","breed":"Persian","weight":5.5}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Pet"
test_endpoint "PUT" "$BASE_URL/appointments/1" '{"date":"2024-02-02","time":"11:00","status":"confirmed"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Appointment"
test_endpoint "PUT" "$BASE_URL/records/1" '{"title":"Updated Record","description":"Updated description"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Medical Record"
test_endpoint "PUT" "$BASE_URL/lab-tests/1" '{"status":"COMPLETED","results":"Normal values"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Lab Test"
test_endpoint "PUT" "$BASE_URL/billing/1" '{"status":"PAID","paidDate":"2024-01-15"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Invoice"
test_endpoint "PUT" "$BASE_URL/settings" '{"clinicName":"Updated Clinic","address":"456 New St"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update Settings"
test_endpoint "PUT" "$BASE_URL/settings/users/1" '{"name":"Updated User","email":"updated@test.com","role":"VETERINARIAN"}' "-H 'x-clinic-code: $CLINIC_CODE'" "Update User"

echo
echo -e "${BLUE}🗑️  Testing DELETE Endpoints${NC}"
echo -e "${BLUE}─────────────────────────────${NC}"

test_endpoint "DELETE" "$BASE_URL/owners/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Owner"
test_endpoint "DELETE" "$BASE_URL/pets/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Pet"
test_endpoint "DELETE" "$BASE_URL/appointments/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Appointment"
test_endpoint "DELETE" "$BASE_URL/records/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Medical Record"
test_endpoint "DELETE" "$BASE_URL/prescriptions/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Prescription"
test_endpoint "DELETE" "$BASE_URL/vaccinations/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Vaccination"
test_endpoint "DELETE" "$BASE_URL/lab-tests/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Lab Test"
test_endpoint "DELETE" "$BASE_URL/billing/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete Invoice"
test_endpoint "DELETE" "$BASE_URL/settings/users/999" "" "-H 'x-clinic-code: $CLINIC_CODE'" "Delete User"

echo
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              TEST SUMMARY            ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC} Frontend API (Port 3000)${CYAN}          ║${NC}"
echo -e "${CYAN}║${NC} Clinic Code: ${PURPLE}$CLINIC_CODE${NC}${CYAN}                ║${NC}"
echo -e "${CYAN}║${NC} Total Tests: ${YELLOW}$TOTAL_COUNT${NC}${CYAN}                    ║${NC}"
echo -e "${CYAN}║${NC} Passed: ${GREEN}$PASS_COUNT${NC}${CYAN}                        ║${NC}"
echo -e "${CYAN}║${NC} Failed: ${RED}$FAIL_COUNT${NC}${CYAN}                        ║${NC}"
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${CYAN}║${NC} Status: ${GREEN}ALL TESTS PASSED! 🎉${NC}${CYAN}       ║${NC}"
else
    echo -e "${CYAN}║${NC} Status: ${RED}SOME TESTS FAILED ❌${NC}${CYAN}       ║${NC}"
fi
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"