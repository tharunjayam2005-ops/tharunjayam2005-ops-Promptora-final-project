# 🚀 Promptora

> 🤖 **Universal AI Prompt Generator & Multi-Model Content Creation Platform**



✨ Promptora is a modern AI platform that helps users **create, improve, save, and manage high-quality AI prompts**.

It supports multiple AI models, reusable skills, prompt templates, user profiles, authentication, cloud storage, and local storage.

## Video links Provide :

* English Video : "https://drive.google.com/file/d/1FU-Lz2y69B15Wcjw5LZ5bNcg2mrddnOa/view?usp=sharing"
* Tamil   Video : "https://drive.google.com/file/d/1BPdzi8s-eWW6DVHy622xU7JGim68GAag/view?usp=sharing"

## I Provide Live Link of Web :
* Web Application Live Link : "https://tharunjayam2005-ops-promptora-final.vercel.app/overview"

---

## 🌟 Features

- 🧠 **AI-Powered Prompt Generation**
- 💬 **Multi-Model AI Chat**
- 🤖 **OpenRouter & Google Gemini**
- 🔀 **AI Model Switching & Fallback**
- 🔑 **API Key Management**
- 📚 **Personal Prompt Library**
- 🧩 **Prompt Templates & Skills**
- 👤 **User Profile Management**
- 🖼️ **Profile Avatar Upload**
- 📊 **Usage Dashboard**
- 📤 **Profile & Usage Export**
- 🔐 **Supabase Authentication**
- 🛡️ **Row Level Security**
- 💾 **Local Storage Fallback**
- 📱 **Responsive Design**

---

## 🛠️ Technology Stack

| 🔧 Technology | 🎯 Purpose |
|---|---|
| ⚛️ React 19 | Frontend |
| ⚡ Vite | Development & Build Tool |
| 💻 JavaScript / JSX | Application Development |
| 🧭 React Router | Page Navigation |
| 🟢 Supabase | Authentication, Database & Storage |
| 🤖 OpenRouter | Multi-Model AI Access |
| ✨ Google Gemini | AI Model Integration |
| 🎨 CSS | User Interface |
| 💾 Local Storage | Local Data Fallback |

---

## 📁 Project Structure

```text
🚀 Promptora/
│
├── 📂 public/
│
├── 📂 src/
│   ├── 📂 components/
│   ├── 📂 contexts/
│   ├── 📂 lib/
│   ├── 📂 pages/
│   └── 📂 services/
│
├── 📂 supabase/
│   ├── 📄 schema.sql
│   └── 📄 user_api_keys.sql
│
├── 📂 report/
│
├── ⚙️ .env.example
├── 🚫 .gitignore
├── 🌐 index.html
├── 📦 package.json
├── ⚡ vite.config.js
└── 📖 README.md
```

---

# 🚀 Setup

## 📋 Requirements

Before running Promptora, install:

- 🟢 **Node.js**
- 📦 **npm**
- 💻 **VS Code**
- 🌐 **Modern Web Browser**

Check your installation:

```bash
node -v
npm -v
```

---

## 📥 1. Install Dependencies

Open the project folder in **VS Code** or **Command Prompt**.

Run:

```bash
npm install
```

---

## ⚙️ 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

VITE_OPENROUTER_API_KEY=
VITE_GEMINI_API_KEY=

