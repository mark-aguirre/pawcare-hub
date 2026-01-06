# Dashboard Modals

This directory contains modal components for creating new records through the Quick Actions dashboard feature. Each modal provides a comprehensive form for data entry with validation and user-friendly interfaces.

## Modal Components

### `NewAppointmentModal.tsx`
**Purpose**: Schedule new appointments for pets with veterinarians.

**Features**:
- Pet selection from existing pets
- Veterinarian assignment
- Date and time picker with calendar widget
- Appointment type selection (checkup, vaccination, surgery, etc.)
- Duration selection (15 minutes to 2 hours)
- Notes field for special instructions
- Form validation to ensure required fields are filled

**Key Fields**:
- Pet (required)
- Veterinarian (required)
- Date (required, future dates only)
- Time (required, predefined slots)
- Duration (required, dropdown selection)
- Type (required, categorized options)
- Notes (optional)

### `NewPetModal.tsx`
**Purpose**: Register new pets in the system with comprehensive information.

**Features**:
- Owner selection from existing owners
- Species selection with emoji indicators
- Age, gender, and weight tracking
- Color and markings description
- Photo upload capability
- Allergy and medical condition tracking
- Comprehensive form validation

**Key Fields**:
- Name (required)
- Owner (required, dropdown selection)
- Species (required, with emojis)
- Breed (optional)
- Age (required, numeric input)
- Gender (required, male/female)
- Weight (optional, decimal input)
- Color/Markings (optional)
- Photo URL (optional)
- Allergies (optional, comma-separated)
- Medical Conditions (optional, textarea)

### `NewOwnerModal.tsx`
**Purpose**: Register new pet owners with contact and emergency information.

**Features**:
- Complete contact information form
- Emergency contact details
- Address information with map icon
- Email and phone validation
- Additional notes section
- Clean, organized layout with sections

**Key Fields**:
- Full Name (required)
- Email (required, email validation)
- Phone (required, tel input)
- Address (optional, textarea)
- Emergency Contact Name (optional)
- Emergency Phone (optional)
- Additional Notes (optional)

### `NewRecordModal.tsx`
**Purpose**: Create detailed medical records for pets.

**Features**:
- Pet and veterinarian selection
- Record type categorization
- Date selection (past dates allowed)
- Rich text description area
- File attachment support
- Comprehensive medical documentation

**Key Fields**:
- Pet (required, dropdown)
- Veterinarian (required, dropdown)
- Date (required, calendar picker)
- Record Type (required, medical categories)
- Title (required, brief summary)
- Description (required, detailed textarea)
- Notes (optional, additional observations)
- Attachments (optional, file upload)

## Common Features

### Form Validation
- Required field indicators with asterisks (*)
- Real-time validation feedback
- Submit button disabled until required fields are filled
- Clear error messaging

### User Experience
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Loading states and feedback
- Cancel and submit actions
- Form reset on successful submission

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support

### Data Integration
- Uses mock data for dropdowns and selections
- Structured data output for API integration
- Type-safe interfaces matching the main data models
- Consistent data formatting

## Usage Example

```tsx
import { QuickActions } from '@/components/dashboard/QuickActions';

// The QuickActions component automatically handles all modals
function Dashboard() {
  return (
    <div>
      <QuickActions />
    </div>
  );
}
```

## Modal State Management

The modals are managed through the `QuickActions` component using React state:

```tsx
const [activeModal, setActiveModal] = useState<ModalType>(null);

// Open modal
const handleActionClick = (actionId: string) => {
  setActiveModal(actionId as ModalType);
};

// Close modal
const closeModal = () => {
  setActiveModal(null);
};
```

## Styling Guidelines

- Consistent with the overall design system
- Uses Tailwind CSS classes
- Responsive grid layouts
- Proper spacing and typography
- Icon integration with Lucide React
- Gradient buttons for primary actions

## Future Enhancements

- File upload functionality
- Image preview for pet photos
- Auto-complete for common fields
- Integration with calendar systems
- Email notifications
- Print functionality for records
- Bulk operations support