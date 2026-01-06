# Dashboard Slide-in Panels

This directory contains slide-in panel components that provide full functionality for the Quick Actions feature. These panels slide in from the right side of the screen, providing a more integrated and modern user experience compared to traditional modal dialogs.

## Panel Components

### `NewAppointmentPanel.tsx`
**Purpose**: Schedule new appointments with a comprehensive slide-in form.

**Features**:
- **Slide-in Animation**: Smooth slide-in from the right side
- **Pet Selection**: Dropdown with pet details and owner information
- **Veterinarian Assignment**: Selection with specialization display
- **Date & Time Picker**: Calendar widget with time slot selection
- **Appointment Types**: Categorized appointment types
- **Duration Options**: Flexible duration selection (15 min to 2 hours)
- **Form Validation**: Real-time validation with disabled submit states
- **Organized Sections**: Grouped form fields for better UX

**Layout Sections**:
1. **Header**: Icon, title, and description
2. **Appointment Details**: Pet and veterinarian selection
3. **Schedule Information**: Date, time, duration, and type
4. **Notes**: Optional additional information
5. **Actions**: Submit and cancel buttons

### `NewPetPanel.tsx`
**Purpose**: Register new pets with comprehensive information collection.

**Features**:
- **Multi-section Form**: Organized into logical sections
- **Owner Integration**: Links pets to existing owners
- **Species Selection**: Visual species selection with emojis
- **Physical Details**: Age, gender, weight tracking
- **Medical Information**: Allergies and conditions tracking
- **Photo Upload**: Photo URL input with upload button
- **Responsive Layout**: Adapts to different screen sizes

**Layout Sections**:
1. **Basic Information**: Name, owner, species, breed
2. **Physical Details**: Age, gender, weight, color
3. **Medical Information**: Allergies and conditions
4. **Photo Upload**: Image management

### `NewOwnerPanel.tsx`
**Purpose**: Register new pet owners with contact and emergency information.

**Features**:
- **Contact Management**: Complete contact information
- **Emergency Contacts**: Secondary contact information
- **Icon Integration**: Visual icons for different field types
- **Address Handling**: Multi-line address input
- **Clean Layout**: Well-organized sections with clear labels

**Layout Sections**:
1. **Basic Information**: Name, email, phone, address
2. **Emergency Contact**: Optional emergency contact details
3. **Additional Notes**: Free-form notes section

### `NewRecordPanel.tsx`
**Purpose**: Create detailed medical records with comprehensive documentation.

**Features**:
- **Patient & Provider**: Pet and veterinarian selection
- **Record Categorization**: Color-coded record types
- **Date Management**: Past date selection for historical records
- **Rich Documentation**: Detailed description and notes
- **File Attachments**: Support for multiple file types
- **Medical Focus**: Specialized for veterinary record keeping

**Layout Sections**:
1. **Patient & Provider**: Pet and veterinarian selection
2. **Record Details**: Date, type, and title
3. **Medical Information**: Description and notes
4. **Attachments**: File upload and management

## Technical Implementation

### Slide-in Animation
All panels use the `Sheet` component from Radix UI which provides:
- Smooth slide-in animation from the right
- Overlay background with blur effect
- Automatic focus management
- Keyboard navigation support
- Escape key to close

### Panel Structure
```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent className="w-[700px] sm:w-[800px] overflow-y-auto">
    <SheetHeader>
      {/* Icon, title, description */}
    </SheetHeader>
    
    <form onSubmit={handleSubmit}>
      {/* Organized form sections */}
    </form>
  </SheetContent>
</Sheet>
```

### Form Organization
Each panel organizes form fields into logical sections:
- **Visual Hierarchy**: Clear section headers with borders
- **Responsive Grids**: Adaptive layouts for different screen sizes
- **Icon Integration**: Contextual icons for better UX
- **Validation States**: Real-time feedback and error handling

### State Management
- **Form State**: Individual useState for each form
- **Panel State**: Managed by parent QuickActions component
- **Validation**: Built-in HTML5 validation with custom logic
- **Success Handling**: Toast notifications and form reset

### Styling Features
- **Consistent Design**: Matches dashboard design system
- **Gradient Buttons**: Primary actions with gradient backgrounds
- **Hover Effects**: Interactive feedback on form elements
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation

## User Experience

### Panel Behavior
1. **Opening**: Click Quick Action → Panel slides in from right
2. **Form Interaction**: Organized sections with clear progression
3. **Validation**: Real-time feedback with disabled states
4. **Submission**: Success toast + automatic panel close
5. **Cancellation**: Cancel button or overlay click to close

### Visual Design
- **Width**: 700px on mobile, 800px on desktop
- **Scrolling**: Vertical scroll for long forms
- **Sections**: Clear visual separation with borders
- **Icons**: Contextual icons for different field types
- **Colors**: Consistent with dashboard color scheme

### Accessibility
- **Focus Management**: Proper tab order and focus states
- **Screen Readers**: ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard support
- **High Contrast**: Accessible color combinations

## Integration with QuickActions

The panels are integrated through the `QuickActions` component:

```tsx
const [activePanel, setActivePanel] = useState<PanelType>(null);

// Panel components with state management
<NewAppointmentPanel 
  open={activePanel === 'appointment'} 
  onOpenChange={(open) => !open && closePanel()} 
/>
```

## Data Flow

1. **User Interaction**: Click Quick Action button
2. **State Update**: Set active panel type
3. **Panel Opens**: Slide-in animation begins
4. **Form Interaction**: User fills out form
5. **Validation**: Real-time validation feedback
6. **Submission**: Data logged + toast notification
7. **Cleanup**: Form reset + panel close

## Future Enhancements

- **Auto-save**: Draft saving for long forms
- **Keyboard Shortcuts**: Quick access shortcuts
- **Form Templates**: Pre-filled form templates
- **Bulk Operations**: Multiple record creation
- **Integration**: Real API integration
- **Offline Support**: Offline form completion
- **Print Support**: Print completed forms
- **Export**: Export form data to various formats