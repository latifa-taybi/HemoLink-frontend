# HemoLink Frontend - Backend Integration Services (Phase 2)

## Overview

Successfully created comprehensive Angular services layer for backend API integration. This phase establishes type-safe communication between the Angular frontend and Spring Boot backend.

## ✅ Completed Tasks

### 1. **Base API Service** (`api.service.ts`)
- Central HTTP service for all API calls
- Standardized error handling (401, 403, 404, 500+)
- Automatic logout on 401 (unauthorized)
- Param builder utility for query parameters
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`

### 2. **Entity Services** (10 comprehensive services)

#### **DonneurService** (`donneur.service.ts`)
- `getAllDonneurs()` - Get with pagination
- `getDonneurById()` - Get single donor
- `searchDonneurs()` - Search by name
- `getDonneursByBloodGroup()` - Filter by blood type
- `getEligibleDonneurs()` - Get eligible donors
- `createDonneur()` - Create new donor
- `updateDonneur()` - Update donor info
- `deleteDonneur()` - Deactivate donor
- `getDonneurStats()` - Donation statistics

#### **CommandeSangService** (`commande-sang.service.ts`)
- Order lifecycle management
- Status transitions: PENDING → PREPARING → SHIPPED → DELIVERED
- `getCommandesByStatus()` - Filter by status
- `addItemToCommande()` / `removeItemFromCommande()` - Item management
- `startPreparation()`, `shipCommande()`, `deliverCommande()` - Status updates
- `getCommandeStats()` - Order analytics

#### **RendezVousService** (`rendez-vous.service.ts`)
- Appointment scheduling and management
- `getAvailableSlots()` - Available time slots
- `bookAppointment()` - Book appointment
- `getScheduledRendezVous()` - Upcoming appointments
- `cancelRendezVous()` / `rescheduleRendezVous()` - Modifications
- `completeRendezVous()` - Mark completed
- `checkDonneurEligibility()` - Eligibility check
- `getAttendanceRate()` - Performance metrics

#### **PocheSangService** (`poche-sang.service.ts`)
- Blood bag inventory management
- Status tracking: AVAILABLE, QUARANTINE, USED, EXPIRED
- `getNearExpiryPoches()` - Expiration alerts
- `releaseFromQuarantine()` / `markAsUsed()` / `markAsExpired()` - Status updates
- `addLaboTest()` - Add lab test to bag
- Utility methods: `isUsable()`, `daysUntilExpiry()`
- `getInventoryStats()` - Stock analytics

#### **DonService** (`don.service.ts`)
- Donation recording and tracking
- `recordDonation()` - Record new donation
- `getDonsByDateRange()` - Historical data
- `getDonsByBloodGroup()` - Filter by blood type
- `getTotalCollectedVolume()` - Volume metrics
- `getAverageDonationVolume()` - Statistics
- `getEfficiencyReport()` - Performance analysis

#### **HopitalService** (`hopital.service.ts`)
- Hospital profile management
- `getNearbyHopitals()` - Geolocation search
- `getHopitalStaff()` / `addStaffToHopital()` - Staff management
- `getHopitalOrders()` - Order history
- `getConsumptionReport()` - Usage analytics

#### **CentreCollecteService** (`centre-collecte.service.ts`)
- Collection center management
- `getNearByCentres()` - Find nearby centers
- `getCentreSchedule()` - Operating hours
- `getCentreStock()` - Blood inventory
- `getAttendanceReport()` - Appointment stats
- `getPerformanceMetrics()` - Center KPIs

#### **TestLaboService** (`test-labo.service.ts`)
- Laboratory test management
- `getPendingTests()` / `getCompletedTests()` - Test filtering
- `createFullScreening()` - Batch test creation
- `passTest()` / `failTest()` / `inconclusiveTest()` - Result recording
- `getQualityControlReport()` - Lab metrics
- `getTurnaroundTime()` - Performance tracking

#### **UtilisateurService** (`utilisateur.service.ts`)
- User/employee management
- Role-based filtering (ADMIN, DONNEUR, HOPITAL, PERSONNEL_CENTRE, LABO_PERSONNEL)
- `updateUtilisateurRole()` - Role assignment
- `updatePassword()` / `resetPassword()` - Password management
- `enable2FA()` / `disable2FA()` - Security settings
- Admin operations: audit logs, login history, force logout, account locking
- `getStatsByRole()` - User analytics

#### **NotificationService** (`notification.service.ts`)
- Notification system for all users
- `getUnreadNotifications()` - Pending messages
- `markAsRead()` / `markAllAsRead()` - Read status
- `sendBulkNotification()` - Batch notifications
- `sendToRole()` - Role-based notifications
- `sendAppointmentReminder()` - Automated reminders
- User preferences: notification types, delivery channels

### 3. **Models and Interfaces** (`models/index.ts`)

**Exported Enums:**
- `RoleUtilisateur` - 5 roles (ADMIN, DONNEUR, HOPITAL, PERSONNEL_CENTRE, LABO_PERSONNEL)
- `GroupeSanguin` - 8 blood types (O+, O-, A+, A-, B+, B-, AB+, AB-)
- `StatutCommande` - Order states (PENDING, PREPARING, SHIPPED, DELIVERED)
- `StatutRendezVous` - Appointment states (SCHEDULED, COMPLETED, CANCELLED)
- `StatutSang` - Blood bag states (AVAILABLE, QUARANTINE, USED, EXPIRED)

**Data Models** (15+ interfaces):
- `Utilisateur`, `Donneur`, `Don`, `PocheSang`
- `CommandeSang`, `ElementCommande`, `RendezVous`
- `CentreCollecte`, `Hopital`, `TestLabo`, `Notification`
- `StatistiquesStock`, `ApiResponse<T>`, `PageableResponse<T>`, `ErrorResponse`

### 4. **Code Quality Fixes**

✅ **Fixed Compilation Errors:**
1. Added enum re-exports in models/index.ts
2. Added missing `dateExpiration` field to PocheSang
3. Enhanced Notification interface with `type` and `priorite` fields
4. Updated Dashboard component to use correct backend role names
5. All 11 services with zero TypeScript errors

✅ **Code Standards:**
- Consistent error handling across all services
- Uniform pagination support (page, size parameters)
- Type-safe Observables for all responses
- Documented methods with JSDoc comments
- Organized code with clear section separators

## 📋 API Endpoints Mapped

All 13 backend controllers mapped with their endpoints:

| Service | Endpoint | Methods |
|---------|----------|---------|
| Auth | `/api/auth` | POST /login, /inscription |
| Donneur | `/api/donneurs` | GET/POST/PUT/DELETE with filtering |
| Don | `/api/dons` | GET/POST with date ranges |
| PocheSang | `/api/poches-sang` | GET/POST/PATCH with status transitions |
| CommandeSang | `/api/commandes-sang` | GET/POST/PATCH with lifecycle |
| RendezVous | `/api/rendez-vous` | GET/POST/PATCH/DELETE with scheduling |
| CentreCollecte | `/api/centres-collecte` | GET/POST/PUT with geolocation |
| Hopital | `/api/hopitals` | GET/POST/PUT with staff management |
| TestLabo | `/api/test-labo` | GET/POST/PATCH with result recording |
| Utilisateur | `/api/utilisateurs` | GET/POST/PUT/PATCH with role management |
| Notification | `/api/notifications` | GET/POST/PATCH/DELETE with preferences |

## 🔑 Key Features

### ✨ Authentication & Authorization
- JWT token-based auth with Bearer scheme
- 24-hour token expiration
- Automatic logout on 401
- Role-based access control for all 6 user types

### 📊 Comprehensive Querying
- Pagination throughout (page, size parameters)
- Advanced filtering (by status, date range, location, blood group)
- Search functionality (donors, hospitals, centers)
- Geolocation-based queries (nearby hospitals/centers)

### 🔄 Real-World Workflows
- Order lifecycle management (PENDING → DELIVERED)
- Appointment booking with slot availability
- Lab test batching and result recording
- Blood bag tracking with expiration alerts
- Staff and organization management

### 📈 Analytics & Reporting
- Statistics for all major entities
- Performance metrics (attendance, turnaround time, success rates)
- Date range reporting
- Role-based and blood-group-based analytics

## 🚀 Integration Patterns

### Basic Usage
```typescript
// 1. Inject service
constructor(private donneurService: DonneurService) {}

