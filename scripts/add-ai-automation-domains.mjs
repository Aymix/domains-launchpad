#!/usr/bin/env node
/**
 * Add two new domains under a new "AI & Automation" cluster:
 *   - Applied AI & Generative AI  (building WITH LLMs: prompts, RAG, agents, APIs)
 *   - Workflow Automation & No-Code  (Zapier / Make / n8n / Power Automate / RPA)
 *
 * Idempotent: re-running replaces the two domains and ensures the cluster exists.
 *   node scripts/add-ai-automation-domains.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const kbPath = join(__dirname, '..', 'src/content/knowledge-base.json')
const kb = JSON.parse(await readFile(kbPath, 'utf8'))

const CLUSTER = 'AI & Automation'

const appliedAi = {
  slug: 'applied-ai',
  name: 'Applied AI & Generative AI',
  cluster: CLUSTER,
  icon: '✨',
  tagline: 'Build real things with AI you didn’t train yourself, chatbots, assistants, and tools powered by large language models.',
  introVideo: {
    url: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    videoId: 'G2fqAlgmoPo',
    title: 'Introduction to Generative AI',
    channel: 'Google Cloud Tech',
  },
  overview:
    'Applied AI is about using AI that already exists instead of building it from scratch. Companies like OpenAI, Google, and Anthropic spent millions training huge models (the ones behind ChatGPT, Gemini, and Claude). Your job in this domain is to take those ready-made "brains" and wire them into useful products: a support chatbot, a tool that summarizes documents, an assistant that answers questions about your own files, or an "agent" that can take actions for you.\n\nThe key difference from the Machine Learning domain: there, you learn to train models from data. Here, you mostly call a model that someone else trained, through a simple API or a no-code tool, and focus on getting good results out of it. The main skills are prompting (asking the model the right way), giving the model the right context (so it answers from your data, not just its training), and chaining steps together so the AI can solve bigger tasks.\n\nThis field exploded after ChatGPT launched in late 2022, and "AI Engineer" is now one of the fastest-growing tech roles. The good news for a beginner: you can build something genuinely impressive in a weekend, because the hard part (the model) is already done. You bring the idea, the prompts, and the glue code.',
  whyItMatters:
    'Generative AI is being added to almost every app and workflow right now, so knowing how to build with it is one of the most in-demand skills of the decade. You don’t need a PhD or a giant computer, a laptop and an API key are enough to ship something real. It’s also a fast on-ramp: a beginner who can write clear prompts and connect an AI to real data is already useful to a team, even before learning deep machine learning.',
  isItForYou:
    'This fits you if you like building products and seeing quick results more than doing heavy math. If you enjoy writing, explaining things clearly, and experimenting until something works, prompting will feel natural. If you want to understand how the models actually work on the inside (the math, the training), pair this with the Artificial Intelligence & Machine Learning domain. Many people do applied AI first because it’s motivating, then go deeper later.',
  prerequisites: [
    'Basic computer comfort: installing things, copying API keys, using a code editor or a no-code tool',
    'A little Python or JavaScript helps a lot, but you can start with no-code tools and add code later',
    'Clear writing in plain language, prompting is mostly about explaining what you want precisely',
    'Curiosity and patience to experiment: you’ll try many prompts before one works well',
    'No advanced math required to start (that’s the Machine Learning domain, not this one)',
  ],
  coreConcepts: [
    { name: 'Large Language Model (LLM)', what: 'A huge AI trained on text that predicts the next word, which lets it write, summarize, translate, and answer questions. ChatGPT, Gemini, and Claude are LLMs.' },
    { name: 'Prompt', what: 'The instructions and question you give the model. Better prompts give better answers, this is the core skill of the field.' },
    { name: 'Prompt engineering', what: 'The craft of writing prompts that reliably get good results: giving examples, setting a role, asking step by step, and being specific.' },
    { name: 'Token', what: 'The chunks of text a model reads and writes (roughly ¾ of a word). You’re usually billed per token, and models have a token limit per request.' },
    { name: 'Context window', what: 'How much text the model can "see" at once (the prompt plus its answer). Bigger windows let you feed in more documents.' },
    { name: 'RAG (Retrieval-Augmented Generation)', what: 'Giving the model your own documents at question time so it answers from your data instead of guessing. This is how "chat with your PDFs" works.' },
    { name: 'Embeddings', what: 'A way to turn text into numbers that capture meaning, so a computer can find which of your documents is most relevant to a question.' },
    { name: 'Vector database', what: 'A store for embeddings that lets you quickly search by meaning, the memory behind most RAG apps.' },
    { name: 'Hallucination', what: 'When a model states something false but confidently. Managing and reducing this (with RAG, checks, and good prompts) is a key part of the job.' },
    { name: 'AI agent', what: 'An LLM given tools (search, code, APIs) and a goal, so it can take several steps on its own to get something done, not just chat.' },
    { name: 'Fine-tuning', what: 'Lightly retraining a ready-made model on your own examples to specialize it. Often optional, good prompting and RAG solve most beginner needs first.' },
    { name: 'API key', what: 'A secret password that lets your app call an AI provider’s model. You keep it private and are billed for usage.' },
  ],
  toolsAndTech: [
    'ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), the main chat assistants to learn on',
    'OpenAI API / Anthropic API / Google AI Studio (call models from your own code or no-code tools)',
    'Hugging Face (thousands of free open models, datasets, and demo "Spaces")',
    'Ollama / LM Studio (run open models like Llama locally on your own computer, free)',
    'LangChain / LlamaIndex (popular frameworks for building RAG apps and agents)',
    'Vector databases: Chroma, Pinecone, Weaviate (memory for RAG)',
    'Python (most common) or JavaScript/TypeScript (great for web apps)',
    'Cursor / GitHub Copilot (AI coding assistants that speed you up while building)',
    'Streamlit / Gradio (turn a Python script into a shareable web app in minutes)',
    'n8n / Make / Zapier (wire AI into automations with little or no code)',
  ],
  roadmap: [
    {
      stage: 'Beginner (Weeks 0-4): Get great at talking to AI',
      goal: 'Be able to get reliable, useful answers from ChatGPT/Claude/Gemini for real tasks, and understand what these models can and can’t do.',
      steps: [
        'Use a free chat assistant daily for real tasks: drafting, summarizing, explaining, brainstorming',
        'Learn the basics of prompting: be specific, give it a role, show examples, ask it to think step by step',
        'Watch a short "what is generative AI / LLM" explainer so the words make sense',
        'Read a beginner prompt-engineering guide and try each technique on your own tasks',
        'Notice failures: when it makes things up (hallucinates) and how rephrasing fixes it',
      ],
      milestoneProject: 'Build a "prompt toolkit": 5 prompts you’ve refined for tasks you actually do (e.g. summarize an article, rewrite an email, explain code). Save the before/after to see the improvement.',
    },
    {
      stage: 'Building (Months 1-3): Call AI from your own app',
      goal: 'Connect to an AI model with code or a no-code tool and build a small working app around it.',
      steps: [
        'Get an API key (OpenAI, Anthropic, or free Google AI Studio) and make your first API call',
        'Learn just enough Python or JavaScript to send a prompt and show the response',
        'Use Streamlit or Gradio to turn your script into a simple web app you can share',
        'Try running an open model locally with Ollama so you understand the open-source side',
        'Or skip code at first: build the same idea in n8n/Make so you see the no-code path too',
      ],
      milestoneProject: 'Ship a small AI app: e.g. a "tone rewriter" that turns rough notes into a polite email, or a study-buddy that quizzes you on a topic. Put it online with Streamlit or a free host.',
    },
    {
      stage: 'Intermediate (Months 3-6): Make AI use YOUR data (RAG)',
      goal: 'Build an app that answers questions from your own documents, the single most useful pattern in applied AI.',
      steps: [
        'Understand embeddings and vector search at a high level (text → numbers → find similar)',
        'Use LangChain or LlamaIndex to load documents, split them, and store embeddings',
        'Build a "chat with your documents" app over a few PDFs or notes you care about',
        'Learn to reduce hallucinations: cite sources, say "I don’t know", keep answers grounded in retrieved text',
        'Add basic evaluation: a list of test questions you check the answers against',
      ],
      milestoneProject: 'Build a RAG assistant over a real document set you own (course notes, a product manual, your blog). It should answer questions and show which document each answer came from.',
    },
    {
      stage: 'Advanced (Months 6+): Agents, tools, and production',
      goal: 'Build AI that takes actions, and learn what it takes to run an AI feature reliably for real users.',
      steps: [
        'Build a simple agent: give the model tools (web search, a calculator, an API) and let it decide steps',
        'Learn cost and latency basics: token usage, caching, choosing a smaller model when it’s enough',
        'Add guardrails: input checks, output validation, and limits so the AI behaves safely',
        'Compare models (OpenAI vs Claude vs open models) and pick by quality, speed, and price',
        'Learn the basics of responsible AI: privacy, bias, and being honest about what’s AI-generated',
      ],
      milestoneProject: 'Build an agent that completes a multi-step task end to end, e.g. "research a topic, summarize 3 sources, and draft an email", with a clear log of every step it took.',
    },
  ],
  freeCourses: [
    { title: 'Generative AI for Beginners (18 lessons)', url: 'https://github.com/microsoft/generative-ai-for-beginners', provider: 'Microsoft', level: 'Beginner', note: 'A free, hands-on course covering prompts, building apps, RAG, and agents, with code in Python and JavaScript. One of the best starting points. Free.' },
    { title: 'ChatGPT Prompt Engineering for Developers', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', provider: 'DeepLearning.AI + OpenAI', level: 'Beginner', note: 'A short, famous free course by Andrew Ng and OpenAI on prompting from code. About 1.5 hours. Free.' },
    { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', provider: 'DAIR.AI', level: 'Beginner to Advanced', note: 'The most complete free, open guide to prompting techniques, with clear examples for each. Free.' },
    { title: 'Elements of AI', url: 'https://www.elementsofai.com/', provider: 'University of Helsinki + MinnaLearn', level: 'Beginner', note: 'A famous free, no-code course on what AI is and how it works in plain language. Great for the big picture. Free.' },
    { title: 'Hugging Face Learn (LLM & NLP courses)', url: 'https://huggingface.co/learn', provider: 'Hugging Face', level: 'Beginner to Intermediate', note: 'Free, practical courses on using and building with open models, agents, and more. Free.' },
    { title: 'Anthropic Courses (prompt engineering & building with Claude)', url: 'https://github.com/anthropics/courses', provider: 'Anthropic', level: 'Beginner to Intermediate', note: 'Free, step-by-step notebooks teaching real prompting and app-building skills from the makers of Claude. Free.' },
    { title: 'Introduction to Generative AI Learning Path', url: 'https://www.cloudskillsboost.google/paths/118', provider: 'Google Cloud', level: 'Beginner', note: 'Short free intro courses explaining generative AI and LLMs from the ground up. Free.' },
  ],
  youtubeChannels: [
    { name: 'Andrej Karpathy', url: 'https://www.youtube.com/@AndrejKarpathy', whyGood: 'A founding member of OpenAI who explains how LLMs really work in famously clear, beginner-friendly talks. His "Intro to Large Language Models" is a must-watch.' },
    { name: 'IBM Technology', url: 'https://www.youtube.com/@IBMTechnology', whyGood: 'Short, whiteboard-style explainers on generative AI, RAG, agents, and embeddings. Perfect when a concept confuses you.' },
    { name: 'DeepLearning.AI', url: 'https://www.youtube.com/@DeepLearningAI', whyGood: 'Andrew Ng’s organization. Trustworthy, structured explanations and course previews on building with AI.' },
    { name: 'Two Minute Papers', url: 'https://www.youtube.com/@TwoMinutePapers', whyGood: 'Bite-size, excited tours of the latest AI breakthroughs. Great for staying current and motivated.' },
    { name: 'sentdex', url: 'https://www.youtube.com/@sentdex', whyGood: 'Hands-on Python coding with AI, building real things step by step. Good once you start writing code.' },
    { name: 'Prompt Engineering', url: 'https://www.youtube.com/@engineerprompt', whyGood: 'Practical walkthroughs of building RAG apps, agents, and local LLM setups with current tools.' },
  ],
  articlesAndDocs: [
    { title: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', provider: 'OpenAI', level: 'Beginner to Intermediate', note: 'Official, practical tips for getting better results from models. Clear and short.' },
    { title: 'Anthropic Prompt Engineering Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', provider: 'Anthropic', level: 'Beginner to Intermediate', note: 'A well-organized, example-rich guide to prompting that applies to most models, not just Claude.' },
    { title: 'What is Retrieval-Augmented Generation (RAG)?', url: 'https://aws.amazon.com/what-is/retrieval-augmented-generation/', provider: 'AWS', level: 'Beginner', note: 'A clear plain-language explanation of the most important pattern in applied AI.' },
    { title: 'Hugging Face Documentation', url: 'https://huggingface.co/docs', provider: 'Hugging Face', level: 'Beginner to Advanced', note: 'The reference hub for open models, the Transformers library, and demo Spaces.' },
    { title: 'LangChain Documentation (Introduction)', url: 'https://python.langchain.com/docs/introduction/', provider: 'LangChain', level: 'Intermediate', note: 'Docs and quickstarts for the most popular framework for chaining LLM calls, RAG, and agents.' },
  ],
  interactivePractice: [
    { name: 'Google AI Studio', url: 'https://aistudio.google.com/', note: 'Try prompts and build with Gemini for free in the browser, with a generous free tier and an API key when you’re ready. Free.' },
    { name: 'Hugging Face Spaces', url: 'https://huggingface.co/spaces', note: 'Thousands of live AI demos you can use and copy. A great way to see what’s possible and learn from others’ code. Free.' },
    { name: 'OpenAI Playground', url: 'https://platform.openai.com/playground', note: 'A sandbox to experiment with prompts and settings before putting them in code. (Usage is billed via API credits.)' },
    { name: 'Ollama', url: 'https://ollama.com/', note: 'Run open models like Llama and Mistral locally on your own machine with one command. Free and private.' },
    { name: 'Kaggle (LLM courses & notebooks)', url: 'https://www.kaggle.com/learn', note: 'Free hands-on lessons and free notebooks (with GPUs) to practice building AI features. Free.' },
  ],
  communities: [
    { name: 'r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/', note: 'The most active community for running and building with open models. Practical, fast-moving, beginner-friendly.' },
    { name: 'Hugging Face Forums', url: 'https://discuss.huggingface.co/', note: 'Friendly Q&A for using open models, Transformers, and Spaces.' },
    { name: 'OpenAI Developer Community', url: 'https://community.openai.com/', note: 'Official forum for API questions, prompt help, and sharing what you built.' },
    { name: 'r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', note: 'Broader AI/ML discussion and news; useful for keeping up with the field.' },
  ],
  projectIdeas: [
    { title: 'Chat with your documents (RAG)', what: 'Upload a few PDFs or notes and ask questions, with the app citing which document each answer came from.', difficulty: 'Intermediate' },
    { title: 'Personal email/tone rewriter', what: 'Paste rough notes and get back a polished email in a tone you pick (formal, friendly, brief).', difficulty: 'Beginner' },
    { title: 'Study buddy quiz generator', what: 'Give it your course notes and it makes flashcards and quizzes you, then explains wrong answers.', difficulty: 'Beginner' },
    { title: 'Meeting-notes summarizer', what: 'Paste a transcript and get a summary, decisions, and action items in a clean format.', difficulty: 'Beginner' },
    { title: 'Customer-support assistant', what: 'A chatbot grounded in a product’s FAQ/manual that answers only from that content and escalates when unsure.', difficulty: 'Intermediate' },
    { title: 'Research agent', what: 'An agent that searches the web, reads a few sources, and drafts a short cited summary on a topic.', difficulty: 'Advanced' },
  ],
  careerPaths: [
    'AI Engineer / AI Application Developer (build LLM-powered features and products; one of the fastest-growing roles)',
    'Prompt Engineer / AI Solutions specialist (design prompts and workflows that get reliable results)',
    'AI Product Manager (decide what AI features to build and how to make them useful and safe)',
    'Generative AI consultant / freelancer (help businesses add AI to their tools and processes)',
    'Developer Advocate / AI educator (teach and create content about building with AI)',
  ],
  timeToJobReady:
    '3-6 months to build a portfolio of small AI apps, faster if you already code. Because demand is so high and the barrier to a working demo is low, a few strong projects (especially a solid RAG app) can open doors quickly.',
  commonMistakes: [
    'Thinking you must train your own model, for most products you just call an existing one.',
    'Vague prompts: being unspecific and then blaming the model. Specific instructions and examples fix most issues.',
    'Trusting outputs blindly, models hallucinate. Always verify important facts and use RAG to ground answers.',
    'Skipping the data part, the magic is usually in feeding the model the right context, not in the prompt alone.',
    'Ignoring cost, large prompts and big models add up. Learn token usage and pick the smallest model that works.',
    'Hard-coding your API key into public code, keep secrets private or you’ll get billed for someone else’s use.',
    'Chasing every new tool instead of shipping one finished project that proves your skills.',
  ],
  glossary: [
    { term: 'LLM', definition: 'Large Language Model: an AI trained on huge amounts of text that predicts the next word, powering chat assistants.' },
    { term: 'Prompt', definition: 'The instructions you give an AI model to get a response.' },
    { term: 'Token', definition: 'A chunk of text (about ¾ of a word) that models read and generate, and that you’re usually billed by.' },
    { term: 'Context window', definition: 'The maximum amount of text a model can consider at once, including your prompt and its answer.' },
    { term: 'RAG', definition: 'Retrieval-Augmented Generation: fetching your own documents and giving them to the model so it answers from your data.' },
    { term: 'Embedding', definition: 'A list of numbers that represents the meaning of text, used to find related content by meaning.' },
    { term: 'Vector database', definition: 'A database built to store embeddings and search them by similarity.' },
    { term: 'Hallucination', definition: 'When an AI confidently states something that is not true.' },
    { term: 'Agent', definition: 'An AI given tools and a goal so it can take multiple steps on its own to complete a task.' },
    { term: 'Fine-tuning', definition: 'Further training a ready-made model on your own examples to specialize its behavior.' },
    { term: 'Inference', definition: 'Running a trained model to get an output, what happens every time you send a prompt.' },
    { term: 'Open model', definition: 'A model whose weights are publicly available (e.g. Llama, Mistral) so you can run it yourself, often free.' },
  ],
  relatedDomains: ['ai-machine-learning', 'automation-workflow', 'web-development', 'data-science'],
  verificationNotes: [
    'Intro video verified via YouTube oEmbed: "Introduction to Generative AI" by Google Cloud Tech (G2fqAlgmoPo), embeddable and live.',
    'All listed resources are well-known, free or freemium, and use stable canonical URLs: Microsoft Generative AI for Beginners (GitHub), DeepLearning.AI ChatGPT Prompt Engineering short course, DAIR.AI Prompting Guide, Elements of AI, Hugging Face Learn/Docs/Spaces, Anthropic Courses (GitHub) and prompt-engineering docs, Google Cloud Skills Boost intro path and AI Studio, OpenAI prompt-engineering guide and Playground, AWS RAG explainer, LangChain docs, Ollama, Kaggle Learn.',
    'YouTube channels are real and active: @AndrejKarpathy, @IBMTechnology, @DeepLearningAI, @TwoMinutePapers, @sentdex, @engineerprompt.',
    'This domain is intentionally distinct from "Artificial Intelligence & Machine Learning": it focuses on building applications WITH pre-trained models (prompting, RAG, agents, APIs) rather than training models from data. The two are cross-linked.',
  ],
}

const automation = {
  slug: 'automation-workflow',
  name: 'Workflow Automation & No-Code',
  cluster: CLUSTER,
  icon: '⚙️',
  tagline: 'Make boring, repetitive work happen automatically, connect your apps so tasks run themselves, often with no code at all.',
  introVideo: {
    url: 'https://www.youtube.com/watch?v=IIczUjFIHw0',
    videoId: 'IIczUjFIHw0',
    title: 'What Is Workflow Automation? | Beginner’s Guide to Building Your First Workflow',
    channel: 'Workload',
  },
  overview:
    'Workflow automation is the art of making your tools do repetitive work for you, without you clicking through it every time. Think "when a new form is submitted, save it to a spreadsheet, send the team a message, and email the customer a receipt", all happening by itself in seconds. You build these flows by connecting apps together, usually by dragging boxes and filling in settings rather than writing code.\n\nThe pattern is almost always the same: a trigger ("when this happens") starts the flow, then a series of actions ("do these things") run in order. A trigger might be a new email, a form response, a calendar event, or a scheduled time. Actions might be creating a row, sending a message, calling another app, or asking an AI to write something. Tools like Zapier, Make, and n8n give you hundreds of ready-made connections so you snap them together like LEGO.\n\nThis is one of the most practical, fastest-payoff skills out there. You don’t need a computer-science background, and you can automate something useful on day one (like saving email attachments to cloud storage). It’s hugely valuable at work, every business has repetitive tasks, and with AI now plugged into these tools, "AI automation" has become a popular freelance and career path on its own.',
  whyItMatters:
    'Every team wastes hours on copy-paste, data entry, and "moving things from app A to app B." If you can automate that, you save real time and money, which makes the skill easy to sell, whether you’re an employee, a freelancer, or running your own thing. It’s also the gentlest on-ramp into tech: you learn how apps, data, APIs, and logic work by building things that immediately help, all without a heavy coding requirement. Add AI on top and you can build smart automations that read, write, and decide.',
  isItForYou:
    'This fits you if you love making things tidy and efficient, and you get satisfaction from removing busywork. You don’t need to enjoy math or deep coding, you need to enjoy solving "how do I connect these and make it run by itself?" If you like the logic of automation and want to go deeper, it leads naturally into APIs, light scripting, and even the Applied AI domain. If you find pure coding intimidating but still want to build useful tech, this is a great place to start.',
  prerequisites: [
    'Comfort using everyday apps (email, spreadsheets, forms, chat tools)',
    'Logical, step-by-step thinking: "first this happens, then do that, unless…"',
    'Willingness to read app settings carefully and test flows until they work',
    'Basic spreadsheet skills (rows, columns, simple formulas) are a big help',
    'No coding required to start; a little later helps you go beyond the basics',
  ],
  coreConcepts: [
    { name: 'Trigger', what: 'The event that starts an automation, like "a new email arrives" or "a form is submitted." Every flow begins with one.' },
    { name: 'Action', what: 'A step the automation performs after the trigger, like "create a spreadsheet row" or "send a Slack message."' },
    { name: 'Workflow (scenario / zap)', what: 'The whole automation: a trigger plus the chain of actions. Called a "Zap" in Zapier, a "Scenario" in Make, a "Workflow" in n8n.' },
    { name: 'No-code / low-code', what: 'Building software by configuring visual blocks instead of writing code (no-code), or mostly visual with a little code where needed (low-code).' },
    { name: 'Integration / connector', what: 'A ready-made link between the automation tool and an app (Gmail, Sheets, Slack), so you don’t build the connection yourself.' },
    { name: 'API', what: 'A way for apps to talk to each other. Connectors use APIs under the hood; learning a bit about them unlocks any app, even unsupported ones.' },
    { name: 'Webhook', what: 'A URL that an app calls the instant something happens, a fast, universal way to trigger automations from almost anything.' },
    { name: 'Field mapping', what: 'Telling the flow which piece of data goes where, like sending the form’s "email" field into the email step’s "to" field.' },
    { name: 'Condition / filter (logic)', what: 'Rules that decide what runs, like "only continue if the order is over $100" or branching into different paths.' },
    { name: 'Data transformation', what: 'Reshaping data between steps: formatting dates, splitting text, doing math, so the next app gets exactly what it expects.' },
    { name: 'RPA (Robotic Process Automation)', what: 'Software "robots" that click and type in apps like a human would, used to automate older systems that have no API.' },
    { name: 'AI step / AI automation', what: 'Adding an AI action into a flow, like having it summarize an email or draft a reply, so automations can handle messy, language-based tasks.' },
  ],
  toolsAndTech: [
    'Zapier (the most popular, beginner-friendly automation tool; huge app library)',
    'Make (formerly Integromat) (visual, powerful, great free tier for complex flows)',
    'n8n (open-source, can self-host for free; popular for AI automations)',
    'Microsoft Power Automate (automation across Microsoft 365 and Windows)',
    'IFTTT (the simplest tool for personal/home automations)',
    'Airtable / Notion (databases-as-apps that pair perfectly with automations)',
    'Google Apps Script (free light scripting to automate Google Workspace)',
    'Webhooks & REST APIs (the universal glue for connecting anything)',
    'Pipedream / Activepieces (developer-friendly and open-source automation platforms)',
    'UiPath / Automation Anywhere (enterprise RPA tools for clicking through legacy apps)',
    'AI models (OpenAI, Claude, Gemini) plugged in as steps for "AI automation"',
  ],
  roadmap: [
    {
      stage: 'Beginner (Weeks 0-3): Build your first working automations',
      goal: 'Understand triggers and actions and ship a few simple flows that save you real clicks.',
      steps: [
        'Watch a short "what is workflow automation" explainer to get the trigger → action idea',
        'Make a free Zapier or Make account and connect two apps you already use',
        'Build a classic first flow: "new form response → add a row to a spreadsheet → notify me"',
        'Learn field mapping: how data from the trigger flows into each action',
        'Add a filter so the flow only runs in certain cases (e.g. only paid orders)',
      ],
      milestoneProject: 'Automate one annoying task in your own life: e.g. save Gmail attachments to Google Drive automatically, or post every new RSS article to a Telegram/Discord channel.',
    },
    {
      stage: 'Building (Months 1-3): Multi-step flows and logic',
      goal: 'Build longer automations with branching, formatting, and multiple apps that solve a real process.',
      steps: [
        'Chain 4-6 steps across several apps (form → sheet → email → chat → calendar)',
        'Use conditions and branches (paths/routers) to handle different cases',
        'Transform data between steps: format dates, split names, do simple math',
        'Learn to test, watch run history, and fix flows when a step fails',
        'Try Make for visual, more complex scenarios and compare it to Zapier',
      ],
      milestoneProject: 'Build a small "mini-CRM": a form that captures leads into a database (Airtable/Sheets), tags them by type, emails a tailored welcome, and alerts your team, all automatically.',
    },
    {
      stage: 'Intermediate (Months 3-6): APIs, webhooks, and AI',
      goal: 'Go beyond ready-made connectors and add AI so your automations can handle language and decisions.',
      steps: [
        'Use webhooks to trigger flows from any app, even ones without a built-in connector',
        'Make raw API/HTTP calls to connect an app that isn’t in the library',
        'Add an AI step (OpenAI/Claude/Gemini) to summarize, classify, or draft text inside a flow',
        'Learn n8n (self-hostable, free) for more control and AI-heavy automations',
        'Handle errors gracefully: retries, fallback paths, and alerts when something breaks',
      ],
      milestoneProject: 'Build an AI-powered inbox helper: when an email arrives, AI summarizes it, decides its category, logs it to a sheet, and drafts a suggested reply for you to approve.',
    },
    {
      stage: 'Advanced (Months 6+): Reliable systems & getting paid',
      goal: 'Design dependable automations for real businesses and (optionally) turn the skill into freelance income.',
      steps: [
        'Design for reliability: monitoring, logging, error handling, and clear documentation',
        'Think about data privacy and security: who can see the data your flows touch',
        'Explore RPA (UiPath/Power Automate Desktop) for apps with no API',
        'Optimize cost: task/operation limits, batching, and choosing the right tool for the job',
        'Package your skills: build templates and case studies you can sell or show employers',
      ],
      milestoneProject: 'Automate a complete real-world process end to end for someone (a friend’s small business, a club, a freelance client), then write a short case study showing the time it saves.',
    },
  ],
  freeCourses: [
    { title: 'Zapier Learn (guided courses & tutorials)', url: 'https://learn.zapier.com/', provider: 'Zapier', level: 'Beginner', note: 'Free official lessons that take you from your first Zap to multi-step automations. The easiest place to start. Free.' },
    { title: 'Make Academy', url: 'https://academy.make.com/', provider: 'Make', level: 'Beginner to Intermediate', note: 'Free structured courses for Make’s visual builder, from basics to advanced scenarios. Free.' },
    { title: 'n8n Courses & Docs', url: 'https://docs.n8n.io/courses/', provider: 'n8n', level: 'Beginner to Intermediate', note: 'Free text and video courses for the open-source tool that’s popular for AI automations. Free.' },
    { title: 'Microsoft Power Automate Learning Path', url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-automate/', provider: 'Microsoft', level: 'Beginner', note: 'Free official training for automating across Microsoft 365 and the desktop. Free.' },
    { title: 'UiPath Academy (RPA)', url: 'https://academy.uipath.com/', provider: 'UiPath', level: 'Beginner to Advanced', note: 'The leading free training for Robotic Process Automation, with recognized certificates. Free.' },
    { title: 'Build Your Own AI Automations with n8n (full course)', url: 'https://www.youtube.com/watch?v=AURnISajubk', provider: 'Jono Catliff (YouTube)', level: 'Beginner', note: 'A free, long-form, hands-on beginner course for building AI-powered automations in n8n. Free.' },
  ],
  youtubeChannels: [
    { name: 'n8n', url: 'https://www.youtube.com/@n8n-io', whyGood: 'Official channel of the open-source tool. Clear tutorials on building real (and AI-powered) automations from scratch.' },
    { name: 'Make', url: 'https://www.youtube.com/@MakeHQ', whyGood: 'Official Make channel with visual, beginner-friendly scenario walkthroughs.' },
    { name: 'Nick Saraev', url: 'https://www.youtube.com/@nicksaraev', whyGood: 'Popular, practical AI-automation tutorials with a focus on building flows you can actually sell as a freelancer.' },
    { name: 'IBM Technology', url: 'https://www.youtube.com/@IBMTechnology', whyGood: 'Short, clear explainers on automation, RPA, APIs, and webhooks when you want the concept, not a product demo.' },
    { name: 'Jono Catliff', url: 'https://www.youtube.com/@jonocatliff', whyGood: 'Beginner-first, full-length automation courses and project builds, especially with n8n and AI.' },
  ],
  articlesAndDocs: [
    { title: 'Zapier Blog: automation guides & app tutorials', url: 'https://zapier.com/blog/', provider: 'Zapier', level: 'Beginner', note: 'A huge, free library of plain-language guides on automating specific tasks and apps. Great for ideas.' },
    { title: 'n8n Documentation', url: 'https://docs.n8n.io/', provider: 'n8n', level: 'Beginner to Advanced', note: 'Clear docs covering nodes, expressions, webhooks, and self-hosting the free open-source tool.' },
    { title: 'Make Help Center', url: 'https://www.make.com/en/help/', provider: 'Make', level: 'Beginner to Advanced', note: 'Reference for modules, routers, and data transformation in Make.' },
    { title: 'Microsoft Power Automate Documentation', url: 'https://learn.microsoft.com/en-us/power-automate/', provider: 'Microsoft', level: 'Beginner to Advanced', note: 'Official docs for cloud and desktop flows across the Microsoft ecosystem.' },
    { title: 'What is a Webhook? (explainer)', url: 'https://zapier.com/blog/what-are-webhooks/', provider: 'Zapier', level: 'Beginner', note: 'A friendly, plain-language introduction to webhooks, the universal automation trigger.' },
  ],
  interactivePractice: [
    { name: 'Zapier (free plan)', url: 'https://zapier.com/', note: 'Build real automations free (with monthly task limits). The fastest way to learn by doing. Freemium.' },
    { name: 'Make (free plan)', url: 'https://www.make.com/', note: 'Generous free tier for visual, multi-step scenarios, great for practicing complex logic. Freemium.' },
    { name: 'n8n', url: 'https://n8n.io/', note: 'Open-source; use the cloud trial or self-host completely free. Best for AI automations and full control. Free/Freemium.' },
    { name: 'IFTTT', url: 'https://ifttt.com/', note: 'The simplest tool for quick personal automations (phone, smart home, social). Great first taste. Freemium.' },
    { name: 'Pipedream', url: 'https://pipedream.com/', note: 'Connect apps with optional code steps, a nice bridge from no-code into light coding. Freemium.' },
  ],
  communities: [
    { name: 'r/nocode', url: 'https://www.reddit.com/r/nocode/', note: 'Community for building without code, including automation tools, ideas, and career talk.' },
    { name: 'n8n Community Forum', url: 'https://community.n8n.io/', note: 'Active, helpful forum for automation and AI-workflow questions and templates.' },
    { name: 'Make Community', url: 'https://community.make.com/', note: 'Official forum to get help building scenarios and share templates.' },
    { name: 'r/Zapier', url: 'https://www.reddit.com/r/zapier/', note: 'Q&A and tips for Zapier users, from beginners to power users.' },
    { name: 'r/automation', url: 'https://www.reddit.com/r/automation/', note: 'General discussion on automating tasks, tools, and the growing AI-automation freelance scene.' },
  ],
  projectIdeas: [
    { title: 'Email attachments → cloud storage', what: 'Automatically save every incoming attachment to a dated folder in Google Drive or Dropbox.', difficulty: 'Beginner' },
    { title: 'Form → spreadsheet → notification', what: 'When someone submits a form, log it to a sheet and ping you on Slack/Telegram/Discord.', difficulty: 'Beginner' },
    { title: 'RSS / news → social or chat', what: 'Auto-post new articles from your favorite sources to a channel or social account.', difficulty: 'Beginner' },
    { title: 'Mini-CRM lead pipeline', what: 'Capture leads, tag them, send a tailored welcome email, and alert the team, automatically.', difficulty: 'Intermediate' },
    { title: 'AI inbox triage', what: 'AI reads new emails, summarizes and categorizes them, logs them, and drafts replies for approval.', difficulty: 'Intermediate' },
    { title: 'Invoice / receipt processor', what: 'Pull data from incoming invoices (with AI or OCR), record it, and file the documents in order.', difficulty: 'Advanced' },
  ],
  careerPaths: [
    'Automation Specialist / Workflow Automation Consultant (build and maintain automations for a company)',
    'No-Code Developer / Maker (build apps and tools without traditional coding)',
    'RPA Developer (automate processes in larger enterprises with UiPath/Power Automate; well-paid)',
    'AI Automation Freelancer / Agency owner (a fast-growing niche, building AI-powered flows for clients)',
    'Operations / RevOps / Business Systems Analyst (improve how a company’s tools and processes run)',
  ],
  timeToJobReady:
    '1-3 months to become genuinely useful (you can freelance simple automations within weeks), and around 6 months to handle complex, AI-powered, business-grade workflows. It’s one of the quickest tech skills to start earning from.',
  commonMistakes: [
    'Automating a messy process, fix and simplify the steps by hand first, then automate the clean version.',
    'Skipping testing: not checking edge cases, so the flow breaks quietly on the first unusual input.',
    'No error handling, when one step fails the whole flow stops and nobody notices. Add alerts and fallbacks.',
    'Ignoring task/operation limits and pricing, then getting surprised by costs or a paused flow.',
    'Over-automating: building a fragile 20-step flow for something you do twice a year.',
    'Not documenting what a flow does, so future-you (or a teammate) can’t fix it later.',
    'Treating AI steps as magic, they still need clear prompts and a human check on important outputs.',
  ],
  glossary: [
    { term: 'Trigger', definition: 'The event that starts an automation (e.g. a new email or form submission).' },
    { term: 'Action', definition: 'A step the automation performs after the trigger.' },
    { term: 'Zap / Scenario / Workflow', definition: 'The name for a complete automation in Zapier / Make / n8n respectively.' },
    { term: 'No-code', definition: 'Building software by configuring visual blocks instead of writing code.' },
    { term: 'Integration (connector)', definition: 'A ready-made link between the automation tool and another app.' },
    { term: 'API', definition: 'A defined way for apps to talk to each other and exchange data.' },
    { term: 'Webhook', definition: 'A URL an app calls instantly when an event happens, used to trigger automations.' },
    { term: 'Field mapping', definition: 'Connecting a piece of data from one step to the right input of another step.' },
    { term: 'Filter / condition', definition: 'A rule that decides whether (or which way) an automation continues.' },
    { term: 'RPA', definition: 'Robotic Process Automation: software robots that mimic human clicks and typing to automate apps without an API.' },
    { term: 'Task / operation', definition: 'A single billed unit of work in an automation tool; plans cap how many you can run.' },
    { term: 'Run history / logs', definition: 'A record of each time a flow ran and what happened, used to debug failures.' },
  ],
  relatedDomains: ['applied-ai', 'web-development', 'information-technology', 'ai-machine-learning'],
  verificationNotes: [
    'Intro video verified via YouTube oEmbed: "What Is Workflow Automation?" by Workload (IIczUjFIHw0), embeddable and live.',
    'All listed resources are well-known, free or freemium, with stable canonical URLs: Zapier Learn/Blog, Make Academy/Help, n8n Courses/Docs, Microsoft Power Automate Learn/Docs, UiPath Academy, plus a free long-form n8n AI-automation course on YouTube.',
    'YouTube channels are real and active: @n8n-io (official), @MakeHQ (official), @nicksaraev, @IBMTechnology, @jonocatliff.',
    'Practice platforms all have real free or freemium tiers: Zapier, Make, n8n (open-source/self-host), IFTTT, Pipedream.',
    'This domain is cross-linked with Applied AI & Generative AI, since "AI automation" (adding AI steps into workflows) is a major, growing use case.',
  ],
}

/* ----------------------------- apply changes ----------------------------- */
if (!Array.isArray(kb.clusters)) kb.clusters = []
if (!kb.clusters.includes(CLUSTER)) kb.clusters.push(CLUSTER)

const upsert = (domain) => {
  const i = kb.domains.findIndex((d) => d.slug === domain.slug)
  if (i >= 0) kb.domains[i] = domain
  else kb.domains.push(domain)
}
upsert(appliedAi)
upsert(automation)

// Cross-link existing AI/ML domain to the two new ones (no duplicates)
const aiml = kb.domains.find((d) => d.slug === 'ai-machine-learning')
if (aiml && Array.isArray(aiml.relatedDomains)) {
  for (const s of ['applied-ai', 'automation-workflow']) {
    if (!aiml.relatedDomains.includes(s)) aiml.relatedDomains.push(s)
  }
}

await writeFile(kbPath, JSON.stringify(kb, null, 2))
console.log('Clusters:', kb.clusters.join(' | '))
console.log('Domain count:', kb.domains.length)
console.log('Added/updated:', appliedAi.name, '+', automation.name)
