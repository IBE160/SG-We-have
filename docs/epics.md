# ibe160 - Epic Breakdown

**Author:** (Your Name)
**Date:** mandag 3. november 2025
**Project Level:** 3
**Target Scale:** Complex system - subsystems, integrations, architectural decisions

---

## Overview

This document provides the detailed epic breakdown for ibe160, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

# Epic 0: Project Initialization & Environment Setup

**Goal:** Initialize the project repository and configure the development environments for both frontend and backend to enable parallel development.

**User Stories:**

### Story 0.1: Initialize Next.js Frontend
**As a** Developer
**I want to** initialize a Next.js project with Tailwind CSS
**So that** I have a modern foundation for building the user interface.

**Acceptance Criteria:**
- [ ] Next.js project created using `create-next-app`
- [ ] Tailwind CSS configured and working
- [ ] Project structure follows best practices (app directory)
- [ ] Application runs locally on port 3000

### Story 0.2: Initialize FastAPI Backend
**As a** Developer
**I want to** set up a Python FastAPI project structure
**So that** I can build high-performance API endpoints.

**Acceptance Criteria:**
- [ ] Python environment set up (virtualenv/poetry)
- [ ] FastAPI installed
- [ ] Basic directory structure created (app, api, core, etc.)
- [ ] "Hello World" endpoint working on localhost:8000

### Story 0.3: Configure Supabase Connection
**As a** Developer
**I want to** set up the Supabase client in both frontend and backend
**So that** the application can interact with the database and auth services.

**Acceptance Criteria:**
- [ ] Supabase project created (or instructions to connect to one)
- [ ] Environment variables configured (.env)
- [ ] Database connection verified from Backend
- [ ] Auth client initialized in Frontend

### Story 0.4: Repository Structure & CI/CD Prep
**As a** DevOps Engineer
**I want to** organize the repository
**So that** frontend and backend code are manageable in a single repo (monorepo style) or cleanly separated.

**Acceptance Criteria:**
- [ ] Root directory contains clear `frontend/` and `backend/` folders (or equivalent)
- [ ] .gitignore configured for both Node and Python artifacts
- [ ] README.md updated with setup instructions

## Epic 1: User Foundation & Course Management

**Expanded Goal:** To provide a secure and intuitive entry point for users, allowing them to register, log in, and establish their academic structure by creating and managing courses and associated lectures.

**Story Breakdown:**

*   **Story 1.1: User Registration**
    *   As a new student, I want to create an account, so that I can access the application's features.
    *   **Acceptance Criteria:**
        1.  User can provide a unique username and password.
        2.  System validates input and creates a new user account.
        3.  User receives confirmation of successful registration.
        *Fulfills: FR001*
*   **Story 1.2: User Login & Logout**
    *   As a registered student, I want to securely log in and out, so that I can access my personalized study environment.
    *   **Acceptance Criteria:**
        1.  User can enter credentials to log in.
        2.  System authenticates user and grants access.
        3.  User can log out from any page.
        *Fulfills: FR001*
*   **Story 1.3: Create New Course**
    *   As a student, I want to create new courses, so that I can organize my study materials by subject.
    *   **Acceptance Criteria:**
        1.  User can input a course name.
        2.  System creates a new course associated with the user.
        3.  User sees the new course listed on their dashboard.
        *Fulfills: FR002*
*   **Story 1.4: View Course List**
    *   As a student, I want to view a list of all my created courses, so that I can easily navigate to a specific course.
    *   **Acceptance Criteria:**
        1.  Dashboard displays all courses created by the user.
        2.  Each course entry is clickable and leads to the course details page.
        *Fulfills: FR002*
*   **Story 1.5: Add Lecture to Course**
    *   As a student, I want to add lectures under a specific course, so that I can organize my notes within each subject.
    *   **Acceptance Criteria:**
        1.  User can add a new lecture entry within a selected course.
        2.  System associates the lecture with the course.
        3.  User sees the new lecture listed under the course.
        *Fulfills: FR003*

## Epic 2: Core Note-Taking Experience

**Expanded Goal:** To provide students with a functional and intuitive rich text editor for capturing and managing their lecture notes, ensuring essential formatting capabilities and reliable persistence.

**Story Breakdown:**

*   **Story 2.1: Access Note Editor**
    *   As a student, I want to access a note-taking editor for a specific lecture, so that I can begin writing my notes.
    *   **Acceptance Criteria:**
        1.  Clicking on a lecture entry opens the note editor.
        2.  Editor is pre-populated if notes already exist for that lecture.
        *Fulfills: FR004*
*   **Story 2.2: Basic Text Formatting**
    *   As a student, I want to use basic formatting tools (bold, italic, lists, headings) in the note editor, so that I can structure and highlight important information in my notes.
    *   **Acceptance Criteria:**
        1.  Editor provides buttons/shortcuts for bold, italic, numbered lists, bullet lists, H1, H2, H3.
        2.  Text formatting is applied correctly.
        *Fulfills: FR005*
