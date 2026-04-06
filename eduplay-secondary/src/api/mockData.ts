import type {
  User, Subject, Topic, Question, Flashcard,
  WordScrambleItem, MatchPair, LeaderboardEntry,
  GameSession, Badge,
} from '@/types'

// ─── Users ───────────────────────────────────────────────────────────────────
export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  amir: {
    password: '1234',
    user: { id: 1, username: 'amir', email: 'amir@school.com', firstName: 'Amir', lastName: 'M', role: 'student', xp: 1240, level: 3, streak: 12, yearGroup: 'Year 9' },
  },
  sara: {
    password: '1234',
    user: { id: 2, username: 'sara', email: 'sara@school.com', firstName: 'Sara', lastName: 'K', role: 'student', xp: 1890, level: 4, streak: 20, yearGroup: 'Year 9' },
  },
  james: {
    password: '1234',
    user: { id: 3, username: 'james', email: 'james@school.com', firstName: 'James', lastName: 'T', role: 'student', xp: 1540, level: 4, streak: 7, yearGroup: 'Year 9' },
  },
  admin: {
    password: 'admin',
    user: { id: 4, username: 'admin', email: 'admin@school.com', firstName: 'Admin', lastName: 'User', role: 'admin', xp: 9999, level: 20, streak: 99, yearGroup: 'Staff' },
  },
}

// ─── Subjects ────────────────────────────────────────────────────────────────
export const MOCK_SUBJECTS: Subject[] = [
  { id: 1, name: 'Physics',     icon: '⚛️',  color: '#6C63FF', accentColor: '#9B87FF', gradeLevel: 'Year 9', topicCount: 8,  questionCount: 320, progressPercent: 72 },
  { id: 2, name: 'Mathematics', icon: '📐',  color: '#00D4AA', accentColor: '#5EEAD4', gradeLevel: 'Year 9', topicCount: 10, questionCount: 450, progressPercent: 55 },
  { id: 3, name: 'Chemistry',   icon: '🧪',  color: '#F5A623', accentColor: '#FCD34D', gradeLevel: 'Year 9', topicCount: 7,  questionCount: 280, progressPercent: 40 },
  { id: 4, name: 'History',     icon: '🏛️',  color: '#FF6B6B', accentColor: '#FCA5A5', gradeLevel: 'Year 9', topicCount: 6,  questionCount: 240, progressPercent: 88 },
  { id: 5, name: 'Biology',     icon: '🧬',  color: '#4DA6FF', accentColor: '#93C5FD', gradeLevel: 'Year 9', topicCount: 9,  questionCount: 360, progressPercent: 62 },
  { id: 6, name: 'English Lit.', icon: '📝', color: '#9B87FF', accentColor: '#C4B5FD', gradeLevel: 'Year 9', topicCount: 5,  questionCount: 200, progressPercent: 30 },
]

