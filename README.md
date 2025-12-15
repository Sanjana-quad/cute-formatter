🌸 Cute Formatter
=================

A dreamy, pastel, Web3‑inspired **text beautification studio** ✨

Cute Formatter takes plain text (plans, notes, descriptions) and transforms it into **aesthetically formatted content** with:

*   Smart section detection (LLM‑powered)
    
*   Per‑section styling controls
    
*   Cute animations & transitions
    
*   Pastel 3D background with parallax
    
*   Export to **HTML, PNG, and PDF**
    

This project started as a learning experiment and evolved into a **full creative document engine**.

✨ Features
----------

### 🧠 Smart Text Parsing

*   Paste messy text in plain English
    
*   Click **Smart Parse (LLM)**
    
*   Automatically detects:
    
    *   Title
        
    *   Paragraphs
        
    *   Lists & step lists
        
    *   Quotes
        
    *   Notes
        
    *   Code blocks
        

Uses:

*   OpenRouter (LLaMA 3.1) for free‑tier LLM parsing
    
*   Strict JSON output enforcement
    

### 🎨 Per‑Section Styling

*   Choose different styles for:
    
    *   Title
        
    *   Paragraphs
        
    *   Lists
        
    *   Notes
        
    *   Quotes
        
*   Each section animates independently
    
*   Presets designed for readability + cuteness
    

### 🌈 Theme Token System

*   Theme presets (Pastel, Minimal, Glitter)
    
*   Live‑editable CSS variables:
    
    *   Background
        
    *   Card color
        
    *   Accent color
        
    *   Font
        
    *   Glitter intensity
        

Themes update the preview in real time.

### 🫧 Dreamy 3D UI & Parallax

*   Pastel floating 3D blobs (React Three Fiber)
    
*   Star particles for ambience
    
*   Mouse‑based parallax (not scroll‑based)
    
*   Soft hover lifts & glow effects
    

Visual stack:

*   three.js
    
*   @react-three/fiber
    
*   @react-three/drei
    

### 📤 Export System

#### ✅ HTML Export

*   Self‑contained HTML file
    
*   Embedded styles & tokens
    
*   Perfect for sharing or hosting
    

#### ✅ PNG Export

*   Uses **html2canvas‑pro** (supports modern CSS colors)
    
*   High‑resolution image export
    
*   Safe with gradients, lab()/lch() colors
    

#### ✅ PDF Export

*   Server‑side PDF rendering (Puppeteer)
    
*   Canva‑quality output
    
*   A4 format
    
*   Preserves background & styling
    

🛠 Tech Stack
-------------

### Frontend

*   Next.js (App Router)
    
*   React
    
*   Tailwind CSS
    
*   React Three Fiber (3D)
    

### Backend / APIs

*   Next.js Route Handlers
    
*   OpenRouter (LLM parsing)
    
*   Puppeteer (PDF generation)
    

### Utilities

*   html2canvas‑pro (PNG export)
    
*   CSS variables for theming
    

📁 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   app/   ├─ api/   │   ├─ parse/route.js          # LLM parsing API   │   └─ export-pdf/route.js     # PDF generation   ├─ page.jsx                    # Main page  components/   ├─ CuteFormatterStarter.jsx    # Core editor   ├─ PastelDreamScene.jsx        # 3D pastel background   ├─ MouseParallax.jsx           # Mouse‑based parallax  styles/   ├─ globals.css   `

🚀 Getting Started
------------------

### 1\. Install dependencies

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

Additional libs used:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install @react-three/fiber @react-three/drei three  npm install html2canvas-pro  npm install puppeteer   `

### 2\. Environment Variables

Create .env.local:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   OPENROUTER_API_KEY=sk-or-xxxx   `

### 3\. Run the app

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

Visit:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:3000   `

🧪 How to Use
-------------

1.  Paste plain text into **Input Text**
    
2.  Click **Smart Parse (LLM)**
    
3.  Adjust theme + section styles
    
4.  Preview updates instantly
    
5.  Export as:
    
    *   HTML
        
    *   PNG
        
    *   PDF
        

🐛 Debugging Lessons (Important)
--------------------------------

This project intentionally explored real‑world issues:

*   ✔ Client vs Server Components ("use client" matters)
    
*   ✔ LLM JSON instability → strict schema enforcement
    
*   ✔ API quota & free‑tier fallbacks
    
*   ✔ html2canvas limitations with modern CSS
    
*   ✔ UI overlays blocking clicks (z‑index & pointer‑events)
    
*   ✔ Large JSON payloads blocked → switched to FormData
    

Each issue was fixed using **production‑grade patterns**.

🌱 Learning Outcomes
--------------------

By building Cute Formatter, you learn:

*   Modern Next.js App Router patterns
    
*   LLM integration & prompt engineering
    
*   UI architecture with AST rendering
    
*   Export pipelines (HTML → PNG → PDF)
    
*   3D & motion design in React
    
*   Debugging silent UI & server failures
    

This project is **portfolio‑ready** and extensible into a SaaS.

🔮 Future Ideas
---------------

*   User accounts & saved projects
    
*   Template marketplace
    
*   Public share links
    
*   Mobile app version
    
*   AI style suggestions
    
*   Collaboration & comments
    

💖 Final Note
-------------

Cute Formatter is intentionally **playful but serious under the hood**.

It proves that:

> _Aesthetic tools can be technically deep, and deep systems can still feel cute._

Happy building ✨