export default function(pattern) {
    return (input) => {
        if (pattern instanceof RegExp) {
            return pattern.test(input);
        }

        if (typeof(pattern) === 'function') {
            return pattern(input);
        }

        return pattern === input;
    };
}
