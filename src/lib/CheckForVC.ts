/** @format */

import * as DJS from "discord.js";

// * Quick util for checking if a user is connected to a voice channel in the same guild as the bot or not
export function CheckForVC(Message: DJS.Message): boolean {
  let vc = Message.author.client.voiceConnections.has(Message.guild.id);
  /*if (vc === false) {
    Message.channel.send(
      `**Don't degrade the champion at any time!** A man in my position could never afford to look ridiculous. __You understand that?__ Tell Tito Santana and tell Hulk Hogan that.`
    );
  }*/
  return true;
}
