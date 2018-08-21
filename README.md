# Emergency Contacts
A static website with your personal emergency contacts. If you are lost without any of your devise around and you need to call a family member but don't know the number and all your accounts are secured with 2-step authentication this site can safe your day.

## How to setup

1) Fork this repository and setup GitHub pages.

2) Generate a JSON file with all the contacts that might come in handy [on this page](https://jwillmer.github.io/emergency-contacts/encrypt.html).

3) Paste the encrypted data into [emergency-information.json](emergency-information.json) and update the repository.

4) Visit the [start page](https://jwillmer.github.io/emergency-contacts/index.html) and try it out (demo uses `sos` as password).

## Tested Browsers

| Browser      | Status      | Note                 |
| ------------ | ----------- | -------------------- |
| Safari 604   | works       | crypto polyfill      |
| Safari 602   | not working | missing ES6 support  |
| Chrome 68    | works       |                      |
| Chrome 63    | works       |                      |
| IE 10        | not working | missing ES6 support  |
| IE 11        | not working | missing ES6 support  |


## Tooling

The following tools are used to optimize this project.

- [BrowserStack](https://www.browserstack.com/) to test its accessibility. 
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) to optimize for speed

[![browserstack](img/browserstack.png)](https://www.browserstack.com/)
[![lighthouse](img/lighthouse.png)](https://developers.google.com/web/tools/lighthouse/)
