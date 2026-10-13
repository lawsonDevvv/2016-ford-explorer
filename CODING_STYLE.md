# 2016 Ford Explorer — House Coding Style

This is an observed style guide for this repository. It describes the code that is here now, including its intentional rough edges. When adding or changing code, match the nearby file first; do not use a broad formatter or a "cleanup" pass unless that is the requested change.

## Overall character

The project favors direct, readable feature code over abstraction for its own sake:

- One Discord command, listener, or operation per file.
- Small utilities do the actual database/API work; commands and interaction handlers coordinate them.
- Hardcoded Discord IDs and feature metadata live in `src/util/types/`, not in a fresh config/service layer.
- User-facing language is informal, sometimes blunt, and consistently automotive/transit themed for failures.
- Existing code is pragmatic rather than perfectly standardized. Consistency with the *local file* takes priority over enforcing one quote, import-spacing, or indentation style across the repository.

## File and folder organization

- Commands are grouped by audience/function: `src/commands/Public`, `Staff`, `Dev`, and then feature subfolders such as `Tickets` and `Group Moderation`.
- Event code lives under `src/listeners`; component/modal routing goes in `src/listeners/interactionHandlers`.
- Reusable operations go under `src/util/<domain>/` and normally use a default-exported async function.
- Domain enums, ID maps, display metadata, and union types go under `src/util/types/`.
- Prisma remains the source of truth for persistence in `prisma/schema.prisma`.

Prefer an existing domain folder over creating a generic `services`, `helpers`, `constants`, or `lib` folder.

## TypeScript and formatting

- TypeScript uses semicolons in normal statements and imports.
- Indentation is commonly four spaces. Continuation chains are usually indented one additional level.
- Object literals and arrays are generally expanded vertically once they have meaningful content.
- Keep trailing commas only where the nearby file already uses them; the repo contains both forms.
- Both single and double quotes are established. Most Discord-facing code leans double quotes for normal sentences and single quotes for IDs/options. Match the surrounding file instead of converting it.
- Imports are not globally sorted or uniformly spaced: both `import {Thing}` and `import { Thing }` occur. Copy the closest sibling’s convention.
- Add explicit types when they clarify Discord/Prisma values, function signatures, or data objects. Do not add gratuitous aliases, interfaces, wrappers, or generics around straightforward local values.
- Use `const` by default. `let` appears only when a value genuinely changes.
- Existing code uses straightforward `any` in error-boundary/event cases. Do not introduce `any` casually, but do not redesign an established error path solely to remove it.

Example command shape:

```ts
@ApplyOptions<CommandOptions>({
    description: "Renames a ticket.",
    preconditions: ["Staff", "GuildOnly"]
})
export default class extends Command {
    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const name: string = interaction.options.getString('name', true);

        if (!(interaction.channel instanceof TextChannel)) return await interaction.reply("This channel is not a text channel nor is it a ticket.");

        // Perform the focused operation, then reply with a compact payload.
    }
}
```

## Sapphire / Discord patterns

- Commands are default-exported `class extends Command` implementations, decorated with `@ApplyOptions<CommandOptions>(...)`.
- Listeners are default-exported `class extends Listener` implementations, decorated with `@ApplyOptions<ListenerOptions>(...)`.
- Commands normally define `registerApplicationCommands()` with a `SlashCommandBuilder`, then register with `RegisterBehavior.Overwrite` or `VerboseOverwrite` as the nearby command does.
- Implement slash command execution in `public async chatInputRun(interaction: ChatInputCommandInteraction)`.
- Put authorization in Sapphire `preconditions` when one already exists (`Staff`, `HeadAdmin`, `OwnerOnly`, etc.), instead of duplicating it within every command.
- Interaction handlers begin with short early-return guards: interaction kind, `customId`, guild, and member.
- Defer before work that may take time, using ephemeral `MessageFlags.Ephemeral` replies when the response is operational/private.
- Validate channel/member runtime types with `instanceof` where Discord’s types alone are not sufficient.
- Return the awaited final reply when it ends the function: `return await interaction.editReply(...)`. This is a common local pattern.
- Build embeds fluently with `EmbedBuilder`; use `Colors.*` or existing feature-specific color maps.

## Control flow and error handling

- Prefer guard clauses over nested `if` blocks:

```ts
if (!interaction.guild || !interaction.member) return;
if (interaction.customId !== "closeTicketButton") return;
```

