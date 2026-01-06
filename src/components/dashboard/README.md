# Dashboard Components

This directory contains all the components used in the PawCare Hub dashboard. Each component is designed to be modular, reusable, and follows the design system established in the project.

## Components Overview

### Core Components

#### `StatCard.tsx`
- Displays key metrics with optional trend indicators
- Supports multiple variants (primary, accent, warning, success)
- Includes hover effects and animations
- Props: `title`, `value`, `icon`, `trend`, `variant`, `delay`

#### `AppointmentCard.tsx`
- Shows individual appointment details
- Color-coded status indicators
- Pet species emoji display
- Interactive hover effects
- Props: `appointment`, `delay`

#### `QuickActions.tsx`
- Grid of quick action buttons for common tasks
- Primary action highlighted with gradient
- Responsive 2x2 grid layout
- Links to various sections of the app

#### `RecentPets.tsx`
- List of recently added pets
- Avatar display with fallback emojis
- Species-based color coding
- Scrollable list with hover effects

### Enhanced Components

#### `RevenueChart.tsx`
- Weekly revenue visualization
- Interactive bar chart with hover tooltips
- Summary statistics (total, average)
- Trend indicators and comparisons

#### `UpcomingAppointments.tsx`
- Shows next few days' appointments
- Date-based organization
- Type and status indicators
- Veterinarian assignment display

#### `LowStockAlert.tsx`
- Inventory monitoring component
- Critical stock level alerts
- Progress bars for stock levels
- Category-based color coding

#### `RecentActivity.tsx`
- Timeline of recent system activities
- Activity type categorization
- Time-based organization
- Interactive activity items

#### `PerformanceSummary.tsx`
- Key performance indicators
- Progress tracking against targets
- Trend analysis with visual indicators
- Monthly performance overview

#### `WelcomeMessage.tsx`
- Onboarding component for new users
- Feature highlights and quick tour
- Animated decorative elements
- Call-to-action buttons

## Design Patterns

### Animation System
- Staggered animations using `animationDelay`
- Consistent slide-up entrance animations
- Hover effects with smooth transitions
- Loading states with pulse animations

### Color System
- Semantic color variants (primary, success, warning, destructive)
- Gradient backgrounds for emphasis
- Consistent opacity levels for states
- Dark mode compatibility

### Layout Patterns
- Responsive grid systems
- Card-based component structure
- Consistent spacing and padding
- Mobile-first responsive design

### Interactive Elements
- Hover states with scale and shadow effects
- Click feedback with transitions
- Loading and empty states
- Accessibility considerations

## Usage Examples

```tsx
// Basic stat card
<StatCard
  title="Today's Appointments"
  value={5}
  icon={Calendar}
  variant="primary"
  trend={{ value: 12, isPositive: true }}
/>

// Revenue chart
<RevenueChart />

// Welcome message for new users
<WelcomeMessage userName="Dr. Smith" isFirstTime={true} />
```

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the established color palette
- Maintain consistent border radius (rounded-xl, rounded-2xl)
- Use shadow utilities for depth
- Implement proper focus states for accessibility

## Data Integration

All components use mock data from `@/data/mockData.ts` but are designed to easily integrate with real API data. The interfaces are defined in `@/types/index.ts`.

## Performance Considerations

- Components use React.memo where appropriate
- Animations are optimized for 60fps
- Images use proper loading states
- Lists are virtualized when necessary