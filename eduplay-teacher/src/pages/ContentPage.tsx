import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectsApi, topicsApi, questionsApi, flashcardsApi } from '@/api'
import {
  Button, Badge, Modal, Input, Textarea, Select,
  EmptyState, ConfirmDialog,
} from '@/components/ui/index'
import type { Subject, Topic, Question, Flashcard, Choice } from '@/types'
import clsx from 'clsx'

type ContentTab = 'questions' | 'flashcards' | 'scramble' | 'match'

const CONTENT_TABS: { id: ContentTab; label: string; icon: string }[] = [
  { id: 'questions',  label: 'Questions',  icon: '❓' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
  { id: 'scramble',   label: 'Scramble',   icon: '🔤' },
  { id: 'match',      label: 'Match pairs',icon: '🧩' },
]

// ─── Question Form ────────────────────────────────────────────────────────────
const QuestionForm: React.FC<{
  topicId: number
  initial?: Question
  onSave: (data: Partial<Question>) => void
  onCancel: () => void
  loading?: boolean
}> = ({ topicId, initial, onSave, onCancel, loading }) => {
  const [text, setText] = useState(initial?.text ?? '')
  const [explanation, setExplanation] = useState(initial?.explanation ?? '')
  const [choices, setChoices] = useState<Choice[]>(
    initial?.choices ?? [
      { text: '', isCorrect: true,  order: 0 },
      { text: '', isCorrect: false, order: 1 },
      { text: '', isCorrect: false, order: 2 },
      { text: '', isCorrect: false, order: 3 },
    ]
  )

  const setCorrect = (idx: number) =>
    setChoices(choices.map((c, i) => ({ ...c, isCorrect: i === idx })))

  const setChoiceText = (idx: number, val: string) =>
    setChoices(choices.map((c, i) => i === idx ? { ...c, text: val } : c))

  const handleSave = () => {
    if (!text.trim()) return
    onSave({ topicId, text, explanation, choices, type: 'multiple_choice' })
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea label="Question text" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Enter the question..." />
      <div>
        <label className="block text-xs font-mono text-[#6B7694] uppercase tracking-wider mb-2">
          Answer choices — click circle to mark correct
        </label>
        <div className="flex flex-col gap-2">
          {choices.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrect(i)}
                className={clsx(
                  'w-5 h-5 rounded-full border-2 shrink-0 transition-all',
                  c.isCorrect ? 'bg-[#10B981] border-[#10B981]' : 'border-[#1E2330] hover:border-[#3B82F6]',
                )}
              />
              <input
                value={c.text}
                onChange={(e) => setChoiceText(i, e.target.value)}
                placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0A0C10] border border-[#1E2330] text-[#E8ECF4] text-sm placeholder:text-[#2A3149] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
      <Textarea label="Explanation (optional)" value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} placeholder="Shown to students after answering..." />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} loading={loading} disabled={!text.trim()}>
          {initial ? 'Save changes' : 'Add question'}
        </Button>
      </div>
    </div>
  )
}