// ─── Topics ──────────────────────────────────────────────────────────────────
export const MOCK_TOPICS: Record<number, Topic[]> = {
  1: [ // Physics
    { id: 101, subjectId: 1, title: 'Forces & Motion',      description: '', order: 1, questionCount: 40, isCompleted: true  },
    { id: 102, subjectId: 1, title: 'Electromagnetism',     description: '', order: 2, questionCount: 40, isCompleted: false },
    { id: 103, subjectId: 1, title: 'Waves & Sound',        description: '', order: 3, questionCount: 40, isCompleted: false },
    { id: 104, subjectId: 1, title: 'Energy & Power',       description: '', order: 4, questionCount: 40, isCompleted: false },
    { id: 105, subjectId: 1, title: 'Radioactivity',        description: '', order: 5, questionCount: 40, isCompleted: false },
    { id: 106, subjectId: 1, title: 'Space Physics',        description: '', order: 6, questionCount: 40, isCompleted: false },
    { id: 107, subjectId: 1, title: 'Optics',               description: '', order: 7, questionCount: 40, isCompleted: false },
    { id: 108, subjectId: 1, title: 'Thermodynamics',       description: '', order: 8, questionCount: 40, isCompleted: false },
  ],
  2: [ // Mathematics
    { id: 201, subjectId: 2, title: 'Algebra',              description: '', order: 1, questionCount: 45, isCompleted: true  },
    { id: 202, subjectId: 2, title: 'Quadratic Equations',  description: '', order: 2, questionCount: 45, isCompleted: false },
    { id: 203, subjectId: 2, title: 'Trigonometry',         description: '', order: 3, questionCount: 45, isCompleted: false },
    { id: 204, subjectId: 2, title: 'Statistics & Data',    description: '', order: 4, questionCount: 45, isCompleted: false },
    { id: 205, subjectId: 2, title: 'Geometry & Proofs',    description: '', order: 5, questionCount: 45, isCompleted: false },
    { id: 206, subjectId: 2, title: 'Vectors',              description: '', order: 6, questionCount: 45, isCompleted: false },
    { id: 207, subjectId: 2, title: 'Calculus Intro',       description: '', order: 7, questionCount: 45, isCompleted: false },
    { id: 208, subjectId: 2, title: 'Probability',          description: '', order: 8, questionCount: 45, isCompleted: false },
    { id: 209, subjectId: 2, title: 'Number Theory',        description: '', order: 9, questionCount: 45, isCompleted: false },
    { id: 210, subjectId: 2, title: 'Ratio & Proportion',   description: '', order: 10, questionCount: 45, isCompleted: false },
  ],
  3: [ // Chemistry
    { id: 301, subjectId: 3, title: 'Atomic Structure',     description: '', order: 1, questionCount: 40, isCompleted: true  },
    { id: 302, subjectId: 3, title: 'Bonding',              description: '', order: 2, questionCount: 40, isCompleted: false },
    { id: 303, subjectId: 3, title: 'Electrolysis',         description: '', order: 3, questionCount: 40, isCompleted: false },
    { id: 304, subjectId: 3, title: 'Acids & Bases',        description: '', order: 4, questionCount: 40, isCompleted: false },
    { id: 305, subjectId: 3, title: 'Rates of Reaction',    description: '', order: 5, questionCount: 40, isCompleted: false },
    { id: 306, subjectId: 3, title: 'Organic Chemistry',    description: '', order: 6, questionCount: 40, isCompleted: false },
    { id: 307, subjectId: 3, title: 'The Periodic Table',   description: '', order: 7, questionCount: 40, isCompleted: false },
  ],
  4: [ // History
    { id: 401, subjectId: 4, title: 'World War I',          description: '', order: 1, questionCount: 40, isCompleted: true  },
    { id: 402, subjectId: 4, title: 'World War II',         description: '', order: 2, questionCount: 40, isCompleted: true  },
    { id: 403, subjectId: 4, title: 'The Cold War',         description: '', order: 3, questionCount: 40, isCompleted: true  },
    { id: 404, subjectId: 4, title: 'The British Empire',   description: '', order: 4, questionCount: 40, isCompleted: true  },
    { id: 405, subjectId: 4, title: 'The Civil Rights Movement', description: '', order: 5, questionCount: 40, isCompleted: false },
    { id: 406, subjectId: 4, title: 'The French Revolution', description: '', order: 6, questionCount: 40, isCompleted: false },
  ],
  5: [ // Biology
    { id: 501, subjectId: 5, title: 'Cell Biology',         description: '', order: 1, questionCount: 40, isCompleted: true  },
    { id: 502, subjectId: 5, title: 'Genetics & DNA',       description: '', order: 2, questionCount: 40, isCompleted: false },
    { id: 503, subjectId: 5, title: 'Human Body Systems',   description: '', order: 3, questionCount: 40, isCompleted: false },
    { id: 504, subjectId: 5, title: 'Ecology',              description: '', order: 4, questionCount: 40, isCompleted: false },
    { id: 505, subjectId: 5, title: 'Evolution',            description: '', order: 5, questionCount: 40, isCompleted: false },
    { id: 506, subjectId: 5, title: 'Photosynthesis',       description: '', order: 6, questionCount: 40, isCompleted: false },
    { id: 507, subjectId: 5, title: 'Respiration',          description: '', order: 7, questionCount: 40, isCompleted: false },
    { id: 508, subjectId: 5, title: 'Reproduction',         description: '', order: 8, questionCount: 40, isCompleted: false },
    { id: 509, subjectId: 5, title: 'Immunology',           description: '', order: 9, questionCount: 40, isCompleted: false },
  ],
  6: [ // English Lit
    { id: 601, subjectId: 6, title: 'Macbeth',              description: '', order: 1, questionCount: 40, isCompleted: false },
    { id: 602, subjectId: 6, title: 'An Inspector Calls',   description: '', order: 2, questionCount: 40, isCompleted: false },
    { id: 603, subjectId: 6, title: 'Poetry Anthology',     description: '', order: 3, questionCount: 40, isCompleted: false },
    { id: 604, subjectId: 6, title: 'Of Mice and Men',      description: '', order: 4, questionCount: 40, isCompleted: false },
    { id: 605, subjectId: 6, title: 'Language Analysis',    description: '', order: 5, questionCount: 40, isCompleted: false },
  ],
}

