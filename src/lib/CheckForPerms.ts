/** @format */

import * as DJS from "discord.js";

export function CheckForPerms(
  Message: DJS.Message,
  Permissions: DJS.PermissionResolvable
): boolean {
  let bool = Message.member.hasPermission(Permissions, {
    checkAdmin: true,
    checkOwner: true,
  });
  if (!bool) {
    Message.channel.send(
      `*licks beard with tongue* You're talkin to the Intercontinental Heavyweight Champion of the world! **Yeaaahhhhh** You can't beat the Macho Man Randy Cabbage, even Hulk Hogan. I'm watchin' you.`
    );
    return bool;
  }
}
