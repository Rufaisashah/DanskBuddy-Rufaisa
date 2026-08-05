# DanskBuddy

<!--# DanskBuddy 🇩🇰-->

> Find your Danish conversation partner

A web application connecting people learning Danish with native speakers for real conversation practice. Built as the final team project at HackYourFuture Denmark.

---

## Live Demo

🔗 **[danskbuddy.vercel.app](https://dansk-buddy.vercel.app/)**

> Demo account: `demo@test.com` / `password123`

---

## The Problem

People learning Danish have no easy way to find native speakers for real conversation practice. Language apps teach grammar but not natural spoken conversation. Language cafes exist but are infrequent and hard to find.

**DanskBuddy connects learners with native speakers for one-on-one practice sessions — online or in person.**

---

## Features

- 👤 **User profiles** — register as a learner or native speaker with your level, city and topics
- 🔍 **Browse partners** — search and filter by city, level, availability and topics
- 🤝 **Matching system** — send connection requests, accept or decline
- 💬 **Messaging** — chat with your matched partners
- 📣 **Community feed** — share your progress, tips and encouragement
- 🌱 **15 seed profiles** — realistic profiles to explore from day one

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | React Context API |
| Storage | localStorage (no backend) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx     # user session — login, logout, updateUser
│   └── AppContext.jsx      # users, matches, messages, posts state
├── data/
│   └── seedData.js         # 15 seed profiles loaded on first visit
├── utils/
│   ├── storage.js          # localStorage read/write helpers
│   └── uuid.js             # unique id generator
├── components/
│   ├── Layout/             # navbar with badges, footer, mobile menu
│   ├── Auth/               # Login and Register with role selection
│   ├── Profile/            # MyProfile edit, ProfileCard, PublicProfile
│   ├── Browse/             # search and filter partners
│   ├── Matches/            # MatchesList tabs, MatchCard accept/decline
│   ├── Messages/           # MessagesList, ChatWindow
│   ├── Feed/               # FeedPage, PostCard, CreatePost
│   ├── HomePage/           # landing page hero
│   └── Shared/             # LoadingSpinner, EmptyState, LevelBadge
└── main.jsx                # routes and providers
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/Rufaisashah/DanskBuddy-Rufaisa.git
cd DanskBuddy-Rufaisa

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

No environment variables needed — all data uses localStorage.

---

## How It Works

### Data storage

All data is stored in the browser's localStorage — no backend or database required.

```
danskbuddy_users    → all registered users + seed profiles
danskbuddy_current  → id of logged in user
danskbuddy_matches  → connection requests and their status
danskbuddy_messages → conversations keyed by conversationId
danskbuddy_posts    → community feed posts
```

On first visit, 15 seed profiles are loaded automatically so the Browse page is populated immediately.

### User object shape

```js
{
  id: "unique-id",
  email: "user@test.com",
  password: "plaintext",       // localStorage only — not for production
  name: "Maja Nielsen",
  role: "native",              // learner | native | both
  avatar: "👩",               // emoji avatar
  city: "Copenhagen",
  danishLevel: "native",       // beginner | intermediate | advanced | native
  nativeLanguage: "Danish",
  learningGoals: "Help others learn Danish",
  topics: ["culture", "food"],
  availability: "weekends",
  bio: "Born and raised in Copenhagen...",
  createdAt: "2026-01-01"
}
```

### Match object shape

```js
{
  id: "unique-id",
  requesterId: "user-id",
  receiverId: "user-id",
  status: "pending",           // pending | accepted | declined
  createdAt: "2026-01-01T10:00:00"
}
```

### Message object shape

```js
{
  id: "unique-id",
  conversationId: "userId1-userId2",
  senderId: "user-id",
  text: "Hej! Vil du øve dansk?",
  createdAt: "2026-01-01T10:00:00"
}
```

---

## Routes

| Route | Page | Auth required |
|---|---|---|
| `/` | HomePage | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/browse` | Browse partners | Yes |
| `/profile/me` | My profile | Yes |
| `/profile/:id` | Public profile | Yes |
| `/matches` | Matches list | Yes |
| `/messages` | Messages list | Yes |
| `/messages/:userId` | Chat window | Yes |
| `/feed` | Community feed | Yes |

---

## Team

Built by three HackYourFuture Denmark students:

| Member | Role | Features |
|---|---|---|
| **Rufaisa Shah** | Frontend | Auth, Profile, Browse, HomePage |
| **Iryna** | Frontend | Context, Layout, Matches, Routes, Deployment |
| **Jyoti** | Frontend | Seed data, Shared components, Messages, Feed |

---

## Development

### Branch strategy

```
main      → production, protected
develop   → integration branch
feature/* → one branch per feature per person
```

### Git workflow

```bash
# Start of every day
git checkout develop
git pull origin develop
git checkout feature/your-branch
git merge develop

# End of every day
git add .
git commit -m "feat: what you built"
git push origin feature/your-branch
```

### Commit message format

```
feat: add browse page with search and filter
fix: correct match status not updating
chore: add seed data file
style: mobile responsive matches page
```

---

## Known Limitations

- **localStorage only** — data is stored in the browser. Clearing browser data removes all accounts and messages. A production version would use PostgreSQL.
- **No password hashing** — passwords are stored in plain text in localStorage. Not suitable for production.
- **Single device** — since data is browser-based, accounts don't transfer between devices or browsers.
- **No real notifications** — pending match count refreshes on page load, not in real time.

---

## What We Would Add Next

- PostgreSQL database for persistent storage
- Node.js + Express REST API
- Real time messaging with WebSockets
- Email notifications for new matches
- Profile photo upload with Cloudinary
- Danish language level quiz on registration
- Map view to find partners near you
- Mobile app with React Native

---

## Weekly Sprints

| Week | Focus | Done |
|---|---|---|
| 1 | Foundation — auth, context, layout, seed data, matches, messages | ✅ |
| 2 | Polish — browse, feed, profile, deployment, mobile responsive | ✅ |

---

*Built at HackYourFuture Denmark, 2026* -->
