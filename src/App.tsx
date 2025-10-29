import "./App.css"
import "../extensions/index"
import { Result, Ok, Err } from "../extensions/result"
import { AsyncResult } from "../extensions/asyncresult"
import { createSemaphore, ErrorType, delayAsync, toAsync, mergeToDictionary } from "../extensions/index"
import { AsyncEnumerable } from "../extensions/asyncenumerable"
import { jsonGet, setBaseUrl } from "../extensions/requests"

type Error = {
	msg: string
	id: number
}

const mapStrToError = (s: string):Error => ({
	msg: s,
	id: 789
})

type JsonGetResult = {
	page: number,
    per_page: number,
    total: number,
    total_pages: number
}

function App() {

	const arr = [1, 2, 3, 4, 5]

	const [even, odd] = arr.partition(n => n % 2 == 0)
	console.log("even", even, "odd", odd)

	console.log("arr.take -1", arr.take(-1))
	console.log("arr.take 0", arr.take(0))
	console.log("arr.take 1", arr.take(1))
	console.log("arr.take 3", arr.take(3))
	console.log("arr.take 5", arr.take(5))
	console.log("arr.take 50", arr.take(50))
	console.log("arr.skip -1", arr.skip(-1))
	console.log("arr.skip 0", arr.skip(0))
	console.log("arr.skip 1", arr.skip(1))
	console.log("arr.skip 3", arr.skip(3))
	console.log("arr.skip 5", arr.skip(5))
	console.log("arr.skip 50", arr.skip(50))

	const plus100Async = async (n: number) => {
		await delayAsync(3000)
		console.log("plus100Async processed", n)
		return n + 100
	}
		
	const asyncArrayRsult = arr
		.toAsyncEnumerable()
		.mapAwait(plus100Async)

	;(async () => {
		const result = await asyncArrayRsult.await()	
		console.log("result from async array", result)
	})()
		
	const testStrings = async () => {

		const delayedValue = (value: number): Promise<number> => 
			new Promise(resolve => 
				setTimeout(() => resolve(value), 1000))

		async function* generate(): AsyncIterable<number> {
			yield delayedValue(2000)
			yield delayedValue(100)
			yield delayedValue(500)
			console.log("Die 4")
			yield delayedValue(250)
			console.log("Die 5")
			yield delayedValue(125)
			yield delayedValue(50)
		}

		const p = await new AsyncEnumerable(generate())
			.map(n => `Das ist gemäppt: ${n}`)
			.take(4)
			.await()
		console.log("p", p);

		for await (const value of generate()) 
			console.log("value", value);
		
		console.log("substringAfter", "substring after/this here".substringAfter("/"))
		console.log("substringUntil", "substring until/this here".substringUntil("/"))
		console.log("stringBetween", "substring between{this here} and not more".stringBetween("{", "}"))
		console.log("lastIndexOfAny", "substring between{this here} and not more".lastIndexOfAny(["{", "}"]))
		"substring between{this here} and not more".sideEffect(console.log)
		console.log("parse 89", "89".parseInt())
		console.log("parse EightyNine", "EightyNine".parseInt())
	}

	const testArrays = () => {
		console.log("SideEffectForEach")
		const numberarr = [1, 2, 3, 4, 5, 6]
		numberarr.sideEffectForEach(i => console.log(i))

		console.log("insert", numberarr.insert(1, 123), numberarr)
		console.log("append", numberarr.append(456), numberarr)
		console.log("contains 5", numberarr.contains(5))
		console.log("contains 123", numberarr.contains(123))

		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		console.log("diff odd", arr.diff([1, 3, 5, 7, 9]))
		console.log("diff even", arr.diff([2, 4, 6, 8]))
		console.log("diff nothing", arr.diff([]))
		console.log("diff others", arr.diff([11, 22, 33, 44]))

		const sarr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
		console.log("diff odd", sarr.diff(["1", "3", "5", "7"]))

		const keyValues = [
			{ key: "eins", value: 1 },
			{ key: "zwei", value: 2 },
			{ key: "drei", value: 3 },
			{ key: "vier", value: 4 }
		]
		const dict = mergeToDictionary(keyValues)
		console.log("from 2", dict["zwei"])
		console.log("from 3", dict["drei"])
	}

	const testNumbers = () => {
		const byte = 123
		console.log("as bytes", byte.byteCountToString())
		const kbyte = 1234
		console.log("as bytes", kbyte.byteCountToString())
		const mbyte = 1234567
		console.log("as bytes", mbyte.byteCountToString())
		const gbyte = 1234567890
		console.log("as bytes", gbyte.byteCountToString())
	}

	const testDate = () => {
		const date = new Date()
		console.log(date, date.getMilliseconds())
		console.log(date.removeMilliseconds(), date.removeMilliseconds().getMilliseconds())
	}

	const onlyEven = (val: number): Result<number, string> =>
	val % 2 == 0
		? new Ok(val)
			: new Err("Is not even")

	const testResult = () => {

		const addEven = (v: number, a: number): Result<number, string> =>
			(v + a) % 2 == 0
			? new Ok(v + a)
			: new Err("Result is not even")

		const one1 = onlyEven(1)
		const two1 = onlyEven(2)
		const oneStr = JSON.stringify(one1)
		const twoStr = JSON.stringify(two1)
		console.log("One toJson", oneStr)
		console.log("Two toJson", twoStr)
		const one = Result.parseJSON<number, string>(oneStr)
		const two = Result.parseJSON<number, string>(twoStr)
		const oneStr1 = JSON.stringify(one)
		const twoStr1 = JSON.stringify(two)
		console.log("One toJson", oneStr1)
		console.log("Two toJson", twoStr1)
		const three = onlyEven(3)
		const four = onlyEven(4)

		const res1 = one.map(v => v + 5)
		const res2 = two.map(v => v + 5)
		const res3 = three.bind(v => addEven(v, 5))
		const res4 = three.bind(v => addEven(v, 10))
		const res5 = four.bind(v => addEven(v, 4))
		const res6 = four.bind(v => addEven(v, 5))
		const res7 = four
						.bind(v => addEven(v, 10))
						.bind(v => addEven(v, 8))
						.bind(v => addEven(v, 200))
						.mapError(mapStrToError)
						.map(v => v + 1)
		const res8 = three
						.bind(v => addEven(v, 10))
						.bind(v => addEven(v, 8))
						.bind(v => addEven(v, 200))
						.mapError(mapStrToError)
						.map(v => v + 1)


		console.log("one.map(v => v + 5)", res1)
		console.log("two.map(v => v + 5)", res2)
		console.log("three.bind(v => addEven(v, 5))", res3)
		console.log("three.bind(v => addEven(v, 10))", res4)
		console.log("four.bind(v => addEven(v, 4))", res5)
		console.log("four.bind(v => addEven(v, 5))", res6)
		console.log("complex...", res7)
		console.log("complex error...", res8)

		one.match(ok => console.log("match one ok", ok), err => console.log("match one err", err))
		two.match(ok => console.log("match two ok", ok), err => console.log("match two err", err))
		one.whenError(err => console.log("whenError one err", err))
		two.whenError(err => console.log("whenError two err", err))
	}

	const testAsyncTasks = () => {
		const addSlowly = async (a: number, b: number) => {
			await delayAsync(1000)
			return a + b
		}

		const a1 = toAsync(8)
		const a2 = a1.map(v => v + 18)
		const a3 = a2.bind(v => addSlowly(v, 20))
		const a4 = a2
					.bind(v => addSlowly(v, 20))
					.bind(v => addSlowly(v, 40))
					.bind(v => addSlowly(v, 60))
					.map(v => v + 1)
		
		a1.then(v => console.log("a1", v))
		a2.then(v => console.log("a2", v))
		a3.then(v => console.log("a3", v))
		a4.then(v => console.log("a4", v))
	}

	const testAsyncResult = () => {
		const addEvenSlow = (v: number, a: number) => new AsyncResult<number, string>(addEvenSlowP(v, a))
		const addEvenSlowP = async (v: number, a: number): Promise<Result<number, string>> => {
			await delayAsync(1000)
			return (v + a) % 2 == 0
				? new Ok(v + a)
				: new Err("Result is not even")
		}

		const addSlow = async (v: number, a: number): Promise<number> => {
			await delayAsync(1000)
			return v + a
		}

		const eins = AsyncResult.from(onlyEven(1))
		const zwei = AsyncResult.from(onlyEven(2))
		const drei = AsyncResult.from(onlyEven(3))
		const vier = AsyncResult.from(onlyEven(4))

		const res1 = eins.map(v => v + 5)
		const res2 = zwei.map(v => v + 5)
		const res3 = zwei.mapAsync(v => addSlow(v, 5))
		const res4 = drei.mapAsync(v => addSlow(v, 5))
		const res5 = zwei
						.mapAsync(v => addSlow(v, 5))
						.mapAsync(v => addSlow(v, 1))
		const res6 = zwei.bindAsync(v => addEvenSlow(v, 6))
		const res7 = zwei.bindAsync(v => addEvenSlow(v, 5))
		const res8 = drei.bindAsync(v => addEvenSlow(v, 10))
		const res9 = vier.bindAsync(v => addEvenSlow(v, 5))
		const res10 = vier
				.bindAsync(v => addEvenSlow(v, 10))
				.bindAsync(v => addEvenSlow(v, 8))
				.bindAsync(v => addEvenSlow(v, 200))
					.map(v => v + 1)

		const ausgabe = async () => {
			console.log("1", await eins.toResult(), await zwei.toResult())
			console.log("2", await drei.toResult(), await vier.toResult())
			console.log("3", await res1.toResult())
			console.log("4", await res2.toResult())
			console.log("5", await res3.toResult())
			console.log("6", await res4.toResult())
			console.log("7", await res5.toResult())
			console.log("8", await res6.toResult())
			console.log("9", await res7.toResult())
			console.log("10", await res8.toResult())
			console.log("AsyncResult", await res1.toResult(), await res2.toResult(), await res3.toResult(), await res4.toResult(), await res5.toResult(), await res6.toResult())
		}
		ausgabe()

		const resMatch = <T, E>(res: AsyncResult<T, E>) => res.match(
			ok => console.log("AsyncResult.ok", ok),
			err => console.log("AsyncResult.err", err),
		)

		const resMatchResult = (res: AsyncResult<number, string>) => res.match(
			ok => ok,
			() => 999,
		)

		const logMatchResult = (p: Promise<number>) =>
			p.then(n => console.log("matchResult", n))

		logMatchResult(resMatchResult(res9))
		logMatchResult(resMatchResult(res10))

		resMatch(res9)
		resMatch(res10)
	}

	const runJsonGet = () => {
		
		setBaseUrl("https://reqres.in")

		const result = jsonGet<JsonGetResult, ErrorType>("api/users?page=2")
		console.log("jsonGet", result)
}

const testParallelAsync = async () => {

		const testAsync = async (id: string, delayinSecs: number) => {
			await delayAsync(delayinSecs * 1000)
			return id
		}

		const testMany = AsyncEnumerable.fromPromises([
			testAsync("1", 2),
			testAsync("2", 1),
			testAsync("3", 1),
			testAsync("4", 1),
			testAsync("5", 1),
			testAsync("6", 1),
			testAsync("7", 10),
			testAsync("8", 4),
		])

		console.log("Start")
		for await (const id of testMany.asIterable()) {
			console.log("Test Async", id)
			await delayAsync(200)
		}
	}

	const testParallelArrayAsync = async () => {

		const testAsync = async (id: string, delayinSecs: number) => {
			await delayAsync(delayinSecs * 1000)
			return [id, id + 1, id + 2]
		}

		const testMany = AsyncEnumerable.fromArrayPromises([
			testAsync("1", 2),
			testAsync("2", 1),
			testAsync("3", 1),
			testAsync("4", 1),
			testAsync("5", 1),
			testAsync("6", 1),
			testAsync("7", 10),
			testAsync("8", 4),
		])

		console.log("Start")
		for await (const id of testMany.asIterable()) 
			console.log("Test Async", id)
	}

	const testParallelArrayAsyncSemaphore = async () => {

		const sem = createSemaphore(4, 4)
		const testAsync = async (id: string, delayinSecs: number) => {
			await sem.wait()
			await delayAsync(delayinSecs * 1000)
			sem.release()
			return [id, id + 1, id + 2]
		}

		const testMany = AsyncEnumerable.fromArrayPromises([
			testAsync("1", 4),
			testAsync("2", 1),
			testAsync("3", 1),
			testAsync("4", 1),
			testAsync("5", 1),
			testAsync("6", 1),
			testAsync("7", 20),
			testAsync("8", 8),
		])

		console.log("Start")
		for await (const id of testMany.asIterable()) 
			console.log("Test Async", id)
	}

	const testParallelArrayAsyncSemaphoreError = async () => {

		const sem = createSemaphore(4, 4)
		const testAsync = async (id: string, delayinSecs: number) => {
			await sem.wait()
			await delayAsync(delayinSecs * 1000)
			if (id == "err")
				throw { error: "Error", code: 1234 }
			sem.release()
			return [id, id + 1, id + 2]
		}

		const testMany = AsyncEnumerable.fromArrayPromises([
			testAsync("1", 4),
			testAsync("2", 1),
			testAsync("err", 1),
			testAsync("3", 1),
			testAsync("4", 1),
			testAsync("5", 1),
			testAsync("6", 1),
			testAsync("7", 20),
			testAsync("8", 8),
		])

		console.log("Start")
		try {
			for await (const id of testMany.asIterable()) {
				console.log("Test Async", id)
//				await delayAsync(299)
			}
		} catch (e) {
			console.log("Error", e)
		}
	}

	return (
		<div className="cont">
			<button onClick={testStrings}>Test strings</button>
			<button onClick={testArrays}>Test arrays</button>
			<button onClick={testNumbers}>Test numbers</button>
			<button onClick={testDate}>Test Date</button>
			<button onClick={testResult}>Test Result</button>
			<button onClick={testAsyncTasks}>Test Async</button>
			<button onClick={testAsyncResult}>Test AsyncResult</button>
			<button onClick={runJsonGet}>JSON Get</button>			
			<button onClick={testParallelAsync}>Test parallel async</button>
			<button onClick={testParallelArrayAsync}>Test parallel array async</button>
			<button onClick={testParallelArrayAsyncSemaphore}>Test parallel array async semaphore</button>
			<button onClick={testParallelArrayAsyncSemaphoreError}>Test parallel array async semaphore error</button>
		</div>
	)
}

export default App
