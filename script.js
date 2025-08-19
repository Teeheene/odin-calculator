

//add event listeners to all the buttons
const buttons = [...document.querySelectorAll("#container button")]
const screen = document.querySelector(".screen"); 
const operators = ["+", "-", "*", "/", "."]
let flagDecimal = true;

buttons.forEach((btn, index) => {
	btn.addEventListener("click", () => {
		let input = btn.textContent;
		switch(index) {
			case 0:
				screen.textContent += Math.floor(Math.random()*10);
				break;
			case 1:
				screen.textContent = "";
				break;
			case 2: 
				screen.textContent = screen.textContent.slice(0,-1);
				break;
			case 17:
				screen.textContent = calculate(screen.textContent);
				break;
			case 6: case 10: case 14: case 18:
				if(operators.includes(screen.textContent[screen.textContent.length-1])) {
					screen.textContent = screen.textContent.slice(0,-1);
				}
				screen.textContent += input;
				flagDecimal = true;
				break;
			case 16: 
				if(!flagDecimal)
					break;
				flagDecimal = false;
				if(operators.includes(screen.textContent[screen.textContent.length-1])) {
					screen.textContent += "0.";
					break;
				}
			default:
				screen.textContent += input;
		}
	})
})

function toInfix(expression) {
	let queue = expression.split("");
	let infix = [];

	const checkUnary = (strDigit) => {
		if(isNaN(parseFloat(strDigit)))
			return true;
		else return false;
	}

	let toInsert = "";
	for(let i = 0; i < queue.length; i++) {
		if(isNaN(queue[i]) && queue[i] !== ".") {
			if(checkUnary(toInsert))
				infix.push(0, queue[i]);	
			else infix.push(parseFloat(toInsert), queue[i]);
			toInsert = "";
		} else {
			toInsert += queue[i];
		}
	}

	if(!checkUnary(toInsert))
		infix.push(parseFloat(toInsert))
	else
		infix.push(0);
	infix.push("END");
		
	return infix;
}

function evaluate(a,b,op) {
	switch(op) {
		case "+": return a + b;
		case "-": return a - b;
		case "*": return a * b;
		case "/": return a / b;
	}
}

function precedence(op) {
	switch(op) {
		case "+": case "-":
			return 1;
		case "*": case "/":
			return 2;
		return 0;
	}
}

//evaluating an infix expression
function calculate(expression) {
	const infix = toInfix(expression);
	let value = [];
	let ops = [];

	console.log(infix);

	for(let i = 0; i < infix.length; i++) {
		let token = infix[i];
		let topOp = ops[ops.length-1];

		if(typeof token === "number") {
			value.push(token);
		} 
		else if(precedence(topOp) >= precedence(token) || token === "END") {
			let b = value.pop();
			let a = value.pop();
			let op = ops.pop();
			value.push(evaluate(a,b,op));

			if(token != "END")
				ops.push(token);
		}
		else if(precedence(topOp) < precedence(token) || isNaN(token)) {
			ops.push(token);
		}

		console.log(value)
		console.log(ops)
	}

	while(ops.length > 0) {
		let b = value.pop();
		let a = value.pop();
		let op = ops.pop();
		value.push(evaluate(a,b,op));
	}

	return value[0];
}

