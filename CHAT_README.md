# 🌽 Live Chat System for The Anti-Iowa Cult

A real-time chat system that allows users to create usernames and participate in global text chat on the right side of the website.

## Features

- **Real-time messaging** using WebSocket connections
- **Username creation** - users can set custom usernames
- **Global chat** - all users see the same chat room
- **Responsive design** - works on desktop and mobile
- **Message history** - recent messages are loaded when joining
- **User join/leave notifications**
- **Minimize/close chat widget**
- **Persistent usernames** - stored in localStorage

## Setup Instructions

### 1. Install Dependencies

First, install the required Node.js packages:

```bash
npm install
```

### 2. Start the Chat Server

Run the WebSocket server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on port 3000 by default.

### 3. Access the Website

Open your browser and go to:
```
http://localhost:3000
```

## How It Works

### Frontend (chat.js)
- Creates a chat widget that appears on the right side of all pages
- Handles user interface and WebSocket communication
- Manages username creation and message sending
- Provides responsive design for mobile devices

### Backend (server.js)
- Express.js server with WebSocket support
- Handles real-time message broadcasting
- Manages connected users and message history
- Provides API endpoints for status and message retrieval

### Styling (chat.css)
- Matches the existing website's aesthetic
- Responsive design for all screen sizes
- Smooth animations and transitions
- Custom scrollbars and hover effects

## Usage

1. **Join the Chat**: Enter a username (2-20 characters) and click "Join Chat"
2. **Send Messages**: Type your message and press Enter or click "Send"
3. **Minimize**: Click the "−" button to minimize the chat
4. **Close**: Click the "×" button to close the chat widget

## File Structure

```
├── chat.js          # Frontend chat functionality
├── chat.css         # Chat widget styling
├── server.js        # WebSocket server
├── package.json     # Node.js dependencies
├── index.html       # Main website (updated with chat)
└── CHAT_README.md   # This file
```

## API Endpoints

- `GET /api/status` - Server status and statistics
- `GET /api/messages` - Recent message history
- `GET /api/users` - Currently online users

## WebSocket Events

### Client to Server
- `join` - User joins with username
- `message` - Send a chat message
- `typing` - Typing indicator

### Server to Client
- `history` - Recent message history
- `message` - New chat message
- `userJoined` - User joined notification
- `userLeft` - User left notification
- `users` - Updated online users list
- `error` - Error message

## Customization

### Changing the Chat Position
Edit `chat.css` and modify the `.chat-widget` position:

```css
.chat-widget {
    position: fixed;
    bottom: 20px;  /* Distance from bottom */
    right: 20px;   /* Distance from right */
    /* ... */
}
```

### Changing Colors
The chat uses the same color scheme as the main website:
- Primary: `#1bffff` (cyan)
- Secondary: `#ff00cc` (pink)
- Accent: `#ffff00` (yellow)

### Adding to Other Pages
To add the chat to other HTML pages, include these lines in the `<head>`:

```html
<link rel="stylesheet" href="chat.css">
```

And before the closing `</body>` tag:

```html
<script src="chat.js"></script>
```

## Troubleshooting

### Chat Not Connecting
1. Make sure the server is running (`npm start`)
2. Check browser console for WebSocket errors
3. Verify the server is running on the correct port

### Messages Not Sending
1. Check if username is set
2. Verify WebSocket connection status
3. Check server logs for errors

### Mobile Issues
1. Ensure responsive CSS is working
2. Test on different screen sizes
3. Check touch interactions

## Security Notes

- This is a basic implementation for demonstration
- In production, consider adding:
  - User authentication
  - Message filtering
  - Rate limiting
  - HTTPS/WSS
  - Input sanitization

## Future Enhancements

- Private messaging
- User profiles
- Message reactions
- File sharing
- Voice messages
- Chat rooms/channels
- Message search
- User blocking

---

🌽 **Anti-Iowa Cult Chat System** - Because even in a world without Iowa, we need to communicate! 🌽 