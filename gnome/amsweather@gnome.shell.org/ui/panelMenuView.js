'use strict';

import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export class PanelMenuView {

    constructor(position, positionIndex, indicatorName) {
        this._indicator = null;
        this._label = null;
        this._position = position || 'center';
        this._positionIndex = positionIndex || 1;
        this._indicatorName = indicatorName || 'indicator';
	}

    create() {

        this._indicator = new PanelMenu.Button(0.0, this._indicatorName, true);
            
        this._label = new St.Label({
            text: "...",
            y_align: Clutter.ActorAlign.CENTER
        });

        this._indicator.add_child(this._label);

        Main.panel.addToStatusArea(this._indicatorName, this._indicator, this._positionIndex, this._position);
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
