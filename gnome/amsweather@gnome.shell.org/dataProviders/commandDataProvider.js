'use strict';

const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;

class Command {

    static Excecute(...args) {

        let [res, out] = GLib.spawn_sync(null, args,
                        null, GLib.SpawnFlags.SEARCH_PATH, null);

        return (out.length > 0) ?
                ByteArray.toString(out) : _("Error executing command.");
    }
}

var Provider = class Provider {
    constructor(pathToExtension) {
        this._pathToExtension = pathToExtension;
    }

    provide(onNewData) {
        const result = Command.Excecute(`${this._pathToExtension}/amsweather.sh`).trim();
        onNewData(result);
    }
}