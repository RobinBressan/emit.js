import matcher from 'matcher';
import {Promise} from 'es6-promise';

export default function() {
    let listeners = [];

    function on(pattern, callback, once = false) {
        let listener = {
            matcher: matcher(pattern),
            callback: callback,
            once: once,
        };

        listeners.push(listener);

        return () => {
            let index = listeners.indexOf(listener);

            if (index === -1) {
                throw new Error('You can not unregister an event listener which does not exists');
            }

            listeners.splice(index, 1);
        };
    }

    function emit(event) {
        let args = [].slice.apply(arguments);
        args.shift(); // removing event

        return new Promise((resolve, reject) => {
            listeners = listeners.filter((listener) => {
                if (!listener.matcher(event)) {
                    return;
                }

                listener.callback.apply({
                    event: event,
                }, args);

                return !listener.once;
            });

            resolve();
        });
    }

    return {
        on: (event, callback) => on(event, callback),
        once: (event, callback) => on(event, callback, true),
        emit: emit,
        removeAllListeners: () => listeners = [],
    };
}
