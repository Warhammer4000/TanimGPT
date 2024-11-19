# TanimGPT

A modern chat interface for LMStudio, featuring a clean UI, theme support, and markdown rendering.

## Features

- 🤖 Integration with locally hosted LMStudio
- 💬 Chat management (create/delete conversations)
- 📝 Markdown and code syntax highlighting
- 🎨 Multiple theme options (light/dark/system)
- 📱 Responsive design
- ⚡ Typing animation with customizable speed
- 📁 File/image upload support
- 💾 Persistent chat history

## Prerequisites

- Node.js 16.x or later
- LMStudio running locally with API access enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tanimgpt.git
cd tanimgpt
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Connecting to LMStudio

1. Start LMStudio and enable API access
2. Click the settings icon (⚙️) in TanimGPT
3. Enter your LMStudio URL (default: `http://localhost:1234`)
4. The active model will be automatically detected

## Usage

### Creating a New Chat

1. Click the "New Chat" button in the sidebar
2. Start typing your message in the input box
3. Press Enter or click the send button to submit

### Managing Chats

- Create new chats using the "New Chat" button
- Switch between chats by clicking on them in the sidebar
- Delete chats using the trash icon

### Customization

Access settings by clicking the gear icon (⚙️) to:
- Change theme (light/dark/system)
- Toggle typing animation
- Adjust typing animation speed
- Configure LMStudio connection

### File Upload

1. Click the upload icon in the chat input
2. Select one or more files
3. Type your message (optional)
4. Send the message with the files

## Development

### Project Structure

```
src/
├── components/
│   ├── chat/           # Chat-related components
│   ├── settings/       # Settings dialog
│   ├── theme/          # Theme provider
│   └── ui/             # Reusable UI components
├── lib/
│   ├── store.ts        # Global state management
│   └── utils.ts        # Utility functions
└── App.tsx             # Main application component
```

### Tech Stack

- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Radix UI (Components)
- React Markdown
- Vite (Build Tool)

## License

MIT