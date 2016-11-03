# events

[![Total Downloads][ico-downloads]]
[![PHP7 Ready](https://img.shields.io/badge/PHP7-ready-green.svg)]

PHP + NodeJS Server-sent events API EventSource Manager

# Install
Add the following properties to your project's `composer.json` file:

```json
"minimum-stability": "dev",
"prefer-stable": true
```

Then run the command `composer require voxx/events`.

# Usage

1) Start the NodeJS Event Manager service to manage connected clients and event broadcasting.
```nodejs
$ node src/EventManager/app.js

UDP RECEIVER LISTENING ON: 127.0.0.1:6969
** NEW CLIENT REQUESTED REGISTRATION: 127.0.0.1:64996 **
clientsLength:1
** NEW CLIENT REQUESTED REGISTRATION: 127.0.0.1:64997 **
clientsLength:2
```

2) Open the examples/index.html page in one or more SSE capable web browser(s).
```
https://[yourdomain.tld]/index.html
```

3) Manually trigger an event via php script to be broadcasted to all connected clients in real time.
``` php
$ php -f examples/sse-server.php
sending 119 bytes over event stream
```

## TODO
  - Dynamic generation of data stream events
  - Logging and enabling/disabling debug

## Contributors
  - [voxx](https://github.com/voxx)
  - Caffiene, Nicotine, and lots of tutorials.
