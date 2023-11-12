let pokemon1 = {
    pokeName: "Nidoking",
    id: 34,
    hp: 81,
    atk: 102,
    def: 77,
    spAtk: 85,
    spDef: 85,
    spe: 85,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/34.png"
}

let pokemon2 = {
    pokeName: "Venusaur",
    id: 3,
    hp: 95,
    atk: 75,
    def: 110,
    spAtk: 100,
    spDef: 80,
    spe: 30,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"
}

let $$playerOneButtons = document.body.querySelectorAll(".button1");
let $$playerTwoButtons = document.body.querySelectorAll(".button2");
let $$playerOneArea = document.body.querySelector("#player-one-area");
let $$playerTwoArea = document.body.querySelector("#player-two-area");
let $$playerOneHp = document.body.querySelector(".player-one-hp");
let $$playerTwoHp = document.body.querySelector(".player-two-hp");
let $$textLog = document.body.querySelector(".text-log");
let currentOneAttack = null;
let currentOneSpAttack = null;
let currentOneSpeed = null;
let currentOneHp = null;
let currentTwoAttack = null;
let currentTwoSpAttack = null;
let currentTwoSpeed = null;
let currentTwoHp = null;
let trickRoomStatus = false;


//Funcion que oculta el primer panel y abre el segundo
function hideOneOpenTwo() {
    for (let button of $$playerTwoButtons) {
        button.classList.remove("hidden");
    }
    for (let button of $$playerOneButtons) {
        button.classList.add("hidden");
    }
}

function openOne() {
    for (let button of $$playerOneButtons) {
        button.classList.remove("hidden");
    }
}

function oneAttack() {
    if (currentOneAttack !== null) {
        if (currentOneAttack <= pokemon2.def) {
            currentTwoHp = Math.floor((currentTwoHp - (currentOneAttack * 0.2)));
        } else {
            currentTwoHp = Math.floor((currentTwoHp - (currentOneAttack * 0.5)));
        }
        currentOneAttack = null;
    } else {
        if (currentOneSpAttack <= pokemon2.spDef) {
            currentTwoHp = Math.floor((currentTwoHp - (currentOneSpAttack * 0.2)));
        } else {
            currentTwoHp = Math.floor((currentTwoHp - (currentOneSpAttack * 0.5)));
        }
        currentOneSpAttack = null;
    }
}

function twoAttack() {
    if (currentTwoAttack !== null) {
        if (currentTwoAttack <= pokemon1.def) {
            currentOneHp = Math.floor((currentOneHp - (currentTwoAttack * 0.2)));
        } else {
            currentOneHp = Math.floor((currentOneHp - (currentTwoAttack * 0.5)));
        }
        currentTwoAttack = null;
    } else {
        if (currentTwoSpAttack <= pokemon1.spDef) {
            currentOneHp = Math.floor((currentOneHp - (currentTwoSpAttack * 0.2)));
        } else {
            currentOneHp = Math.floor((currentOneHp - (currentTwoSpAttack * 0.5)));
        }
        currentTwoSpAttack = null;
    }
}

