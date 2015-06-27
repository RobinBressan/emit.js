# emit.js [![Build Status](https://travis-ci.org/RobinBressan/emit.js.svg?branch=master)](https://travis-ci.org/RobinBressan/emit.js)

Efficient minimalist event emitter in JavaScript.

## Installation

It is available with bower or npm:

```
bower install emit.js
npm install emit.js
```

Include `emit.min.js` to the HTML, and the `emit` object is now available in the global scope:

```html
<script type="text/javascript" src="/path/to/bower_components/emit.js/dist/emit.min.js"></script>
```

Alternately, you can use a module manager to avoid global scoping:

```js
var emit = require('emit.js');
// or es6 import
import emit from 'emit.js';
```

# Usage

## Create an event emitter

```js
var emitter = emit();
```

## Register listener on it

You can register a listener with `on` and `once` method. Listeners registered with `once` will be triggered only once.

```js
emitter.on('event', function(...args) {
    // the args depends on the emit call
    
    console.log('I am a listener');
});

// you can also register an event with a regex
emitter.on(/^event(foo)?$/, function(...args) {
    // the args depends on the emit call
    
    console.log('I am a listener');
});

// you can also register an event with a callback for powerful listener
emitter.on(function(event) {
    return event.substr(0, 5) === 'hello'; // We want to match all event beginning with `hello`.
}, function(...args) {
    // the args depends on the emit call
    
    console.log('I am a listener');
});

emitter.once('event', function(...args) {
    console.log('I am triggered only once');
});
```

## Unregister a listener

When you register a listener, you get in return a callback to unregister it:

```js
var unregister = emitter.on('event', function(...args) {
    // the args depends on the emit call
    if (...) {
        unregister(); // unregistering this listener
    }

    console.log('I am a listener');
});
```

## Emit an event

To emit an event, just use the `emit` method:

```js
emitter.emit('event', arg1, arg2, ...); // we emit an event with as many parameters as we want

emitter.emit('event').then(function() {
    // all listeners have been called
}, function(error) {
    // an error occured
});
```

# Development

## Installation

`make install`

## Build

`make build` or `make build-dev` (unminified version)

## Watch

`make watch`

## Test

`make test`

## Contributing

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

## License

This application is available under the MIT License.