// 2. Call method
this.donneurService.getAllDonneurs(0, 20).subscribe({
  next: (response) => { /* handle data */ },
  error: (err) => { /* handle error */ }
});
```

### Error Handling (Built-in)
- 401: Auto logout + redirect
- 403: "Permission denied"
- 404: "Resource not found"
- 5xx: "Server error"

### Loading States
```typescript
this.loading = true;
this.service.method().subscribe({
  next: (data) => { this.data = data; this.loading = false; },
  error: (err) => { this.error = err; this.loading = false; }
});
```

## 📁 File Structure

```
src/app/services/
├── api.service.ts              (Base HTTP service)
├── auth.service.ts             (Authentication - existing, now with enums)
├── donneur.service.ts          (Donor management)
├── commande-sang.service.ts    (Order management)
├── rendez-vous.service.ts      (Appointments)
├── poche-sang.service.ts       (Blood bags)
├── don.service.ts              (Donations)
├── hopital.service.ts          (Hospitals)
├── centre-collecte.service.ts  (Collection centers)
├── test-labo.service.ts        (Lab tests)
├── utilisateur.service.ts      (User management)
└── notification.service.ts     (Notifications)

src/app/models/
└── index.ts                    (All interfaces & enums, re-exported)
```

## 🔧 Backend Configuration

**API Base URL:** `http://localhost:8082/api`

