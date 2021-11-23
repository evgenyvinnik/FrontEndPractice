/**
 * Given a function, decorate it so that return values are
 * cached. That is, if it's called again with the same
 * arguments, it should return the cached value rather than
 * executing the original function again.
 *
 * Requirements:
 * - The wrapped function should accept any number of arguments
 *   that can be any data type. (For the purposes of this demo,
 *   we won't consider objects or arrays more than one level deep.)
 * - The cache should treat objects with the same keys and values
 *   as the same argument, even if the keys aren't in the same order.
 *
 * E.g.
 * ```
 * const fn = (arg) => ...
 * const memoizedFn = memoize(fn)
 * const call1 = memoizedFn(arg)
 * const call2 = memoizedFn(arg)
 * // call1 and call2 should be equal, and fn
 * // should be called once.
 * ```
 */

let cache = new Map();

function serializeSignature(functionName, parameters) {
  if(typeof parameters === 'object'){
    let parameters1 = JSON.stringify(parameters).toString();
    let split = parameters1.split(/[,{}:"]/).sort((a, b) => {
      return a.localeCompare(b);
    }).join(', ');
    let result =  `${functionName}(${split}`;
    return result;
  }
  else {

    let result =  `${functionName}(${parameters.map(JSON.stringify).sort((a, b) => {
      console.log("A" + a);
      console.log("B" + b);
      return a.localeCompare(b);
    }).join(', ')})`;

    return result;
  }
}

function serialize(functionName, parameters, result) {
  let cacheKey = serializeSignature(functionName, parameters);

  cache.add(cacheKey, result);
}

function memoiseCache(fn) {
  return function(...args) {
    let cacheKey = serializeSignature(fn.name, args);
    if(cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    else {
      let result = fn(...args);
      cache.set(cacheKey, result);
      return result;
    }
  }
}

function memoize(fn) {

  if(typeof fn === 'function') {
    return memoiseCache(fn);
  }
}

let callCount = 0

function test(str) {
  console.log(`called with ${str}`)
  callCount++
  return str
}

function object(obj) {
  console.log(`called with ${JSON.stringify(obj)}`)
  callCount++
  return Object.keys(obj).length
}

function concat(a, b) {
  console.log(`called with ${a}, ${b}`)
  callCount++
  return `${a} ${b}`
}

const memoizedTest = memoize(test)
const a = memoizedTest('hello')
const b = memoizedTest('hello')
const c = memoizedTest('world')

const memoizedConcat = memoize(concat)
const j = memoizedConcat('hello', 'world')
const k = memoizedConcat('hello', 'world')
const l = memoizedConcat('goodnight', 'moon')

const memoizedObject = memoize(object)
const x = memoizedObject({ hello: 'world', goodnight: 'moon' })
const y = memoizedObject({ goodnight: 'moon', hello: 'world' })
const z = memoizedObject({ hello: 'world' })

 console.log({a, b, c, j, k, l, x, y, z})
// console.log({x, y, z})
console.log('Call count:', callCount)

// Expected output:
// {
//   a: 'hello',
//   b: 'hello',
//   c: 'world',
//   j: 'hello world',
//   k: 'hello world',
//   l: 'goodnight moon',
//   x: 2,
//   y: 2,
//   z: 1
// }
// Call count: 6