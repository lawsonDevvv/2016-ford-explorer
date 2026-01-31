# AI Coding Agent Instructions: 2016-ford-explorer

## Project Overview
Discord bot for the Civil Metropolitan Transit Authority (CMTZ) community, built with Discord.js v14 and Sapphire Framework. Integrates with Roblox API (via noblox.js) for group management, uses Prisma with MySQL for persistence, and includes custom systems for suggestions, tickets, counting, giveaways, and moderation cases.

## Architecture & Key Patterns

### Sapphire Framework Structure
- **Commands**: Use `@ApplyOptions<CommandOptions>` decorator with default exports extending `Command`
- **Listeners**: Use `@ApplyOptions<ListenerOptions>` decorator with `event: Events.X` property
- **Preconditions**: Custom authorization checks (`Staff`, `HeadAdmin`, `OwnerOnly`) applied via `preconditions` array in command options
- All classes use decorator pattern and default exports: `export default class extends Command {}`

### File Organization
```
src/
  Bot.ts                  # Entry point - initializes client, Prisma, Roblox API
  lib/LawsonClient.ts     # Custom SapphireClient with required intents
  commands/               # Slash commands organized by access level
    Public/               # No preconditions
    Staff/                # Requires Staff precondition
    Dev/                  # Owner/developer only
    Util/                 # Roblox integration commands (setrank, getrank)
  listeners/              # Event handlers
    interactionHandlers/  # Modal/button/select menu handlers
  util/                   # Shared utilities
    types/                # Type definitions and enums
    cases/                # Moderation case management
    tickets/              # Ticket system utilities
  preconditions/          # Custom Sapphire preconditions
```

### Database Models (Prisma)
- **Suggestion**: Forum-based suggestion system with staff responses, status tracking
- **Counting**: Per-guild counting game state (currentNumber, lastCounter, countingRecord)
- **Giveaway**: Giveaway system with participants (many-to-many relation)
- **Case**: Moderation cases for blacklists/unblacklists (CaseType enum, CaseStatus enum)
- **Ticket**: Support ticket system with claim/close workflow, transcript storage
- **TicketSettings**: Per-guild counter and logs channel config
- **BackupCode**: 2FA backup code storage

### Type System Patterns
Type definitions in `src/util/types/` follow a consistent pattern:
- String unions for type safety: `type ticketType = 'general' | 'report' | 'reportStaff'`
- Enums for database values: `enum CaseType { CountingBlacklist = 0, ... }`
- Metadata objects mapping enums to display strings/IDs: `CaseTypeMetadata`, `TicketRoles`, `TicketCategories`
- Role IDs hardcoded in type files (e.g., `blacklistRoles`, `TicketRoles`)

### Interaction Handlers
Listeners in `src/listeners/interactionHandlers/` handle modals, buttons, and select menus:
- Check `customId` to route interactions: `if (interaction.customId !== 'suggestionModal') return;`
- Use `interaction.deferReply()` for operations taking >3s
- Modals collect multi-field input (suggestions, tickets)
- Buttons trigger actions (ticket claim/close, role selection)

### External API Integration
- **Roblox API**: Authenticated via cookie in `Bot.ts`, used for group ranking commands
- **Custom API**: Optional ranking API at `${apiUrl}/ranking/setRank` with bearer token auth
- Both use axios with error handling for 418 (already ranked) and other status codes

### Global Exports Pattern
`src/Bot.ts` exports frequently-used singletons:
```typescript
export const prisma: PrismaClient
export const client: LawsonClient
export const snipes: Map<string, Message>      // Message deletion cache
export const editSnipes: Map<string, Message[]> // Edit history cache
export const apiUrl: string
export const headers: { Authorization: string }
```
Import these directly: `import { prisma, client } from "../Bot"`

## Development Workflows

### Build & Run
```bash
npm run build       # rimraf ./dist && tsc - Clean build
npm run buildPreserve  # tsc only - Incremental
npm start          # node ./dist/Bot.js
npm run update     # git pull && build
```