// ─── Flashcard Form ───────────────────────────────────────────────────────────
const FlashcardForm: React.FC<{
  topicId: number
  initial?: Flashcard
  onSave: (data: Partial<Flashcard>) => void
  onCancel: () => void
  loading?: boolean
}> = ({ topicId, initial, onSave, onCancel, loading }) => {
  const [term, setTerm]           = useState(initial?.term ?? '')
  const [definition, setDefinition] = useState(initial?.definition ?? '')
  const [category, setCategory]   = useState(initial?.category ?? '')

  return (
    <div className="flex flex-col gap-4">
      <Input label="Term" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Mitochondria" />
      <Textarea label="Definition" value={definition} onChange={(e) => setDefinition(e.target.value)} rows={3} placeholder="e.g. The organelle responsible for producing ATP..." />
      <Input label="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. BIOLOGY · CELLS" />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ topicId, term, definition, category })} loading={loading} disabled={!term.trim() || !definition.trim()}>
          {initial ? 'Save changes' : 'Add flashcard'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ContentPage: React.FC = () => {
  const qc = useQueryClient()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [activeTab, setActiveTab] = useState<ContentTab>('questions')
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [showAddFlashcard, setShowAddFlashcard] = useState(false)
  const [editQuestion, setEditQuestion] = useState<Question | null>(null)
  const [editFlashcard, setEditFlashcard] = useState<Flashcard | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'question' | 'flashcard'; id: number } | null>(null)

  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: subjectsApi.list })
  const { data: topics = [] }   = useQuery({
    queryKey: ['topics', selectedSubject?.id],
    queryFn: () => topicsApi.list(selectedSubject!.id),
    enabled: !!selectedSubject,
  })
  const { data: questions = [] } = useQuery({
    queryKey: ['questions', selectedTopic?.id],
    queryFn: () => questionsApi.list(selectedTopic!.id),
    enabled: !!selectedTopic && activeTab === 'questions',
  })
  const { data: flashcards = [] } = useQuery({
    queryKey: ['flashcards', selectedTopic?.id],
    queryFn: () => flashcardsApi.list(selectedTopic!.id),
    enabled: !!selectedTopic && activeTab === 'flashcards',
  })

  const addQ = useMutation({
    mutationFn: questionsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['questions', selectedTopic?.id] }); setShowAddQuestion(false) },
  })
  const updateQ = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Question> }) => questionsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['questions', selectedTopic?.id] }); setEditQuestion(null) },
  })
  const deleteQ = useMutation({
    mutationFn: questionsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['questions', selectedTopic?.id] }); setDeleteTarget(null) },
  })
  const addF = useMutation({
    mutationFn: flashcardsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['flashcards', selectedTopic?.id] }); setShowAddFlashcard(false) },
  })
  const updateF = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Flashcard> }) => flashcardsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['flashcards', selectedTopic?.id] }); setEditFlashcard(null) },
  })
  const deleteF = useMutation({
    mutationFn: flashcardsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['flashcards', selectedTopic?.id] }); setDeleteTarget(null) },
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#E8ECF4] mb-0.5">Content</h1>
        <p className="text-sm text-[#6B7694]">Manage subjects, topics, questions and flashcards</p>
      </div>

      <div className="grid grid-cols-4 gap-4 items-start">

        {/* ── Column 1: Subjects ── */}
        <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1E2330]">
            <div className="font-syne text-[13px] font-bold text-[#E8ECF4]">Subjects</div>
          </div>
          <div className="flex flex-col">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedSubject(s); setSelectedTopic(null) }}
                className={clsx(
                  'flex items-center gap-2.5 px-4 py-3 text-left border-b border-[#1E2330] last:border-0 transition-all text-sm',
                  selectedSubject?.id === s.id
                    ? 'bg-[#3B82F6]/08 text-[#E8ECF4] border-l-2 border-l-[#3B82F6]'
                    : 'text-[#6B7694] hover:text-[#E8ECF4] hover:bg-white/[0.02]',
                )}
              >
                <span>{s.icon}</span>
                <span className="font-medium truncate">{s.name}</span>
              </button>
            ))}
            {subjects.length === 0 && (
              <div className="py-8 text-center text-xs text-[#6B7694]">No subjects</div>
            )}
          </div>
        </div>

        {/* ── Column 2: Topics ── */}
        <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1E2330]">
            <div className="font-syne text-[13px] font-bold text-[#E8ECF4]">
              {selectedSubject ? selectedSubject.name : 'Topics'}
            </div>
          </div>
          {!selectedSubject ? (
            <div className="py-8 text-center text-xs text-[#6B7694]">Select a subject</div>
          ) : (
            <div className="flex flex-col">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={clsx(
                    'flex flex-col px-4 py-3 text-left border-b border-[#1E2330] last:border-0 transition-all',
                    selectedTopic?.id === t.id
                      ? 'bg-[#3B82F6]/08 border-l-2 border-l-[#3B82F6]'
                      : 'hover:bg-white/[0.02]',
                  )}
                >
                  <span className={clsx('text-sm font-medium truncate', selectedTopic?.id === t.id ? 'text-[#E8ECF4]' : 'text-[#6B7694]')}>
                    {t.title}
                  </span>
                  <span className="font-mono text-[10px] text-[#2A3149]">{t.questionCount} questions</span>
                </button>
              ))}
              {topics.length === 0 && (
                <div className="py-8 text-center text-xs text-[#6B7694]">No topics</div>
              )}
            </div>
          )}
        </div>

        {/* ── Columns 3–4: Content editor ── */}
        <div className="col-span-2 flex flex-col gap-3">
          {!selectedTopic ? (
            <div className="bg-[#161A22] border border-[#1E2330] rounded-xl">
              <EmptyState icon="📂" title="Select a topic" description="Choose a subject and topic on the left to manage its content" />
            </div>
          ) : (
            <>
              {/* Tab bar */}
              <div className="flex gap-1 bg-[#111318] border border-[#1E2330] rounded-xl p-1">
                {CONTENT_TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                      activeTab === t.id ? 'bg-[#161A22] text-[#E8ECF4]' : 'text-[#6B7694] hover:text-[#E8ECF4]',
                    )}
                  >
                    <span>{t.icon}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Questions tab */}
              {activeTab === 'questions' && (
                <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2330]">
                    <div>
                      <div className="font-syne text-[13px] font-bold text-[#E8ECF4]">Questions</div>
                      <div className="font-mono text-[10px] text-[#6B7694]">{selectedTopic.title} · {questions.length} total</div>
                    </div>
                    <Button size="sm" icon={<span>+</span>} onClick={() => setShowAddQuestion(true)}>Add question</Button>
                  </div>
                  <div className="flex flex-col divide-y divide-[#1E2330]">
                    {questions.map((q) => (
                      <div key={q.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#E8ECF4] mb-2 leading-snug">{q.text}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {q.choices.map((c) => (
                                <span
                                  key={c.id}
                                  className={clsx(
                                    'text-[11px] font-mono px-2 py-0.5 rounded',
                                    c.isCorrect
                                      ? 'bg-[#10B981]/12 text-[#34D399]'
                                      : 'bg-[#1E2330] text-[#6B7694]',
                                  )}
                                >
                                  {c.isCorrect && '✓ '}{c.text}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setEditQuestion(q)}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ type: 'question', id: q.id })}>Del</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <EmptyState icon="❓" title="No questions yet" description="Add your first question for this topic" action={<Button size="sm" onClick={() => setShowAddQuestion(true)}>Add question</Button>} />
                    )}
                  </div>
                </div>
              )}

              {/* Flashcards tab */}
              {activeTab === 'flashcards' && (
                <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2330]">
                    <div>
                      <div className="font-syne text-[13px] font-bold text-[#E8ECF4]">Flashcards</div>
                      <div className="font-mono text-[10px] text-[#6B7694]">{selectedTopic.title} · {flashcards.length} total</div>
                    </div>
                    <Button size="sm" icon={<span>+</span>} onClick={() => setShowAddFlashcard(true)}>Add card</Button>
                  </div>
                  <div className="flex flex-col divide-y divide-[#1E2330]">
                    {flashcards.map((f) => (
                      <div key={f.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#E8ECF4] mb-1">{f.term}</div>
                          <div className="text-[12px] text-[#6B7694] leading-snug">{f.definition}</div>
                          {f.category && <Badge label={f.category} color="blue" className="mt-2" />}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => setEditFlashcard(f)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ type: 'flashcard', id: f.id })}>Del</Button>
                        </div>
                      </div>
                    ))}
                    {flashcards.length === 0 && (
                      <EmptyState icon="🃏" title="No flashcards yet" description="Add term-definition pairs for this topic" action={<Button size="sm" onClick={() => setShowAddFlashcard(true)}>Add flashcard</Button>} />
                    )}
                  </div>
                </div>
              )}

              {/* Scramble + Match placeholder */}
              {(activeTab === 'scramble' || activeTab === 'match') && (
                <div className="bg-[#161A22] border border-[#1E2330] rounded-xl">
                  <EmptyState
                    icon={activeTab === 'scramble' ? '🔤' : '🧩'}
                    title={`${activeTab === 'scramble' ? 'Word scramble' : 'Match pairs'} editor`}
                    description="Manage via the Django admin panel at localhost:8000/admin"
                    action={<Badge label="Coming soon" color="amber" />}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={showAddQuestion} onClose={() => setShowAddQuestion(false)} title="Add question" size="lg">
        {selectedTopic && (
          <QuestionForm
            topicId={selectedTopic.id}
            onSave={(data) => addQ.mutate(data)}
            onCancel={() => setShowAddQuestion(false)}
            loading={addQ.isPending}
          />
        )}
      </Modal>

      <Modal open={!!editQuestion} onClose={() => setEditQuestion(null)} title="Edit question" size="lg">
        {editQuestion && selectedTopic && (
          <QuestionForm
            topicId={selectedTopic.id}
            initial={editQuestion}
            onSave={(data) => updateQ.mutate({ id: editQuestion.id, data })}
            onCancel={() => setEditQuestion(null)}
            loading={updateQ.isPending}
          />
        )}
      </Modal>

      <Modal open={showAddFlashcard} onClose={() => setShowAddFlashcard(false)} title="Add flashcard">
        {selectedTopic && (
          <FlashcardForm
            topicId={selectedTopic.id}
            onSave={(data) => addF.mutate(data)}
            onCancel={() => setShowAddFlashcard(false)}
            loading={addF.isPending}
          />
        )}
      </Modal>

      <Modal open={!!editFlashcard} onClose={() => setEditFlashcard(null)} title="Edit flashcard">
        {editFlashcard && selectedTopic && (
          <FlashcardForm
            topicId={selectedTopic.id}
            initial={editFlashcard}
            onSave={(data) => updateF.mutate({ id: editFlashcard.id, data })}
            onCancel={() => setEditFlashcard(null)}
            loading={updateF.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.type}`}
        message={`Are you sure you want to delete this ${deleteTarget?.type}? This action cannot be undone.`}
        onConfirm={() => {
          if (!deleteTarget) return
          if (deleteTarget.type === 'question') deleteQ.mutate(deleteTarget.id)
          else deleteF.mutate(deleteTarget.id)
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteQ.isPending || deleteF.isPending}
      />
    </div>
  )
}
