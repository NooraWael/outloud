Outloud
===========

### _Learn by Talking

Outloud is a **voice-first learning companion** where you don’t just answer questions…

You have a **real conversation**.

You talk.The AI talks back — as a **mentor, peer, coach, or critic**.Together, you co-host a tiny “learning podcast” about your topic.

After the conversation, Outloud shows you **how clearly you explained things** with:

*   a **clarity + understanding score**,
    
*   a **color-coded transcript** of what you said,
    
*   and a **20-second retell challenge** to instantly get better.
    

🚀 Why Outloud?
---------------

Students don’t truly know something until they can **say it out loud** and defend it in a conversation.

But:

*   Not everyone has a friend to quiz them.
    
*   Not everyone has a tutor.
    
*   And talking to a static chatbot is boring lets be real.
    

**Outloud makes studying feel like a co-hosted podcast:**

*   You explain an idea.
    
*   The AI responds in a chosen role (mentor / peer / coach / critic .. etc).
    
*   It pushes back, asks follow-ups, or adds its own perspective.
    
*   Together you build understanding in a natural, back-and-forth flow.
    

✨ What Outloud Actually Does
----------------------------

### 🎧 1. Voice Conversations — Not Just One-Way Recording

*   You **speak** your thoughts for 20–40 seconds.
    
*   Your speech is transcribed.
    
*   The AI **talks back** — in voice (TTS) and text:
    
    *   As a **Mentor**: probing “why?” and “how?”
        
    *   As a **Study Buddy**: curious, exploring ideas with you
        
    *   As a **Coach**: encouraging, challenging you to go deeper
        
    *   As a **Critic**: skeptical, testing your logic
        

You can _hear_ the AI response, not just read it so it feels like you’re co-hosting a tiny episode about your topic.

You can do several turns:

> You talk → AI responds → you respond → AI responds…

That conversation is then analyzed as a whole.

### 📘 2. Optional Study Materials

You can attach study material to a topic:

*   Textbook pages
    
*   Grading guides / rubrics
    
*   Notes or lecture slides
    
*   URLs - in the future i hope
    

Outloud will:

*   Use these as **grounding** for the conversation
    
*   Check if your explanations match the material
    
*   Highlight which parts you’ve covered and where you’re drifting
    

If you **don’t** upload anything, Outloud still talks with you and evaluates based on its knowledge — perfect for:

*   Practicing oral exams
    
*   Explaining a concept from memory
    
*   Rehearsing a pitch or presentation
    

### 🧠 3. Evaluation + Heatmap Over Your Own Words

After a conversation, Outloud:

*   Combines your turns into a single transcript
    
*   Checks:
    
    *   **Coverage** – did you hit the core ideas?
        
    *   **Clarity** – was it structured and understandable?
        
    *   **Correctness** – did you get the facts right?
        
    *   **Causality** – did you explain _why_ things happen, not just what?
        

Then it generates a **Heatmap**:

*   🟩 **Strong**: clear, accurate, helpful phrasing
    
*   🟨 **Vague**: hand-wavy or incomplete parts
    
*   🟥 **Misconceptions**: incorrect or contradictory explanations
    

Finally, Outloud gives you a **20-second retell prompt**:

> “In 20 seconds, explain this again, but focus on X and avoid Y.”

You re-record.You get a **new score**.You _see_ your improvement.

### 🔁 4. Study Spaces: Start New or Continue Old Conversations

The app organizes your learning into **Study Spaces**:

*   “OS Exam – Deadlocks”
    
*   “IELTS Speaking Practice”
    
*   “AI Hackathon Pitch”
    

Inside each space, you can:

*   See previous conversations
    
*   Continue an existing discussion with your AI co-host
    
*   Or start a brand new one
    

This is where future features like:

*   “Fight Your Past Self”
    
*   Progress over time
    
*   Concept coverage
    

…will live (the architecture already supports it).

🛠️ Tech Stack (High Level)
---------------------------

*   **Frontend:** React Native (Expo) — mobile app + web support
    
    *   Audio recording & playback
        
    *   Conversational UI with chat bubbles and waveform animations
        
*   **Backend:**
    
    *   Node/Express — conversation logic, personas, scoring
        
    *   Python/FastAPI — speech-to-text via Whisper (faster-whisper)
        
    *   Postgres (Supabase) — users, study spaces, materials, conversations, evaluations
        
*   **AI:**
    
    *   Whisper — speech-to-text
        
    *   OpenAI — persona replies + grading (scores, heatmap, feedback)
        
    *   TTS — AI voice responses (for the podcast-like feel)
        

🧪 How It Works (End-to-End Flow)
---------------------------------

1.  You log in and choose a **Study Space** (or create a new one).
    
2.  You pick a **role** for the AI: Mentor, Study Buddy, Coach, or Critic.
    
3.  You **hit record** and explain a concept out loud.
    
4.  Outloud:
    
    *   Converts your speech to text
        
    *   Sends your transcript + conversation history + optional study material to the AI
        
    *   Gets back an AI response in that role
        
    *   Plays back the AI’s response (so it feels like a real conversation)
        
5.  After a few turns, you tap **Evaluate**.
    
6.  Outloud:
    
    *   Analyzes your side of the conversation
        
    *   Scores your explanation
        
    *   Generates a heatmap of where you were strong/weak
        
    *   Gives you a short retell challenge
        
7.  You retell → get a new score → see your progress.
    

🎯 Why This Makes Learning Cool Again
-------------------------------------------

Outloud:
    
*   Encourages **deep thinking**, not just tapping through quizzes
    
*   Supports **any subject** (as long as you can talk about it)
    
*   Builds real-world skills: explaining clearly, speaking confidently, defending ideas
    

It doesn’t just give answers.It helps you **hear yourself think and think better.**

👤 Team
-------

Built by **Noora Wael**

*   Mobile developer & puzzle enjoyer
    
*   Obsessed with making learning more human and fun