VITE_OPENROUTER_SWITCHING_MODELS=
```

⚠️ **Important:** Never upload your real `.env` file or private API keys to GitHub.

---

## 🗄️ 3. Supabase Setup

If you want authentication and cloud storage:

### Step 1️⃣
Create a **Supabase project**.

### Step 2️⃣
Add your Supabase URL and public anon key to `.env`.

### Step 3️⃣
Open the **Supabase SQL Editor**.

### Step 4️⃣
Run:

```text
📄 supabase/schema.sql
```

### Step 5️⃣
Review/run:

```text
📄 supabase/user_api_keys.sql
```

### Step 6️⃣
Restart the development server.

---

# ▶️ Usage

## 🚀 Start the Application

Run:

```bash
npm run dev
```

Vite will show a local URL, usually:

```text
🌐 http://localhost:5173/
```

Open it in your browser.

---

## 🧭 Basic Workflow

1. 🏠 Open **Promptora**
2. 🔐 Sign in or create an account
3. ✍️ Open **Prompt Generator**
4. 💡 Enter your idea or request
5. 🧠 Generate an optimized AI prompt
6. 📋 Copy the generated prompt
7. 💾 Save the prompt to your Library
8. 💬 Use **AI Chat** to interact with AI models
9. ⚙️ Configure API keys and models in **Settings**
10. 👤 Manage your account in **Profile**
11. 📊 Check activity in **Dashboard**

---

# 🤖 AI Providers

## 🌐 OpenRouter

OpenRouter allows Promptora to access multiple AI models through a common API.

Configure:

```env
VITE_OPENROUTER_API_KEY=your-api-key
```

🔀 Promptora can use configured fallback models when the selected model is unavailable.

---

## ✨ Google Gemini

Configure:

```env
VITE_GEMINI_API_KEY=your-api-key
```

Gemini models can then be used for supported AI operations.

---

# 📚 Prompt Library

The **Prompt Library** allows users to:

- 💾 Save prompts
- 👀 View saved prompts
- 📋 Copy prompts
- 🗑️ Delete prompts
- ☁️ Store prompts using Supabase
- 💻 Use local storage when cloud storage is unavailable

---

# 🧩 Skills & Templates

Promptora provides reusable AI resources:

- 🧠 Built-in Skills
- ✨ Custom Skills
- 📝 Prompt Templates
- 🤖 Custom AI Models

These resources help users create more consistent and high-quality prompts.

---

# 👤 Profile

Users can:

- ✏️ Update their name
- 📝 Add a bio
- 🖼️ Upload an avatar
- 👀 View account information
- 📤 Export profile information

### 📄 Supported Export Formats

```text
📕 PDF
📄 TXT
📋 JSON
```

---

# 📊 Dashboard

The Dashboard provides information about:

- 📈 Prompt activity
- 📊 AI usage
- 💾 Saved prompts
- 🤖 AI activity
- 📑 Reports
- 📤 Data exports

Usage data can be exported in supported formats such as **CSV** and **JSON**.

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run code-quality checks:

```bash
npm run lint
```

---

# 🔐 Security

🔒 Keep sensitive information secure.

The following should normally **not** be committed to GitHub:

```text
🚫 .env
🚫 node_modules/
🚫 dist/
```

Use `.env.example` to show required environment variables without exposing real secrets.

🛡️ Supabase Row Level Security helps protect users' cloud data.

---

# 🔄 Application Flow

```text
👤 User
   ↓
💡 User Idea
   ↓
🧠 Prompt Generator / 💬 AI Chat
   ↓
🤖 AI Model Selection
   ↓
⚙️ AI Processing
   ↓
✨ Optimized Prompt / Response
   ↓
📋 Copy or 💾 Save
   ↓
📚 Prompt Library
   ↓
📊 Dashboard / 👤 Profile
```

---

# 🧪 Troubleshooting

### ❌ Dependencies not installed

Run:

```bash
npm install
```

### ⚙️ Environment variables not working

Restart Vite:

```bash
npm run dev
```

### 🗄️ Supabase connection error

Check:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 🤖 AI model not responding

Check:

- 🔑 API key
- 🤖 Selected model
- 🌐 Internet connection
- ☁️ Provider availability
- 🖥️ Browser console errors

---

# 📜 NPM Commands

| 💻 Command | 📝 Description |
|---|---|
| `npm install` | 📦 Install dependencies |
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 🏗️ Create production build |
| `npm run preview` | 👀 Preview production build |
| `npm run lint` | 🧹 Run lint checks |

---

# 🎓 Project Information

### 🚀 Project Name
**Promptora**

### 🤖 Project Type
**AI Prompt Generator & Multi-Model Content Creation Platform**

### 🛠️ Technologies
**React • Vite • Supabase • OpenRouter • Google Gemini**

### 🎯 Main Goal

> 💡 **Turn simple ideas into powerful, structured AI prompts.**

---


---

## ⭐ Promptora

### 💡 Create. 🧠 Improve. 🤖 Generate. 💾 Save. 🚀 Manage.

**Made with ❤️ for AI-powered creativity and productivity.**
