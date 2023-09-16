function random(min, max, roundto) {
    // roundto is currently unused
    return parseFloat((Math.random() * (max - min) + min).toFixed(roundto));
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
        return `to the ${d} at ${this.magnitude} ms⁻¹ for ${this.duration}s`
    }

    display() {
        let p = document.createElement("p");
        p.innerHTML = this.repr();
        document.getElementById("quiz").appendChild(p)
    }
}

function reset() {
    document.getElementById("quiz").innerHTML = "";
}

function ize(a) {
    return decimals(a) >= 3 ? a.toPrecision(3) : a;
}

function calc(i) {
    return ize(eval(i.split("").filter(c => "0123456789.+-*/()".includes(c)).join("")));
}

function childs(n) {
    return [ ... n.childNodes].filter(o => o.nodeName != "#text")
}

function check() {
    let d = 0;
    let s = 0;
    let t = 0;
    motions.forEach(m => {
        d += m.magnitude * m.duration;
        t += m.duration;
        s += m.magnitude * m.duration * m.direction;
    });
    childs(document.getElementById("answers")).forEach(field => {
        let formula = field.getAttribute("formula");
        let c = ize(eval(formula));
        let nodes = childs(field);
        console.log(calc(nodes[1].value) == c);
        if (calc(nodes[1].value) == c) {
            nodes[3].innerText = "Correct!";
        } else {
            nodes[3].innerText = "Wrong";
        }
    })
    // let as = ize(d/t);
    // let av = ize(s/t);
    // eval("console.log('yo', d)");
    // document.getElementById("input-average-speed")
    // let inputas = calc(document.getElementById("input-average-speed").value);
    // let inputav = calc(document.getElementById("input-average-velocity").value);
    // console.log(inputas == as, inputas, as);
    // console.log(inputav == av, inputav, av);
}

function show() {let d = 0;
    let s = 0;
    let t = 0;
    motions.forEach(m => {
        d += m.magnitude * m.duration;
        t += m.duration;
        s += m.magnitude * m.duration * m.direction;
        childs(document.getElementById("answers")).forEach(field => {
            let formula = field.getAttribute("formula");
            let c = ize(eval(formula));
            let nodes = childs(field);
            nodes[3].innerText = `Answer: ${c}`;
        })
    });
}

let motions;
addEventListener("DOMContentLoaded", () => {
    motions = new Array();
    for (i = 0; i < 3; i++) {
        motions.push(Motion.rand());
    }
    motions.forEach(m => m.display());
})
