import "./App.css"
import "../extensions/index"

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

	return (	
		<div className="cont">
			<button onClick={testStrings}>Test strings</button>	
			<button onClick={testArrays}>Test arrays</button>	
			<button onClick={testNumbers}>Test numbers</button>	
			<button onClick={testDate}>Test Date</button>	
		</div>
	)
}

export default App
