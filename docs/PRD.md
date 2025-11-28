# ibe160 Product Requirements Document (PRD)

**Author:** (Your Name)
**Date:** mandag 3. november 2025
**Project Level:** 3
**Target Scale:** Complex system - subsystems, integrations, architectural decisions

---

## Goals and Background Context

### Goals

*   Enable users to seamlessly create accounts, log in, and manage their courses and notes.
*   Ensure the AI generates accurate, relevant, and pedagogically sound multiple-choice quizzes from user notes.
*   Provide an interactive quiz interface with clear feedback and accurate scoring.
*   Deliver a fast, reliable, and positive user experience.
*   Address the challenges faced by motivated university students by providing a unified tool for note-taking and quiz generation.
*   Validate the core problem of fragmented study tools and inform product feature prioritization.

### Background Context

Motivated university students frequently struggle with fragmented study processes, often resorting to multiple disparate tools for note-taking and quiz generation. This leads to scattered information, inefficient study habits, and a hindrance to effective exam preparation. Research indicates a strong demand for a unified solution that integrates these functionalities, driven by student frustration with existing inefficiencies. The core challenge lies in overcoming student inertia towards new tools, necessitating an MVP with irresistibly practical features from day one, particularly focusing on highly accurate and relevant AI-generated quizzes and a robust note-taking interface. This project aims to consolidate the learning process into a single, intuitive web-based platform.

---

## Requirements

### Functional Requirements

*   FR001: User Authentication: The system shall provide sign-up, login, and logout functionality for users.
*   FR002: Course Management: The system shall allow users to create and view courses.
*   FR003: Lecture Management: The system shall allow users to add lectures under each course.
*   FR004: Note-taking Interface: The system shall provide a rich text editor for taking notes.
*   FR005: Note-taking Formatting: The rich text editor shall include essential formatting tools such as bold, italic, number list, bullet list, and headings (h1, h2, h3), font size, and font type.
*   FR006: AI Quiz Generation: The system shall generate multiple-choice quizzes based on individual lecture notes or full course content.
*   FR007: Configurable Quiz Length: The system shall allow users to configure the quiz length (5, 10, 15, 20, 25, or 30 questions).
*   FR008: Quiz Quality: AI-generated quizzes shall be relevant, understandable, honest, supportive, straight to the point, and fact-based.
*   FR009: AI Accuracy: The AI shall fact-check online and use context-relevant online information to ensure questions are accurate and contextually sound.
*   FR010: Question Types: AI-generated quizzes shall focus on definitions, application, and comparison question types.
*   FR011: Quiz Interface Display: The quiz interface shall display one question at a time.
*   FR012: Immediate Feedback: The system shall provide immediate feedback on answers (correct = green, incorrect = red).
*   FR013: Final Score Summary: The system shall display a final score summary upon quiz completion.
*   FR014: Post-Quiz Options: The system shall provide options to "Retake same quiz" or "Generate new quiz from same notes" after quiz completion.
*   FR015: Quiz Progress Bar: The quiz interface shall include a progress bar for user orientation.
*   FR016: Micro-learning: The system shall offer a "Want to learn more?" option with 1-3 factual sentences for correct answers.
*   FR017: Skip Question: The system shall allow users to skip irrelevant questions without affecting the score.
*   FR018: AI Robustness: The AI must generate quizzes effectively from free-form notes, minimizing student effort in structuring.
*   FR019: Seamless Quiz Connection: The system shall provide clear "Generate Quiz" buttons on both single lecture page and lecture notes overview page.

### Non-Functional Requirements

*   NFR001: Reliability and Availability: The application must consistently function as expected for note-taking and quiz generation.
*   NFR002: Security and Compliance: The system shall ensure secure handling and storage of user data (notes, credentials).
*   NFR003: Maintainability and Developer Experience: The system should be easy to maintain and extend.
*   NFR004: Scalability: The system shall be designed to accommodate a growing number of users and data.
*   NFR005: Performance: The application shall be as performative as possible, ensuring a responsive user experience.


---

## User Journeys

### User Journey 1: New User Onboarding and First Note-Taking Session

**Persona:** Focused Fiona (motivated university student)

**Scenario:** Fiona, a new user, wants to start organizing her study materials and needs to capture notes from a recent lecture.

