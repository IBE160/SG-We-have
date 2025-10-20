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

- User sign up & login. 

- Course and lectures overview. 

- Text input for typing notes with formatting toolbar. 

- AI study buddy that can generate multiple-choice quizes from input text. (Both for single-lectures and whole courses, in JSON format) 

- Timestamps when creating new notes. 

 

**Nice to Have (Optional Extensions)** 

- To-do list 

- PDF and Powerpoint uploads 

- Flashcards 

- Sharing-feature to share quizes with others


### Data Requirements 

- Username & Password 

- Multiple-choice tests 

- Text input  

- Course name 

- Lecture with timestamp 


### User Flows 

#### Flow 1: Student taking notes
  Entry point: Create user/login page

  1. Create user/login page
     - Student views fist page with login and create user options
     - Clicks "Create a user"
  2. Create user
     - If not registered already: Student creates a username and sets a password
     - Clicks "Confirm"
  3. Home page
      - Student sees the home page
      - Clicks "create course" button
      - Student types in course name
      - Clicks "Confirm"
  4. Course overview page
      - Student enters the course page
      - Clicks "Take notes" button
  5. Taking notes
      - Student sees a text box
      - Types in notes during lecture
      - When finished: Clicks "Save" 
      - Student sees a time-stamp appears from when the file was saved.
  6. Return to course overview
      -  Student arrives back on course overview page
      -  Student sees a overview with the lecture they just took notes from
      -  Clicks "Generate quiz" button
      -  Student chooses which lectures to be included in the quiz
      -  Student chooses how many questions they want to have in the quiz from options 10, 15, 20, 25 or 30.
      -  Clicks "Go to quiz"
  7. Multiple-choice quiz
      -  Student starts the generated quiz and is represented with one question at the time with four buttons with an option for answer each.
      -  Student clicks one of the four options, the correct answer is highlighted in green and the wrong answers are highlighted in red
      -  When quiz is finished: Student gets a score of how many correct answers they had out of total questions. 

### Technical Constraints 

- Must work in a browser on desktop. 

- Must support user authentication. 

- Use SUPABASE database for user registration and login. 

- Use AI to generate multiple-choice test in JSON format.

- Next.js and tailwind for frontend. 

- Python, AI-model, FAST API and SUPABASE database for backend. 

 

### Success Criteria 

- Users can create and manage their courses and lectures. 

- Text input is stored in the database. 

- User can recieve multiple-choice quizes based on their notes from a single lecture or a full course, when requested. 

 

### Project timeline and milestones 

Week 42: Update and improve proposal 

Week 43: Phase 1 and 2. - Analyze + plan 

Week 44: Phase 3 Solution architecture (architect + ux/ui designer) - Setup next.js and tailwind environment 

Week 45: Phase 3 Solution architecture (architect + ux/ui designer) - FastAPI and Supabase, AI Integration 

Week 46: Phase 4 Implementation and testing 

Week 47: Phase 4 Implementation: Polishing and final touches 

 

 