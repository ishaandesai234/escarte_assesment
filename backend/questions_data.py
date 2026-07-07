"""Seed question bank for SkillSpark (10-15 questions per category)."""

# Question formats:
# - mcq: {question, options[], correct_index}
# - fill_blank: {question with ___, options[], correct_index}
# - match_pairs: {pairs: [{left, right}]}
# - true_false: {question, correct: bool}
# - scenario: {question, options[], correct_index}
# - order_sentence: {words[], correct_order[] (indices)}

QUESTIONS = [
    # ================ BASIC ENGLISH (15) ================
    {"category": "english", "format": "mcq", "question": "She ___ to school every day.",
     "options": ["go", "goes", "going", "gone"], "correct_index": 1,
     "explanation": "For 'she/he/it' we add -s to the verb in present tense.", "badge": None, "points": 10},

    {"category": "english", "format": "mcq", "question": "I have ___ apple in my bag.",
     "options": ["a", "an", "the", "no article"], "correct_index": 1,
     "explanation": "Use 'an' before words starting with a vowel sound.", "badge": None, "points": 10},

    {"category": "english", "format": "mcq", "question": "Which sentence is correct?",
     "options": ["He don't like tea", "He doesn't likes tea", "He doesn't like tea", "He not like tea"],
     "correct_index": 2, "explanation": "After 'doesn't', the verb stays in base form.",
     "badge": "grammar-guardian", "points": 15},

    {"category": "english", "format": "order_sentence",
     "question": "Put the words in the correct order:",
     "words": ["is", "My", "friend", "kind", "very"],
     "correct_order": [1, 2, 0, 4, 3], "explanation": "'My friend is very kind' — subject, verb, then description.",
     "badge": None, "points": 15},

    {"category": "english", "format": "match_pairs", "question": "Match the opposites:",
     "pairs": [{"left": "happy", "right": "sad"}, {"left": "big", "right": "small"},
               {"left": "fast", "right": "slow"}, {"left": "hot", "right": "cold"}],
     "explanation": "These are common opposite word pairs.", "badge": None, "points": 20},

    {"category": "english", "format": "fill_blank",
     "question": "The cat is ___ the table.", "options": ["under", "understanding", "beneath of", "underly"],
     "correct_index": 0, "explanation": "'Under' is the correct preposition here.", "badge": None, "points": 10},

    {"category": "english", "format": "mcq", "question": "What is the plural of 'child'?",
     "options": ["childs", "childes", "children", "childrens"], "correct_index": 2,
     "explanation": "'Children' is an irregular plural.", "badge": None, "points": 10},

    {"category": "english", "format": "true_false",
     "question": "The word 'quickly' is an adjective.", "correct": False,
     "explanation": "'Quickly' is an adverb — it describes how an action is done.", "badge": None, "points": 10},

    {"category": "english", "format": "mcq", "question": "Choose the past tense of 'run'.",
     "options": ["runned", "ran", "runs", "running"], "correct_index": 1,
     "explanation": "'Run' is irregular — its past tense is 'ran'.", "badge": None, "points": 10},

    {"category": "english", "format": "fill_blank",
     "question": "They ___ playing football right now.",
     "options": ["is", "are", "am", "be"], "correct_index": 1,
     "explanation": "Use 'are' with 'they'.", "badge": None, "points": 10},

    # ================ COMMUNICATION (12) ================
    {"category": "communication", "format": "scenario",
     "question": "Your friend is sad. What do you say first?",
     "options": ["Stop crying", "Are you okay? Do you want to talk?", "It's not a big deal", "Ignore them"],
     "correct_index": 1, "explanation": "Showing empathy and offering to listen is the kindest first step.",
     "badge": "bold-speaker", "points": 15},

    {"category": "communication", "format": "scenario",
     "question": "A stranger asks for your home address. What do you do?",
     "options": ["Tell them immediately", "Politely say no and walk away", "Give a fake address", "Ask why they need it and share"],
     "correct_index": 1, "explanation": "Safety first — never share personal info with strangers.",
     "badge": None, "points": 15},

    {"category": "communication", "format": "mcq",
     "question": "Pick the polite way to interrupt:",
     "options": ["Shut up, I want to speak", "Excuse me, can I say something?", "Hey! Listen to me!", "Just stop talking"],
     "correct_index": 1, "explanation": "'Excuse me' is respectful and gets attention politely.",
     "badge": None, "points": 10},

    {"category": "communication", "format": "scenario",
     "question": "In a group project, one person isn't helping. What's the best first step?",
     "options": ["Tell the teacher immediately", "Do their work for them", "Talk to them privately and ask if they need help", "Complain to other members"],
     "correct_index": 2, "explanation": "A calm private chat often solves the issue without conflict.",
     "badge": None, "points": 15},

    {"category": "communication", "format": "true_false",
     "question": "Good listening means waiting for your turn to speak.", "correct": False,
     "explanation": "Good listening is about understanding the speaker, not planning your reply.",
     "badge": None, "points": 10},

    {"category": "communication", "format": "mcq",
     "question": "Which is a sign of active listening?",
     "options": ["Looking at your phone", "Interrupting often", "Nodding and asking follow-up questions", "Changing the topic"],
     "correct_index": 2, "explanation": "Nodding and follow-ups show you are engaged.",
     "badge": None, "points": 10},

    {"category": "communication", "format": "scenario",
     "question": "You disagree with a friend. What's the best way to say it?",
     "options": ["You're wrong!", "I see it differently — here's why...", "Whatever, forget it", "Stay silent forever"],
     "correct_index": 1, "explanation": "Sharing your view calmly keeps the friendship strong.",
     "badge": None, "points": 15},

    {"category": "communication", "format": "mcq",
     "question": "Body language includes everything EXCEPT:",
     "options": ["Eye contact", "Facial expressions", "The words you say", "Posture"],
     "correct_index": 2, "explanation": "Words are verbal. Body language is non-verbal.",
     "badge": None, "points": 10},

    # ================ FINANCIAL LITERACY (12) ================
    {"category": "finance", "format": "scenario",
     "question": "You get ₹500 pocket money. What's the smartest thing to do?",
     "options": ["Spend it all on snacks", "Save some, spend some", "Give it all to a friend", "Hide it and forget"],
     "correct_index": 1, "explanation": "Balancing saving and spending is a great money habit.",
     "badge": "money-master", "points": 15},

    {"category": "finance", "format": "mcq",
     "question": "What does 'saving' mean?",
     "options": ["Spending money quickly", "Keeping money aside for later", "Losing money", "Borrowing money"],
     "correct_index": 1, "explanation": "Saving = setting money aside for future needs or goals.",
     "badge": None, "points": 10},

    {"category": "finance", "format": "mcq",
     "question": "You buy a ₹200 toy and give ₹500. How much change do you get?",
     "options": ["₹200", "₹300", "₹500", "₹700"], "correct_index": 1,
     "explanation": "500 - 200 = 300.", "badge": None, "points": 10},

    {"category": "finance", "format": "true_false",
     "question": "Borrowing money means you don't need to return it.", "correct": False,
     "explanation": "Borrowing means you MUST return the money — usually with a little extra (interest).",
     "badge": None, "points": 10},

    {"category": "finance", "format": "mcq",
     "question": "What is a bank?",
     "options": ["A shop that sells food", "A safe place that keeps your money and gives interest",
                 "A type of school", "A game"],
     "correct_index": 1, "explanation": "Banks safeguard your money and pay you interest for saving.",
     "badge": None, "points": 10},

    {"category": "finance", "format": "scenario",
     "question": "You really want new shoes but only have half the money. What's smart?",
     "options": ["Steal them", "Save until you have enough", "Ask friends to pay for you", "Take a big loan"],
     "correct_index": 1, "explanation": "Patience and saving beats debt every time.",
     "badge": None, "points": 15},

    {"category": "finance", "format": "mcq",
     "question": "Which of these is a 'need' (not a want)?",
     "options": ["Latest video game", "Designer sneakers", "Food and water", "Chocolate cake"],
     "correct_index": 2, "explanation": "Needs are essentials for survival. Wants are extras.",
     "badge": None, "points": 10},

    {"category": "finance", "format": "true_false",
     "question": "A budget helps you plan how to use your money.", "correct": True,
     "explanation": "A budget is a plan for spending and saving.", "badge": None, "points": 10},

    # ================ LEADERSHIP (10) ================
    {"category": "leadership", "format": "scenario",
     "question": "Your team is confused about what to do. As a leader, you:",
     "options": ["Shout at them", "Explain the goal clearly and give each person a task",
                 "Do everything yourself", "Cancel the project"],
     "correct_index": 1, "explanation": "Clarity + delegation = great leadership.",
     "badge": "leader-in-making", "points": 15},

    {"category": "leadership", "format": "scenario",
     "question": "A teammate makes a mistake. Best response?",
     "options": ["Make fun of them", "Blame them publicly", "Help them fix it and learn from it", "Ignore it"],
     "correct_index": 2, "explanation": "Great leaders build people up, not tear them down.",
     "badge": None, "points": 15},

    {"category": "leadership", "format": "mcq",
     "question": "What's more important in a leader?",
     "options": ["Being the loudest", "Being fair and listening", "Being the smartest", "Being the oldest"],
     "correct_index": 1, "explanation": "Fairness and listening earn true respect.",
     "badge": None, "points": 10},

    {"category": "leadership", "format": "scenario",
     "question": "You have 4 friends and 2 hours to clean a park. What do you do?",
     "options": ["Do it alone", "Split areas equally and set a check-in time",
                 "Argue for an hour first", "Give up"],
     "correct_index": 1, "explanation": "Planning + teamwork = fast results.",
     "badge": None, "points": 15},

    {"category": "leadership", "format": "true_false",
     "question": "A good leader always makes decisions without asking others.", "correct": False,
     "explanation": "Great leaders listen and involve their team.",
     "badge": None, "points": 10},

    {"category": "leadership", "format": "mcq",
     "question": "What does 'delegation' mean?",
     "options": ["Doing everything yourself", "Assigning tasks to team members",
                 "Skipping the work", "Complaining to the boss"],
     "correct_index": 1, "explanation": "Delegation = trusting the team with the right tasks.",
     "badge": None, "points": 10},

    # ================ CRITICAL THINKING (8) ================
    {"category": "critical", "format": "scenario",
     "question": "You see a shocking news headline. What do you do first?",
     "options": ["Share it right away", "Check if the source is reliable",
                 "Believe everything you read", "Argue with friends about it"],
     "correct_index": 1, "explanation": "Always verify before you share — that's critical thinking.",
     "badge": "sharp-thinker", "points": 15},

    {"category": "critical", "format": "mcq",
     "question": "Which one is a FACT (not opinion)?",
     "options": ["Pizza is the best food", "Water boils at 100°C at sea level",
                 "Blue is a pretty color", "Math is boring"],
     "correct_index": 1, "explanation": "Facts can be proven. Opinions are personal views.",
     "badge": None, "points": 10},

    {"category": "critical", "format": "mcq",
     "question": "I go up but never come down. What am I?",
     "options": ["A balloon", "Your age", "A kite", "Rain"], "correct_index": 1,
     "explanation": "Age only increases — it never goes back down!", "badge": None, "points": 10},

    {"category": "critical", "format": "true_false",
     "question": "If most people believe something, it must be true.", "correct": False,
     "explanation": "Popular beliefs are not always facts — always check evidence.",
     "badge": None, "points": 10},

    {"category": "critical", "format": "mcq",
     "question": "What's the best way to solve a big problem?",
     "options": ["Panic", "Break it into smaller steps", "Ignore it", "Ask someone else to solve it"],
     "correct_index": 1, "explanation": "Big problems become easy when broken down.",
     "badge": None, "points": 10},

    # ================ EMOTIONAL INTELLIGENCE (8) ================
    {"category": "emotional", "format": "scenario",
     "question": "You feel angry. What's the best FIRST thing to do?",
     "options": ["Yell at someone", "Take deep breaths and pause",
                 "Break something", "Post about it online"],
     "correct_index": 1, "explanation": "Pause + breathe = calm decisions.",
     "badge": None, "points": 15},

    {"category": "emotional", "format": "scenario",
     "question": "A friend is jealous of your success. How do you handle it?",
     "options": ["Brag more to annoy them", "Cut them off completely",
                 "Talk kindly and share the moment with them", "Feel guilty and hide your wins"],
     "correct_index": 2, "explanation": "Kindness and inclusion often melts jealousy.",
     "badge": None, "points": 15},

    {"category": "emotional", "format": "true_false",
     "question": "Crying is a sign of weakness.", "correct": False,
     "explanation": "Crying is a healthy way to release emotions — it takes courage.",
     "badge": None, "points": 10},

    {"category": "emotional", "format": "mcq",
     "question": "Empathy means:",
     "options": ["Feeling sorry for someone", "Understanding what someone else feels",
                 "Agreeing with everyone", "Ignoring feelings"],
     "correct_index": 1, "explanation": "Empathy is walking in someone else's shoes emotionally.",
     "badge": None, "points": 10},

    {"category": "emotional", "format": "scenario",
     "question": "You failed a test. What's a healthy response?",
     "options": ["Blame everyone else", "Give up on studying forever",
                 "Reflect on what went wrong and try again", "Pretend it didn't happen"],
     "correct_index": 2, "explanation": "Reflection turns failure into growth.",
     "badge": None, "points": 15},

    {"category": "emotional", "format": "mcq",
     "question": "Which is a healthy way to handle stress?",
     "options": ["Bottle it up", "Skip sleep", "Talk to someone you trust", "Overeat"],
     "correct_index": 2, "explanation": "Sharing feelings with trusted people lightens the load.",
     "badge": None, "points": 10},
]