**Database:**
- Engine: PostgreSQL 15+
- Host: localhost:5432
- Database: HemoLink
- Credentials: postgres/admin (⚠️ Move to env in production)

**JWT:**
- Secret: hemolink_ultra_secret_key_...
- Algorithm: HMAC-SHA256
- Expiration: 24 hours

**CORS:** Needs configuration between http://localhost:4200 (Angular) and http://localhost:8082 (Spring Boot)

## ✅ Next Steps (Phase 3)

### Immediate
1. **Update Components** to use new services instead of mock data
2. **Add HttpClientModule** to app imports if not present
3. **Test Login Flow** end-to-end with actual backend
4. **Verify CORS** configuration

### Components to Update Priority Order
1. LoginComponent → Use AuthService + UtilisateurService
2. DashboardComponent → Use service data
3. AdminComponents → Use CRUD services
4. DonorComponents → Use DonneurService, RendezVousService
5. HospitalComponents → Use CommandeSangService, HopitalService
6. LabComponents → Use TestLaboService, PocheSangService

### Advanced Features
1. **Notifications** - Implement real-time notifications with WebSocket
2. **Pagination UI** - Create reusable pagination component
3. **Search/Filter** - Implement advanced filtering UI
4. **Analytics Dashboard** - Use statistics endpoints
5. **Export Reports** - Generate PDF/Excel reports

## 📖 Reference

**Service Declaration Pattern:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly endpoint = '/my-endpoint';
  constructor(private api: ApiService) {}
  
  getAll(): Observable<MyModel[]> {
    return this.api.get<MyModel[]>(this.endpoint);
  }
}
```

**Universal Error Handling:**
All services inherit ApiService's error handling. No need to replicate 401/403/404 handling in components.

## 🎯 Architecture Benefits

✅ **Maintainability** - Centralized API logic, easy to update endpoints
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Reusability** - Services work across components
✅ **Testability** - Services easily mockable for unit tests
✅ **Scalability** - Easy to add new services following same pattern
✅ **Performance** - Pagination and filtering on backend

## 📝 Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| ApiService | ✅ Complete | Base HTTP service |
| 10 Entity Services | ✅ Complete | All CRUD + business logic |
| Models/Enums | ✅ Complete | 15+ interfaces, 5 enums |
| Error Handling | ✅ Complete | Centralized in ApiService |
| Type Safety | ✅ Complete | Zero TypeScript errors |
| Compilation | ✅ Passing | No errors found |

---

**Created:** Today
**Phase:** 2/4 (Backend Integration)
**Status:** ✅ COMPLETE - Ready for component integration