- Keep happy paths linear: get input → validate context → call utility/database → send reply.
- Wrap external calls and multi-step Discord operations in `try`/`catch` when a user needs feedback or an error should be logged.
- Log through `this.container.logger` in framework classes. Use `client.logger` during bootstrap.
- Preserve the established automotive error copy, especially `Cylinder <n> Misfire`, instead of replacing it with generic "Something went wrong" text.
- Use `error instanceof Error ? error.message : String(error)` when interpolating an unknown thrown value in a new error message.

## Data access and external APIs

- Import the global singleton from `src/Bot.ts`; do not create new Prisma, Discord-client, or API-client instances.

```ts
import {prisma} from "../../Bot";

const ticket = await prisma.ticket.findFirst({
    where: { channel: interaction.channel!.id }
});
```

- Keep Prisma reads/writes close to the operation that owns them. Simple queries are often one line; multi-field queries are expanded vertically.
- Import shared `apiUrl` and `headers` from `Bot.ts` for the custom API. API helpers are small default exports that return typed response data directly.
- Use enum values/numeric status values and metadata maps already defined under `src/util/types/`; do not replace them with ad hoc strings.
- Preserve existing database field naming conventions (`guild`, `channel`, `user`, etc.) rather than translating them into a second domain model.

## Constants, IDs, enums, and metadata

- Put hardcoded role/channel/category IDs next to their feature’s types and metadata, as existing ticket and case modules do.
- Use string-literal unions for small feature keys (for example `ticketType`) and enums where values map to database/state concepts.
- Follow an enum with a metadata object when UI text or IDs are keyed by it.
- Name metadata maps in PascalCase (`TicketRoles`, `CaseTypeMetadata`) and use bracket lookup (`TicketRoles[type]`).
- Keep the existing numerical enum ordering intact, particularly for persisted case/status values.

## Naming

- Files use camelCase names that describe one behavior: `createTicket.ts`, `ticketCloseButtonHandler.ts`, `getServers.ts`.
- Command/listener classes are usually anonymous default exports. Named classes are acceptable where the existing file uses one (for example `EvalCommand`).
- Functions and local variables use camelCase and uncomplicated names: `ticketSettings`, `updateData`, `reasonInput`, `numberContent`.
- Type names, enums, client classes, and builders use PascalCase.
- Use short names only for tightly scoped builder callbacks (`o`, `option`) and response objects (`r`); otherwise choose readable descriptive names.

## Comments and documentation

- Comment business rules, Discord permission intent, surprising constants, and non-obvious validation.
- Keep comments plain and nearby, usually `// ...`. The ticket creation utility shows that JSDoc is welcome for a complex/public helper, but it is not required for ordinary commands/listeners.
- Do not add noisy comments that narrate obvious builder chains or restate TypeScript types.
- Preserve existing in-place operational comments such as `// @everyone`, `// Ticket User`, and schema status notes.

## User-facing copy

- The bot has personality. Keep messages compact, conversational, and in the same community voice.
- Technical failures should use the established automotive/transit vocabulary where appropriate (for example, "Cylinder 3 misfire" or "CBTC_DEADMAN").
- Existing copy can be intentionally irreverent. Do not sanitize or rewrite unrelated strings while implementing a feature.
- Command option descriptions are concise and sometimes playful; follow that tone without sacrificing what the input does.

## What not to do in future changes

- Do not introduce a new DI container, repository layer, config system, validation framework, or generic result type for a small feature.
- Do not instantiate `PrismaClient`, `LawsonClient`, Axios defaults, or an API client outside `src/Bot.ts` when an exported singleton/config already exists.
- Do not reformat unrelated files, normalize all quotation marks, alphabetize imports, or convert the project to a strict lint/prettier style as collateral work.
- Do not move feature IDs into environment variables unless the task specifically calls for configuration changes; hardcoded IDs are an established project convention.
- Do not change decorator/default-export command registration conventions.
- Do not change persisted enum numbers or schema defaults without a migration and an explicit data-impact review.

## Practical implementation checklist

Before sending a change for review:

1. Start from the closest existing command/listener/utility and mirror its structure.
2. Reuse `Bot.ts` exports and `src/util/types/` metadata before creating anything new.
3. Add context guards before Discord operations and defer long-running interactions.
4. Keep changes narrowly scoped; leave unrelated formatting, wording, and old quirks alone.
5. Run the TypeScript build after changing source code and fix any introduced errors.
6. Match the surrounding file’s quote style, import spacing, array/object layout, and registration behavior.

## Notes for AI-assisted work

The biggest style risk is not a missing semicolon—it is overengineering or applying a generic clean-code template that makes a new file feel unlike the rest of this bot. Prefer a 30-line direct handler that looks like its siblings over new shared abstractions. If the repository has two legitimate local styles, choose the style of the file being edited, not the style of the last file an AI happened to generate.
