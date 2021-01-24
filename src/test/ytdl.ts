
import * as ytdl from "ytdl-core";
import { writeFileSync } from "fs";

async function test() {
  let info = await ytdl.getInfo('https://www.youtube.com/watch?v=fUffrvUjwCY');
  writeFileSync('./ytinfo.json', JSON.stringify(info), 'utf8');
}

test();