*   **Story 2.3: Save Lecture Notes**
    *   As a student, I want to save my lecture notes, so that my work is preserved and I can access it later.
    *   **Acceptance Criteria:**
        1.  User can click a "Save" button.
        2.  Notes content is persistently stored.
        3.  System displays a confirmation of successful save.
        *Fulfills: FR004*
*   **Story 2.4: Auto-Timestamp Notes**
    *   As a student, I want my saved notes to be automatically timestamped, so that I can easily track when I last updated them.
    *   **Acceptance Criteria:**
        1.  Upon saving, a timestamp (date and time) is associated with the notes.
        2.  The timestamp is visible to the user.
        *Fulfills: FR004*

## Epic 3: AI-Powered Quiz Generation

**Expanded Goal:** To integrate an AI system capable of generating accurate, relevant, and configurable multiple-choice quizzes directly from a student's notes, enhancing their ability to self-assess and learn.

**Story Breakdown:**

*   **Story 3.1: Initiate Quiz Generation**
    *   As a student, I want to initiate quiz generation from my lecture notes, so that I can create practice questions.
    *   **Acceptance Criteria:**
        1.  A "Generate Quiz" button is available on lecture overview pages.
        2.  Clicking the button opens a quiz configuration interface.
        *Fulfills: FR019*
*   **Story 3.2: Select Lectures for Quiz**
    *   As a student, I want to select specific lectures to include in a quiz, so that I can focus on particular topics.
    *   **Acceptance Criteria:**
        1.  Quiz configuration interface allows selection of one or more lectures.
        2.  Only lectures with saved notes are selectable.
        *Fulfills: FR006*
*   **Story 3.3: Configure Quiz Length**
    *   As a student, I want to choose the number of questions for my quiz, so that I can control the duration of my practice session.
    *   **Acceptance Criteria:**
        1.  Quiz configuration interface offers options for 5, 10, 15, 20, 25, or 30 questions.
        2.  System generates a quiz with the selected number of questions.
        *Fulfills: FR007*
*   **Story 3.4: AI Generates Multiple-Choice Questions**
    *   As a student, I want the AI to generate multiple-choice questions from my notes, so that I can test my understanding of the material.
    *   **Acceptance Criteria:**
        1.  AI processes selected notes and generates questions in multiple-choice format.
        2.  Questions are relevant to the content of the notes.
        3.  Each question has one correct answer and several plausible distractors.
        *Fulfills: FR006, FR008, FR010, FR018*
*   **Story 3.5: AI Fact-Checking for Accuracy**
    *   As a student, I want the AI to fact-check questions and answers against external sources, so that I can trust the accuracy of the quiz content.
    *   **Acceptance Criteria:**
        1.  AI integrates with external knowledge sources during quiz generation.
        2.  Generated questions and answers are factually correct.
        *Fulfills: FR009*

## Epic 4: Interactive Quiz Experience

**Expanded Goal:** To provide an intuitive and engaging quiz-taking interface that offers immediate feedback, tracks progress, and encourages further learning and practice.

**Story Breakdown:**

*   **Story 4.1: Display Single Question**
    *   As a student, I want to see one quiz question at a time, so that I can focus on answering it without distraction.
    *   **Acceptance Criteria:**
        1.  Quiz interface displays one question and its answer options clearly.
        2.  Navigation controls (e.g., "Next Question") are present.
        *Fulfills: FR011*
*   **Story 4.2: Immediate Answer Feedback**
    *   As a student, I want to receive immediate feedback on my answer choice, so that I can learn from my mistakes instantly.
    *   **Acceptance Criteria:**
        1.  Upon selecting an answer, the correct option is highlighted green and incorrect options red.
        2.  Feedback is displayed clearly (e.g., "Correct!" or "Incorrect, the correct answer was...").
        *Fulfills: FR012*
*   **Story 4.3: Quiz Progress Tracking**
    *   As a student, I want to see my progress through the quiz, so that I know how many questions are remaining.
    *   **Acceptance Criteria:**
        1.  A progress bar or question counter (e.g., "3/10") is visible during the quiz.
        *Fulfills: FR015*
*   **Story 4.4: Final Score Summary**
    *   As a student, I want to see a summary of my performance after completing a quiz, so that I can assess my understanding.
    *   **Acceptance Criteria:**
        1.  Upon quiz completion, a screen displays the total score (e.g., "8/10 correct").
        2.  Options to review answers or retake the quiz are presented.
        *Fulfills: FR013*
*   **Story 4.5: Retake/New Quiz Options**
    *   As a student, I want options to retake the same quiz or generate a new one from the same notes, so that I can continue practicing effectively.
    *   **Acceptance Criteria:**
        1.  After completing a quiz, buttons for "Retake same quiz" and "Generate new quiz" are available.
        2.  Clicking "Retake same quiz" starts a new quiz with the identical questions.
        3.  Clicking "Generate new quiz" starts a new quiz with different questions from the same source notes.
        *Fulfills: FR014*

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.
