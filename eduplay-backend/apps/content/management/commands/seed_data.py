"""
python manage.py seed_data

Populates the database with:
  - Demo users (students + teacher + admin)
  - Subjects, topics, questions, flashcards, scramble words, match pairs
  - Badges
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import User
from apps.content.models import Subject, Topic, Question, Choice, Flashcard, WordScramble, MatchPair
from apps.progress.models import Badge


PRIMARY_SUBJECTS = [
    {'name': 'Maths',   'icon': '🔢', 'color': '#FFD93D', 'accent_color': '#FEF08A', 'grade_level': 'primary'},
    {'name': 'Science', 'icon': '🔬', 'color': '#6BCB77', 'accent_color': '#86EFAC', 'grade_level': 'primary'},
    {'name': 'English', 'icon': '📖', 'color': '#4D96FF', 'accent_color': '#93C5FD', 'grade_level': 'primary'},
    {'name': 'Art',     'icon': '🎨', 'color': '#FF6FC8', 'accent_color': '#F9A8D4', 'grade_level': 'primary'},
]

SECONDARY_SUBJECTS = [
    {'name': 'Physics',      'icon': '⚛️',  'color': '#6C63FF', 'accent_color': '#9B87FF', 'grade_level': 'secondary'},
    {'name': 'Mathematics',  'icon': '📐',  'color': '#00D4AA', 'accent_color': '#5EEAD4', 'grade_level': 'secondary'},
    {'name': 'Chemistry',    'icon': '🧪',  'color': '#F5A623', 'accent_color': '#FCD34D', 'grade_level': 'secondary'},
    {'name': 'History',      'icon': '🏛️',  'color': '#FF6B6B', 'accent_color': '#FCA5A5', 'grade_level': 'secondary'},
    {'name': 'Biology',      'icon': '🧬',  'color': '#4DA6FF', 'accent_color': '#93C5FD', 'grade_level': 'secondary'},
    {'name': 'English Lit.', 'icon': '📝',  'color': '#9B87FF', 'accent_color': '#C4B5FD', 'grade_level': 'secondary'},
]

SEED_TOPICS = {
    'Maths': [
        'Addition & Subtraction', 'Multiplication', 'Fractions',
        'Shapes & Geometry', 'Measurement', 'Times Tables',
    ],
    'Science': ['Plants & Nature', 'Animals', 'Space & Planets', 'Materials', 'Weather'],
    'English': ['Phonics', 'Spelling', 'Grammar', 'Punctuation', 'Vocabulary', 'Comprehension'],
    'Art':     ['Colours & Mixing', 'Famous Artists', 'Music Notes', 'Drawing'],
    'Physics': [
        'Forces & Motion', 'Electromagnetism', 'Waves & Sound',
        'Energy & Power', 'Radioactivity', 'Space Physics',
    ],
    'Mathematics': [
        'Algebra', 'Quadratic Equations', 'Trigonometry',
        'Statistics & Data', 'Geometry & Proofs', 'Probability',
    ],
    'Chemistry': [
        'Atomic Structure', 'Bonding', 'Electrolysis',
        'Acids & Bases', 'Rates of Reaction', 'Organic Chemistry',
    ],
    'History': [
        'World War I', 'World War II', 'The Cold War',
        'The British Empire', 'The Civil Rights Movement',
    ],
    'Biology': [
        'Cell Biology', 'Genetics & DNA', 'Human Body Systems',
        'Ecology', 'Evolution', 'Photosynthesis',
    ],
    'English Lit.': ['Macbeth', 'An Inspector Calls', 'Poetry Anthology', 'Language Analysis'],
}

SEED_QUESTIONS = {
    'Multiplication': [
        ('What is 7 × 8?',  ['54', '56', '48', '63'], 1),
        ('What is 6 × 9?',  ['54', '56', '48', '45'], 0),
        ('What is 12 × 4?', ['42', '44', '48', '52'], 2),
        ('What is 5 × 11?', ['50', '55', '45', '60'], 1),
        ('What is 3 × 7?',  ['18', '24', '21', '27'], 2),
    ],
    'Animals': [
        ('How many legs does a spider have?',     ['6', '8', '4', '10'],                        1),
        ('What do caterpillars turn into?',        ['Bees', 'Moths', 'Butterflies', 'Flies'],    2),
        ('Which animal is a mammal?',              ['Shark', 'Eagle', 'Frog', 'Dolphin'],        3),
        ('What is a group of lions called?',       ['Pack', 'Herd', 'Pride', 'Flock'],           2),
        ('Which bird cannot fly?',                 ['Sparrow', 'Penguin', 'Parrot', 'Eagle'],    1),
    ],
    'Electromagnetism': [
        ('What is the SI unit of electric current?',         ['Volt', 'Ohm', 'Ampere', 'Watt'],             2),
        ('Which law states V = IR?',                          ["Newton's", "Faraday's", "Ohm's", "Boyle's"], 2),
        ('What does a transformer do?',                       ['Stores charge', 'Changes voltage', 'Converts AC to DC', 'Measures resistance'], 1),
        ('What is the unit of electrical resistance?',        ['Ampere', 'Volt', 'Joule', 'Ohm'],            3),
        ('Which material is a good electrical conductor?',    ['Glass', 'Rubber', 'Copper', 'Plastic'],       2),
        ('What type of current alternates direction?',        ['DC', 'AC', 'RC', 'PC'],                      1),
    ],
    'Cell Biology': [
        ('What is the powerhouse of the cell?',         ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'],   2),
        ('Which organelle controls the cell?',           ['Mitochondria', 'Nucleus', 'Cytoplasm', 'Membrane'], 1),
        ('What process do cells use to divide?',         ['Osmosis', 'Diffusion', 'Mitosis', 'Photosynthesis'], 2),
        ('What is the diffusion of water called?',       ['Active transport', 'Osmosis', 'Respiration', 'Absorption'], 1),
        ('Which structure is only in plant cells?',      ['Nucleus', 'Mitochondria', 'Cell membrane', 'Cell wall'], 3),
    ],
    'Electrolysis': [
        ('What is the positive electrode called?',           ['Cathode', 'Anode', 'Electrode', 'Ion'],        1),
        ('What charge do cations carry?',                     ['Negative', 'Neutral', 'Positive', 'Variable'], 2),
        ('At which electrode does reduction occur?',          ['Anode', 'Cathode', 'Both', 'Neither'],         1),
        ('What gas is produced at the anode in brine?',       ['Oxygen', 'Hydrogen', 'Chlorine', 'Nitrogen'],  2),
    ],
}

SEED_FLASHCARDS = {
    'Animals': [
        ('Mammal',    'A warm-blooded animal that feeds its young with milk',             'SCIENCE · ANIMALS'),
        ('Reptile',   'A cold-blooded animal with scales, like snakes and lizards',      'SCIENCE · ANIMALS'),
        ('Carnivore', 'An animal that only eats meat',                                   'SCIENCE · ANIMALS'),
        ('Herbivore', 'An animal that only eats plants',                                 'SCIENCE · ANIMALS'),
        ('Migration', 'When animals travel long distances to find food or better weather', 'SCIENCE · ANIMALS'),
    ],
    'Cell Biology': [
        ('Mitochondria',         'The organelle responsible for producing ATP through cellular respiration', 'BIOLOGY · CELLS'),
        ('Nucleus',              'The control centre of the cell containing DNA',                           'BIOLOGY · CELLS'),
        ('Osmosis',              'Diffusion of water across a partially permeable membrane',                'BIOLOGY · CELLS'),
        ('Mitosis',              'Cell division producing two genetically identical daughter cells',        'BIOLOGY · CELLS'),
        ('Endoplasmic reticulum','A network of membranes involved in protein and lipid synthesis',         'BIOLOGY · CELLS'),
    ],
    'Electromagnetism': [
        ('Voltage',     'The energy transferred per unit charge, measured in volts',        'PHYSICS · EM'),
        ('Resistance',  'Opposition to the flow of current in a circuit, measured in ohms', 'PHYSICS · EM'),
        ('Frequency',   'The number of complete wave cycles per second, measured in hertz', 'PHYSICS · WAVES'),
        ('Amplitude',   'The maximum displacement of a wave from its rest position',        'PHYSICS · WAVES'),
        ('Transformer', 'A device that changes the voltage of an alternating current',      'PHYSICS · EM'),
    ],
}

SEED_SCRAMBLE = {
    'Multiplication': [
        ('MULTIPLY', 'What you do when you times numbers'),
        ('EQUALS',   'The result of a calculation'),
        ('PRODUCT',  'The result of multiplication'),
        ('FACTOR',   'A number you multiply by'),
        ('DOUBLE',   'Times by two'),
    ],
    'Electrolysis': [
        ('ANODE',     'The positive electrode in electrolysis'),
        ('ISOTOPE',   'Atoms with same protons, different neutrons'),
        ('COVALENT',  'A bond that shares electron pairs'),
        ('CATALYST',  'Speeds up a reaction without being consumed'),
        ('OXIDATION', 'Loss of electrons in a redox reaction'),
    ],
}

SEED_MATCH = {
    'Multiplication': [
        ('Addition',       'Adding numbers together'),
        ('Subtraction',    'Taking a number away'),
        ('Multiplication', 'Repeated addition'),
        ('Division',       'Splitting into equal groups'),
    ],
    'Electromagnetism': [
        ('Voltage',   'Energy per unit charge'),
        ('Resistance','Opposition to current flow'),
        ('Frequency', 'Cycles per second of a wave'),
        ('Amplitude', 'Maximum displacement of a wave'),
    ],
    'Cell Biology': [
        ('Mitosis',   'Division producing identical cells'),
        ('Meiosis',   'Division producing gametes'),
        ('Osmosis',   'Water diffusion across a membrane'),
        ('Diffusion', 'Movement from high to low concentration'),
    ],
}

BADGES_DATA = [
    ('First Game',    '🎯', 'Complete your very first game',      'first_game'),
    ('Streak 5',      '🔥', 'Play 5 days in a row',              'streak_5'),
    ('Streak 10',     '🔥', 'Play 10 days in a row',             'streak_10'),
    ('Streak 30',     '🔥', 'Play 30 days in a row',             'streak_30'),
    ('XP 500',        '⭐', 'Earn 500 XP',                       'xp_500'),
    ('XP 1000',       '🌟', 'Earn 1,000 XP',                     'xp_1000'),
    ('XP 5000',       '💫', 'Earn 5,000 XP',                     'xp_5000'),
    ('Top 3',         '🏆', 'Reach the top 3 on the leaderboard', 'top_3'),
    ('10 Games',      '🎮', 'Play 10 games',                     'games_10'),
    ('50 Games',      '🎮', 'Play 50 games',                     'games_50'),
    ('All Subjects',  '📚', 'Play every subject at least once',   'all_subjects'),
]


class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data first')

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            User.objects.filter(is_superuser=False).delete()
            Subject.objects.all().delete()
            Badge.objects.all().delete()

        self.stdout.write('Creating users...')
        self._create_users()

        self.stdout.write('Creating subjects & topics...')
        self._create_subjects()

        self.stdout.write('Creating badges...')
        self._create_badges()

        self.stdout.write(self.style.SUCCESS('\n✅ Seed complete! Login with:'))
        self.stdout.write('  Primary students : layla / 1234 | omar / 1234')
        self.stdout.write('  Secondary students: amir / 1234 | sara / 1234')
        self.stdout.write('  Teacher          : teacher / teach1234')
        self.stdout.write('  Admin            : admin / admin1234')
        self.stdout.write('  Django admin     : http://localhost:8000/admin/')

    def _create_users(self):
        users = [
            # Primary students
            dict(username='layla',   first_name='Layla',   last_name='M', role='student', school_level='primary',   year_group='Year 4', xp=620,  level=2, streak=5,  avatar='🐸', password='1234'),
            dict(username='omar',    first_name='Omar',    last_name='A', role='student', school_level='primary',   year_group='Year 4', xp=890,  level=2, streak=8,  avatar='🦊', password='1234'),
            dict(username='zara',    first_name='Zara',    last_name='H', role='student', school_level='primary',   year_group='Year 5', xp=750,  level=2, streak=3,  avatar='🦋', password='1234'),
            dict(username='priya',   first_name='Priya',   last_name='L', role='student', school_level='primary',   year_group='Year 5', xp=510,  level=2, streak=2,  avatar='🐱', password='1234'),
            # Secondary students
            dict(username='amir',    first_name='Amir',    last_name='M', role='student', school_level='secondary', year_group='Year 9', xp=1240, level=3, streak=12, avatar='⚡', password='1234'),
            dict(username='sara',    first_name='Sara',    last_name='K', role='student', school_level='secondary', year_group='Year 9', xp=1890, level=4, streak=20, avatar='🔥', password='1234'),
            dict(username='james',   first_name='James',   last_name='T', role='student', school_level='secondary', year_group='Year 9', xp=1540, level=4, streak=7,  avatar='🎯', password='1234'),
            dict(username='chloe',   first_name='Chloe',   last_name='R', role='student', school_level='secondary', year_group='Year 9', xp=980,  level=2, streak=4,  avatar='🌟', password='1234'),
            # Staff
            dict(username='teacher', first_name='Ms',      last_name='Smith', role='teacher', school_level='primary', year_group='Staff', xp=0, level=1, streak=0, avatar='🎓', password='teach1234'),
            dict(username='admin',   first_name='Admin',   last_name='User',  role='admin',   school_level='primary', year_group='Staff', xp=9999, level=20, streak=99, avatar='👑', password='admin1234'),
        ]
        for u in users:
            password = u.pop('password')
            if not User.objects.filter(username=u['username']).exists():
                user = User(**u)
                user.set_password(password)
                user.save()
                self.stdout.write(f'  Created user: {user.username}')

    def _create_subjects(self):
        all_subjects = PRIMARY_SUBJECTS + SECONDARY_SUBJECTS
        for i, s_data in enumerate(all_subjects):
            subject, _ = Subject.objects.get_or_create(
                name=s_data['name'], grade_level=s_data['grade_level'],
                defaults={**s_data, 'order': i},
            )
            topics = SEED_TOPICS.get(subject.name, [])
            for j, title in enumerate(topics):
                topic, _ = Topic.objects.get_or_create(
                    subject=subject, title=title,
                    defaults={'order': j},
                )
                self._seed_topic_content(topic)

    def _seed_topic_content(self, topic: Topic):
        # Questions
        q_data = SEED_QUESTIONS.get(topic.title, [])
        for i, (text, choices, correct_idx) in enumerate(q_data):
            if not topic.questions.filter(text=text).exists():
                q = Question.objects.create(topic=topic, text=text, order=i)
                for k, c_text in enumerate(choices):
                    Choice.objects.create(
                        question=q, text=c_text,
                        is_correct=(k == correct_idx), order=k,
                    )

        # Flashcards
        for i, (term, definition, category) in enumerate(SEED_FLASHCARDS.get(topic.title, [])):
            Flashcard.objects.get_or_create(
                topic=topic, term=term,
                defaults={'definition': definition, 'category': category, 'order': i},
            )

        # Scramble words
        for i, (word, hint) in enumerate(SEED_SCRAMBLE.get(topic.title, [])):
            if not topic.scramble_words.filter(word=word).exists():
                WordScramble.objects.create(topic=topic, word=word, hint=hint, order=i)

        # Match pairs
        for i, (term, definition) in enumerate(SEED_MATCH.get(topic.title, [])):
            MatchPair.objects.get_or_create(
                topic=topic, term=term,
                defaults={'definition': definition, 'order': i},
            )

    def _create_badges(self):
        for name, icon, description, criteria_key in BADGES_DATA:
            Badge.objects.get_or_create(
                criteria_key=criteria_key,
                defaults={'name': name, 'icon': icon, 'description': description},
            )
