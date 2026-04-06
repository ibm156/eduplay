// ─── Mock Database ────────────────────────────────────────────────────────────

import type {
  User, Subject, Topic, Question, Flashcard,
  WordScrambleItem, MatchPair, LeaderboardEntry,
  GameSession, Badge,
} from '@/types'

export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  layla: {
    password: '1234',
    user: {
      id: 1, username: 'layla', email: 'layla@school.com',
      firstName: 'Layla', lastName: 'M', role: 'student',
      xp: 620, level: 2, streak: 5, avatar: '🐸',
    },
  },
  omar: {
    password: '1234',
    user: {
      id: 2, username: 'omar', email: 'omar@school.com',
      firstName: 'Omar', lastName: 'A', role: 'student',
      xp: 890, level: 2, streak: 8, avatar: '🦊',
    },
  },
  admin: {
    password: 'admin',
    user: {
      id: 3, username: 'admin', email: 'admin@school.com',
      firstName: 'Admin', lastName: 'User', role: 'admin',
      xp: 9999, level: 20, streak: 30, avatar: '🎓',
    },
  },
}

export const MOCK_SUBJECTS: Subject[] = [
  { id: 1, name: 'Maths',   icon: '🔢', color: '#FFD93D', gradeLevel: 'Primary', topicCount: 6, questionCount: 120, progressPercent: 72 },
  { id: 2, name: 'Science', icon: '🔬', color: '#6BCB77', gradeLevel: 'Primary', topicCount: 5, questionCount: 95,  progressPercent: 45 },
  { id: 3, name: 'English', icon: '📖', color: '#4D96FF', gradeLevel: 'Primary', topicCount: 7, questionCount: 140, progressPercent: 60 },
  { id: 4, name: 'Art',     icon: '🎨', color: '#FF6FC8', gradeLevel: 'Primary', topicCount: 4, questionCount: 60,  progressPercent: 30 },
]

export const MOCK_TOPICS: Record<number, Topic[]> = {
  1: [
    { id: 101, subjectId: 1, title: 'Addition & Subtraction', description: '', order: 1, questionCount: 20, isCompleted: true },
    { id: 102, subjectId: 1, title: 'Multiplication',         description: '', order: 2, questionCount: 20, isCompleted: false },
    { id: 103, subjectId: 1, title: 'Fractions',              description: '', order: 3, questionCount: 20, isCompleted: false },
    { id: 104, subjectId: 1, title: 'Shapes & Geometry',      description: '', order: 4, questionCount: 20, isCompleted: false },
    { id: 105, subjectId: 1, title: 'Measurement',            description: '', order: 5, questionCount: 20, isCompleted: false },
    { id: 106, subjectId: 1, title: 'Times Tables',           description: '', order: 6, questionCount: 20, isCompleted: false },
  ],
  2: [
    { id: 201, subjectId: 2, title: 'Plants & Nature',  description: '', order: 1, questionCount: 20, isCompleted: true },
    { id: 202, subjectId: 2, title: 'Animals',          description: '', order: 2, questionCount: 20, isCompleted: false },
    { id: 203, subjectId: 2, title: 'Space & Planets',  description: '', order: 3, questionCount: 20, isCompleted: false },
    { id: 204, subjectId: 2, title: 'Materials',        description: '', order: 4, questionCount: 20, isCompleted: false },
    { id: 205, subjectId: 2, title: 'Weather',          description: '', order: 5, questionCount: 15, isCompleted: false },
  ],
  3: [
    { id: 301, subjectId: 3, title: 'Phonics',        description: '', order: 1, questionCount: 20, isCompleted: true },
    { id: 302, subjectId: 3, title: 'Spelling',       description: '', order: 2, questionCount: 20, isCompleted: false },
    { id: 303, subjectId: 3, title: 'Grammar',        description: '', order: 3, questionCount: 20, isCompleted: false },
    { id: 304, subjectId: 3, title: 'Punctuation',    description: '', order: 4, questionCount: 20, isCompleted: false },
    { id: 305, subjectId: 3, title: 'Comprehension',  description: '', order: 5, questionCount: 20, isCompleted: false },
    { id: 306, subjectId: 3, title: 'Vocabulary',     description: '', order: 6, questionCount: 20, isCompleted: false },
    { id: 307, subjectId: 3, title: 'Creative Writing',description:'', order: 7, questionCount: 20, isCompleted: false },
  ],
  4: [
    { id: 401, subjectId: 4, title: 'Colours & Mixing', description: '', order: 1, questionCount: 15, isCompleted: false },
    { id: 402, subjectId: 4, title: 'Famous Artists',   description: '', order: 2, questionCount: 15, isCompleted: false },
    { id: 403, subjectId: 4, title: 'Music Notes',      description: '', order: 3, questionCount: 15, isCompleted: false },
    { id: 404, subjectId: 4, title: 'Drawing Shapes',   description: '', order: 4, questionCount: 15, isCompleted: false },
  ],
}

