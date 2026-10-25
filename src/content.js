// All site copy lives here. Edit this file to update the portfolio.

const gh = (repo) => `https://github.com/Sudhanshu-Patil/${repo}`

// Which chat robot the site shows. 'builtin' is the React assistant in src/Assistant.jsx.
// 'glance' loads the open-source Glance widget from the deployment below instead. Flip back any time.
export const assistant = {
  mode: 'glance',
  glanceSrc: 'https://glance-test-sigma.vercel.app/widget.js',
}

export const profile = {
  name: 'Sudhanshu Patil',
  role: 'AI Engineer',
  email: 'sudhanshupatil588@gmail.com',
  phone: '+91 72489 13660',
  phoneHref: 'tel:+917248913660',
  address: 'Manish Layout, Nagpur 440022, India',
  resume: '/Sudhanshu_Patil_AI_Engineer.pdf',
  github: 'https://github.com/Sudhanshu-Patil',
  linkedin: 'https://www.linkedin.com/in/sudhpatil',
  leetcode: 'https://leetcode.com/u/sudh000',
  credly: 'https://www.credly.com/users/sudhanshu-patil.a7dc7beb',
  availability: 'Immediate joiner. Pune, Hyderabad, Bangalore, Mumbai or remote.',
}

export const proof = [
  { value: '94%', label: 'PII redaction latency cut, 8s to 0.5s' },
  { value: '10+', label: 'production MCP tools across 9 CRM modules' },
  { value: '8,000+', label: 'lines of production code as a team of one' },
  { value: 'Top 5%', label: 'LeetCode Knight' },
]

export const experience = [
  {
    role: 'AI Engineer (Freelance / Contract)',
    company: '',
    place: 'Remote',
    period: 'Jul 2026 - Present',
    note: 'Client work on MCP and backend systems, plus production-shaped AI builds of my own.',
    points: [
      'For a startup client (Sep - Oct 2026), built multi-tenant MCP servers with OAuth 2.1 + PKCE, dynamic client registration and per-tenant protected-resource discovery (RFC 9728), tested until sign-in was clean on all three clients.',
      'Added an approval layer re-checked on every tool call, so revoking access cuts a user off mid-session, and per-call metered credits charged in a single conditional UPDATE so balances never go negative under concurrency.',
      'Deployed on AWS ECS Fargate behind an ALB with secrets in SSM, multi-arch images and rolling deploys at 100% minimum healthy.',
      "Shipped 19 PRs in about a week on a WhatsApp CRM over Meta's Cloud API: error-code-aware retries, pre-send broadcast checks, and a region fix that removed inbox lag.",
      'Alongside client work, shipped Redline, AI Email Reply, a multi-tenant chatbot platform, a restaurant reception agent and a settlement feasibility engine (all below).',
    ],
  },
  {
    role: 'AI Solutions Developer',
    company: 'SimpleWorks',
    place: 'Nagpur',
    period: 'Aug 2025 - Jun 2026',
    note: 'Sole AI engineer for banking and enterprise clients, from architecture to production.',
    points: [
      'Built a hub-and-spoke agentic RAG framework (orchestrator, intent recogniser, dynamic query splitting, math sandbox) that passed QA for BFSI clients including Bank of India, with up to 2 levels of human-in-the-loop review.',
      'Architected a cloud-hosted FastMCP server exposing 10+ tools across 9 CRM modules to Claude, Gemini CLI and internal apps, with configurable 40k-token memory.',
      'Cut PII redaction from 8s to 0.5s by replacing a spaCy transformer with a fine-tuned DistilBERT NER model, plus triple-verification guardrails that keep excluded fields out of every LLM payload.',
      'Designed the end-to-end MVP architecture and UX for an internal AI platform: multi-DB connectors, RBAC, Langfuse traceability and @mention cross-mode queries.',
      'Solo-led Python 3.11 to 3.13 and LlamaIndex migrations on Azure AI Foundry with zero rollbacks, including offline wheel packaging for air-gapped banking systems, unblocking GPT-5 series adoption.',
    ],
  },
  {
    role: 'Associate Data Scientist (Intern)',
    company: 'Novartis',
    place: 'Hyderabad',
    period: 'Jan 2025 - Jul 2025',
    note: 'Received a full-time pre-placement offer for performance.',
    points: [
      'Built an on-prem LLM chatbot trained on internal R-coding files. It answered in R without being prompted to, with quality comparable to OSS tools, and no data left the network.',
      'Removed manual work for 60+ data managers with VBA and Office Scripts automations, and replaced SAS reporting with an interactive RShiny dashboard.',
    ],
  },
]

