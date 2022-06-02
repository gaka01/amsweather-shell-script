'use strict';

var Provider = class Provider {
    provide(onNewData) {
        fetch('http://93.155.192.228/')
        .then(request => request.text())
        .then(htmlData => {
            const result = htmlData.match(/(?<=Температура\s\s)(.*)(?=C)./g);
            if(result && result.length > 0) {
                onNewData(result);
            }
        });
    }
}