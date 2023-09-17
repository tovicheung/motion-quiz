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

function forEachAnswer(callback) {
    childs(answers).forEach(field => {
        callback(field, childs(field));
    })
}

function enableButton(id) {
    document.getElementById(id).disabled = false;
    document.getElementById(id).classList.remove("disabled");
}

function disableButton(id) {
    document.getElementById(id).disabled = true;
    document.getElementById(id).classList.add("disabled");
}

function check() {
    forEachAnswer((field, nodes) => {
        if (nodes[1].value == "") {
            nodes[4].innerText = "Empty input";
            return;
        }
        try {
            nodes[4].innerText = calc(nodes[1].value) == nodes[2].innerText ? "Correct" : "Wrong";
        } catch (e) {
            console.log(e);
            nodes[4].innerText = "Invalid input (error occured)"
        }
    })
}

function show() {
    clearFeedback();
    forEachAnswer((field, nodes) => {
        nodes[1].classList.add("hidden");
        nodes[2].classList.remove("hidden");
    });
    disableButton("button-show-answer");
    disableButton("button-submit");
}

function clearFeedback() {
    forEachAnswer((field, nodes) => {
        nodes[4].innerText = "";
    })
}

const quiz = document.getElementById("quiz");
const answers = document.getElementById("answers");

function reload() {
    enableButton("button-show-answer");
    enableButton("button-submit");
    clearFeedback();
    motions = new Array();
    while (quiz.hasChildNodes()) {
        quiz.removeChild(quiz.childNodes[0]);
    }
    for (i = 0; i < 3; i++) {
        motions.push(Motion.rand());
    }
    motions.forEach(m => m.display());
    calculate();
    forEachAnswer((field, nodes) => {
        let correct = ize(eval(field.getAttribute("formula")));
        nodes[1].classList.remove("hidden");
        nodes[2].classList.add("hidden");
        nodes[2].innerText = correct;
    })
}

let motions;
addEventListener("DOMContentLoaded", reload)
