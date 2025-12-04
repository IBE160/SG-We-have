import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-background-light font-display text-text-primary overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-x-0 top-0 h-[500px] -translate-y-1/2 transform opacity-60">
         <div className="absolute left-[20%] h-full w-[40%] rounded-full bg-accent-blue/20 blur-[100px]"></div>
         <div className="absolute right-[20%] h-full w-[40%] rounded-full bg-accent-purple/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-lg bg-accent-blue size-8 text-white">
                 <span className="material-symbols-outlined" style={{fontSize: '20px'}}>school</span>
              </div>
              <span className="text-xl font-bold tracking-tight">StudyTool</span>
           </div>
           <nav className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Log In</Link>
              <Link href="/register" className="rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">Sign Up</Link>
           </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-20">
           <div className="max-w-3xl mx-auto flex flex-col gap-6 items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white/50 px-3 py-1 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                </span>
                <span className="text-xs font-medium text-text-secondary">New: AI Quiz Generation</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
                 Master Your Studies <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">With AI Powers</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed">
                 Organize your notes, generate quizzes instantly, and track your progress. The all-in-one workspace for modern students.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
                 <Link href="/register" className="w-full sm:w-auto rounded-xl bg-accent-blue px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent-blue/25 hover:shadow-xl hover:shadow-accent-blue/30 hover:-translate-y-0.5 transition-all duration-200">
                    Get Started for Free
                 </Link>
                 <Link href="/login" className="w-full sm:w-auto rounded-xl bg-white border border-border-light px-8 py-4 text-base font-bold text-text-primary hover:bg-gray-50 transition-colors">
                    Live Demo
                 </Link>
              </div>
           </div>

           {/* Feature Cards Preview */}
           <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left px-4">
              {/* Card 1 */}
              <div className="rounded-2xl border border-border-light bg-white/60 p-6 backdrop-blur-md shadow-sm">
                 <div className="mb-4 inline-flex rounded-lg bg-accent-blue/10 p-3 text-accent-blue">
                    <span className="material-symbols-outlined">note_add</span>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Smart Notes</h3>
                 <p className="text-text-secondary text-sm">Capture ideas quickly with our rich text editor optimized for learning.</p>
              </div>
              {/* Card 2 */}
              <div className="rounded-2xl border border-border-light bg-white/60 p-6 backdrop-blur-md shadow-sm">
                 <div className="mb-4 inline-flex rounded-lg bg-accent-green/10 p-3 text-accent-green">
                    <span className="material-symbols-outlined">quiz</span>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Instant Quizzes</h3>
                 <p className="text-text-secondary text-sm">Turn your notes into practice quizzes automatically to test your knowledge.</p>
              </div>
               {/* Card 3 */}
              <div className="rounded-2xl border border-border-light bg-white/60 p-6 backdrop-blur-md shadow-sm">
                 <div className="mb-4 inline-flex rounded-lg bg-accent-purple/10 p-3 text-accent-purple">
                    <span className="material-symbols-outlined">school</span>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Course Management</h3>
                 <p className="text-text-secondary text-sm">Keep all your subjects organized in one beautiful dashboard.</p>
              </div>
           </div>
        </main>
        
        <footer className="py-8 text-center text-sm text-text-secondary">
           <p>© 2025 StudyTool. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}