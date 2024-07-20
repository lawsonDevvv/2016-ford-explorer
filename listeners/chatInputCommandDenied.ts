import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Listener, Events } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandDenied
})
export default class extends Listener {
    public async run() {
        return this.container.logger.info(`[COMMAND DENIED] A user tried to run a command but was denied.`);
        
    }
}