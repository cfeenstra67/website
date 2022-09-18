---
title: 'Egghead History'
date: '2022-09-18'
description: 'Egghead is a browser history replacement with much more advanced searching capabilities than the default Chrome history.'
repo: cfeenstra67/egghead
live: https://egghead.camfeenstra.com
---
Egghead is a browser history extension that I created because I found myself trying to find things in Chrome's default history without success fairly often. The most common scenario I found myself in was something like:

1. In the course of solving a problem I'd google around, and eventually find a solution. For programming questions, this often meant opening a Stack Overflow link from my google search.
2. Later I'd want to inspect that page again but would rather just find it in my history rather than recreate whatever google search allowed me to find it in the first place.

In chrome's default history, this seemingly simple task was impossible. The main feature I wanted to implement in Egghead was to allow myself to see the links I opened from each page after searching for it. Egghead allows this, in addition to having a generally much more powerful search engine allowing faceted queries and other things.

It was also a fun project where I was able to learn about publishing browser extensions, creating extensions that were compatible w/ all modern browsers, and practice typescript more generally. It's currently available on the chrome extension and firefox add-on stores:

- [Chrome](https://chrome.google.com/webstore/detail/egghead-history/gnbambehlmjiemgkmekipjgooacicknb)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/egghead-history/)
