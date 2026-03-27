# Hive.js

Web implementation of **Hive**, the two-player hex-based insect strategy board game. The goal is to surround your opponent's Queen Bee while they try to surround yours. Live at hive.unrest.io.

## Tech Stack

- **Game engine** (`/game/`) — Pure JavaScript, standalone. Handles board state, move validation, hex geometry, and win detection. Tested with Jest (`cd game && npx jest`).
- **Frontend** (`/client/`) — Vue 3 SPA. Renders the hex board, piece piles, game setup, tutorials, and chat.
- **Backend** (`/server/`) — Django 5.2 + Channels 4.x. REST API for game/room management, WebSockets (via Redis) for real-time multiplayer. Username/password auth via django-registration.

## Project Structure

```
game/                  # Standalone game engine (pure JS)
  Board/
    index.js           # Core board state and move validation
    moves.js           # Per-piece movement rules
    specials.js        # Multi-step/complex moves
    Geo.js             # Hexagonal grid geometry
    wouldBreakHive.js  # Connectivity validation
  pieces.js            # Piece definitions, counts, metadata
  help.js              # In-game help text per piece
  tutorial/            # Tutorial boards and captions
  __tests__/           # Jest tests

client/                # Vue 3 frontend
  src/
    components/        # Game UI (Game.vue, Board.vue, NewGame.vue, etc.)
    views/             # Page views
    store/             # State management
    css/               # Stylesheets
    sprite/            # Piece SVG sprite generation

server/                # Django backend
  settings/            # Django config
  models.py            # Room, Game, Message models
  consumers.py         # WebSocket handlers for multiplayer
  views.py             # HTTP views (room creation/joining)
  user/                # Auth app
```

## How the Game Works

1. Players create/join a room and pick a piece set
2. They alternate placing and moving insect pieces on a shared hex grid
3. Each piece type (Queen, Ant, Beetle, Spider, Grasshopper, etc.) has unique movement rules
4. The hive must stay connected — moving a piece that would split the board is illegal
5. First to fully surround the opponent's Queen wins
6. Queen must be placed by turn 4

## Notable Features

- **40+ piece types** — base game plus expansions (Mosquito, Pill Bug, Ladybug) and many custom pieces (Dragonfly, Scorpion, Orchid Mantis, etc.)
- **Real-time multiplayer** with chat via WebSockets
- **Interactive tutorials** built into the client
- **Works offline** for local two-player (no server needed)
- Game engine is cleanly separated from UI and server

## Commands

```bash
# Frontend dev
cd client && npm install && npm run serve

# Backend dev (requires postgres + redis)
.venv/bin/python manage.py migrate
./bin/develop

# Game engine tests
cd game && npx jest
```