export const featured = [
  {
    name: 'MediClaim',
    tagline: 'Agentic RAG for insurance claims adjudication',
    problem: 'A friend spent six weeks fighting a denied claim. The answer sat in a 140-page policy nobody could cite.',
    pipeline: ['Input guardrails', 'Intent routing', 'Dense + BM25 + Neo4j', 'RRF + rerank', 'Grounding check', 'LLM judge', 'Human review'],
    facts: [
      '3B Llama fine-tuned with QLoRA, merged and quantized',
      'Policy lookup, claim search and fraud detection as MCP tools',
      'RAGAS regression on a golden dataset for every change',
      'Load-tested, red-teamed, traced in Langfuse and LangSmith',
    ],
    links: [
      { label: 'Watch demo', href: 'https://www.loom.com/share/248fda054e1f455087bacdba58c52b00' },
      { label: 'Code', href: gh('MediClaim') },
    ],
  },
  {
    name: 'Redline',
    tagline: 'Deterministic diffs and grounded chat for engineering drawings',
    problem: 'Two revisions of a drawing. Which tags, dimensions and entities actually changed?',
    pipeline: ['PDF, OCR, DWG ingest', '3-tier alignment', 'Delta report', 'Hybrid retrieval', 'Cite or refuse'],
    facts: [
      'No LLM in the diff path, enforced by tests',
      'Tesseract OCR with a vision-LLM second read',
      'Exact-tag lookup unioned with vector search, cross-encoder rerank',
      'OTel-shaped trace on every stage',
    ],
    links: [
      { label: 'Watch demo', href: 'https://drive.google.com/file/d/1PZXix5YPPk2Vv7bS1BxfMjkkR7xWPG0K/view' },
      { label: 'Code', href: gh('Redline') },
    ],
  },
  {
    name: 'Telecom Triage',
    tagline: 'Confidence-gated AI triage for a customer-operations inbox',
    problem: 'Act on clear requests automatically. Hand anything uncertain to a human.',
    pipeline: ['Intake', 'Classify (JSON mode)', 'Confidence gate', 'Remediation branch', 'Audit log'],
    facts: [
      'LangGraph state machine with config-driven branches',
      'Deterministic guardrail caps confidence the model cannot justify',
      'SLA flags, full audit trail and a live dashboard',
      '41 offline tests with the LLM mocked',
    ],
    links: [
      { label: 'Live app', href: 'https://telecom-request.streamlit.app' },
      { label: 'Code', href: gh('telecom-request-workflow') },
    ],
  },
  {
    name: 'AI Email Reply',
    tagline: 'Suggested replies, and a metric that shows whether they are any good',
    problem: 'A generator is easy. Knowing whether a draft is worth sending is the hard part.',
    pipeline: ['Past email corpus', 'Grounded draft', '5-dimension score', 'Metric validation'],
    facts: [
      'Scores grounding, intent, similarity, style and sendability',
      'Metric validated with discriminant probes',
      'Runs fully offline with a mock provider',
      '96 tests',
    ],
    links: [{ label: 'Code', href: gh('AI-Email-Reply') }],
  },
  {
    name: 'ATS-Ready',
    tagline: 'AI resume engineering platform, built solo on a zero-cost stack',
    problem: 'Built during my own job hunt. One master profile in, a role-specific resume, ATS score and cover letter out.',
    pipeline: ['Parse JD', 'Match skills', 'Tailor', 'DOCX export'],
    facts: [
      'Redis-backed async workers, so LLM jobs never block requests',
      'Job feed aggregated from 7 sources, ranked against your skills',
      'JWT with refresh tokens, rate limiting, Razorpay billing',
      '37 tests and Playwright end-to-end in 3-stage CI',
    ],
    links: [{ label: 'Live app', href: 'https://ats-ready.onrender.com/' }],
  },
  {
    name: 'Glance',
    tagline: 'Open-source AI assistant for any portfolio, with a robot that has moods',
    problem: 'Most portfolio chatbots need a paid API, a vector database and hand-written knowledge. This one reads your site and needs a free key and a script tag.',
    pipeline: ['Widget reads your site in the browser', 'Vercel function', 'Groq gpt-oss-120b', 'Fallback model', 'Streamed answer'],
    facts: [
      "The widget reads the page in the visitor's browser, so React sites work and no scraping server is needed",
      'Zero dependencies, Shadow DOM, works on any site',
      'Visual robot moods: happy, thinking, surprised, sad and sleepy',
      'Powers the robot on this site. Try it in the corner',
    ],
    links: [
      { label: 'Live demo', href: 'https://glance-chat.vercel.app' },
      { label: 'Code', href: gh('glance-chat') },
    ],
  },
]

