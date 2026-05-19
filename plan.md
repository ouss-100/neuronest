# Neuronest Project Completion Plan

Based on the existing database models, this plan outlines the necessary steps to complete the Neuronest application. The application is a specialized platform connecting parents with healthcare professionals (doctors) to manage and assess their children's developmental or neurological health.

## 1. Backend API Development
Create robust API routes (using Next.js App Router API or custom server) to handle the following operations:

* **Authentication & Authorization**:
  * Registration flows for Parents and Doctors.
  * OTP generation and verification for account verification.
  * Login with JWT (JSON Web Tokens) and Role-Based Access Control (RBAC) for `ADMIN`, `DOCTOR`, and `PARENT`.
* **User Management**:
  * Admin endpoints to approve/activate doctors (updating the `isActive` field based on `identityCard`).
  * Profile management for updating user details.
* **Child & Symptom Management**:
  * CRUD operations for Parents to manage their children's profiles and log symptoms over time.
* **Appointment System**:
  * Endpoints for Parents to search for nearby/available doctors (using Doctor `latitude`/`longitude`).
  * Booking system to create, reschedule, or cancel appointments.
  * Doctor endpoints to confirm or mark appointments as completed.
* **Assessments & Reports (Rapports)**:
  * Endpoints for recording assessment steps and symptom snapshots.
  * Doctor endpoints to create and update medical reports (`Rapports`) including diagnoses, medications, and exercises.
* **Contact Module**:
  * Endpoint to handle contact form submissions and store them in the database.

## 2. Frontend Development (Next.js)
Develop the user interface divided into role-specific portals:

* **Public Pages**:
  * Landing Page, About Us, Contact Us (linked to `Contact` model).
  * Registration and Login pages with OTP verification steps.
* **Parent Portal**:
  * **Dashboard**: Overview of upcoming appointments and recent reports.
  * **My Children**: Interface to add children, log new symptoms, and view assessment history.
  * **Find a Doctor**: Interactive map or list view to find doctors based on specialty and location.
  * **Appointments**: Manage booked appointments.
* **Doctor Portal**:
  * **Dashboard**: Daily schedule and pending appointment requests.
  * **Patient List**: View assigned children and their symptom histories.
  * **Assessments & Reports**: Forms to conduct step-by-step assessments and write detailed `Rapports`.
  * **Profile**: Manage specialty, location (map picker), and availability.
* **Admin Dashboard**:
  * User management interface.
  * Verification queue to review Doctor identity cards and toggle their `isActive` status.

## 3. Key Workflows to Implement

1. **Doctor Onboarding Workflow**:
   * Doctor registers -> Provides ID -> Admin reviews ID -> Admin sets `isActive = true` -> Doctor appears in search results and can receive appointments.
2. **Assessment & Diagnosis Workflow**:
   * Parent logs child symptoms -> Books appointment with Doctor -> Doctor conducts Assessment (saving symptom snapshots and steps) -> Doctor issues a Rapport with diagnosis, recommendations, and exercises -> Parent views Rapport.
3. **Location-based Search**:
   * Implement geospatial queries or distance calculations using Doctor `latitude`/`longitude` to help parents find nearby specialists.

## 4. Refinement & Technical Debt
* **Geospatial Indexing**: Add `2dsphere` index to the Doctor model if MongoDB geospatial queries will be used for location searches.
* **Validation**: Add Zod schemas to validate API request bodies against the Mongoose models.
* **Security**: Ensure strict authorization checks (e.g., parents can only access data for their own children, doctors can only access data for their confirmed patients).

## 5. Deployment Preparation
* Configure environment variables (.env) for DB URI, JWT secret, Email/SMS API keys for OTP.
* Run a final QA pass and deploy the Next.js application.
