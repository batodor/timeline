# Timeline pre-employment test

## Task

Your goal is to implement timeline page using provided components and API

Feel free to use any state-management library.
You can also use javascript instead of typescript.

![Prototype sketch](screenshot.png)

## Timeline logic

- Every page should show 10 latest activities.
- If user reaches bottom of the page you should display next 10 activities ("infinity scroll" is a preferred way, but you can implement it using "load more" button)
- You should subscribe for global timeline / timeline of opened project / file / user and collect all new activities behind button "load new {} activities"
- After clicking on "load new activities" you should display it at the top of the list, marked all of them with dot (`highlighted` property in `Comment` and `FileIsUploaded` components)
- Flag `highlighted` should be removed after 5 second since it was in visible area
- user can click filename and user name to navigate particular file / user / project
- Timeline sorted by activity creation date from new to old

Please, implement as much as you can.

**Important note**

`/src/API/index.ts` is prohibited to modify. This file just emulates server, as reason of it you should have realy weightly reason to modify it. You cannot use this file as internal state.

## Installation

```
npm install
npm start
```

## Submitting

```
npm run zip
```

Please, send to us `solution.zip` archive after that.

## API

To see API usage check `src/API/usage`

Usage:
```
import * as API from '../API';

API.<resource>.entity() => Promise with resource entity
API.<resource>.getActivities(data?) => Promise with 10 activities for resource, posted before specified data
API.<resource>.subscribe(cb) => subscription // Callback cb will be called with every new activitiy in specified resource will be 
```

Resource can be:
* file
* user
* timeline
* project