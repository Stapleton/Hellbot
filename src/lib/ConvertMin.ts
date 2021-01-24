/** @format */

// Because I am too lazy to figure out the i18n node lib
export function ConvertMin(time: number | string) {
  // Hours, minutes and seconds
  var hrs = ~~(<number>time / 3600);
  var mins = ~~((<number>time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