// ─── Questions ───────────────────────────────────────────────────────────────
export const MOCK_QUESTIONS: Record<number, Question[]> = {
  102: [ // Physics - Electromagnetism
    { id: 1,  topicId: 102, type: 'multiple_choice', text: 'What is the SI unit of electric current?',              choices: [{ id:1, text:'Volt' }, { id:2, text:'Ohm' }, { id:3, text:'Ampere' }, { id:4, text:'Watt' }],              correctChoiceId: 3 },
    { id: 2,  topicId: 102, type: 'multiple_choice', text: 'Which law states that V = IR?',                         choices: [{ id:1, text:"Newton's" }, { id:2, text:"Faraday's" }, { id:3, text:"Ohm's" }, { id:4, text:"Boyle's" }],  correctChoiceId: 3 },
    { id: 3,  topicId: 102, type: 'multiple_choice', text: 'What does a transformer do?',                           choices: [{ id:1, text:'Stores charge' }, { id:2, text:'Changes voltage' }, { id:3, text:'Converts AC to DC' }, { id:4, text:'Measures resistance' }], correctChoiceId: 2 },
    { id: 4,  topicId: 102, type: 'multiple_choice', text: 'What is the unit of electrical resistance?',            choices: [{ id:1, text:'Ampere' }, { id:2, text:'Volt' }, { id:3, text:'Joule' }, { id:4, text:'Ohm' }],              correctChoiceId: 4 },
    { id: 5,  topicId: 102, type: 'multiple_choice', text: 'Which material is a good electrical conductor?',        choices: [{ id:1, text:'Glass' }, { id:2, text:'Rubber' }, { id:3, text:'Copper' }, { id:4, text:'Plastic' }],        correctChoiceId: 3 },
    { id: 6,  topicId: 102, type: 'multiple_choice', text: 'What type of current alternates direction?',            choices: [{ id:1, text:'DC' }, { id:2, text:'AC' }, { id:3, text:'RC' }, { id:4, text:'PC' }],                       correctChoiceId: 2 },
  ],
  501: [ // Biology - Cell Biology
    { id: 10, topicId: 501, type: 'multiple_choice', text: 'What is the powerhouse of the cell?',                   choices: [{ id:1, text:'Nucleus' }, { id:2, text:'Ribosome' }, { id:3, text:'Mitochondria' }, { id:4, text:'Vacuole' }], correctChoiceId: 3 },
    { id: 11, topicId: 501, type: 'multiple_choice', text: 'Which organelle controls the cell?',                    choices: [{ id:1, text:'Mitochondria' }, { id:2, text:'Nucleus' }, { id:3, text:'Cytoplasm' }, { id:4, text:'Membrane' }], correctChoiceId: 2 },
    { id: 12, topicId: 501, type: 'multiple_choice', text: 'What process do cells use to divide?',                  choices: [{ id:1, text:'Osmosis' }, { id:2, text:'Diffusion' }, { id:3, text:'Mitosis' }, { id:4, text:'Photosynthesis' }], correctChoiceId: 3 },
    { id: 13, topicId: 501, type: 'multiple_choice', text: 'What is the diffusion of water called?',                choices: [{ id:1, text:'Active transport' }, { id:2, text:'Osmosis' }, { id:3, text:'Respiration' }, { id:4, text:'Absorption' }], correctChoiceId: 2 },
    { id: 14, topicId: 501, type: 'multiple_choice', text: 'Which cell structure is only in plant cells?',          choices: [{ id:1, text:'Nucleus' }, { id:2, text:'Mitochondria' }, { id:3, text:'Cell membrane' }, { id:4, text:'Cell wall' }], correctChoiceId: 4 },
    { id: 15, topicId: 501, type: 'multiple_choice', text: 'What do ribosomes do?',                                 choices: [{ id:1, text:'Produce energy' }, { id:2, text:'Synthesise proteins' }, { id:3, text:'Store water' }, { id:4, text:'Photosynthesise' }], correctChoiceId: 2 },
  ],
  303: [ // Chemistry - Electrolysis
    { id: 20, topicId: 303, type: 'multiple_choice', text: 'What is the positive electrode in electrolysis called?', choices: [{ id:1, text:'Cathode' }, { id:2, text:'Anode' }, { id:3, text:'Electrode' }, { id:4, text:'Ion' }],         correctChoiceId: 2 },
    { id: 21, topicId: 303, type: 'multiple_choice', text: 'What charge do cations carry?',                          choices: [{ id:1, text:'Negative' }, { id:2, text:'Neutral' }, { id:3, text:'Positive' }, { id:4, text:'Variable' }],   correctChoiceId: 3 },
    { id: 22, topicId: 303, type: 'multiple_choice', text: 'At which electrode does reduction occur?',               choices: [{ id:1, text:'Anode' }, { id:2, text:'Cathode' }, { id:3, text:'Both' }, { id:4, text:'Neither' }],          correctChoiceId: 2 },
    { id: 23, topicId: 303, type: 'multiple_choice', text: 'What must a substance have to conduct electricity?',     choices: [{ id:1, text:'Fixed ions' }, { id:2, text:'Free electrons or ions' }, { id:3, text:'High density' }, { id:4, text:'Low melting point' }], correctChoiceId: 2 },
    { id: 24, topicId: 303, type: 'multiple_choice', text: 'What gas is produced at the anode during brine electrolysis?', choices: [{ id:1, text:'Oxygen' }, { id:2, text:'Hydrogen' }, { id:3, text:'Chlorine' }, { id:4, text:'Nitrogen' }], correctChoiceId: 3 },
  ],
}

