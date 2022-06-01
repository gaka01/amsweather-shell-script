/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

'use strict';

const {St, Gio, Clutter} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
//libs
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;

class ExtensionView {

    constructor() {
        this._indicator = null;
        this._label = null;
	}

    create() {

        let indicatorName = `${Me.metadata.name} Indicator`;

        this._indicator = new PanelMenu.Button(0.0, indicatorName, true);
            
        this._label = new St.Label({
            text: "...",
            y_align: Clutter.ActorAlign.CENTER
        });

        this._indicator.add_actor(this._label);

        Main.panel.addToStatusArea(indicatorName, this._indicator, 1, "center");
    }

    update(data) {
        if(this._label && data) {
            this._label.set_text(data);
        }
    }

    destroy() {
        if(this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}

class ExtensionCtrl {

    constructor(opt) {
        this._view = new ExtensionView();
        this._timeout = null;
        this._opt = opt || {};
    }

    _update() {
        const data = Command.Excecute(this._opt.command).trim();
        log(`_update ${data}`);
        this._view.update(data);
    }

    _starttmr() {
        if(!this._timeout){
            const interval = (this._opt.interval || 60) * 1000;
            this._timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval,
            () => {
                this._update();
                return GLib.SOURCE_CONTINUE;
            });
        }
    }

    _stoptmr() {
        if(this._timeout){
            GLib.Source.remove(this._timeout);
            this._timeout = null;
        }
    }

    create() {
        this._view.create();
        this._update();
        this._starttmr();
    }

    destroy() {
        this._stoptmr();
        this._view.destroy();
    }
}

class Command {

    static Excecute(...args) {

        let [res, out] = GLib.spawn_sync(null, args,
                        null, GLib.SpawnFlags.SEARCH_PATH, null);

        return (out.length > 0) ?
                ByteArray.toString(out) : _("Error executing command.");
    }
}

/* exported init */

class Extension {
    constructor() {
        this.ctrl = new ExtensionCtrl({
            interval: 900,
            command: `${Me.path}/amsweather.sh`
        });
    }

    enable() {
        log(`enabling ${Me.metadata.name}`);
        this.ctrl.create();
    }

    disable() {
        log(`disabling ${Me.metadata.name}`);
        this.ctrl.destroy();
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`);
    return new Extension();
}