export const MOCK_QUESTIONS: Record<number, Question[]> = {
  // Maths - Multiplication
  102: [
    { id: 1, topicId: 102, type: 'multiple_choice', text: 'What is 7 × 8?',  choices: [{ id: 1, text: '54' }, { id: 2, text: '56' }, { id: 3, text: '48' }, { id: 4, text: '63' }], correctChoiceId: 2 },
    { id: 2, topicId: 102, type: 'multiple_choice', text: 'What is 6 × 9?',  choices: [{ id: 1, text: '54' }, { id: 2, text: '56' }, { id: 3, text: '48' }, { id: 4, text: '45' }], correctChoiceId: 1 },
    { id: 3, topicId: 102, type: 'multiple_choice', text: 'What is 12 × 4?', choices: [{ id: 1, text: '42' }, { id: 2, text: '44' }, { id: 3, text: '48' }, { id: 4, text: '52' }], correctChoiceId: 3 },
    { id: 4, topicId: 102, type: 'multiple_choice', text: 'What is 5 × 11?', choices: [{ id: 1, text: '50' }, { id: 2, text: '55' }, { id: 3, text: '45' }, { id: 4, text: '60' }], correctChoiceId: 2 },
    { id: 5, topicId: 102, type: 'multiple_choice', text: 'What is 3 × 7?',  choices: [{ id: 1, text: '18' }, { id: 2, text: '24' }, { id: 3, text: '21' }, { id: 4, text: '27' }], correctChoiceId: 3 },
  ],
  // Science - Animals
  202: [
    { id: 6,  topicId: 202, type: 'multiple_choice', text: 'How many legs does a spider have?',       choices: [{ id: 1, text: '6' }, { id: 2, text: '8' }, { id: 3, text: '4' }, { id: 4, text: '10' }], correctChoiceId: 2 },
    { id: 7,  topicId: 202, type: 'multiple_choice', text: 'What do caterpillars turn into?',         choices: [{ id: 1, text: 'Bees' }, { id: 2, text: 'Moths' }, { id: 3, text: 'Butterflies' }, { id: 4, text: 'Flies' }], correctChoiceId: 3 },
    { id: 8,  topicId: 202, type: 'multiple_choice', text: 'Which animal is a mammal?',               choices: [{ id: 1, text: 'Shark' }, { id: 2, text: 'Eagle' }, { id: 3, text: 'Frog' }, { id: 4, text: 'Dolphin' }], correctChoiceId: 4 },
    { id: 9,  topicId: 202, type: 'multiple_choice', text: 'What is a group of lions called?',        choices: [{ id: 1, text: 'Pack' }, { id: 2, text: 'Herd' }, { id: 3, text: 'Pride' }, { id: 4, text: 'Flock' }], correctChoiceId: 3 },
    { id: 10, topicId: 202, type: 'multiple_choice', text: 'Which bird cannot fly?',                  choices: [{ id: 1, text: 'Sparrow' }, { id: 2, text: 'Penguin' }, { id: 3, text: 'Parrot' }, { id: 4, text: 'Eagle' }], correctChoiceId: 2 },
  ],
  // English - Spelling
  302: [
    { id: 11, topicId: 302, type: 'multiple_choice', text: 'Which spelling is correct?',              choices: [{ id: 1, text: 'Recieve' }, { id: 2, text: 'Receive' }, { id: 3, text: 'Receve' }, { id: 4, text: 'Receeve' }], correctChoiceId: 2 },
    { id: 12, topicId: 302, type: 'multiple_choice', text: 'Which word means "happy"?',               choices: [{ id: 1, text: 'Gloomy' }, { id: 2, text: 'Angry' }, { id: 3, text: 'Joyful' }, { id: 4, text: 'Tired' }], correctChoiceId: 3 },
    { id: 13, topicId: 302, type: 'multiple_choice', text: 'What is the plural of "child"?',          choices: [{ id: 1, text: 'Childs' }, { id: 2, text: 'Childes' }, { id: 3, text: 'Children' }, { id: 4, text: 'Childrens' }], correctChoiceId: 3 },
    { id: 14, topicId: 302, type: 'multiple_choice', text: 'Which word is spelled correctly?',        choices: [{ id: 1, text: 'Beutiful' }, { id: 2, text: 'Beautiful' }, { id: 3, text: 'Beautifull' }, { id: 4, text: 'Butiful' }], correctChoiceId: 2 },
    { id: 15, topicId: 302, type: 'multiple_choice', text: 'What is the opposite of "ancient"?',     choices: [{ id: 1, text: 'Old' }, { id: 2, text: 'Modern' }, { id: 3, text: 'Large' }, { id: 4, text: 'Tiny' }], correctChoiceId: 2 },
  ],
}

