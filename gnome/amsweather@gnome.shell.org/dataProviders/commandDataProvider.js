'use strict';

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const ByteArray = imports.byteArray;

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

var Provider = class Provider {
    constructor(pathToExtension) {
        this._pathToExtension = pathToExtension;
    }

    provide(onNewData) {
        Command.ExcecuteAsync((result) => onNewData(result), `${this._pathToExtension}/amsweather.sh`);
    }
}