CATEGORIES = [
    {"id": "english", "name": "Basic English", "emoji": "📚", "color": "#FF822D",
     "description": "Grammar, words, and simple sentences"},
    {"id": "communication", "name": "Communication", "emoji": "💬", "color": "#4A90E2",
     "description": "Talking, listening, and being kind with words"},
    {"id": "finance", "name": "Financial Literacy", "emoji": "💰", "color": "#58CC02",
     "description": "Saving, spending, and smart money habits"},
    {"id": "leadership", "name": "Leadership", "emoji": "👑", "color": "#F5A623",
     "description": "Teamwork, decision making, and inspiring others"},
    {"id": "critical", "name": "Critical Thinking", "emoji": "🧠", "color": "#9B59B6",
     "description": "Analyzing, questioning, and solving problems"},
    {"id": "emotional", "name": "Emotional Intelligence", "emoji": "💖", "color": "#E74C3C",
     "description": "Understanding feelings — yours and others'"},
]


BADGES = {
    "grammar-guardian": {"name": "Grammar Guardian", "emoji": "🛡️", "color": "#FF822D"},
    "money-master": {"name": "Money Master", "emoji": "💰", "color": "#58CC02"},
    "leader-in-making": {"name": "Leader in the Making", "emoji": "👑", "color": "#F5A623"},
    "bold-speaker": {"name": "Bold Speaker", "emoji": "🎤", "color": "#4A90E2"},
    "sharp-thinker": {"name": "Sharp Thinker", "emoji": "🧠", "color": "#9B59B6"},
}