// Default questions used for any topic not in the map above
export const DEFAULT_QUESTIONS: Question[] = [
  { id: 90, topicId: 0, type: 'multiple_choice', text: 'What shape has 4 equal sides?',        choices: [{ id: 1, text: 'Rectangle' }, { id: 2, text: 'Triangle' }, { id: 3, text: 'Square' }, { id: 4, text: 'Circle' }],  correctChoiceId: 3 },
  { id: 91, topicId: 0, type: 'multiple_choice', text: 'What is the tallest animal on Earth?', choices: [{ id: 1, text: 'Elephant' }, { id: 2, text: 'Giraffe' },   { id: 3, text: 'Horse' },  { id: 4, text: 'Camel' }],   correctChoiceId: 2 },
  { id: 92, topicId: 0, type: 'multiple_choice', text: 'How many days are in a week?',         choices: [{ id: 1, text: '5' },        { id: 2, text: '6' },         { id: 3, text: '7' },      { id: 4, text: '8' }],       correctChoiceId: 3 },
  { id: 93, topicId: 0, type: 'multiple_choice', text: 'Which planet do we live on?',          choices: [{ id: 1, text: 'Mars' },     { id: 2, text: 'Venus' },     { id: 3, text: 'Earth' },  { id: 4, text: 'Jupiter' }], correctChoiceId: 3 },
  { id: 94, topicId: 0, type: 'multiple_choice', text: 'What colour do you get mixing blue and yellow?', choices: [{ id: 1, text: 'Purple' }, { id: 2, text: 'Orange' }, { id: 3, text: 'Green' }, { id: 4, text: 'Pink' }], correctChoiceId: 3 },
]

export const MOCK_FLASHCARDS: Record<number, Flashcard[]> = {
  201: [
    { id: 1, topicId: 201, term: 'Photosynthesis', definition: 'The process plants use to make food from sunlight and water', category: 'SCIENCE · PLANTS' },
    { id: 2, topicId: 201, term: 'Chlorophyll',    definition: 'The green pigment in plants that captures sunlight', category: 'SCIENCE · PLANTS' },
    { id: 3, topicId: 201, term: 'Root',           definition: 'The part of a plant that absorbs water and nutrients from soil', category: 'SCIENCE · PLANTS' },
    { id: 4, topicId: 201, term: 'Pollination',    definition: 'The transfer of pollen from one flower to another', category: 'SCIENCE · PLANTS' },
    { id: 5, topicId: 201, term: 'Germination',    definition: 'When a seed begins to grow into a new plant', category: 'SCIENCE · PLANTS' },
  ],
  202: [
    { id: 6,  topicId: 202, term: 'Mammal',     definition: 'A warm-blooded animal that feeds its young with milk', category: 'SCIENCE · ANIMALS' },
    { id: 7,  topicId: 202, term: 'Reptile',    definition: 'A cold-blooded animal with scales, like snakes and lizards', category: 'SCIENCE · ANIMALS' },
    { id: 8,  topicId: 202, term: 'Carnivore',  definition: 'An animal that only eats meat', category: 'SCIENCE · ANIMALS' },
    { id: 9,  topicId: 202, term: 'Herbivore',  definition: 'An animal that only eats plants', category: 'SCIENCE · ANIMALS' },
    { id: 10, topicId: 202, term: 'Migration',  definition: 'When animals travel long distances to find food or better weather', category: 'SCIENCE · ANIMALS' },
  ],
}

export const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: 50, topicId: 0, term: 'Evaporation',  definition: 'When liquid water turns into water vapour (gas)', category: 'SCIENCE' },
  { id: 51, topicId: 0, term: 'Gravity',      definition: 'The force that pulls objects towards the ground', category: 'SCIENCE' },
  { id: 52, topicId: 0, term: 'Orbit',        definition: 'The path a planet takes around the Sun', category: 'SPACE' },
  { id: 53, topicId: 0, term: 'Continent',    definition: 'One of the seven large areas of land on Earth', category: 'GEOGRAPHY' },
  { id: 54, topicId: 0, term: 'Habitat',      definition: 'The natural home or environment of an animal or plant', category: 'SCIENCE' },
]

