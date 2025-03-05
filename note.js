// ----- Implement Event Emitter ------
Question: https://devtools.tech/questions/s/how-to-implement-event-emitter-in-javascript-or-facebook-interview-question---qid---J4fNqXImp6QIdGMc7SPF

// class Emitter {
//   constructor() {
//     this.emitter = {}
//   }

//   subscribe(eventName, callback) {
//     let released = false;
//     let id = Symbol();
//     if (!this.emitter.hasOwnProperty(eventName)) {
//       this.emitter[eventName] = {};
//     }
//     this.emitter[eventName][id] = callback;

//     return {
//       release: () => {
//         if (released) throw TypeError('Already released');
//         delete this.emitter[eventName][id];
//         released = true;
//       }
//     }
//   }

//   emit(eventName, ...params) {
//     if (this.emitter.hasOwnProperty(eventName)) {
//       Object.getOwnPropertySymbols(this.emitter[eventName]).forEach(keys => {
//         this.emitter[eventName][keys](...params);
//       });
//     }
//   }
// }


// -------- CHATGPT DEBOUNCE ----------

// function debounce(func, wait) {
//     let timeout;
//     return function(...args) {
//         const context = this;
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(context, args), wait);
//     };
// }

// -------- MY DEBOUNCE ----------

// function debounce(fn, wait) {
//   let timer;
  
//   return function func(...args) {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//           fn(...args);
//       }, wait);
//   }
// }


// -------- CHATGPT THROTTLE ----------

// function throttle(func, limit) {
//   let lastFunc;
//   let lastRan;
//   return function(...args) {
//       const context = this;
//       if (!lastRan) {
//           func.apply(context, args);
//           lastRan = Date.now();
//       } else {
//           clearTimeout(lastFunc);
//           lastFunc = setTimeout(function() {
//               if ((Date.now() - lastRan) >= limit) {
//                   func.apply(context, args);
//                   lastRan = Date.now();
//               }
//           }, limit - (Date.now() - lastRan));
//       }
//   };
// }

// -------- MY THROTTLE ----------

// function throttle(fn) {
// 	let cooldown = false;
//   return function f(...args) {
//   	if(!cooldown) {
//       fn.call(this, ...args);
//     	cooldown = true;
//       setTimeout(()=>cooldown=false, 1000);
//     }
//   }
// }

// function log(event) {
// 	console.log(event.target.value);
// }
// const tlog = throttle(log);


// -------- CURRYING ----------

// function curry(fn) {
//   return function curried(...args) {
//     if(args.length >= fn.length) {
//       return fn(...args);
//     } else {
//       return function(...args2) {
//         return curried(args.concat(args2));
//       }
//     }
//   }
// }


// -------- DEEPFLATTEN I ----------

// function deepFlatten(arr) {
//   return arr.reduce((acc, ele) => Array.isArray(ele) ? acc.concat(deepFlatten(ele)) : acc.concat(ele),[]);
// }

// console.log(deepFlatten([1,2,[3,[4], {'a':5 }, [6,7]]]))


// --------------- Negative Indexes using Proxies ---------------

// let a = [1,2,3,4];
// proxy = new Proxy(a, {
//   get(target, prop) {
//     if(!isNaN(prop)) {
//       prop = parseInt(prop, 10);
//       if(prop < 0)  {
//         prop += target.length;
//       }
//     }
//     return target[prop];
//   }
// })

// console.log(proxy[-1]);



//=============================================================  IMPORTANCE OF `Promise.resolve`  =============================================================

// Promise-like Object: If the argument is a thenable (an object with a then method), Promise.resolve will return a promise that follows the state of that thenable (whether it resolves or rejects).
// Actual Promise: If the argument is already a promise, Promise.resolve simply returns it.
// Non-Promise Value: If the argument is not a promise or thenable, Promise.resolve returns a promise that is immediately resolved with that value.

//================================================================================================================================================================


// --------------- IMPLEMENT Promise.all -------------------------

// function promiseAll(promises) {
//   let results = [];
//   let completed = 0;
//   return new Promise((resolve, reject) => {
//     promises.forEach((promise, index) => {
//       Promise.resolve(promise)
//         .then(result => {
//           results[index] = result;
//           completed++;
//           if (completed === promises.length) {
//               resolve(results);
//           }
//         })
//         .catch((error)=>reject(error));
//     });
//   })
// }

// let p1 = Promise.resolve(1);
// let p2 = Promise.reject('p2 gone bad');

// promiseAll([p1,p2])
//   .then((data)=>{console.log(data)})
//   .catch((error)=>{console.log('Error:', error)})

// --------------- IMPLEMENT Promise.allSettled -------------------------

// function promiseAllSettled(promises) {
//   let results = [];
//   let completed = 0;
//   return new Promise((resolve) => {
//     promises.forEach((promise, index) => {
//       Promise.resolve(promise)
//         .then(result => results[index] = {status: 'fulfilled', value: result})
//         .catch((error) => results[index] = {status: 'rejected', value: error})
//         .finally(() => {
//           completed++;
//           if (completed === promises.length) {
//               resolve(results);
//           }
//         })
//     });
//   })
// }

// let p1 = Promise.resolve(1);
// let p2 = Promise.reject('p2 gone bad');

// promiseAllSettled([p1,p2,p1,p2])
//   .then((data)=>{console.log(data)})


// --------------- IMPLEMENT Promise.any -------------------------

