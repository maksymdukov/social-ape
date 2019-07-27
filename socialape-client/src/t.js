function a(value) {
    return value + 1;
}

function b(value) {
    return value + 2;
}

function c(value) {
    return value + 3;
}

console.log(a(b(c(0))));

function compose(...funcs) {
    return funcs.reduce((acc, f) => {
        return (...args) => f(acc(...args));
    }, (value) => value)
}

// Look like
// it 1
// acc - (...args) => f( ((value) => value)(...args))
//it 2
//acc - ()...

console.log(compose(a, b, c)(0));

function compose2(...funcs) {
    return (value) => {
        return funcs.reduce((acc, f) => f(acc), value)
    }
}

console.log(compose2(a, b, c)(0));
