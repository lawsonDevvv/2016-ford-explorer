# AI Coding Agent Guide: 2016-ford-explorer

## Project Essence
Discord bot for CMTZ community (Civil Metropolitan Transit Authority) using Sapphire Framework (Discord.js v14). Manages features: group rankings (Roblox), tickets, suggestions, counting games, giveaways, and moderation cases. MySQL persistence via Prisma. Thematic automotive/transit error messages throughout.

## Critical Architecture Patterns

### Sapphire Framework Foundation
All commands/listeners use decorators + default exports:
```typescript
@ApplyOptions<CommandOptions>({
  description: 'Command description',
  preconditions: ["Staff"]  // Custom: Staff, HeadAdmin, OwnerOnly
})
export default class extends Command { ... }
```
Register commands with `RegisterBehavior.VerboseOverwrite` to ensure updates.

### Global Singleton Pattern (src/Bot.ts)
These are exported globally and imported directly throughout codebase:
- `prisma`: PrismaClient instance
- `client`: LawsonClient (Sapphire) instance
- `snipes`: Message deletion cache
- `editSnipes`: Edit history cache
- `apiUrl`, `headers`: Custom ranking API config

**Always import from Bot.ts, never instantiate new services.**

### Type & Enum Organization (src/util/types/)
Metadata objects map enums to display values:
- **Cases.ts**: `CaseType` enum (0-7), `CaseTypeMetadata` for display, `blacklistRoles` object with hardcoded Discord role IDs
- **Tickets.ts**: `TicketTypes` enum, `TicketCategories` (channel ID mapping), `TicketRoles`, `TicketEmbedColors`, `TicketGreetingMessages` per type
- **Other files**: Roblox types, 2FA, GiveawayStatus, SuggestionThreadTags

Use enum *numbers* when creating database records, not string keys.

### Channel & Role ID Management
Hardcoded in type files and listeners:
- Counting channel: `1281993412396191847`
- Suggestion forum: `1286445249287163914`
- Staff role: `1238455317860323338`
- Ticket blacklist: `1373746940214509740`
- Various ticket categories/roles per type in Tickets.ts

### Interaction Handler Pattern (src/listeners/interactionHandlers/)
Listeners check `customId` to route interactions:
```typescript
if (interaction.customId !== "createTicketButton") return;
// Always check guild/member before proceeding
if (!interaction.guild || !interaction.member) return;
// Defer for long operations
await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
```

## Key Data Flows

### Counting System
1. Message in channel `1281993412396191847` → `CountingChannel` listener
2. Validates: numeric format, equals `currentNumber + 1`, different user than last counter
3. Checks `blacklistRoles.countingBlacklist` for blacklisted users
4. Updates `Counting` model (currentNumber, lastCounter, countingRecord)
5. Reacts with 👍 (success) or 👎 (failure with "Cylinder 3 Misfire" error)

### Ticket Workflow
1. User selects type from dropdown → `ticketCreateButtonHandler`
2. Checks `ticketBlacklist` role, calls `createTicket()` utility
3. Channel created with permissions for user + ticket role
4. Buttons: Claim (sets `claimedBy`), Close (generates transcript, sets `closedBy`/`closedAt`)
5. Transcripts stored as JSON in `Ticket.transcript` field

### Suggestion System
1. Command creates Discord forum thread in `1286445249287163914`
2. Generates 10-char unique ID (via `short-unique-id`)
3. Stores: author, type (Server/Game/Other), status (Pending/Approved/Denied), staff response
4. Staff updates via separate commands with status/response

### Case Management (Moderation)
Creates audit trail for blacklists/unblacklists with `Case` model:
- Type: enum 0-7 (counting/ticket/giveaway/run, blacklist/unblacklist)
- Status: Open (0), Closed (1), Rescinded (2)
- Stores: createdAt, editedAt, guild, user, staffMember, reason

## Development Workflows

### Local Development
```bash
npm run buildPreserve    # Incremental compile (tsc only)
npm run bs               # Full rebuild + run (rimraf + tsc + node)
npm run build            # Clean rebuild
npm start                # Run existing compiled bot
```

### Database Changes
```bash
npx prisma migrate dev --name description_of_change
npx prisma generate     # Regenerate after schema edits
```
Migrations stored in `prisma/migrations/`. MySQL provider only.

### Testing
Jest + ts-jest in `test/` (mirrors `src/` structure). Currently minimal coverage.

## Project-Specific Conventions

### Error Message Theming
Automotive/transit failures for context:
- "Cylinder 3 Misfire" - Counting errors
- "7.3, apply" - Counting timeout message
- "CBTC_DEADMAN" - API failures
- "I_AM_A_TEAPOT (NO_COFFEE)" - 418 status code

### Role-Based Preconditions
Use hardcoded role IDs in precondition checks:
```typescript
// Staff role: 1238455317860323338
// Check with: if (!interaction.member?.roles.cache.has('roleId')) return;
```

### Embed Patterns
```typescript
import { EmbedBuilder, Colors } from "discord.js";
new EmbedBuilder()
  .setDescription("text")
  .setColor(Colors.Red)  // or hex: 0xFF0000
```

### Environment Variables
Required in `.env`:
- `TOKEN`, `DATABASE_URL`, `ROBLOX_COOKIE`
- `API_URL`, `API_PORT`, `API_KEY` (optional, defaults to localhost:3000)
- `CMTZ_GROUP` (Roblox group ID)
- `OTP_MASTER_KEY` (2FA key derivation)
- `SENTRY_DSN` (error tracking, optional)

## Common Implementation Patterns

### Creating Commands
Extend `Command`, use decorator, implement `chatInputRun()`:
```typescript
@ApplyOptions<CommandOptions>({ preconditions: ["Staff"] })
export default class extends Command {
  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    await interaction.deferReply();
    // Database ops here
    return await interaction.editReply({ ... });
  }
}
```

### Database Operations
Always use global `prisma` instance:
```typescript
import { prisma } from "../Bot";
await prisma.ticket.create({ data: { ... } });
await prisma.counting.update({ where: { server: guildId }, data: { ... } });
```

### Permission Checks
```typescript
const member = interaction.member as GuildMember;
if (member.roles.cache.has(blacklistRoles.ticketBlacklist)) return;
```

## Critical Files by Purpose
- **Architecture**: `src/Bot.ts` (exports), `src/lib/LawsonClient.ts` (intents)
- **Types & Constants**: `src/util/types/*.ts` (all enums, metadata, role/channel IDs)
- **Preconditions**: `src/preconditions/*.ts` (Staff, HeadAdmin, OwnerOnly)
- **Database**: `prisma/schema.prisma` (all models)
- **Example Command**: `src/commands/Staff/blacklist.ts` (preconditions, role operations)
- **Complex Utility**: `src/util/tickets/createTicket.ts` (permissions, data persistence)

## Known Quirks
- Whitelist of user IDs in `CountingChannel.ts` line 12-13 (bypass counting restrictions)
- Counting validation allows any number 0-100000000
- Ticket transcripts stored as raw JSON (not pre-formatted)
- Suggestions use forum threads (not traditional channels)
- 2FA backup codes and encrypted storage models present but scope unclear

