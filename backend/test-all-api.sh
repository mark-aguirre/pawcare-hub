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
echo -e "${CYAN}║        PawCare Hub API Test          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo

# Step 1: Create new clinic and extract clinic code
echo -e "${YELLOW}🏥 Setting up test clinic...${NC}"
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"clinicName":"Test Clinic","address":"123 Test St","phone":"555-0123","email":"test@clinic.com"}' "$BASE_URL/settings")
CLINIC_CODE=$(echo $RESPONSE | grep -o '"clinicCode":"[^"]*' | cut -d'"' -f4)

if [ -z "$CLINIC_CODE" ]; then
    echo -e "${RED}❌ Failed to create clinic or extract clinic code${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Created clinic with code: ${PURPLE}$CLINIC_CODE${NC}"
echo

echo -e "${BLUE}📊 Testing GET Endpoints${NC}"
echo -e "${BLUE}─────────────────────────${NC}"

# Dashboard
test_endpoint "GET" "$BASE_URL/dashboard/stats" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Dashboard Stats"
test_endpoint "GET" "$BASE_URL/dashboard/recent-activity" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Recent Activity"

# Test endpoints
test_endpoint "GET" "$BASE_URL/test/health" "" "" "Health Check"
test_endpoint "GET" "$BASE_URL/test/ping" "" "" "Ping"

# Core entities
test_endpoint "GET" "$BASE_URL/owners" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Owners"
test_endpoint "GET" "$BASE_URL/pets" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Pets"
test_endpoint "GET" "$BASE_URL/veterinarians" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Veterinarians"

# Appointments
test_endpoint "GET" "$BASE_URL/appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Appointments"
test_endpoint "GET" "$BASE_URL/appointments/today" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Today Appointments"

# Medical
test_endpoint "GET" "$BASE_URL/medical-records" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Medical Records"
test_endpoint "GET" "$BASE_URL/prescriptions" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Prescriptions"
test_endpoint "GET" "$BASE_URL/vaccinations" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Vaccinations"
test_endpoint "GET" "$BASE_URL/vaccinations/due" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Due Vaccinations"
test_endpoint "GET" "$BASE_URL/lab-tests" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Lab Tests"

# Inventory
test_endpoint "GET" "$BASE_URL/inventory" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Inventory"
test_endpoint "GET" "$BASE_URL/inventory/low-stock" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Low Stock"

# Financial
test_endpoint "GET" "$BASE_URL/invoices" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Invoices"
test_endpoint "GET" "$BASE_URL/invoices/overdue" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Overdue Invoices"
test_endpoint "GET" "$BASE_URL/payments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Payments"

# Reports
test_endpoint "GET" "$BASE_URL/reports" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Reports"
test_endpoint "GET" "$BASE_URL/reports?type=revenue" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Revenue Reports"
test_endpoint "GET" "$BASE_URL/reports?type=appointments" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Appointment Reports"

# Activities
test_endpoint "GET" "$BASE_URL/activities/recent" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Recent Activities"

# Settings
test_endpoint "GET" "$BASE_URL/settings" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings"
test_endpoint "GET" "$BASE_URL/settings/users" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings Users"
test_endpoint "GET" "$BASE_URL/settings/permissions" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Settings Permissions"

# Users
test_endpoint "GET" "$BASE_URL/users" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Users"

echo
echo -e "${BLUE}📝 Testing POST Endpoints${NC}"
echo -e "${BLUE}──────────────────────────${NC}"

# Auth endpoints (no clinic code needed)
test_endpoint "POST" "$BASE_URL/auth/login" '{"identifier":"test@test.com","password":"password"}' "" "Auth Login"
test_endpoint "POST" "$BASE_URL/auth/signup" '{"clinicCode":"'$CLINIC_CODE'","name":"Test User","email":"testuser@test.com","password":"password123"}' "" "Auth Signup"

