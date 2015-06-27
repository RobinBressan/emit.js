import emit from 'emit';

describe('Emit', () => {
    let emitter;
    let helloWorldWithString;
    let helloWorldWithCallback;
    let helloWorldWithRegex;

    beforeEach(() => {
        emitter = emit();
        helloWorldWithString = jasmine.createSpy('helloWorldWithString');
        helloWorldWithCallback = jasmine.createSpy('helloWorldWithCallback');
        helloWorldWithRegex = jasmine.createSpy('helloWorldWithRegex');

        emitter.on('hello.world', helloWorldWithString);
        emitter.on((event) => {
            return event.substr(0, 'hello.'.length) === 'hello.';
        }, helloWorldWithCallback);
        emitter.on(/^hello\.(world)?$/, helloWorldWithRegex);
    });

    it('should trigger some listeners for a given event #1', (done) => {
        emitter.emit('hello.world', 'foo', 'bar').then(() => {
            expect(helloWorldWithString).toHaveBeenCalledWith('foo', 'bar');
            expect(helloWorldWithCallback).toHaveBeenCalledWith('foo', 'bar');
            expect(helloWorldWithRegex).toHaveBeenCalledWith('foo', 'bar');
            helloWorldWithString.calls.reset();
            helloWorldWithCallback.calls.reset();
            helloWorldWithRegex.calls.reset();
            done()
        }, (e) => { fail(e); done(); });
    });

    it('should trigger some listeners for a given event #2', (done) => {
        emitter.emit('hello.', 'again').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).toHaveBeenCalledWith('again');
            expect(helloWorldWithRegex).toHaveBeenCalledWith('again');
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should trigger some listeners for a given event #3', (done) => {
        emitter.emit('hello.w', 'again').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).toHaveBeenCalledWith('again');
            expect(helloWorldWithRegex).not.toHaveBeenCalled();
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should remove all listeners when removeAllListeners is called', (done) => {
        emitter.removeAllListeners();
        emitter.emit('hello.world').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).not.toHaveBeenCalled();
            expect(helloWorldWithRegex).not.toHaveBeenCalled();
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should trigger only once a listener registered with once method', (done) => {
        let goodbye = jasmine.createSpy('goodbye');

        emitter.once('goodbye', goodbye);
        emitter.emit('goodbye')
            .then(() => {
                return emitter.emit('goodbye');
            })
            .then(() => {
                expect(goodbye.calls.count()).toBe(1);
                expect(goodbye).toHaveBeenCalled();
                done();
            }, (e) => { fail(e); done(); });
    });

    it('should unregister a listener when the callback returned by on is called', (done) => {
        let goodbye = jasmine.createSpy('goodbye');

        let remove = emitter.on('goodbye', goodbye);

        emitter.emit('goodbye')
            .then(() => {
                remove();
                expect(remove).toThrow();
                return emitter.emit('goodbye');
            })
            .then(() => {
                expect(goodbye.calls.count()).toBe(1);
                expect(goodbye).toHaveBeenCalled();
                done();
            }, (e) => { fail(e); done(); });
    });
});