// function promiseAny(promises) {
//   let rejections = [];
//   let completed = 0;
//   return new Promise((resolve, reject) => {
//     promises.forEach(promise => {
//       Promise.resolve(promise)
//         .then(resolve)
//         .catch((error) => {
//           completed++;
//           rejections.push(error);
//           if (completed === promises.length) {
//             reject(new AggregateError(rejections, "All promises were rejected"))
//           }
//         });
//       });
      
//   })
// }

// let p1 = Promise.resolve(1);
// let p2 = Promise.reject('p2 gone bad');
// let p3 = Promise.reject('p3 gone bad');

// promiseAny([p2,p3])
//   .then((data)=>{console.log(data)})
//   .catch((error)=>console.log('Error:',error.errors))


// --------------- IMPLEMENT Promise.race -------------------------

// function promiseRace(promises) {
//   return new Promise((resolve, reject) => {
//     promises.forEach(promise => {
//       Promise.resolve(promise)
//       .then(resolve)
//       .catch(reject);
//     });
//   })
// }

// let p1 = new Promise((resolve) => setTimeout(() => resolve(1), 1000));
// let p2 = new Promise((_, reject) => setTimeout(() => reject(2), 2000));

// promiseRace([p1,p2])
//   .then((data)=>{console.log(data)})
//   .catch((error)=>console.log('Error:',error));


// --------------- IMPLEMENT Promise.finally -------------------------

// Promise.prototype.finally = function (callback) {
//   return this.then(
//     (value) => Promise.resolve(callback()).then(() => value),
//     (reason) => Promise.resolve(callback()).then(() => { throw reason; })
//   );
// };

// Promise.resolve(42)
//   .finally(() => new Promise((res) => setTimeout(res, 1000)))  //The finally callback is async, which is handled on 269/270 line by Promise.resolve() instead of directly calling it.
//   .then(console.log); // Logs after 1 second: 42 (waits for callback)



// --------------- THROTTLING PROMISES BY BATCHING -------------------------

// async function throttlePromises(promises, batchSize) {
//   let promiseList = [] 
  
//   async function execute(startIndex) {
//     if(startIndex >= promises.length) return [];

//     console.log('Throttling...');
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     const promisesBatch = promises.slice(startIndex, startIndex + batchSize);
//     const result = await Promise.allSettled(promisesBatch);
//     console.log('result is:', result);
//     promiseList = [...promiseList, ...result];
//     await execute(startIndex + batchSize);
//     return promiseList;
//   }

//   return await execute(0);
// }

// // Example usage:
// const createPromiseResolve = (val) => () => Promise.resolve(val);
// const createPromiseReject = (val) => () => Promise.reject(val);

// // Wrapping the promises in a function that catches rejections immediately
// const promises = [
//   createPromiseResolve(11)().catch(e => e),
//   createPromiseResolve(22)().catch(e => e),
//   createPromiseReject(33)().catch(e => e),
//   createPromiseReject(44)().catch(e => e),
//   createPromiseReject(55)().catch(e => e),
//   createPromiseResolve(66)().catch(e => e),
// ];


// throttlePromises(promises, 2).then((data) => console.log('THE FINAL ANSWER IS:', data));



// --------------------------- PIPE / COMPOSE ----------------------------

// const pipe = (...functions: Function[])  => (initial:number) => {
//   return functions.reduce((acc, fn) => fn(acc), initial);    // to make 'Compose' use reduceRight instead
// }
// const add1 = (num: number) => num+1;
// const add10 = (num: number) => num+10;

// const piped = pipe(add1, add10);
// console.log(piped(0));


// ---------------------- AUTO RETRY PROMISE ----------------------------

// const autoRetry = (generatePromise, retriesAllowed) => {
//   return new Promise((resolve, reject) => {
//     const attempt = () => {
//       generatePromise()
//         .then(resolve)
//         .catch((error) => {
//           if(retriesAllowed === 0) {
//             reject(error);
//           } else {
//             retriesAllowed--;
//             console.log('retries left is:', retriesAllowed)
//             attempt();
//           }
//         });
//     }
//     attempt();
//   });
// }


// // Function is required instead of Promise directly to make unreliable promise (for some unknown reason) 
// const unreliableFunction = () => new Promise((resolve, reject) => {
//   if (Math.random() > 0.5) {
//       resolve('Success!');
//   } else {
//       reject('Failure!');
//   }
// });

// autoRetry(unreliableFunction, 30).then(result => console.log(result)).catch(error => console.log(error));


// ----------------------- CALL / APPLY / BIND -------------------------------

// ========== CALL =============
// Function.prototype.mycall = function (obj, ...args) {
//   const sym = Symbol();
//   obj[sym] = this;
//   const result = obj[sym](...args);
//   delete obj[sym];
//   return result;
// }

// ========== APPLY =============
// Function.prototype.myapply = function (obj, ...args) {
//   const sym = Symbol();
//   obj[sym] = this;
//   const result = obj[sym](...args[0]);
//   delete obj[sym];
//   return result;
// }

// ========== MY BIND =============
// Function.prototype.mybind = function (obj, ...args) {
  //   const result = () => {
    //     const sym = Symbol();
    //     obj[sym] = this;
    //     obj[sym](...args);
//     delete obj[sym];
//   }
//   return result;
// }

// OR

// ========== ARTICLE'S BIND =============
// Function.prototype.mybind = function(object,...args){
//   let func = this;
//   return function (...args1) {
//     return func.apply(object, [...args, ...args1]);
//   }
// }

// ==== EXAMPLE =====
// const obj = {
//   a:1
// }

// function f(b) {
//   console.log('a is:', this.a, ' and b is:', b);
// }

// f.mycall(obj, 2);
// f.myapply(obj, [2]);
// f.mybind(obj, 2)();
