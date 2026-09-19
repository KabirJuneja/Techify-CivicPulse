# 🏙️ NAGAR-X — Ahmedabad Civic Portal

<p align="center">   <strong>A Digital Civic Bridge Between Citizens and Ahmedabad</strong> </p>

<p align="center">
  Report • Connect • Participate • Improve
</p>

---

## 📖 About NAGAR-X

**NAGAR-X** is a modern civic engagement platform designed for the citizens of **Ahmedabad, Gujarat**.

The platform provides a centralized digital space where citizens can report civic problems, provide supporting evidence, participate in community activities, and stay connected with civic services.

NAGAR-X combines a modern web interface with cloud-based services and AI-assisted functionality to make civic issue reporting more accessible, structured, and transparent.

---

## 🎯 Purpose

The purpose of NAGAR-X is to simplify the connection between citizens and civic administration by providing a digital platform for:

* Reporting local civic issues
* Providing visual and voice-based evidence
* Tracking reported issues
* Supporting location-aware reporting
* Participating in civic activities
* Encouraging community involvement
* Organizing civic information in one platform

---

## ✨ Features

### 📝 Civic Issue Reporting

Citizens can report problems occurring in their local areas.

A civic report can contain:

* Issue title
* Issue category
* Ward information
* Location
* Detailed description
* Image evidence
* Voice evidence
* Anonymous reporting
* Issue status
* Resolution information

Supported issue categories include:

* Garbage & Waste
* Streetlights & Grid
* Roads & Potholes
* Water & Drainage
* Traffic & Signals
* Safety & Hazards

---

### 📸 AI-Powered Image Analysis

NAGAR-X uses AI-assisted visual analysis to examine images submitted as civic evidence.

The system can identify and classify visible civic problems and provide structured information such as:

* Detected issue
* Issue category
* Priority level
* Priority explanation
* Civic score
* Hazard detection
* Evidence assessment
* Relevant tags
* Estimated response time

This helps transform unstructured photographic evidence into useful civic information.

---

### 🎙️ Voice-Based Reporting

Citizens can provide civic complaints through voice recordings.

Voice input can be processed into structured text while identifying the language and possible civic issue type.

The system supports:

* English
* Hindi
* Gujarati

This makes reporting more convenient for users who prefer speaking rather than typing.

---

### 📍 Location-Aware Reporting

NAGAR-X supports location-based civic workflows.

Location information can be used to provide relevant geographic context for civic reports and services.

The application includes browser geolocation support for location-aware functionality.

---

### 🗺️ Civic Location Services

The platform integrates map and location services to support civic workflows across Ahmedabad.

Users can work with location-related information such as:

* Civic locations
* Landmarks
* Ward information
* Local service information
* Geographic context

---

### 👤 User Profiles

NAGAR-X supports different types of platform users.

User profiles can contain:

* Name
* Email
* Profile photo
* Phone number
* Ward
* City
* Role
* Civic points
* Report statistics
* Event participation
* Biography
* Preferred language

The supported roles are:

* **Citizen**
* **Official**
* **Admin**

---

### 🎯 Civic Points

The platform includes a civic participation points system.

Citizens can have a civic score associated with their account along with activity information such as:

* Number of reported issues
* Number of joined events
* Civic participation

This helps represent citizen engagement within the platform.

---

### 🤝 Civic Events

NAGAR-X provides a community events section for civic activities.

Events can include:

* Cleanliness drives
* Repair activities
* Plantation drives
* Public townhalls

Event information includes details such as:

* Event name
* Date and time
* Location
* Assembly point
* Ward
* Category
* Description
* Organizer
* Volunteer registrations

---

### 🔄 Issue Status Tracking

Civic issues follow a structured status workflow:

```text
Reported
    ↓
In-Progress
    ↓
Resolved
```

Resolution records can contain:

* Resolving officer
* Officer designation
* Officer squad
* Ward
* Resolution remarks
* Resolution proof
* After-resolution image
* Resolution time
* Resolution timestamp

---

## 🧠 AI Integration

NAGAR-X integrates Google's Gemini AI technology for civic-focused workflows.

AI functionality is used for:

* Civic image analysis
* Issue classification
* Priority identification
* Hazard detection
* Voice transcription
* Language identification
* Civic evidence analysis
* Location-aware information processing

The application is designed so that AI-assisted functionality works as part of the overall civic reporting workflow rather than as a separate standalone feature.

---

## 🏗️ Technology Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**
* **Leaflet**

### Backend

* **Node.js**
* **Express**
* **TypeScript**

### Cloud & Database

* **Firebase**
* **Firebase Authentication**
* **Cloud Firestore**

