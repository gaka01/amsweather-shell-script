## amsweather - Gnome shell extension
Sample gnome 42 shell extension executing command on specified interval

### Installation
* chmod +x ../amsweather.sh 
* cp -a ../amsweather.sh ./amsweather@gnome.shell.org/
* cp -avr ./amsweather@gnome.shell.org ~/.local/share/gnome-shell/extensions/
* re-login and enable 'amsweather' extension

### Debug
* follow first 2 steps from installation
* ln -s <path_to>/amsweather@gnome.shell.org/ ~/.local/share/gnome-shell/extensions/
* re-login and enable 'amsweather' extension
* dbus-run-session -- gnome-shell --nested --wayland or journalctl -f -o cat /usr/bin/gnome-shell
* development reference https://gjs.guide/extensions/development/creating.html
