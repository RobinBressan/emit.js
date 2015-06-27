import emit from 'emit';

describe('Emit', () => {
    let emitter;
    let helloWorldWithString;
    let helloWorldWithCallback;
    let helloWorldWithRegex;

    beforeEach(() => {
        emmitter = emit();
        helloWorldWithString = jasmine.createSpy('helloWorldWithString');
        helloWorldWithCallback = jasmine.createSpy('helloWorldWithCallback');
        helloWorldWithRegex = jasmine.createSpy('helloWorldWithRegex');

        emmitter.on('hello.world', helloWorldWithString);
        emmitter.on((event) => {
            return event.substr(0, 'hello.'.length) === 'hello.';
        }, helloWorldWithCallback);
        emmitter.on(/^hello\.(world)?$/, helloWorldWithRegex);
    });

    it('should trigger some listeners for a given event #1', (done) => {
        emmitter.emit('hello.world', 'foo', 'bar').then(() => {
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
        emmitter.emit('hello.', 'again').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).toHaveBeenCalledWith('again');
            expect(helloWorldWithRegex).toHaveBeenCalledWith('again');
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should trigger some listeners for a given event #3', (done) => {
        emmitter.emit('hello.w', 'again').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).toHaveBeenCalledWith('again');
            expect(helloWorldWithRegex).not.toHaveBeenCalled();
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should remove all listeners when removeAllListeners is called', (done) => {
        emmitter.removeAllListeners();
        emmitter.emit('hello.world').then(() => {
            expect(helloWorldWithString).not.toHaveBeenCalled();
            expect(helloWorldWithCallback).not.toHaveBeenCalled();
            expect(helloWorldWithRegex).not.toHaveBeenCalled();
            done();
        }, (e) => { fail(e); done(); });
    });

    it('should trigger only once a listener registered with once method', (done) => {
        let goodbye = jasmine.createSpy('goodbye');

        emmitter.once('goodbye', goodbye);
        emmitter.emit('goodbye')
            .then(() => {
                return emmitter.emit('goodbye');
            })
            .then(() => {
                expect(goodbye.calls.count()).toBe(1);
                expect(goodbye).toHaveBeenCalled();
                done();
            }, (e) => { fail(e); done(); });
    });

    it('should unregister a listener when the callback returned by on is called', (done) => {
        let goodbye = jasmine.createSpy('goodbye');

        let remove = emmitter.on('goodbye', goodbye);

        emmitter.emit('goodbye')
            .then(() => {
                remove();
                expect(remove).toThrow();
                return emmitter.emit('goodbye');
            })
            .then(() => {
                expect(goodbye.calls.count()).toBe(1);
                expect(goodbye).toHaveBeenCalled();
                done();
            }, (e) => { fail(e); done(); });
    });
});
