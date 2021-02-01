import { SPARQLQueryDispatcher } from '@Plugins/JewValidator/SPARQLQueryDispatcher';
import { ScrapeIMDB } from '@Plugins/JewValidator/ScrapeIMDB';
import * as json from 'jsonfile';
import * as fs from 'fs';

type ResultBinding = [{
  family_name: {
    type: string,
    value: string
  },
  family_nameLabel: {
    "xml:lang": string,
    type: string,
    value: string
  }
}]

type ResultType = {
  head: { vars: string[] },
  results: {
    bindings: ResultBinding
  }
}

export class Validator {
  private slug: string;
  private cacheFile: fs.PathLike = './src/plugins/JewValidator/namecache.json';
  private endpointUrl: string = 'https://query.wikidata.org/sparql'
  private queryDispatcher = new SPARQLQueryDispatcher( this.endpointUrl );
  
  private sparqlQuery = `SELECT ?family_name ?family_nameLabel WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    
    ?family_name wdt:P172 wd:Q7325.
    ?family_name wdt:P140 wd:Q9268.
    OPTIONAL { ?family_name wdt:P735 ?family_name. }
  }
  LIMIT 10000000`;


  constructor(slug: string) {
    this.slug = slug;

    try {
      fs.stat(this.cacheFile, (error, stats) => {
        if (error) throw error;
        if (stats.mtimeMs % Date.now() >= this.aWeek()) this.updateCache();  
      });
    } catch (e) {
      fs.writeFileSync(this.cacheFile, '[]');
    }
  }

  private aWeek() {
    let i = 1; // 1 ms
    i = i * 1000 // 1s
    i = i * 60 // 1m
    i = i * 60 // 1h
    i = i * 24 // 1d
    i = i * 7 // 1w
    return i;
  }

  public updateCache() {
    this.queryDispatcher.query( this.sparqlQuery ).then( (result: ResultType) => {
      let cache = result.results.bindings.map( value => {
        let v = value.family_nameLabel.value.split(' ');
        return v[v.length - 1];
      });
    
      json.writeFileSync(this.cacheFile, [...new Set(cache)]);
    });
  }

  public async compare() {
    let self = this;
    let imdb = new ScrapeIMDB(this.slug);
    let dom = await imdb.getDOM();
    let cast = imdb.getCast(dom);
    let title = imdb.getTitle(dom);
    let names: string[] = await json.readFile(this.cacheFile);
  
    let jews = cast.filter(value => {
      let v = value.split(' ');
      if (names.includes(v[v.length - 1])) return value;
    }, self);
  
    return `${title}\nThere are ${jews.length} jew(s) in the cast/crew.\n${jews.join(', ')}`;
  }
}
