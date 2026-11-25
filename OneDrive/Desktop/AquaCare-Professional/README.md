# AquaCare Professional

### Community Water Quality Reporting and Awareness Portal

**Every Drop Matters. Every Report Makes a Difference.**

AquaCare Professional is a web-based platform designed to help community members learn about common water-quality concerns, submit reports about suspected issues, and track the administrative progress of their complaints. It also provides an authenticated dashboard through which authorised administrators can review and manage submitted complaints.

> **Project type:** Project-Based Learning (PBL) – Third Year B.E.  
> **Department:** Computer Science and Engineering  
> **Institution:**  Vivekananda College of Engineering & Technology, Nehru nagar Puttur
> **Academic year:** 2026-27

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [How the System Works](#how-the-system-works)
- [System Architecture](#system-architecture)
- [Firestore Data Structure](#firestore-data-structure)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Configuration](#firebase-configuration)
- [Run Locally](#run-locally)
- [Deployment](#deployment)
- [Testing Checklist](#testing-checklist)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Team](#team)
- [Disclaimer](#disclaimer)

---

## Overview

Water-quality concerns can be difficult to communicate and follow up on when reports are handled through disconnected channels. AquaCare provides a central web interface for awareness, complaint registration, complaint identification, status tracking, and administrative management.

The website has separate user-facing and administrator-facing functions. Registered users can view their own complaint history, while authorised administrators can review submitted complaints and update their status.

## Problem Statement

Community members may observe water-quality concerns such as unusual colour, unpleasant smell, unusual taste, visible sediments, or suspected contamination. However, reporting these concerns and checking their progress can be difficult when information is not recorded in one organised system.

AquaCare addresses this challenge by providing a centralised digital platform for recording reports and viewing their administrative status.

## Objectives

1. Provide accessible information about common water-quality concerns and safe water practices.
2. Allow users to register, sign in, and access a personal profile.
3. Collect structured information when a user submits a water-quality complaint.
4. Generate a unique Complaint ID for each submitted report.
5. Save a user's Complaint IDs and reported date/time in their personal report history.
6. Allow users to check complaint progress using the Complaint ID.
7. Provide authorised administrators with tools to review complaints, view summary statistics, and update complaint status.

## Key Features

### Public website and awareness

- Homepage with project information and navigation.
- Awareness content covering unusual water colour, mud or sediments, bad or unusual smell, unusual taste, and suspected contamination.
- Basic information about safe storage, hygiene, water testing, and safer water sources.

### User account

- User registration with name, email address, phone number, and password.
- Email-and-password login and logout using Firebase Authentication.
- Personal profile information stored in Cloud Firestore.
- Personal complaint history containing Complaint IDs and reported timestamps.

### Complaint registration

- Structured form for contact details, location, water source, problem type, frequency, and description.
- Unique Complaint ID generated for each report.
- Complaint record, public tracking record, and user report-history record written to Firestore.

### Complaint tracking

- Search for an individual complaint using its Complaint ID.
- Display the current status and relevant report/update/resolution timestamps.
- Status values: **Pending**, **In Progress**, and **Resolved**.

### Administrator dashboard

- Administrator sign-in and access control.
- Complaint list with details and reported date/time.
- Summary counts for total, pending, in-progress, and resolved reports.
- Search and status filtering.
- Status update controls that synchronise the complaint and tracking records.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the website pages and forms |
| CSS3 | Layout, responsive styling, and visual design |
| JavaScript (ES modules) | Page interactions, application logic, and Firebase operations |
| Firebase Authentication | User and administrator authentication |
| Cloud Firestore | User profiles, complaint records, report history, and tracking data |
| Git and GitHub | Source-code version control and collaboration |
| GitHub Pages / Vercel | Static website hosting options |

## How the System Works

1. A visitor opens the AquaCare homepage and can explore water-awareness information.
2. A new user creates an account or an existing user signs in.
3. The signed-in user opens the complaint form and enters the required details.
4. The application generates a unique Complaint ID.
5. The complaint details, a limited tracking record, and the user's report-history entry are saved in Firestore.
6. The user can view the Complaint ID and reported date/time in **My Submitted Reports**.
7. The user can enter the Complaint ID on the tracking page to view its current status.
8. An authorised administrator signs in to the admin dashboard, reviews the complaint, and changes its status when appropriate.
9. The tracking record is updated so the user can check the latest administrative status.

### Complaint lifecycle

`Pending` → `In Progress` → `Resolved`

The status represents the progress recorded by the AquaCare administrator. It is not an independent verification that a physical water-quality problem has been corrected.

## System Architecture

```text
Community User                         Authorised Administrator
      |                                           |
      v                                           v
AquaCare Website                           Admin Dashboard
      |                                           |
      +---------------- JavaScript --------------+
                           |
                           v
                  Firebase Authentication
                           |
                           v
                     Cloud Firestore
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       users          complaints     publicTracking
   profile/reports   full report     limited status data
```

## Firestore Data Structure

The application uses the following collections and subcollections:

| Firestore path | Purpose | Typical data |
|---|---|---|
| `users/{uid}` | User profile | Name, email, phone, account timestamps |
| `users/{uid}/reports/{reportDocId}` | Private report history for that user | Complaint ID, reported timestamp |
| `complaints/{complaintDocId}` | Full complaint record | User ID, contact details, location, water source, problem, frequency, description, status, timestamps |
| `publicTracking/{complaintId}` | Limited tracking record | Complaint ID, complaint document ID, status, reported/updated/resolved timestamps |

The full complaint collection contains personal information and should remain protected by Firestore Security Rules. The public tracking record should contain only the minimum information needed to display an individual complaint's progress.

## Project Structure

The main files in the project are:

```text
AquaCare-Professional/
|
|-- index.html       # Homepage, awareness sections, and user account interface
|-- style.css        # Website styling and responsive layouts
|-- script.js        # Homepage navigation and interactions
|-- firebase.js      # Firebase app, Authentication, and Firestore setup
|
|-- account.js       # Registration, login, profile, and user report history
|
|-- report.html      # Water-quality complaint form
|-- report.js        # Complaint submission and Firestore writes
|
|-- track.html       # Complaint tracking interface
|-- track.js         # Complaint ID lookup and status display
|
|-- admin.html       # Administrator login and dashboard interface
|-- admin.js         # Admin authentication, complaint list, filters, and status updates
|
|-- README.md        # Project documentation
|-- .gitignore       # Files excluded from Git
```

If additional deployment configuration files are present, they may also be included in the repository.

## Getting Started

### Prerequisites

- A computer with Windows, macOS, or Linux.
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor.
- A modern web browser.
- A Firebase project with Authentication and Cloud Firestore enabled.
- [Git](https://git-scm.com/downloads).
- A local development server such as the VS Code Live Server extension.

### Clone the repository

Replace `YOUR_GITHUB_USERNAME` with the GitHub account that owns the repository:

```bash
git clone https://github.com/thrisha-rai-s/AquaCare-Professional.git
cd AquaCare-Professional
```

## Firebase Configuration

1. Open the Firebase Console: https://console.firebase.google.com/.
2. Select the AquaCare Firebase project or create a project for your own deployment.
3. Register a Web App in Firebase Project Settings and obtain its web-app configuration.
4. Add the configuration values to `firebase.js`.
5. Enable **Email/Password** under Firebase Authentication sign-in providers.
6. Create or open the Cloud Firestore database.
7. Publish Firestore Security Rules that match the application's user, complaint, and tracking data model.
8. Add the local and deployed website hostnames to Firebase Authentication's authorised domains when required.

The current source uses Firebase JavaScript SDK modules from Firebase CDN version `12.5.0`. Keep the SDK imports consistent across the project.

**Security notes:**

- Never commit service-account private keys, passwords, private API credentials, or `.env` secrets.
- Firebase web-app configuration is used by client-side applications; it does not replace Firestore Security Rules.
- Restrict full complaint records to the complaint owner and authorised administrator, as appropriate to the implemented rules.
- Users should only be able to read their own profile and report-history records.
- The current ID-based public tracking design allows someone who knows a Complaint ID to retrieve its limited tracking record. Use sufficiently unpredictable IDs and do not put personal details in `publicTracking`.
- Review and test all Firestore Rules before using real community data. The sample project is an academic prototype, not a certified public-service system.

## Run Locally

1. Open the cloned `AquaCare-Professional` folder in VS Code.
2. Confirm that `firebase.js` contains the correct Firebase web-app configuration.
3. Start the folder using the Live Server extension, or another static development server.
4. Open the local URL shown by the server, such as `http://127.0.0.1:5500/`.
5. Test the homepage and open `report.html`, `track.html`, and `admin.html` through the local server.

Do not open the HTML files directly with a `file:///` URL. JavaScript ES modules and Firebase web functionality should be tested through a local HTTP server.

## Deployment

### Option A: GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder if the HTML files are in the repository root.
5. Save and wait for the Pages deployment to complete.
6. Add the deployed hostname to Firebase Authentication's authorised domains if required.
7. Test registration, login, complaint submission, tracking, and admin operations on the published site.

The expected URL format is:

```text
https://thrisha-rai-s.github.io/AquaCare-Professional/
```

### Option B: Vercel

1. Import the GitHub repository into Vercel.
2. Select **Other** as the framework preset for this plain static site.
3. Use the repository root as the root directory when the HTML files are there.
4. Leave the build command empty and use `.` as the output directory for a root-based static project.
5. Deploy the site.
6. Add the Vercel hostname to Firebase Authentication's authorised domains if required.
7. Test all application flows on the deployed site.

## Testing Checklist

| Test case | Expected result |
|---|---|
| Open homepage | Main page and navigation load |
| User registration | Firebase Authentication creates the account |
| User login/logout | User can sign in and sign out |
| User profile | Profile information is displayed |
| Complaint submission | Complaint is saved in Firestore |
| Complaint ID | A unique ID is displayed after successful submission |
| User report history | The user's Complaint ID and reported date/time are displayed |
| Complaint tracking | The matching tracking record and status are displayed |
| Admin login | Only the configured admin account accesses the dashboard |
| Admin status update | Complaint and tracking status are updated |
| Resolution timestamp | Resolution date/time appears when status is set to Resolved |
| Responsive layout | Pages remain usable on mobile and desktop screens |

## Limitations

- AquaCare records user-reported concerns; it does not independently test or certify water quality.
- The system does not currently use IoT sensors to measure pH, turbidity, or other water parameters.
- Complaint resolution is an administrative status recorded in the system; it does not automatically confirm a physical repair or water-quality improvement.
- The current prototype does not automatically forward reports to government water departments.
- Public tracking is based on possession of the Complaint ID; it is not a second factor of identity verification.

## Future Enhancements

- IoT integration for water-quality sensor readings.
- GIS-based mapping of reported water concerns.
- Email or SMS notifications when complaint status changes.
- Regional-language support.
- Upload and display of verified laboratory test reports.
- Integration with authorised local water-supply departments.
- Stronger abuse prevention and enhanced account-recovery workflows.

## Team

**Project title:** AquaCare Professional  
**Project guide:** Prof.Rashmi P C  
**Team members:**

1. Poorvi Rai - 4VP25CS066
2. Shri Vaishnavi Alva - 4VP25CS094
3. Spandana A - 4VP25CS097
4. Thrisha Rai S - 4VP25CS108

**Institution:** Vivekananda College of Engineering & Technology, Nehru nagar Puttur 
**Department:** Computer Science and Engineering  
**University:** Visvesvaraya Technological University (VTU)

## Disclaimer

AquaCare Professional is an academic PBL prototype developed for educational demonstration. It is intended to support awareness and organise user-submitted water-quality concerns. It does not replace laboratory testing, professional public-health advice, or official reporting channels.
