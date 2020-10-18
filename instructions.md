For a quick local env run `npm run start-server` and `npm run start-dashboard` in two terminal windows
to run both api (port 3000) and http servers (port 3001)

GIT:

- Commit with a clear message (best practices: https://chris.beams.io/posts/git-commit/).
- Upload the repo to your github or any other git service and share it with us.

Build a Conversions Feature: <br>
Conversions will let users measure their conversions.

- users should be able to create conversions (conversions only have a name).
- two conversions can't have the same name.
- conversions should have analytics per date, counted using API calls (use POSTman to simulate those).
- a user should be able to get an aggregate of total conversions in a specific date range. 
- each feature apart from the API, needs to have a simple angular UI (see `public` folder), nothing fancing or designed, just functional.
- write clean, decoupled code (practical guides [here](https://www.coreycleary.me/why-should-you-separate-controllers-from-services-in-node-rest-apis/) and [here](https://softwareontheroad.com/ideal-nodejs-project-structure)).
- bonus: server side unit tests
