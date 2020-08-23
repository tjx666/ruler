import { __DEV__} from './utils/constants'

if (__DEV__) {
    console.log('Load background success!');
}

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.executeScript(null, { file: 'extension.js' });
});