//Funcion que inicia flujo de combate
function initTextLog() {
    for (let button of $$playerTwoButtons) {
        button.classList.add("hidden");
    };
    $$playerOneArea.classList.add("hidden");
    $$playerTwoArea.classList.add("hidden");
    $$textLog.classList.remove("hidden");

    if (trickRoomStatus === false) {
        console.log("¡Parece que los pokemon estan comodos! El pokemon más rápido ataca antes!")
        if (currentOneSpeed >= currentTwoSpeed) {
            oneAttack();
            twoAttack();
            setTimeout(function() {
                console.log("Pokemon 1 ataca primero");
            }, 1000);
            setTimeout(function() {
                $$playerTwoHp.innerHTML = currentTwoHp;
                if (currentTwoHp <= 0) {
                    alert("El jugador 1 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 2 son ${currentTwoHp}`);
            }, 2000);
            setTimeout(function() {
                console.log("Pokemon 2 ataca segundo");
            }, 3000);
            setTimeout(function() {
                $$playerOneHp.innerHTML = currentOneHp;
                if (currentOneHp <= 0) {
                    alert("El jugador 2 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 1 son ${currentOneHp}`);
            }, 4000);
            setTimeout(function() {
                $$textLog.classList.add("hidden");
            }, 5000);
            setTimeout(openOne, 5001);
        } else {
            twoAttack();
            oneAttack();
            setTimeout(function() {
                console.log("Pokemon 2 ataca primero");
            }, 1000);
            setTimeout(function() {
                $$playerOneHp.innerHTML = currentOneHp;
                if (currentOneHp <= 0) {
                    alert("El jugador 2 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 1 son ${currentOneHp}`);
            }, 2000);
            setTimeout(function() {
                console.log("Pokemon 1 ataca segundo");
            }, 3000);
            setTimeout(function() {
                $$playerTwoHp.innerHTML = currentTwoHp;
                if (currentTwoHp <= 0) {
                    alert("El jugador 1 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 2 son ${currentTwoHp}`);
            }, 4000);
            setTimeout(function() {
                $$textLog.classList.add("hidden");
            }, 5000);
            setTimeout(openOne, 5001);
        }
    } else {
        console.log("¡Uy parece que el espacio esta enrarecido! Parece que el pokemon más lento se mueve más rapido!")
        if (currentOneSpeed >= currentTwoSpeed) {
            twoAttack();
            oneAttack();
            setTimeout(function() {
                console.log("Pokemon 2 ataca primero");
            }, 1000);
            setTimeout(function() {
                $$playerOneHp.innerHTML = currentOneHp;
                if (currentOneHp <= 0) {
                    alert("El jugador 2 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 1 son ${currentOneHp}`);
            }, 2000);
            setTimeout(function() {
                console.log("Pokemon 1 ataca segundo");
            }, 3000);
            setTimeout(function() {
                $$playerTwoHp.innerHTML = currentTwoHp;
                if (currentTwoHp <= 0) {
                    alert("El jugador 1 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 2 son ${currentTwoHp}`);
            }, 4000);
            setTimeout(function() {
                $$textLog.classList.add("hidden");
            }, 5000);
            setTimeout(openOne, 5001);
        } else {
            oneAttack();
            twoAttack();
            setTimeout(function() {
                console.log("Pokemon 1 ataca primero");
            }, 1000);
            setTimeout(function() {
                $$playerTwoHp.innerHTML = currentTwoHp;
                if (currentTwoHp <= 0) {
                    alert("El jugador 1 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 2 son ${currentTwoHp}`);
            }, 2000);
            setTimeout(function() {
                console.log("Pokemon 2 ataca segundo");
            }, 3000);
            setTimeout(function() {
                $$playerOneHp.innerHTML = currentOneHp;
                if (currentOneHp <= 0) {
                    alert("El jugador 2 ha ganado el combate");
                }
                console.log(`Los HP de pokemon 1 son ${currentOneHp}`);
            }, 4000);
            setTimeout(function() {
                $$textLog.classList.add("hidden");
            }, 5000);
            setTimeout(openOne, 5001);
        }
    }
}

//Event listener que dependiendo que clickes almacena una info para player 1
function playerOneMove() {
    if (this.textContent === "Attack") {
        currentOneAttack = pokemon1.atk;
        currentOneSpAttack = null;
        hideOneOpenTwo();
    } else if (this.textContent === "Special Attack") {
        currentOneSpAttack = pokemon1.spAtk;
        currentOneAttack = null;
        hideOneOpenTwo();
    } else if (this.textContent === "Agility") {
        currentOneSpeed = pokemon1.spe;
        currentOneSpeed += 20;
        hideOneOpenTwo();
    } else {
        if (trickRoomStatus === false) {
            trickRoomStatus = true;
            hideOneOpenTwo();
        } else {
            trickRoomStatus = false;
            hideOneOpenTwo();
        }
    }
}

//Event listener que dependiendo que clickes almacena una info para player 2
function playerTwoMove() {
    if (this.textContent === "Attack") {
        currentTwoAttack = pokemon2.atk;
        currentTwoSpAttack = null;
        initTextLog();
    } else if (this.textContent === "Special Attack") {
        currentTwoSpAttack = pokemon2.spAtk;
        currentTwoAttack = null;
        initTextLog();
    } else if (this.textContent === "Agility") {
        currentTwoSpeed = pokemon2.spe;
        currentTwoSpeed += 20;
        initTextLog();
    } else {
        if (trickRoomStatus === false) {
            trickRoomStatus = true;
            initTextLog();
        } else {
            trickRoomStatus = false;
            initTextLog();
        }
    }
}

//Mas adelante cogerá como parametros los pokemon, los pintaraá y almacenará las variables
function initCombat() {
    //Añade los event listeners a player1
    for (let button of $$playerOneButtons) {
        button.addEventListener("click", playerOneMove);
    }
    //Añade los event listeners a player2
    for (let button of $$playerTwoButtons) {
        button.addEventListener("click", playerTwoMove);
    }
    //Añade los hp de cada pokemon
    currentOneHp = pokemon1.hp;
    $$playerOneHp.innerHTML = currentOneHp;
    currentTwoHp = pokemon2.hp;
    $$playerTwoHp.innerHTML = currentTwoHp;
}
initCombat();