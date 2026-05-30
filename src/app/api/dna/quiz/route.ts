import { NextResponse } from 'next/server'

// The 20 DNA quiz questions per spec
const DNA_QUESTIONS = [
  {
    id: 1,
    q: "Your team just inherited a messy legacy codebase. What's your first move?",
    options: [
      { text: "Start running it, break things, understand through failure.", scores: { Maker: 2 } },
      { text: "Map the entire architecture — draw diagrams, trace dependencies, then plan.", scores: { Architect: 2 } },
      { text: "Google every unfamiliar pattern, read the original commit messages.", scores: { Scholar: 1, Explorer: 1 } },
      { text: "Gather the original team, understand the intent before touching anything.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 2,
    q: "You have a free weekend with no obligations. What do you build?",
    options: [
      { text: "A working app — something live, users can interact with by Sunday.", scores: { Maker: 2 } },
      { text: "A system I've always wanted to design properly — clean interfaces, solid contracts.", scores: { Architect: 2 } },
      { text: "Whatever catches my eye — maybe a new language, a weird protocol, or a retro API.", scores: { Explorer: 2 } },
      { text: "Nothing new — I refactor something old until it's genuinely beautiful.", scores: { Craftsman: 2 } },
    ],
  },
  {
    id: 3,
    q: "What is your relationship with code reviews?",
    options: [
      { text: "I give detailed, almost line-by-line feedback. Quality is moral.", scores: { Craftsman: 2 } },
      { text: "I focus on architecture: Is this scalable? Will this break in 6 months?", scores: { Architect: 1, Scholar: 1 } },
      { text: "I approve fast if it works. Iteration beats perfection.", scores: { Maker: 2 } },
      { text: "I treat it as a teaching moment — I explain the 'why' not just the 'what'.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 4,
    q: "A new paper drops: 'Transformer-Free Architecture Beats GPT-4 on Reasoning Benchmarks.' Your reaction?",
    options: [
      { text: "Open the abstract, skim results, and replicate the benchmark by midnight.", scores: { Scholar: 2 } },
      { text: "Fork the repo and start hacking immediately — production be damned.", scores: { Explorer: 1, Maker: 1 } },
      { text: "Share it with your team with a 3-bullet summary of why it matters.", scores: { Catalyst: 2 } },
      { text: "Bookmark it. Wait for someone smarter to validate it first.", scores: { Scholar: 1, Architect: 1 } },
    ],
  },
  {
    id: 5,
    q: "You're three hours into a hackathon. The original idea isn't working. What happens?",
    options: [
      { text: "Pivot immediately. Ship something simpler that works.", scores: { Maker: 2 } },
      { text: "Diagnose why it failed before any pivot — maybe it's solvable.", scores: { Architect: 1, Scholar: 1 } },
      { text: "Get the team aligned. No pivot without shared clarity.", scores: { Catalyst: 2 } },
      { text: "The pivot is the fun part — now we can try the crazy idea.", scores: { Explorer: 2 } },
    ],
  },
  {
    id: 6,
    q: "How do you feel about documentation?",
    options: [
      { text: "I write docs before I write code. The interface is the spec.", scores: { Architect: 2 } },
      { text: "I write docs after — they're a changelog, not a blueprint.", scores: { Maker: 1, Craftsman: 1 } },
      { text: "I read docs obsessively — edge cases live there.", scores: { Scholar: 2 } },
      { text: "I document so others don't get stuck where I did.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 7,
    q: "A junior dev on your team is consistently writing slow, unreadable code. What do you do?",
    options: [
      { text: "Sit down and pair-program with them — show, don't tell.", scores: { Catalyst: 2 } },
      { text: "Leave detailed code review comments with references and examples.", scores: { Scholar: 1, Craftsman: 1 } },
      { text: "Assign them a refactoring task on existing code — best way to learn.", scores: { Maker: 1, Craftsman: 1 } },
      { text: "Redesign the system so it's harder to write bad code in the first place.", scores: { Architect: 2 } },
    ],
  },
  {
    id: 8,
    q: "What does 'done' mean to you?",
    options: [
      { text: "It works. Users can use it. Ship it.", scores: { Maker: 2 } },
      { text: "It's tested, documented, and I wouldn't be embarrassed if anyone read the code.", scores: { Craftsman: 2 } },
      { text: "It's extensible, well-architected, and won't require major surgery in 6 months.", scores: { Architect: 2 } },
      { text: "There's no 'done' — only current best version. Always more to learn.", scores: { Explorer: 1, Scholar: 1 } },
    ],
  },
  {
    id: 9,
    q: "The team is deadlocked on a tech stack decision. What's your move?",
    options: [
      { text: "Build two quick prototypes in each stack and let the data decide.", scores: { Maker: 2 } },
      { text: "Facilitate a structured discussion and drive toward consensus.", scores: { Catalyst: 2 } },
      { text: "Write a technical decision doc — pros/cons, tradeoffs, long-term implications.", scores: { Architect: 1, Scholar: 1 } },
      { text: "Pick the stack I've been meaning to learn. Disagreements are exploration opportunities.", scores: { Explorer: 2 } },
    ],
  },
  {
    id: 10,
    q: "What's your personal definition of great code?",
    options: [
      { text: "Code that solves real problems for real users, fast.", scores: { Maker: 2 } },
      { text: "Code so clean it reads like prose — any dev can understand it in one pass.", scores: { Craftsman: 2 } },
      { text: "Code that holds up under scale, failure, and future requirements.", scores: { Architect: 2 } },
      { text: "Code that reveals something new about the problem, or the medium itself.", scores: { Scholar: 1, Explorer: 1 } },
    ],
  },
  {
    id: 11,
    q: "How do you typically start a new project?",
    options: [
      { text: "Spin up a repo and start writing — I learn what I'm building by building it.", scores: { Maker: 2 } },
      { text: "Define the data model and API contracts first, then build.", scores: { Architect: 2 } },
      { text: "Research what others have done, find inspiration, then diverge.", scores: { Scholar: 1, Explorer: 1 } },
      { text: "Talk to potential users. No line of code before I understand the problem.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 12,
    q: "Your most-used browser tab during coding is:",
    options: [
      { text: "Stack Overflow / GitHub Issues — solving immediate blockers.", scores: { Maker: 2 } },
      { text: "Architecture diagrams, system design docs, or RFCs.", scores: { Architect: 2 } },
      { text: "arXiv, Hacker News, or some niche research blog.", scores: { Scholar: 1, Explorer: 1 } },
      { text: "A chat window — I'm always asking questions and helping others.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 13,
    q: "You're given 3 months to build anything you want. You pick:",
    options: [
      { text: "A product with real users that generates revenue.", scores: { Maker: 2 } },
      { text: "A distributed system that's technically unsolved at this scale.", scores: { Architect: 2 } },
      { text: "A research project exploring an emergent field nobody has named yet.", scores: { Explorer: 2 } },
      { text: "An open-source tool that solves a problem thousands of developers have.", scores: { Craftsman: 1, Catalyst: 1 } },
    ],
  },
  {
    id: 14,
    q: "When you encounter a bug you can't explain, you:",
    options: [
      { text: "Add more logs, binary search the problem, and fix it.", scores: { Maker: 2 } },
      { text: "Trace the execution path systematically until you isolate the root cause.", scores: { Architect: 2 } },
      { text: "Read every related file and understand the full context before touching anything.", scores: { Scholar: 2 } },
      { text: "Ask a colleague — different eyes catch different things.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 15,
    q: "Your ideal contribution to a team is:",
    options: [
      { text: "Shipping features and keeping velocity high.", scores: { Maker: 2 } },
      { text: "Making sure the foundation is solid so everything built on it lasts.", scores: { Architect: 2 } },
      { text: "Bringing in ideas nobody's thought of yet.", scores: { Explorer: 2 } },
      { text: "Removing blockers and making the team feel capable and cohesive.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 16,
    q: "How do you feel about technical debt?",
    options: [
      { text: "Unavoidable. Move fast, pay it down later.", scores: { Maker: 2 } },
      { text: "A design failure. Good architecture prevents most debt.", scores: { Architect: 2 } },
      { text: "Interesting — it's a record of past decisions and their tradeoffs.", scores: { Scholar: 2 } },
      { text: "I fix it when I see it, even if nobody asked me to.", scores: { Craftsman: 2 } },
    ],
  },
  {
    id: 17,
    q: "Which describes your open-source behavior?",
    options: [
      { text: "I fork and build — usually end up creating my own version.", scores: { Maker: 2 } },
      { text: "I contribute when I find architectural or structural issues.", scores: { Architect: 2 } },
      { text: "I star everything interesting and deep-dive into repos I admire.", scores: { Scholar: 1, Explorer: 1 } },
      { text: "I open issues, write docs, help maintainers.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 18,
    q: "You've been asked to onboard a new engineer. You:",
    options: [
      { text: "Give them a task on day one. You learn by doing.", scores: { Maker: 2 } },
      { text: "Walk them through the full system architecture before anything else.", scores: { Architect: 2 } },
      { text: "Share resources, readings, and let them explore at their own pace.", scores: { Scholar: 1, Explorer: 1 } },
      { text: "Check in daily, answer every question, help them feel included fast.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 19,
    q: "A project you built goes viral. Your immediate reaction is:",
    options: [
      { text: "Start thinking about scaling, monetization, next version.", scores: { Maker: 2 } },
      { text: "Worry about whether the architecture can handle it.", scores: { Architect: 2 } },
      { text: "Write a detailed post-mortem about what you learned building it.", scores: { Scholar: 2 } },
      { text: "Celebrate with the team and figure out how to help the new users.", scores: { Catalyst: 2 } },
    ],
  },
  {
    id: 20,
    q: "If your developer style were a movie genre, it would be:",
    options: [
      { text: "Action — fast, decisive, always moving forward.", scores: { Maker: 2 } },
      { text: "Thriller — methodical, deliberate, every detail matters.", scores: { Architect: 2 } },
      { text: "Sci-fi — always imagining how things could be different.", scores: { Explorer: 2 } },
      { text: "Drama — it's about the people, always.", scores: { Catalyst: 2 } },
    ],
  },
]

// GET /api/dna/quiz — returns the 20 questions (no auth needed for viewing)
export async function GET() {
  return NextResponse.json({ questions: DNA_QUESTIONS })
}