export const MOCK_SCRAMBLE: Record<number, WordScrambleItem[]> = {
  102: [
    { id: 1, topicId: 102, word: 'MULTIPLY', hint: 'What you do when you times numbers', scrambled: 'YLPITLUM' },
    { id: 2, topicId: 102, word: 'EQUALS',   hint: 'The answer is this',                 scrambled: 'SLAQEU'   },
    { id: 3, topicId: 102, word: 'PRODUCT',  hint: 'The result of multiplication',       scrambled: 'TUCPROD'  },
    { id: 4, topicId: 102, word: 'FACTOR',   hint: 'A number you multiply by',           scrambled: 'ROTCAF'   },
    { id: 5, topicId: 102, word: 'DOUBLE',   hint: 'Times by two',                       scrambled: 'ELBUOD'   },
  ],
}

export const DEFAULT_SCRAMBLE: WordScrambleItem[] = [
  { id: 60, topicId: 0, word: 'TRIANGLE', hint: 'A shape with 3 sides',             scrambled: 'GNALTIRE' },
  { id: 61, topicId: 0, word: 'DOLPHIN',  hint: 'A smart sea mammal',               scrambled: 'NIPHLDО'.replace('О','O') },
  { id: 62, topicId: 0, word: 'VOLCANO',  hint: 'A mountain that erupts',           scrambled: 'OALCVNO'  },
  { id: 63, topicId: 0, word: 'COMPASS',  hint: 'A tool used for drawing circles',  scrambled: 'SMOPSAC'  },
  { id: 64, topicId: 0, word: 'ECLIPSE',  hint: 'When one object blocks another',   scrambled: 'CELPSEI'  },
]

export const MOCK_MATCH: Record<number, MatchPair[]> = {
  102: [
    { id: 1, topicId: 102, term: 'Addition',       definition: 'Adding numbers together' },
    { id: 2, topicId: 102, term: 'Subtraction',    definition: 'Taking a number away' },
    { id: 3, topicId: 102, term: 'Multiplication', definition: 'Repeated addition' },
    { id: 4, topicId: 102, term: 'Division',       definition: 'Splitting into equal groups' },
  ],
}

export const DEFAULT_MATCH: MatchPair[] = [
  { id: 70, topicId: 0, term: 'Sun',      definition: 'The star at the centre of our solar system' },
  { id: 71, topicId: 0, term: 'Moon',     definition: 'Earth\'s natural satellite' },
  { id: 72, topicId: 0, term: 'Asteroid', definition: 'A rocky object orbiting the Sun' },
  { id: 73, topicId: 0, term: 'Comet',    definition: 'An icy body with a glowing tail' },
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 2, username: 'omar',   displayName: 'Omar A.',   avatarInitials: 'OA', xp: 890, gamesPlayed: 23, isCurrentUser: false },
  { rank: 2, userId: 4, username: 'zara',   displayName: 'Zara H.',   avatarInitials: 'ZH', xp: 750, gamesPlayed: 19, isCurrentUser: false },
  { rank: 3, userId: 1, username: 'layla',  displayName: 'Layla M.',  avatarInitials: 'LM', xp: 620, gamesPlayed: 17, isCurrentUser: false },
  { rank: 4, userId: 5, username: 'priya',  displayName: 'Priya L.',  avatarInitials: 'PL', xp: 510, gamesPlayed: 14, isCurrentUser: false },
  { rank: 5, userId: 6, username: 'james',  displayName: 'James T.',  avatarInitials: 'JT', xp: 430, gamesPlayed: 11, isCurrentUser: false },
]

export const MOCK_BADGES: Badge[] = [
  { id: 1, name: 'First Win',    icon: '🏆', description: 'Complete your first game' },
  { id: 2, name: '5-day Streak', icon: '🔥', description: 'Play 5 days in a row' },
  { id: 3, name: 'Speed Star',   icon: '⚡', description: 'Answer 5 questions in a row without thinking' },
]

export const MOCK_HISTORY: GameSession[] = [
  { id: 1, gameType: 'quiz',      topicId: 102, score: 4, total: 5, xpEarned: 40, completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 2, gameType: 'flashcard', topicId: 201, score: 5, total: 5, xpEarned: 30, completedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: 3, gameType: 'match',     topicId: 102, score: 3, total: 4, xpEarned: 25, completedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
  { id: 4, gameType: 'scramble',  topicId: 102, score: 5, total: 5, xpEarned: 55, completedAt: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString() },
]
