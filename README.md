# TanimGPT

A modern chat interface for LMStudio, featuring a clean UI, theme support, and markdown rendering.

---

## Why Does This Project Exist?

If you are anything like me, you’d want to host a large language model (LLM) server to offload the hardware maintenance while still providing developers access to ChatGPT-like features. Self-hosting solutions, like LMStudio, are powerful but often lack an intuitive web interface. **TanimGPT** bridges that gap by offering a sleek, feature-rich interface that connects directly to your LMStudio instance.

This project is for those who:  
- Have self-hosted LMStudio and want to make it more accessible to their team.  
- Need a developer-friendly, extensible, and responsive chat UI.  
- Value customization, file sharing, and persistent chat history in a self-hosted LLM solution.  

With TanimGPT, you can empower your team to use LLMs without managing complex backend configurations.

---

## Features

- 🤖 **Integration** with locally hosted LMStudio  
- 💬 **Chat management** (create/delete conversations)  
- 📝 **Markdown and code syntax highlighting**  
- 🎨 **Multiple theme options** (light/dark/system)  
- 📱 **Responsive design** for all devices  
- ⚡ **Typing animation** with customizable speed  
- 📁 **File/image upload** support  
- 💾 **Persistent chat history** for seamless user experience  

---

## Prerequisites

Before you begin, ensure you have the following installed:  
- **Node.js** 16.x or later  
- **LMStudio** running locally with API access enabled  

---

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

---

## Connecting to LMStudio

1. Start LMStudio and enable API access.  
2. Open TanimGPT and click the settings icon (⚙️).  
3. Enter your LMStudio URL (default: `http://localhost:1234`).  
4. The active model will be automatically detected and displayed in the settings.  

---

## Usage

### Creating a New Chat  
1. Click the "New Chat" button in the sidebar.  
2. Type your message in the input box.  
3. Press Enter or click the send button to submit your message.  

### Managing Chats  
- **Create** new chats using the "New Chat" button.  
- **Switch** between existing chats by clicking their titles in the sidebar.  
- **Delete** chats with the trash icon next to the chat name.  

### Customization  
- Access the **settings panel** (⚙️) to:  
  - Change theme (light/dark/system).  
  - Toggle typing animation.  
  - Adjust typing animation speed.  
  - Configure the LMStudio connection.  

### File Upload  
1. Click the **upload icon** in the chat input box.  
2. Select one or more files.  
3. Optionally, type a message alongside the files.  
4. Send your message with the attached files.

---

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
- **React** – For building the UI.  
- **TypeScript** – Ensures type safety across the app.  
- **Tailwind CSS** – Simplifies styling with utility classes.  
- **Zustand** – Lightweight state management.  
- **Radix UI** – Modular and accessible UI components.  
- **React Markdown** – Renders markdown in chat messages.  
- **Vite** – Fast and modern build tool.  

---

## Contributing

Contributions are welcome!  
To contribute:  
1. Fork the repository.  
2. Create a new branch:  
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes and push to your branch:  
    ```bash
    git commit -m "Add your message here"
    git push origin feature-name
    ```
4. Open a pull request.  

---

## Troubleshooting

### Common Issues

- **Cannot connect to LMStudio:**  
  Ensure LMStudio is running and API access is enabled. Check your URL configuration in TanimGPT settings.  

- **UI not rendering correctly:**  
  Verify your Node.js version is 16.x or later and that all dependencies are installed.  

- **File upload not working:**  
  Check file size limits and ensure the server supports file uploads.  

### Support

For help or questions, open an issue on GitHub or reach out via the repository's Discussions tab.  

---

## License

TanimGPT is open-source software licensed under the MIT License.  

Feel free to use, modify, and distribute it as per the license terms.  

---
