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

//libs
const GLib = imports.gi.GLib;

//own imports
const { PanelMenuView } = Me.imports.ui.panelMenuView
// const FetchDataProvider = Me.imports.dataProviders.fetchDataProvider
const CommandDataProvider = Me.imports.dataProviders.commandDataProvider


class ExtensionCtrl {

    constructor(opt) {
        this._opt = opt || {};
        this._timeout = null;

        this._dataProvider = new CommandDataProvider.Provider(Me.path);
        this._view = new PanelMenuView(this._opt.position, this._opt.positionIndex);
    }

    _update() {
        this._dataProvider.provide(newData => {
            log(`_update ${newData}`);
            this._view.update(newData);
        });
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

/* exported init */

class Extension {
    constructor() {
        this.ctrl = new ExtensionCtrl({
            interval: 900,
            position: 'center',
            positionIndex: 1,
            // command: `${Me.path}/amsweather.sh`
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
