
import {CommandDataProvider} from './commandDataProvider.js';
import {FetchDataProvider} from './fetchDataProvider.js'

export const Providers = Object.freeze({
  Command:  Symbol("command"),
  Fetch:  Symbol("fetch")
});

export function DataProviderFactory(providers, ...args) {

    switch (providers) {
        case Providers.Command:
            return new CommandDataProvider(args);
  
        case Providers.Fetch:
            return new FetchDataProvider(args);
            
        default:
            throw(`Not found in ${providers}.`);
    } 
}