export const DEFAULT_QUESTIONS: Question[] = [
  { id: 90, topicId: 0, type: 'multiple_choice', text: 'What is Newton\'s Second Law?',              choices: [{ id:1, text:'F = ma' }, { id:2, text:'E = mc²' }, { id:3, text:'V = IR' }, { id:4, text:'PV = nRT' }],                   correctChoiceId: 1 },
  { id: 91, topicId: 0, type: 'multiple_choice', text: 'What does DNA stand for?',                   choices: [{ id:1, text:'Deoxyribonucleic Acid' }, { id:2, text:'Dynamic Nucleic Arrangement' }, { id:3, text:'Deoxyribose Nuclei Array' }, { id:4, text:'Dual Nucleic Acid' }], correctChoiceId: 1 },
  { id: 92, topicId: 0, type: 'multiple_choice', text: 'What is the chemical symbol for gold?',      choices: [{ id:1, text:'Gd' }, { id:2, text:'Go' }, { id:3, text:'Au' }, { id:4, text:'Ag' }],                                  correctChoiceId: 3 },
  { id: 93, topicId: 0, type: 'multiple_choice', text: 'In what year did WW2 end?',                  choices: [{ id:1, text:'1943' }, { id:2, text:'1944' }, { id:3, text:'1945' }, { id:4, text:'1946' }],                           correctChoiceId: 3 },
  { id: 94, topicId: 0, type: 'multiple_choice', text: 'What is the powerhouse of the cell?',        choices: [{ id:1, text:'Nucleus' }, { id:2, text:'Mitochondria' }, { id:3, text:'Ribosome' }, { id:4, text:'Cell Wall' }],       correctChoiceId: 2 },
  { id: 95, topicId: 0, type: 'multiple_choice', text: 'What is the derivative of x²?',              choices: [{ id:1, text:'x' }, { id:2, text:'2x' }, { id:3, text:'x²' }, { id:4, text:'2x²' }],                                 correctChoiceId: 2 },
]

// ─── Flashcards ──────────────────────────────────────────────────────────────
export const MOCK_FLASHCARDS: Record<number, Flashcard[]> = {
  501: [
    { id: 1, topicId: 501, term: 'Mitochondria',        definition: 'The organelle responsible for producing ATP through cellular respiration', category: 'BIOLOGY · CELL BIOLOGY' },
    { id: 2, topicId: 501, term: 'Nucleus',             definition: 'The control centre of the cell containing DNA', category: 'BIOLOGY · CELL BIOLOGY' },
    { id: 3, topicId: 501, term: 'Osmosis',             definition: 'Diffusion of water across a partially permeable membrane from high to low concentration', category: 'BIOLOGY · CELL BIOLOGY' },
    { id: 4, topicId: 501, term: 'Mitosis',             definition: 'Cell division producing two genetically identical daughter cells', category: 'BIOLOGY · CELL BIOLOGY' },
    { id: 5, topicId: 501, term: 'Endoplasmic reticulum', definition: 'A network of membranes involved in protein and lipid synthesis and transport', category: 'BIOLOGY · CELL BIOLOGY' },
  ],
  102: [
    { id: 6, topicId: 102, term: 'Voltage',             definition: 'The energy transferred per unit charge (measured in volts)', category: 'PHYSICS · ELECTROMAGNETISM' },
    { id: 7, topicId: 102, term: 'Resistance',          definition: 'Opposition to the flow of current in a circuit (measured in ohms)', category: 'PHYSICS · ELECTROMAGNETISM' },
    { id: 8, topicId: 102, term: 'Electromagnetic induction', definition: 'The production of a voltage across a conductor in a changing magnetic field', category: 'PHYSICS · ELECTROMAGNETISM' },
    { id: 9, topicId: 102, term: 'Frequency',           definition: 'The number of complete wave cycles per second, measured in hertz', category: 'PHYSICS · WAVES' },
    { id: 10, topicId: 102, term: 'Amplitude',          definition: 'The maximum displacement of a wave from its rest position', category: 'PHYSICS · WAVES' },
  ],
}