# User CRUD
test_endpoint "POST" "$BASE_URL/users" '{"name":"New User","email":"newuser@test.com","password":"password123","role":"NURSE"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create User"

# Core entity creation
test_endpoint "POST" "$BASE_URL/owners" '{"firstName":"Test","lastName":"Owner","email":"test@test.com","phone":"1234567890"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Owner"
test_endpoint "POST" "$BASE_URL/pets" '{"name":"TestPet","species":"Dog","breed":"Lab","age":3,"ownerId":1}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Pet"
test_endpoint "POST" "$BASE_URL/veterinarians" '{"firstName":"Dr.","lastName":"Test","email":"vet@test.com","phone":"1234567890","specialization":"General"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Vet"

# Inventory creation
test_endpoint "POST" "$BASE_URL/inventory" '{"name":"Test Item","category":"MEDICATION","currentStock":100,"minStock":10,"unitPrice":25.50}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Inventory Item"

# Lab test creation
test_endpoint "POST" "$BASE_URL/lab-tests" '{"petId":1,"testType":"Blood Test","veterinarianId":1,"notes":"Routine checkup"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Lab Test"

# Invoice creation
test_endpoint "POST" "$BASE_URL/invoices" '{"petId":1,"ownerId":1,"veterinarianId":1,"items":[{"description":"Checkup","quantity":1,"unitPrice":50.00}],"total":50.00}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Create Invoice"

# Payment processing
test_endpoint "POST" "$BASE_URL/payments/process" '{"invoiceId":1,"amount":100.00,"method":"CASH","transactionId":"TEST123"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Process Payment"

echo
echo -e "${BLUE}✏️  Testing PUT Endpoints${NC}"
echo -e "${BLUE}─────────────────────────${NC}"

test_endpoint "PUT" "$BASE_URL/owners/1" '{"firstName":"Updated","lastName":"Owner","email":"updated@test.com","phone":"9876543210"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Update Owner"
test_endpoint "PUT" "$BASE_URL/pets/1" '{"name":"UpdatedPet","species":"Cat","breed":"Persian","weight":5.5}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Update Pet"
test_endpoint "PUT" "$BASE_URL/settings" '{"clinicName":"Test Clinic","address":"123 Test St"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Update Settings"
test_endpoint "PUT" "$BASE_URL/users/1" '{"name":"Updated User","email":"updated@test.com","role":"VETERINARIAN"}' "-H 'X-Clinic-Code: $CLINIC_CODE'" "Update User"

echo
echo -e "${BLUE}🗑️  Testing DELETE Endpoints${NC}"
echo -e "${BLUE}─────────────────────────────${NC}"

test_endpoint "DELETE" "$BASE_URL/owners/999" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Delete Owner"
test_endpoint "DELETE" "$BASE_URL/pets/999" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Delete Pet"
test_endpoint "DELETE" "$BASE_URL/payments/999" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Delete Payment"
test_endpoint "DELETE" "$BASE_URL/users/999" "" "-H 'X-Clinic-Code: $CLINIC_CODE'" "Delete User"

echo
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              TEST SUMMARY            ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC} Clinic Code: ${PURPLE}$CLINIC_CODE${NC}${CYAN}           ║${NC}"
echo -e "${CYAN}║${NC} Total Tests: ${YELLOW}$TOTAL_COUNT${NC}${CYAN}                    ║${NC}"
echo -e "${CYAN}║${NC} Passed: ${GREEN}$PASS_COUNT${NC}${CYAN}                        ║${NC}"
echo -e "${CYAN}║${NC} Failed: ${RED}$FAIL_COUNT${NC}${CYAN}                        ║${NC}"
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${CYAN}║${NC} Status: ${GREEN}ALL TESTS PASSED! 🎉${NC}${CYAN}       ║${NC}"
else
    echo -e "${CYAN}║${NC} Status: ${RED}SOME TESTS FAILED ❌${NC}${CYAN}       ║${NC}"
fi
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"