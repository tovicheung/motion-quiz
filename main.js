function random(min, max) {
    // roundto is currently unused
    return parseInt(Math.random() * (max - min) + min);
}

function choice(array) {
    return array[random(0, array.length - 1)]
}

function decimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
}

class Motion {
    constructor(direction, magnitude, duration) {
        this.direction = direction;
        this.magnitude = magnitude;
        this.duration = duration;
        Motion.lastDirection = direction;
    }

    static lastDirection = 2;

    static rand() {
        let direction = choice([-1, -1, 0, 1, 1].filter(x => x != Motion.lastDirection));
        let magnitude = direction == 0 ? 0 : random(1, 10);
        let duration = random(1, 10);
        return new Motion(direction, magnitude, duration)
    }

    repr() {
        if (this.magnitude == 0) {
            return `stops for ${this.duration}s`
        }
        let d = this.direction == -1 ? "left" : "right";
        return `moves to the ${d} at ${this.magnitude} ms⁻¹ for ${this.duration}s`
    }

    display() {
        let p = document.createElement("p");
        p.innerHTML = this.repr();
        document.getElementById("quiz").appendChild(p)
    }
}

const Symbol = {
    d: 0,
    s: 0,
    t: 0,
}

function reset() {
    document.getElementById("quiz").innerHTML = "";
}

function ize(a) {
    // did not know what to name
    return decimals(a) >= 3 ? a.toPrecision(3) : a;
}

function calc(i) {
    return ize(eval(i.split("").filter(c => "0123456789.+-*/()".includes(c)).join("")));
}

function childs(n) {
    return [ ... n.childNodes].filter(o => o.nodeName != "#text")
}

function calculate() {
    let d = 0;
    let s = 0;
    let t = 0;
    motions.forEach(m => {
        d += m.magnitude * m.duration;
        t += m.duration;
        s += m.magnitude * m.duration * m.direction;
    });
    Symbol.d = d;
    Symbol.s = s;
    Symbol.t = t;
}

function check() {
    calculate();
    childs(document.getElementById("answers")).forEach(field => {
        let formula = field.getAttribute("formula");
        let c = ize(eval(formula));
        let nodes = childs(field);
        if (nodes[1].value == "") {
            nodes[3].innerText = "Empty input";
            return;
        }
        try {
            nodes[3].innerText = calc(nodes[1].value) == c ? "Correct" : "Wrong";
        } catch (e) {
            console.log(e);
            nodes[3].innerText = "Invalid input (error occured)"
        }
    })
}

function show() {
    calculate();
    childs(answers).forEach(field => {
        let formula = field.getAttribute("formula");
        let c = ize(eval(formula));
        let nodes = childs(field);
        nodes[3].innerText = `Answer: ${c}`;
    })
}

function clear() {
    // buggy, should be unused
    alert("an error occured.")
    console.log("e")
    childs(answers).forEach(field => {
        let nodes = childs(field);
        nodes[1].value = "";
        nodes[3].innerText = "";
        console.log(nodes);
    })
}

const quiz = document.getElementById("quiz");
const answers = document.getElementById("answers");

function reload() {
    motions = new Array();
    while (quiz.hasChildNodes()) {
        quiz.removeChild(quiz.childNodes[0]);
    }
    for (i = 0; i < 3; i++) {
        motions.push(Motion.rand());
    }
    motions.forEach(m => m.display());
}

let motions;
addEventListener("DOMContentLoaded", reload)
