'use strict';
const {St, Gio, Clutter} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

var PanelMenuView = class PanelMenuView {

    constructor(position, positionIndex) {
        this._indicator = null;
        this._label = null;
        this._position = position || 'center';
        this._positionIndex = positionIndex || 1;
	}

    create() {

        const indicatorName = `${Me.metadata.name} Indicator`;

        this._indicator = new PanelMenu.Button(0.0, indicatorName, true);
            
        this._label = new St.Label({
            text: "...",
            y_align: Clutter.ActorAlign.CENTER
        });

        this._indicator.add_actor(this._label);

        Main.panel.addToStatusArea(indicatorName, this._indicator, this._positionIndex, this._position);
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