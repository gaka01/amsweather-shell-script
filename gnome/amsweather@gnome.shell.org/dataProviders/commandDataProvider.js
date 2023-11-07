'use strict';

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const ByteArray = imports.byteArray; // legacy module without ESM equivalent

class Command {

    static ExcecuteAsync(cbResult, ...args) {
        try {
            let proc = Gio.Subprocess.new(
                args, 
                Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            );
            
            proc.communicate_utf8_async(null, null, (proc, res) => {
                var result = null;
                try {
                    let [, stdout, stderr] = proc.communicate_utf8_finish(res);

                    if (proc.get_successful()) {
                        result = stdout.trim(); 
                    } else {
                        log(stderr);
                        result = null;
                    }
                } catch (e) {
                    logError(e);
                    result = null;
                } finally {
                    cbResult(result);
                }
            });
        } catch (e) {
            cbResult(null);
        }
    }
    
    static Excecute(...args) {

        let [res, out] = GLib.spawn_sync(null, args,
                        null, GLib.SpawnFlags.SEARCH_PATH, null);

        return (out.length > 0) ?
                ByteArray.toString(out) : _("Error executing command.");
    }
}

export class CommandDataProvider {
    constructor(pathToExtension) {
        this._pathToExtension = pathToExtension;
    }

    provide(onNewData) {
        Command.ExcecuteAsync((result) => onNewData(result), `${this._pathToExtension}/amsweather.sh`);
    }
}
