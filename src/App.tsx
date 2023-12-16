import "./App.css"
import "../extensions/index"
import { Result, Ok, Err } from "../extensions/result"

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

	const testResult = () => {
		const onlyEven = (val: number): Result<number, string> => 
		val % 2 == 0
			? new Ok(val) 
				: new Err("Is not even")
		
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
						.bind(v => addEven(v, 200)
						.map(v => v + 1))


		console.log("one.map(v => v + 5)", res1)
		console.log("two.map(v => v + 5)", res2)
		console.log("three.bind(v => addEven(v, 5))", res3)
		console.log("three.bind(v => addEven(v, 10))", res4)
		console.log("four.bind(v => addEven(v, 4))", res5)
		console.log("four.bind(v => addEven(v, 5))", res6)
		console.log("complex...", res7)

		one.match(ok => console.log("match one ok", ok), err => console.log("match one err", err))
		two.match(ok => console.log("match two ok", ok), err => console.log("match two err", err))
		one.whenError(err => console.log("whenError one err", err))
		two.whenError(err => console.log("whenError two err", err))
	}	

	return (	
		<div className="cont">
			<button onClick={testStrings}>Test strings</button>	
			<button onClick={testArrays}>Test arrays</button>	
			<button onClick={testNumbers}>Test numbers</button>	
			<button onClick={testDate}>Test Date</button>	
			<button onClick={testResult}>Test Result</button>	
		</div>
	)
}

export default App
