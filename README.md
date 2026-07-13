# USTP Balubal ICT Management and Information System

Web-based ICT Management and Information System for USTP Balubal Campus,
built as a capstone project using Laravel 13, Inertia.js, React, and MySQL.

## Modules
- Service Request Management
- Job Order Management
- Inventory Management
- Defective Equipment Monitoring
- Incident Recording & User Liability
- Facility Booking (Computer Labs & AV Rooms)
- Email Notifications

## Tech Stack
- Backend: Laravel 13
- Frontend: React 19 + Inertia.js
- Database: MySQL
- Styling: Tailwind CSS + shadcn/ui

## Status
🚧 In development

## Design Decisions Log

- **Colors:** USTP official navy (#0C447C) and gold (#FAC775), per university brand guidelines
- **Registration:** Restricted to @ustp.edu.ph emails; Faculty/Staff and Student can self-register, ICT Admin accounts are created manually only
- **Roles:** Simple `roles` table (not full permission-based RBAC) per approved data dictionary
- **Job Order rating/feedback:** Added `rating` and `requester_comment` fields to support Chapter 1 Objective #6 (Launch & Evaluate)
- **Service Request form:** Structured as a multi-service checklist, matching the official FM-USTP-ICT-001 Job Request Form
- **Schema fixes applied:** Added `item_id` to Incident Report, removed duplicate attachment field, made Request Item optional, added `approved_by` to Booking
