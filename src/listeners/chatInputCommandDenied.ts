import { ApplyOptions } from "@sapphire/decorators";
import {ListenerOptions, Listener, Events, ChatInputCommandDeniedPayload, UserError} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandDenied
})
export default class extends Listener {
    public async run(_err: UserError, payload: ChatInputCommandDeniedPayload) {
        this.container.logger.info(`[COMMAND DENIED] A user tried to run /${payload.command.name} but was denied because of the following reason: ${_err.message}`);
        await payload.interaction.reply(`${_err.message}`)
    }
}