### Database Migrations
Use Prisma CLI for schema changes:
```bash
npx prisma migrate dev --name description_of_change
npx prisma generate  # Regenerate Prisma Client after schema changes
```
Migration history in `prisma/migrations/`, uses MySQL provider.

### Testing
Jest configured with `ts-jest`, mocks discord.js. Run with `npm test`.
Test files in `test/` mirror `src/` structure. Currently minimal coverage.

### Environment Variables
Required variables in `.env` (see `.env.example`):
- `TOKEN`: Discord bot token
- `DATABASE_URL`: MySQL connection string
- `ROBLOX_COOKIE`: Roblox authentication cookie
- `API_URL`, `API_PORT`, `API_KEY`: Optional custom ranking API
- `CMTZ_GROUP`: Roblox group ID
- `SENTRY_DSN`: Error tracking (optional)
- `OTP_MASTER_KEY`: 2FA key derivation

## Project-Specific Conventions

### Error Messages
Use humorous/thematic error messages referencing transit/automotive failures:
- `"Cylinder 3 misfire"` for counting errors
- `"CBTC_DEADMAN (CBTC_BIE)"` for API failures
- `"I_AM_A_TEAPOT (NO_COFFEE)"` for 418 status codes

### Command Registration
Always use `RegisterBehavior.VerboseOverwrite` to update commands:
```typescript
registry.registerChatInputCommand(builder, {
    behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite
});
```

### Role-Based Authorization
Preconditions check hardcoded role IDs:
- Staff role: `1238455317860323338`
- Ticket blacklist: `1373746940214509740`
Define blacklist roles in `src/util/types/Cases.ts` as `blacklistRoles` object.

### Embed Patterns
Use `@discordjs/builders` for embeds:
```typescript
import { EmbedBuilder } from "@discordjs/builders";
// Color constants from discord.js: Colors.Red, Colors.Green
// Or hex values: 0x00FF00
```

### Ticket System Flow
1. User selects category from dropdown (sendTicketEmbed.ts)
2. `ticketCreateButtonHandler` validates blacklist, calls `createTicket()`
3. Channel created with permissions for user + ticket role
4. Embed with Claim/Close buttons sent
5. Staff claims ticket (sets `claimedBy`), closes ticket (sets `closedBy`, `closedAt`, generates transcript)
6. Transcripts stored as JSON in `Ticket.transcript` field

### Counting Channel Logic
- Only allows numeric messages in channel `1281993412396191847`
- Validates next number = currentNumber + 1
- Prevents same user counting twice consecutively
- Resets to 0 on errors, updates `countingRecord` on new highs
- Blacklisted users prevented from counting

### Suggestion System
- Uses Discord forum channel (`1286445249287163914`)
- Creates thread with tags (Server/Game/Other) from `SuggestionThreadTags`
- Generates short unique ID (10 chars) for tracking
- Stores messageId after thread creation for vote tracking
- Staff can update status/response via separate commands

## Key Files for Context
- `src/Bot.ts`: Entry point, global exports, initialization
- `src/lib/LawsonClient.ts`: Client configuration with intents
- `src/util/types/`: All type definitions, enums, metadata objects
- `prisma/schema.prisma`: Database schema and relationships
- `src/commands/Staff/blacklist.ts`: Example command with preconditions
- `src/util/tickets/createTicket.ts`: Example complex utility with permissions

## Common Pitfalls
- Don't forget `@ApplyOptions` decorator on commands/listeners
- Always defer replies for database operations: `await interaction.deferReply()`
- Import `prisma` from Bot.ts, not instantiate new PrismaClient
- Use enum values (numbers) when creating database records, not string keys
- Check guild/member exists before role operations: `if (!interaction.guild) return`
- Ticket/counting channel IDs are hardcoded - don't make them configurable without schema changes
