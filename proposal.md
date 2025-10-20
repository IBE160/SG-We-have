### Case Title 

Student helper website 

### Background 

Students often use one website for taking notes and a different site for creating quizes based on their notes. 

### Purpose 

The purpose is to help students take notes during their lectures and generate multiple-choice quizes to practice, and to have both features in the same website. 

### Target Users 

Motivated students who want to take notes and practice for exams, without using multiple websites and/or tools. 


### Core Functionality 

**Must Have (MVP)** 

1. User Authentication
   - Sign up, login, and logout functionality.

2. Course and lecture management
   - Create and view courses.
   - Add lectures under each course.

3. Note-taking interface
   - Rich text editor with basic formatting tools (font types, bold, italic, lists, etc.).

4. AI study buddy
   - AI system that generates multiple-choice quizzes (in JSON format) based on individual leture notes or full course content.
   - Configurable length (5, 10, 15, 20, 25 or 30 questions).
  
5. Quiz interface
   - One question displayed at a time.
   - Immediate feedback on answers (correct = green, incorrect = red).
   - Final score summary upon quiz completion.

 
**Nice to Have (Optional Extensions)** 

- To-do list: Task manager for each course.

- File uploads: Import lecture materials from PDF or Powerpoint.

- Flashcards: Generate and review flashcards from notes.

- Sharing feature: Share quizzes or flashcards with other users.


### Data Requirements 

- User data: Username and password (securely stored).

- Course data: Course name, list of lectures.

- Lecture data: Lecture notes text, timestamps.

- Quiz data: AI-generated multiple-choice quizzes in JSON format.


### User Flow

  Entry point: Create user/login page

  1. Create user/login page
     - Student views fist page with login and create user options.
     - Clicks "Create a user".
  2. Create user
     - If not registered already: Student creates a username and sets a password.
     - Clicks "Confirm" button.
  3. Home page
      - Student sees the home page.
      - Clicks "create course" button.
      - Student types in course name.
      - Clicks "Confirm".
  4. Course overview page
      - Student enters the course page.
      - Clicks "Take notes" button.
  5. Taking notes
      - Student sees a text box.
      - Types in notes during lecture.
      - When finished: Clicks "Save".
      - Student sees a time-stamp appears from when the file was saved.
  6. Quiz generation
      -  Student arrives back on course overview page.
      -  Student sees a overview with the lecture they just took notes from.
      -  Clicks "Generate quiz" button.
      -  Student chooses which lectures to be included in the quiz.
      -  Student chooses how many questions they want to have in the quiz from options (5 to 30 questions).
      -  Clicks "Go to quiz" button.
  7. Quiz interaction
      -  Student starts the generated quiz and is represented with one question at the time with four buttons with an option for answer each.
      -  Student clicks one of the four options, the correct answer is highlighted in green and the wrong answers are highlighted in red.
      -  When quiz is finished: Student gets a score of how many correct answers they had out of total questions. 
  8. Quiz overview
      - Student goes to front page.
      - Clicks button "Your quizzes".
      - Student can view all generated quizzes.


### Technical Constraints 

- Runs in a browser on desktop (responsive web app).
- Frontend: Next.js and Tailwind CSS.
- Backend: FastAPI (Python) + Supabase for authentication and data storage.
- AI-Integration: Google Gemini Pro 2.5 for multiple-choice quiz generation.
- Database: Supabase for users, notes, and quiz data.


### Success Criteria 

- Users can sign up, log in, and manage courses and lectures.

- Notes are stored, timestamped, and retrievable.

- AI Generates accurate multiple-choice quizzes from notes.

- Quizzes are interactive, scored, and visually clear.


### Project timeline and milestones 

Week 42: Update and improve proposal 

Week 43: Phase 1 and 2. - Analyze + plan 

Week 44: Phase 3 Solution architecture (architect + ux/ui designer) - Setup next.js and tailwind environment 

Week 45: Phase 3 Solution architecture (architect + ux/ui designer) - FastAPI and Supabase, AI Integration 

Week 46: Phase 4 Implementation and testing 

Week 47: Phase 4 Implementation: Polishing and final touches 


### Expected outcome

By the end of the project, students will be able to:
- Seamlessly take notes and generate quizzes in one place.
- Review their notes interactively through AI-generated quizzes.
- Save time and improve study efficiency through a unified academic tool.