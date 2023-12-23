import "./App.css"
import "../extensions/index"
import { Result, Ok, Err } from "../extensions/result"
import { AsyncResult } from "../extensions/asyncresult"
import { delayAsync, toAsync } from "../extensions/index"

type Error = {
	msg: string
	id: number
}

const mapStrToError = (s: string):Error => ({
	msg: s,
	id: 789
})

function App() {

	const testStrings = () => {
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
		resMatch(res9)
		resMatch(res10)
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
		</div>
	)
}

export default App