export const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: 50, topicId: 0, term: 'Allele',         definition: 'An alternative form of a gene at the same locus on homologous chromosomes', category: 'BIOLOGY · GENETICS' },
  { id: 51, topicId: 0, term: 'Catalyst',       definition: 'A substance that speeds up a reaction without being consumed in the process', category: 'CHEMISTRY' },
  { id: 52, topicId: 0, term: 'Trophic level',  definition: 'A position in a food chain; producers are level 1, primary consumers level 2', category: 'BIOLOGY · ECOLOGY' },
  { id: 53, topicId: 0, term: 'Isotope',        definition: 'Atoms of the same element with the same number of protons but different neutrons', category: 'CHEMISTRY · ATOMIC STRUCTURE' },
  { id: 54, topicId: 0, term: 'Momentum',       definition: 'The product of an object\'s mass and velocity (p = mv)', category: 'PHYSICS · MECHANICS' },
]

// ─── Scramble ────────────────────────────────────────────────────────────────
export const MOCK_SCRAMBLE: Record<number, WordScrambleItem[]> = {
  303: [
    { id: 1, topicId: 303, word: 'ANODE',      hint: 'The positive electrode in electrolysis',    scrambled: 'OANED'    },
    { id: 2, topicId: 303, word: 'ISOTOPE',    hint: 'Atoms with same protons, different neutrons', scrambled: 'OSPEIOT' },
    { id: 3, topicId: 303, word: 'COVALENT',   hint: 'A bond that shares electron pairs',         scrambled: 'LEANVTOC' },
    { id: 4, topicId: 303, word: 'CATALYST',   hint: 'Speeds up a reaction without being consumed', scrambled: 'SACATLYT' },
    { id: 5, topicId: 303, word: 'OXIDATION',  hint: 'Loss of electrons in a redox reaction',     scrambled: 'XADINOOIT' },
  ],
  102: [
    { id: 6, topicId: 102, word: 'VOLTAGE',    hint: 'Energy per unit charge',                    scrambled: 'AEGVLOT'  },
    { id: 7, topicId: 102, word: 'CURRENT',    hint: 'Flow of electric charge',                   scrambled: 'TCRNURE'  },
    { id: 8, topicId: 102, word: 'CIRCUIT',    hint: 'A closed loop for electricity',             scrambled: 'TIIRCUC'  },
    { id: 9, topicId: 102, word: 'MAGNET',     hint: 'Attracts ferromagnetic materials',          scrambled: 'GENAMT'   },
    { id: 10, topicId: 102, word: 'FREQUENCY', hint: 'Cycles per second of a wave',               scrambled: 'UNERYQCEF' },
  ],
}

export const DEFAULT_SCRAMBLE: WordScrambleItem[] = [
  { id: 60, topicId: 0, word: 'MOMENTUM',   hint: 'Mass times velocity',                         scrambled: 'MNTMUMOE'  },
  { id: 61, topicId: 0, word: 'CHROMOSOME', hint: 'Carries genetic information in the nucleus',  scrambled: 'COHMORSEM' },
  { id: 62, topicId: 0, word: 'NEUTRON',    hint: 'A neutral particle in the nucleus',           scrambled: 'RTNUNOE'   },
  { id: 63, topicId: 0, word: 'EVOLUTION',  hint: 'Change in species over generations',          scrambled: 'VITOLUONE' },
  { id: 64, topicId: 0, word: 'AMPLITUDE',  hint: 'Maximum displacement of a wave',             scrambled: 'ALTDUPIEM' },
]

