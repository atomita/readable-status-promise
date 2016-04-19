/**
 * ReadableStatusPromise
 *
 * This can read the status for Promise.
 *
 * { state: "pending" }
 * { state: "fulfilled", value: <fulfllment value> }
 * { state: "rejected", reason: <rejection reason> }
 */
class ReadableStatusPromise {
	constructor(executor){
		let status = 'pending',
			override_executor = (resolve, reject)=>{
				executor((value, ...args)=>{
					status = 'fulfilled';
					Object.defineProperty(promise, 'value', {
						get: ()=>{ return value; }
					});
					resolve.apply(null, [value].concat(args));
				}, (reason, ...args)=>{
					status = 'rejected';
					Object.defineProperty(promise, 'reason', {
						get: ()=>{ return reason; }
					});
					reject.apply(null, [reason].concat(args));
				});
			},
			promise = new Promise(override_executor);

		Object.defineProperty(promise, 'status', {
			get: ()=>{ return status; }
		});

		return promise;
	}

	static resolve(v){
		let promise = Promise.resolve(v);

		Object.defineProperty(promise, 'status', {
			get: ()=>{ return 'fulfilled'; }
		});
		Object.defineProperty(promise, 'value', {
			get: ()=>{ return v; }
		});
		return promise;
	}

	static reject(v){
		let promise = Promise.reject(v);

		Object.defineProperty(promise, 'status', {
			get: ()=>{ return 'rejected'; }
		});
		Object.defineProperty(promise, 'reason', {
			get: ()=>{ return v; }
		});
		return promise;
	}
}

export default ReadableStatusPromise;