export const moreWork = [
  {
    name: 'Multi-tenant Chatbot Platform',
    desc: 'JWT auth, versioned prompts, file uploads, and one Responses API client that runs on OpenAI, Groq or Ollama.',
    links: [
      { label: 'Live', href: 'https://chatbot-sooty-eight-42.vercel.app' },
      { label: 'Demo', href: 'https://drive.google.com/file/d/1g-iSS7p6ZR8o6qGr6mXd7UN8F8d7nIGj/view' },
      { label: 'Code', href: gh('Chatbot') },
    ],
  },
  {
    name: 'Context-Aware Retrieval Engine',
    desc: 'Benchmarks raw vector search against LLM query expansion. Expansion lifted average cosine score by 9% to 31%.',
    links: [{ label: 'Code', href: gh('Context-aware-retrieval-engine') }],
  },
  {
    name: 'Automation Workflows',
    desc: 'Airtable to AI company summaries to Google Docs, a daily 7 AM Slack report, a weekly outreach bot and a YouTube scraper.',
    links: [
      { label: 'Demo', href: 'https://www.loom.com/share/5af18aeb60834d799ebd3cdd7988222d' },
      { label: 'Code', href: gh('make-daily-company-reports') },
    ],
  },
  {
    name: 'Restaurant Reception Agent',
    desc: 'Multi-turn booking, ordering, menu Q&A and customer memory over a black-box FastAPI backend, streamed over SSE.',
    links: [{ label: 'Code', href: gh('Restaurant-reception-Agent') }],
  },
  {
    name: 'Settlement Feasibility Engine',
    desc: 'Decides whether a debt can be settled on time without the account going negative, and finds the smallest top-up if not.',
    links: [{ label: 'Code', href: gh('Settlement-Feasibility-Fee-Engine') }],
  },
  {
    name: 'Git-Msg',
    desc: 'VS Code extension that reads your staged diff and writes a Conventional Commit message with Gemini or OpenAI.',
    links: [{ label: 'Code', href: gh('Git-Msg') }],
  },
]

// Logos in public/logos, shown in the moving strip above the stack groups.
export const logos = [
  ['python', 'Python'], ['pytorch', 'PyTorch'], ['huggingface', 'Hugging Face'], ['langchain', 'LangChain'],
  ['ollama', 'Ollama'], ['qdrant', 'Qdrant'], ['neo4j', 'Neo4j'], ['fastapi', 'FastAPI'],
  ['postgresql', 'PostgreSQL'], ['redis', 'Redis'], ['docker', 'Docker'], ['kubernetes', 'Kubernetes'],
  ['amazonwebservices', 'AWS'], ['azure', 'Azure'], ['googlecloud', 'Google Cloud'], ['githubactions', 'GitHub Actions'],
  ['nginx', 'Nginx'], ['linux', 'Linux'], ['react', 'React'], ['nextjs', 'Next.js'],
  ['mysql', 'MySQL'], ['sqlite', 'SQLite'], ['cplusplus', 'C++'],
]

export const stack = [
  { group: 'AI and ML', items: ['LLMs', 'RAG', 'Agentic AI', 'MCP', 'LangGraph', 'LangChain', 'LlamaIndex', 'NER', 'QLoRA / PEFT', 'PyTorch', 'RAGAS', 'Guardrails'] },
  { group: 'Backend', items: ['Python', 'FastAPI', 'Pydantic', 'Async (ARQ)', 'OAuth 2.1', 'REST APIs', 'C++', 'SQL', 'React', 'Next.js'] },
  { group: 'Data', items: ['PostgreSQL', 'Redis', 'Qdrant', 'ChromaDB', 'Neo4j', 'MySQL', 'SQLite'] },
  { group: 'Cloud and Ops', items: ['Azure AI Foundry', 'AWS Bedrock', 'AWS ECS Fargate', 'GCP', 'Docker', 'Kubernetes', 'GitHub Actions', 'Nginx', 'Langfuse', 'Linux'] },
]

export const education = {
  school: 'BITS Pilani, Hyderabad Campus',
  degree: 'B.E. (Hons.) Electronics and Communication Engineering, Minor in Computing and Intelligence',
  period: 'Oct 2021 - Jul 2025',
}

export const honors = [
  'INSPIRE-SHE Scholar, top 1% of the Maharashtra HSC board (97.5%)',
  'Naukri EROH University, 2nd runner-up',
  'LeetCode Knight, top 5%',
]

export const certifications = [
  'Oracle Agentic AI Certified Professional (2026)',
  'Oracle Agentic AI Foundations Associate (2026)',
  'Kubernetes LFS158, Linux Foundation (2026)',
  'Docker Foundations Professional (2026)',
  'Databricks Fundamentals (2026)',
  'Oracle Gen AI Certified Professional (2024)',
  'Multi AI Agent Systems with CrewAI',
  'Mastering AutoGen',
]