// ─── Match Pairs ─────────────────────────────────────────────────────────────
export const MOCK_MATCH: Record<number, MatchPair[]> = {
  102: [
    { id: 1, topicId: 102, term: 'Voltage',    definition: 'Energy per unit charge' },
    { id: 2, topicId: 102, term: 'Resistance', definition: 'Opposition to current flow' },
    { id: 3, topicId: 102, term: 'Frequency',  definition: 'Cycles per second of a wave' },
    { id: 4, topicId: 102, term: 'Amplitude',  definition: 'Maximum displacement of a wave' },
  ],
  501: [
    { id: 5, topicId: 501, term: 'Mitosis',    definition: 'Division producing identical cells' },
    { id: 6, topicId: 501, term: 'Meiosis',    definition: 'Division producing gametes' },
    { id: 7, topicId: 501, term: 'Osmosis',    definition: 'Water diffusion across a membrane' },
    { id: 8, topicId: 501, term: 'Diffusion',  definition: 'Movement from high to low concentration' },
  ],
}

export const DEFAULT_MATCH: MatchPair[] = [
  { id: 70, topicId: 0, term: 'Proton',    definition: 'Positive particle in the nucleus' },
  { id: 71, topicId: 0, term: 'Neutron',   definition: 'Neutral particle in the nucleus' },
  { id: 72, topicId: 0, term: 'Electron',  definition: 'Negative particle orbiting the nucleus' },
  { id: 73, topicId: 0, term: 'Ion',       definition: 'An atom with a charge due to electron gain/loss' },
]

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 2, username: 'sara',   displayName: 'Sara K.',   avatarInitials: 'SK', xp: 1890, gamesPlayed: 23, isCurrentUser: false, yearGroup: 'Year 9' },
  { rank: 2, userId: 3, username: 'james',  displayName: 'James T.',  avatarInitials: 'JT', xp: 1540, gamesPlayed: 19, isCurrentUser: false, yearGroup: 'Year 9' },
  { rank: 3, userId: 1, username: 'amir',   displayName: 'Amir M.',   avatarInitials: 'AM', xp: 1240, gamesPlayed: 17, isCurrentUser: false, yearGroup: 'Year 9' },
  { rank: 4, userId: 5, username: 'priya',  displayName: 'Priya L.',  avatarInitials: 'PL', xp: 1090, gamesPlayed: 15, isCurrentUser: false, yearGroup: 'Year 9' },
  { rank: 5, userId: 6, username: 'chloe',  displayName: 'Chloe R.',  avatarInitials: 'CR', xp: 980,  gamesPlayed: 12, isCurrentUser: false, yearGroup: 'Year 9' },
  { rank: 6, userId: 7, username: 'daniel', displayName: 'Daniel W.', avatarInitials: 'DW', xp: 760,  gamesPlayed: 10, isCurrentUser: false, yearGroup: 'Year 9' },
]

// ─── Badges ──────────────────────────────────────────────────────────────────
export const MOCK_BADGES: Badge[] = [
  { id: 1, name: 'First Blood',   icon: '🎯', description: 'Complete your first quiz'       },
  { id: 2, name: '12-day Streak', icon: '🔥', description: 'Play 12 days in a row'          },
  { id: 3, name: 'Top 3',        icon: '🏆', description: 'Reach top 3 on the leaderboard' },
  { id: 4, name: 'Speed Demon',  icon: '⚡', description: 'Answer 5 questions under 5s each'},
]

// ─── History ─────────────────────────────────────────────────────────────────
export const MOCK_HISTORY: GameSession[] = [
  { id: 1, gameType: 'quiz',      topicId: 102, score: 5, total: 6, xpEarned: 40, completedAt: new Date(Date.now() - 1000*60*60*2).toISOString()   },
  { id: 2, gameType: 'flashcard', topicId: 501, score: 5, total: 5, xpEarned: 30, completedAt: new Date(Date.now() - 1000*60*60*26).toISOString()  },
  { id: 3, gameType: 'match',     topicId: 102, score: 4, total: 4, xpEarned: 35, completedAt: new Date(Date.now() - 1000*60*60*50).toISOString()  },
  { id: 4, gameType: 'scramble',  topicId: 303, score: 5, total: 5, xpEarned: 55, completedAt: new Date(Date.now() - 1000*60*60*74).toISOString()  },
  { id: 5, gameType: 'quiz',      topicId: 501, score: 4, total: 6, xpEarned: 30, completedAt: new Date(Date.now() - 1000*60*60*98).toISOString()  },
]
