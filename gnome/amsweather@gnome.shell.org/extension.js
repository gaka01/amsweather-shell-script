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

import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

import {PanelMenuView} from './ui/panelMenuView.js';
import {DataProviderFactory, Providers} from './dataProviders/dataProviderFactory.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

class ExtensionCtrl {

    constructor(opt) {
        this._opt = opt || {};
        this._timeout = null;

        this._dataProvider = new DataProviderFactory(Providers.Command, this._opt.path);
        this._view = new PanelMenuView(this._opt.position, this._opt.positionIndex, this._opt.name);
    }

    _update() {
        this._dataProvider.provide(newData => {
            log(`_update: ${newData}`);
            this._view.update(newData);
        });
    }

    _starttmr() {
        if(!this._timeout) {
            const interval = (this._opt.interval || 60) * 1000;
            this._timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval,
            () => {
                this._update();
                return GLib.SOURCE_CONTINUE;
            });
        }
    }

    _stoptmr() {
        if(this._timeout) {
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

export default class MyExtension extends Extension {

    enable() {
        log(`enabling: ${this.metadata.name}`);
        this.ctrl = new ExtensionCtrl({
            interval: 900,
            position: 'center',
            positionIndex: 1,
            name: this.metadata.name,
            path: this.path
        });
        this.ctrl.create();
    }

    disable() {
        log(`disabling: ${this.metadata.name}`);
        this.ctrl.destroy();
    }
}

