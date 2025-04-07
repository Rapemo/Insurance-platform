import { StreamingTextResponse, LangChainStream } from "ai"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1]

    // Create a system prompt template
    const systemPromptTemplate = PromptTemplate.fromTemplate(`
      You are an AI insurance assistant for InsureAI, a comprehensive insurance platform.
      
      You can help with:
      - Explaining policy details and coverage options
      - Providing information about claims processes
      - Answering general insurance questions
      - Offering guidance on risk management
      
      Current policies available:
      - Auto Insurance (comprehensive, collision, liability)
      - Home Insurance (dwelling, personal property, liability)
      - Life Insurance (term, whole life, universal)
      
      Be helpful, clear, and concise in your responses. If you don't know something, 
      say so rather than making up information.
      
      User query: {query}
    `)

    // Set up the language model
    const { stream, handlers } = LangChainStream()

    const llm = new ChatOpenAI({
      modelName: "gpt-4o",
      streaming: true,
    })

    // Create a chain that processes the user's query
    const chain = RunnableSequence.from([
      {
        query: (input) => input.query,
      },
      systemPromptTemplate,
      llm,
      new StringOutputParser(),
    ])

    // Execute the chain with the user's message
    chain.invoke(
      {
        query: lastMessage.content,
      },
      { callbacks: [handlers] },
    )

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "An error occurred during processing" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