1.  **Action:** Fiona navigates to the application's homepage.
2.  **Action:** She clicks on the "Sign Up" option.
3.  **Action:** She enters her desired username and a secure password.
4.  **Action:** She successfully creates her account and is redirected to the login page.
5.  **Action:** She logs in with her new credentials.
6.  **Action:** Upon successful login, she sees a dashboard or home page.
7.  **Action:** She clicks the "Create Course" button.
8.  **Action:** She inputs "Distributed Systems" as the course name and confirms.
9.  **Action:** She navigates to the newly created "Distributed Systems" course page.
10. **Action:** She clicks on the "Take Notes" button for a new lecture.
11. **Action:** She uses the rich text editor to input her notes for "Lecture 1: Introduction to Distributed Systems."
12. **Action:** After completing her notes, she clicks "Save."
13. **Outcome:** Her notes are successfully saved and timestamped within the "Distributed Systems" course.

### User Journey 2: Generating and Taking a Quiz

**Persona:** Focused Fiona (motivated university student)

**Scenario:** Fiona wants to test her knowledge on a recently studied topic using a quiz generated from her notes.

1.  **Action:** Fiona is on the "Distributed Systems" course overview page, where her saved notes for "Lecture 1" are visible.
2.  **Action:** She locates and clicks the "Generate Quiz" button associated with "Lecture 1."
3.  **Action:** A modal or section appears, prompting her to select lectures (only "Lecture 1" is available) and choose a quiz length.
4.  **Action:** She selects "Lecture 1" and chooses an option for a 10-question quiz.
5.  **Action:** She clicks the "Go to Quiz" button.
6.  **Action:** The quiz interface loads, displaying the first question.
7.  **Action:** For each question, Fiona selects an answer and receives immediate feedback (green for correct, red for incorrect).
8.  **Action:** Fiona completes all 10 questions of the quiz.
9.  **Outcome:** A final score summary is displayed, showing her performance.
10. **Action:** She sees options to "Retake same quiz" or "Generate new quiz from same notes," and she chooses "Retake same quiz."
11. **Outcome:** A new quiz, based on the same parameters, begins.

---

## UX Design Principles

*   **Simplicity and Intuitiveness:** The application should be easy to learn and use, minimizing complexity for students.
*   **Efficiency:** The design should enable users to complete tasks (note-taking, quiz generation, quiz taking) quickly and with minimal effort.
*   **Feedback-Rich Interactions:** Provide clear and immediate feedback to users, especially during quizzes and data entry.
*   **Consistency:** Maintain a consistent look, feel, and behavior across all features and screens.

---

## User Interface Design Goals

*   **Target Platform:** Responsive web application for desktop browsers.
*   **Core Screens/Views:** User Authentication (Login, Sign-up), Home/Dashboard (overview of courses), Course Management (create/view courses), Lecture Management (add/view lectures within a course), Note-Taking Editor, Quiz Generation Interface (selection of lectures, quiz length), Interactive Quiz Interface (question display, feedback, score), Quiz Overview (historical quizzes).
*   **Key Interaction Patterns:** Form submission, button clicks for navigation and actions, text input, rich text editing, multiple-choice selection.
*   **Design Constraints:** Frontend built with Next.js and styled with Tailwind CSS; must adapt to various desktop screen sizes and resolutions; adherence to modern, clean UI principles.

---

## Epic List

*   **Epic 0: Project Initialization & Environment Setup**
    *   Goal: Initialize the project repository and configure the development environments for both frontend and backend to enable parallel development.
    *   Estimated story count: 4 stories
*   **Epic 1: User Foundation & Course Management**
    *   Goal: Establish user accounts and enable basic course and lecture organization.
    *   Estimated story count: 5-7 stories
*   **Epic 2: Core Note-Taking Experience**
    *   Goal: Provide a robust rich text editor for students to take and save notes.
    *   Estimated story count: 5-7 stories
*   **Epic 3: AI-Powered Quiz Generation**
    *   Goal: Enable the generation of accurate and configurable quizzes from user notes.
    *   Estimated story count: 5-7 stories
*   **Epic 4: Interactive Quiz Experience**
    *   Goal: Deliver an engaging and feedback-rich interface for students to take and review quizzes.
    *   Estimated story count: 5-7 stories

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

*   To-do list/task manager for each course.
*   File uploads (PDF, PowerPoint) for inclusion in quiz generation.
*   Flashcard generation.
*   Sharing quizzes and flashcards with other users.
*   Smart Note Templating with Auto-structuring.
*   On-the-Fly AI Key Point Extraction/Summary.
*   Seamless Group Study Integration (Shared Note Sections/Quiz Pools).
