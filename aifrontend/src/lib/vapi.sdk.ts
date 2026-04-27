import Vapi from '@vapi-ai/web'

let vapiSingleton: Vapi | null = null

export const getVapiClient = (): Vapi | null => {
  if (typeof window === 'undefined') return null

  const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN

  if (!token) {
    console.warn('Missing VAPI token')
    return null
  }

  if (!vapiSingleton) {
    vapiSingleton = new Vapi(token)
  }

  return vapiSingleton
}

export const buildInterviewAssistant = ({
  interviewTitle,
  questions = [],
}: {
  interviewTitle?: string
  questions?: string[]
}) => {
  const questionsList =
    questions.length > 0
      ? `\n\nInterview questions to ask (in order, read exactly as written):\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : ''

  return {
    name: 'Interview Assistant',

    firstMessage: `Welcome to ${interviewTitle || 'your interview'}. I'll be conducting your interview today. Let me start with the first question.`,

    transcriber: {
      provider: 'deepgram' as const,
      model: 'nova-2',
      language: 'en-US' as const,
    },

    model: {
      provider: 'openai' as const,
      model: 'gpt-4o-mini' as const,
      temperature: 0.7,
      messages: [],
    },

    voice: {
      provider: '11labs' as const,
      voiceId: '21m00Tcm4TlvDq8ikWAM',
      stability: 0.5,
      similarityBoost: 0.75,
    },

    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,

    clientMessages: [
      'transcript',
      'hang',
      'function-call',
      'speech-update',
      'metadata',
      'conversation-update',
    ],

    serverMessages: [],

    systemPrompt: `You are a professional AI interviewer conducting a structured interview.

CRITICAL RULES:
1. Ask questions EXACTLY as written below - do not paraphrase
2. Wait for the user to finish their complete answer
3. After each answer, briefly acknowledge (e.g., "Thank you" or "Got it") then ask the next question
4. Do NOT ask follow-up questions or probe deeper
5. Do NOT provide feedback on answer quality
6. Stay on script - only ask the provided questions in order

QUESTIONS TO ASK:${questionsList}

Begin by asking question #1.`,
  }
}