### AI & Location Services

* **Google Gemini**
* **Google GenAI SDK**
* **Google Maps**
* **Leaflet**

---

## 🗄️ Data Architecture

NAGAR-X uses Cloud Firestore to store application data.

The primary data collections are:

```text
users
tickets
events
```

### Users

Stores registered citizen and official profiles.

```text
/users/{userId}
```

### Tickets

Stores civic issues and complaints reported by citizens.

```text
/tickets/{ticketId}
```

### Events

Stores civic activities and community events.

```text
/events/{eventId}
```

---

## 📊 Civic Ticket Structure

A civic ticket contains information such as:

```text
Ticket
├── Title
├── Category
├── Ward
├── Location
├── Description
├── Status
├── Upvotes
├── Reporter
├── Anonymous Status
├── Image Evidence
├── Voice Transcript
├── Resolution Information
├── Resolution Proof
├── After Image
├── Created At
└── Updated At
```

---

## 📅 Event Structure

Civic events contain information such as:

```text
Event
├── Title
├── Date & Time
├── Location
├── Assembly Point
├── Ward
├── Category
├── Description
├── Organizer
├── Volunteer Count
├── Author
└── Created At
```

---

## 🔐 Authentication & Roles

NAGAR-X uses Firebase-based authentication and role-based user profiles.

### Citizen

Citizens can interact with civic services, report issues, participate in events, and maintain their civic profile.

### Official

Officials can work with civic information and issue resolution workflows according to their assigned permissions.

### Admin

Administrators have access to administrative functionality according to the application's configured authorization rules.

---

## 📂 Project Structure

```text
NAGAR-X/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   └── main.tsx
│
├── public/
│
├── server.ts
├── index.html
│
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
│
├── package.json
├── package-lock.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
│
├── .env.example
└── .gitignore
```

---

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

---

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd NAGAR-X
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a local `.env` file using `.env.example` as the reference.

```bash
cp .env.example .env
```

Add the required environment configuration locally.

> **Important:** Never commit your `.env` file or private credentials to GitHub.

The repository is configured to ignore environment files while keeping `.env.example` available as a safe configuration reference.

---

### 4. Start the Development Environment

```bash
npm run dev
```

The Vite development server will start the application locally.

---

## 🛠️ Available Commands

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development environment    |
| `npm run server`  | Start the application server         |
| `npm run build`   | Create a production build            |
| `npm run lint`    | Run TypeScript validation            |
| `npm run fastapi` | Start the configured FastAPI service |

---

## 🧪 Validation

To check the TypeScript project without generating output files:

```bash
npm run lint
```

To create the production build:

```bash
npm run build
```

---

## 🔒 Security

NAGAR-X uses environment-based configuration for sensitive credentials.

For local development:

* Keep `.env` private.
* Do not commit API keys.
* Do not expose private credentials in frontend source code.
* Keep Firebase security rules enabled.
* Use appropriate authentication and authorization for protected functionality.

The repository's `.gitignore` excludes environment files and generated build artifacts.

---

## 🌐 Application Information

**Project Name:** NAGAR-X Ahmedabad Civic Portal

**Location:** Ahmedabad, Gujarat, India

**Platform:** Web Application

**Primary Users:**

* Citizens
* Civic Officials
* Administrators

**Core Purpose:**

Digital civic issue reporting, community participation, and citizen–civic administration interaction.

---

## 🔄 Civic Reporting Workflow

```text
Citizen
   │
   ▼
Report an Issue
   │
   ├── Description
   ├── Location
   ├── Image
   └── Voice
   │
   ▼
Evidence Processing
   │
   ▼
Civic Issue Created
   │
   ▼
Reported
   │
   ▼
In-Progress
   │
   ▼
Resolved
   │
   ▼
Resolution Evidence
```

---

## 🌱 Community Engagement Workflow

```text
Discover Civic Event
        │
        ▼
View Event Details
        │
        ▼
Join / Register
        │
        ▼
Participate
        │
        ▼
Civic Contribution
```

---

## 🎨 Design Philosophy

NAGAR-X is designed around a simple principle:

> **Make civic participation easier, clearer, and more accessible.**

The platform combines:

* Clean user interfaces
* Structured civic information
* Visual evidence
* Voice interaction
* Location awareness
* AI-assisted processing
* Community participation

into a unified civic experience.

---

## 🏙️ NAGAR-X

### Report. Connect. Participate. Improve.

**NAGAR-X — Ahmedabad Civic Portal**

Built to create a stronger digital connection between **Ahmedabad's citizens and their city.** 🇮🇳
