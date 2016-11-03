# events
Broadcast event stream in PHP to multiple concurrent web clients, with help from NodeJS

# description
Library used to broadcast stream events from php scripts (running outside the web server,for example in a cron job)
to active web browser connections via Server-Sent-Events(SSE) API.

# example
see examples/ directory_

open a terminal on the server and start the nodejs application: node src/EventManager/app.js

open http://yourserver/examples/index.html in a browser, in multiple tabs/windows_
open a terminal on yourserver machine and run_
`php -f examples/sse-server.php`
You should see the test events displayed in the browser_
