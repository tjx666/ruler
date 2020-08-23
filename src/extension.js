import Vue from 'vue';

import Ruler from './view/Ruler';
import { __DEV__ } from './utils/constants';

if (__DEV__) {
    console.log('Inject extension script success!');
}

const APP_KEY = Symbol(chrome.runtime.id);
let app = window[APP_KEY];
if (app) {
    app.remove();
    app.vm.$destroy();

    delete app.vm;
    delete window[APP_KEY];
} else {
    const vm = new Vue({
        el: document.createElement('div'),
        render: (h) => h(Ruler),
    });

    app = document.createElement('div');
    app.vm = vm;
    const shadow = app.attachShadow({ mode: 'closed' });
    shadow.appendChild(vm.$el);
    document.body.appendChild(app);
    window[APP_KEY] = app;

    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.extension.getURL('style.css');
    shadow.appendChild(styleLink);
}