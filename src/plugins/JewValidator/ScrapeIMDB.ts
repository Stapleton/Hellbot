import fetch from 'node-fetch';
import * as dp from 'dom-parser'

export class ScrapeIMDB {
  private url: string;

  constructor(slug: string) {
    this.url = `https://www.imdb.com/title/${slug}/fullcredits`
  }

  public async getDOM() {
    let val = await fetch(this.url);
    let body = new dp().parseFromString(await val.text());

    return body;
  }

  public getTitle(dom: dp.Dom) {
    let title = dom.getElementsByTagName('title');
    return `${title[0].textContent.replace('&amp;', '&')}`
  }

  public getCast(dom: dp.Dom) {
    let nodes = dom.getElementsByClassName('name');
    let cast: string[] = [];

    nodes.forEach(node => {
      let n = node.childNodes[1].innerHTML;
      cast.push(n.substr(1, n.length - 2));
    });

    return [...new Set(cast)];
  }
}
