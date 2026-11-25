# AquaCare Professional

### Community Water Quality Reporting and Awareness Portal

**Every Drop Matters. Every Report Makes a Difference.**

AquaCare Professional is a web-based platform designed to improve community water-quality awareness and simplify the reporting and tracking of water-related problems.

## Project Overview

The platform connects community members and authorised administrators through a centralized complaint management system. Users can register, submit water-quality complaints, receive unique Complaint IDs and monitor their complaint progress.

## Problem Statement

Water-quality concerns are often reported through disconnected communication channels. This can make complaint management, record maintenance and progress tracking difficult.

AquaCare addresses this problem through a centralized digital reporting and awareness platform.

## Objectives

- Develop a centralized water-quality complaint reporting system.
- Provide user registration and authentication.
- Generate unique Complaint IDs.
- Maintain individual complaint history.
- Enable complaint status tracking.
- Provide an administrator dashboard.
- Promote water-quality awareness.

## Key Features

### 1. Homepage and Water Awareness
- Information about common water-quality problems.
- Awareness about safe water storage and hygiene.
- Guidance on appropriate water-quality testing.

### 2. User Account Management
- New user registration.
- Email and password login.
- Personalized user profile.
- Personal complaint history.

### 3. Complaint Registration
Users can submit:
- Full name and contact details.
- Area or location.
- Water source.
- Type of water problem.
- Frequency of occurrence.
- Problem description.

### 4. Complaint Identification and Tracking
- Automatic generation of unique Complaint IDs.
- Storage of reported date and time.
- Search using Complaint ID.
- Status monitoring.

### 5. Admin Dashboard
- Authorised administrator login.
- View submitted complaints.
- Total, Pending, In Progress and Resolved statistics.
- Search and filter complaints.
- Update complaint status.
- Record last updated and resolution timestamps.

## Complaint Status Workflow

1. Pending – Complaint received.
2. In Progress – Complaint is being addressed.
3. Resolved – Complaint marked as resolved.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic |
| Firebase Authentication | User and admin authentication |
| Cloud Firestore | Cloud database |
| Git and GitHub | Version control and source-code hosting |
| GitHub Pages / Vercel | Website deployment |

## System Architecture

User / Administrator
        |
        v
Web Interface (HTML, CSS, JavaScript)
        |
        v
Application Logic
        |
        v
Firebase Authentication
        |
        v
Cloud Firestore
        |
        v
Complaint Management and Tracking

## Firebase Database Structure

- users – User profile information.
- users/{uid}/reports – Individual complaint history.
- complaints – Complete complaint information.
- publicTracking – Limited complaint tracking information.

Firestore Security Rules are used to restrict access to private user records and administrative operations.

## Project File Structure

```text
AquaCare-Professional/
|
|-- index.html
|-- style.css
|-- script.js
|-- firebase.js
|-- account.js
|-- report.html
|-- report.js
|-- admin.html
|-- admin.js
|-- track.html
|-- track.js
|-- README.md
```

## Installation and Setup

1. Clone the repository:

   git clone https://github.com/YOUR_USERNAME/AquaCare-Professional.git

2. Open the project folder in Visual Studio Code.

3. Ensure the Firebase project configuration is correctly set in firebase.js.

4. Enable Email/Password authentication in Firebase Authentication.

5. Configure the required Firestore security rules.

6. Open index.html using Visual Studio Code Live Server.

## Testing

The following functionalities are included in the project testing:

- User registration and login.
- Complaint form submission.
- Unique Complaint ID generation.
- Personal complaint history.
- Complaint tracking.
- Admin authentication.
- Dashboard statistics.
- Complaint status updates.
- Tracking status synchronization.

## Project Scope and Limitations

AquaCare provides digital reporting, awareness and complaint management. It does not independently detect contaminants, perform laboratory testing or automatically resolve physical water-quality problems.

## Future Enhancements

- IoT-based water-quality monitoring.
- GIS-based complaint mapping.
- Email and SMS notifications.
- Multilingual interface.
- Integration with authorised water-testing laboratories.
- Coordination with local water authorities.

## Conclusion

AquaCare Professional demonstrates how web technologies and cloud-based services can support community water-quality reporting and awareness.

By integrating user accounts, digital complaint registration, unique identification, complaint tracking and administrator management, the platform provides an organized approach to managing reported water-quality concerns.

## Project Information

**Project Name:** AquaCare Professional

**Project Title:** Community Water Quality Reporting and Awareness Portal

**Course:** Project-Based Learning (PBL)

**Programme:** B.E. – Computer Science and Engineering

**University:** Visvesvaraya Technological University (VTU)

**College:** [Enter College Name]

**Project Guide:** [Enter Guide Name]

**Team Members:**
- [Member 1 – Name and USN]
- [Member 2 – Name and USN]
- [Member 3 – Name and USN]
- [Member 4 – Name and USN]

---

**AquaCare Professional – Every Drop Matters. Every Report Makes a Difference.**
