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

 

### User Stories 

When a user accesses the website, they are greeted by a homepage displaying an overview of their existing courses, along with an option to create a new one. Upon selecting “Create a New Course,” the user is presented with an interface that includes a button to add new lectures. Each lecture allows the user to input their notes into a text box, where they can paste or write content from their lectures. Once the notes are complete, the user can save them and use an integrated AI feature to automatically generate a quiz based on the lecture content. 

Additionally, from the course overview page, users can choose to generate a comprehensive quiz that combines questions from all lectures or chosen lectures within a course, or alternatively, create individual quizzes for each lecture. 

 

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

 

 