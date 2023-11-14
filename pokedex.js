//Defino los recursos con los que empiezo y almaceno algunos generales utiles
const board$$ = document.querySelector("#pokedex");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let screenStatus = 1;
let contenderActive = null;
let $$footerBar = document.querySelector(".combat-text");
const selectorSound = document.querySelector(".selector-sound");
const winnerSound = document.querySelector(".winner-sound");
const p1Area = document.querySelector(".player-one-area");
const p2Area = document.querySelector(".player-two-area");
let combatLogText = document.querySelector(".combat-log-text");

//Colores y tipos para los background
const colorType = {
    steel: [168,168,192],
    water: [56,153,248],
    bug: [168,184,32],
    dragon: [160,80,56],
    electric: [248,208,48],
    ghost: [96,96,176],
    fire: [240,80,48],
    fairy: [231,159,231],
    ice: [88,200,224],
    fighting: [160,80,56],
    normal: [168,160,144],
    grass: [120,200,80],
    psychic: [248,112,160],
    rock: [184,160,88],
    dark: [122,88,72],
    ground: [234,214,164],
    poison: [176,88,160],
    flying: [152,168,240]
}

//Nombres de las stats
const statNames = ["HP", "ATK", "DEF", "S.ATK", "S.DEF", "SPD"];

//Defino el numero de pokemon que saco de la api
const pokeNum = 151 + 1;

//Funcion que mapea la info dentro de cada pokemon
const mapData = (unmappedData) => {
    let pokemon = unmappedData.map((elem) => {
        return {
        name: elem.name,
        image: elem.sprites.other.home["front_default"],
        type: elem.types.map((type) => type.type.name),
        id: elem.id,
        baseStat: elem.stats.map((stat) => stat.base_stat),
        };
    });

    return pokemon;
}

//Definimos la funcion de fetch
const getData = async (url) => {
    try {
        let pokemonData = [];
        for (let i = 1; i < pokeNum; i++) {
            let response = await fetch(url + i);
            let data = await response.json();
            pokemonData.push(data);
        }

        let pokemonMapped = mapData(pokemonData);

        return pokemonMapped;

    } catch (error) {
        console.error("Ha habido un error en la descarga de pokemon", error);
    }
}


//Funcion que va a pintar cada carta impresa en la pagina
const renderPokemon = (mappedData) => {
    for (let i = 0; i < mappedData.length; i++) {
        let card$$ = document.createElement("div");
        card$$.className = "card";
        let h2$$ = document.createElement("h2");
        h2$$.className = "card-title";
        let img$$ = document.createElement("img");
        img$$.className = "card-image";
        let p1$$ = document.createElement("p");
        p1$$.className = "card-type";
        let p2$$ = document.createElement("p");
        p2$$.className = "card-type";
        let h3$$ = document.createElement("h3");
        h3$$.className = "card-id";
        let cardContainer$$ = document.createElement("div");
        cardContainer$$.className = "card-id-container";
        let types$$ = document.createElement("div");
        types$$.className = "card-type-row";
        let statsContainer$$ = document.createElement("div");
        statsContainer$$.className = "stats-area";

        card$$.appendChild(cardContainer$$);
        cardContainer$$.appendChild(h3$$);
        //Añado el condicional para que imprima los id en un formato homogeneo
        if (mappedData[i].id < 10) {
            h3$$.textContent = `#00${mappedData[i].id}`;
        } else if (mappedData[i].id < 100) {
            h3$$.textContent = `#0${mappedData[i].id}`;
        } else {
            h3$$.textContent = `#${mappedData[i].id}`;
        }
        cardContainer$$.appendChild(img$$);
        //Compruebo el primer tipo del pokemon con el objeto que contiene los tipos
        //Cuando encuentre una coincidencia le aplica la clase que contiene el color al background
        for (let key in colorType) {
            if (key === mappedData[i].type[0]) {
                cardContainer$$.classList.add(`type-${key}`);
            }
        }
        img$$.setAttribute("src", mappedData[i].image);
        img$$.setAttribute("alt", `Imagen de ${mappedData[i].name}`);
        card$$.appendChild(h2$$);
        h2$$.textContent = mappedData[i].name;
        types$$.appendChild(p1$$);

        //Defino el fondo de cada burbuja de tipo, y si hay dos tipos, lo añado tambien
        p1$$.textContent = mappedData[i].type[0];
        p1$$.classList.add(`type-${mappedData[i].type[0]}`);
        if (mappedData[i].type[1]) {
            types$$.appendChild(p2$$);
            p2$$.textContent = mappedData[i].type[1];
            p2$$.classList.add(`type-${mappedData[i].type[1]}`); 
        }
        card$$.appendChild(types$$);

        //Incorporo las stats
        for (let j = 0; j < 6; j++) {
            let stat$$ = document.createElement("div");
            stat$$.className = "stat";
            let statName$$ = document.createElement("span");
            statName$$.className = "stat-name";
            statName$$.textContent = statNames[j];
            let statValue$$ = document.createElement("span");
            statValue$$.className = "stat-value";
            statValue$$.textContent = mappedData[i].baseStat[j];
            stat$$.appendChild(statName$$);
            stat$$.appendChild(statValue$$);
            statsContainer$$.appendChild(stat$$);
        }
        card$$.appendChild(statsContainer$$);

        board$$.appendChild(card$$);
        card$$.classList.add("transUp");

        card$$.setAttribute("data-name", `${mappedData[i].name}`);
        card$$.setAttribute("data-id", `${mappedData[i].id}`);

    }
}

//Funcion que va a ejecutar la pagina
const initFuction = async () => {
    let pokemonData = await getData(apiUrl);

    //Reseteador para el control de carga
    board$$.innerHTML = "";

    let renderedPokemon = renderPokemon(pokemonData);
    
    return renderedPokemon;
}

initFuction();

//Funcion para el buscador
const showSelection = () => {
    let lowerCaseRequest = browser$$.value.toLowerCase();
    let pokemonCards = document.querySelectorAll(".card-title");
    for (let pokemon of pokemonCards) {
        pokemon.parentNode.classList.remove("hidden");
        if (!pokemon.textContent.toLowerCase().includes(lowerCaseRequest)) {
            pokemon.parentNode.classList.add("hidden");
        }
    }
}

const browser$$ = document.querySelector(".browser");
browser$$.addEventListener("input", showSelection)


//Funcion para el filtro
function filterByType() {
    let typeRows = document.querySelectorAll(".card-type-row");
    for (let pokemon of typeRows) {
        pokemon.parentNode.classList.remove("hidden");
        let typeFilter = pokemon.children;
        if ((typeFilter.length === 1 && typeFilter[0].innerHTML !== this.innerHTML) || (typeFilter.length === 2 && (typeFilter[0].innerHTML !== this.innerHTML && typeFilter[1].innerHTML !== this.innerHTML))) {
            pokemon.parentNode.classList.add("hidden");
        }
        if (this.innerHTML === "all") {
            pokemon.parentNode.classList.remove("hidden");
        }
    }
}

const typesFilter$$ = document.querySelectorAll(".filter");
for(let type of typesFilter$$) {
    type.addEventListener("click", filterByType);
}

//Boton de filtro
const homeButton = document.querySelector(".home");
const filterArea = document.querySelector("#types-area");
const filterButton = document.querySelector(".filter-symbol");
let homeButtonStatus = 0;
homeButton.addEventListener("click", function() {
    if (homeButtonStatus === 0) {
        this.classList.add("rotate");
        filterArea.classList.remove("translate-types-area");
        board$$.classList.add("pokedex-translation");
        homeButtonStatus++;
    } else {
        filterArea.classList.add("translate-types-area");
        board$$.classList.remove("pokedex-translation");
        homeButtonStatus--;
        this.classList.remove("rotate");
    }
});
filterButton.addEventListener("click", function() {
    if (homeButtonStatus === 0) {
        homeButton.classList.add("rotate");
        filterArea.classList.remove("translate-types-area");
        board$$.classList.add("pokedex-translation");
        homeButtonStatus++;
    } else {
        filterArea.classList.add("translate-types-area");
        board$$.classList.remove("pokedex-translation");
        homeButtonStatus--;
        homeButton.classList.remove("rotate");
    }
});

//boton de Pokeball, cuando clico inicio la secuencia de combate
const pokeButton = document.querySelector(".button-active");
pokeButton.addEventListener("click", openCombat);

function openCombat() {
    pokeButton.classList.add("pulse");
    let $$fire = document.querySelector(".fire");
    $$fire.classList.remove("hidden");
    let $$CardsList = document.body.querySelectorAll(".card");
    for (let card of $$CardsList) {
        card.addEventListener("click", addToCombat);
        card.classList.add("pointer");
    }
    $$footerBar.innerHTML = "Player 1, choose your Pokemon";
}

//SCRIPT PARA EL COMBATE
//Construimos los objetos que almacenan la info de los pokes seleccionados
let pokemon1 = {
    pokeName: null,
    id: null,
    hp: null,
    atk: null,
    def: null,
    spAtk: null,
    spDef: null,
    spe: null,
    img: null
}

let pokemon2 = {
    pokeName: null,
    id: null,
    hp: null,
    atk: null,
    def: null,
    spAtk: null,
    spDef: null,
    spe: null,
    img: null
}

//Esta funcion recoge la info de los pokemon seleccionados y los pasa las variables del combate
function addToCombat() {
    if (contenderActive === null) {
        pokemon1.hp = parseInt(this.children[3].children[0].lastChild.innerHTML);
        pokemon1.atk = parseInt(this.children[3].children[1].lastChild.innerHTML);
        pokemon1.def = parseInt(this.children[3].children[2].lastChild.innerHTML);
        pokemon1.spAtk = parseInt(this.children[3].children[3].lastChild.innerHTML);
        pokemon1.spDef = parseInt(this.children[3].children[4].lastChild.innerHTML);
        pokemon1.spe = parseInt(this.children[3].children[5].lastChild.innerHTML);
        let nameValue1 = this.getAttribute("data-name");
        pokemon1.pokeName = nameValue1.toUpperCase();
        let idValue1 = this.getAttribute("data-id");
        pokemon1.id = idValue1;
        pokemon1.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${idValue1}.gif`;
        this.classList.add("markerOne");
        $$footerBar.innerHTML = "Player 2, choose your Pokemon";
        contenderActive = 1;
        playSound(selectorSound);
    } else {
        contenderActive = null;
        pokemon2.hp = parseInt(this.children[3].children[0].lastChild.innerHTML);
        pokemon2.atk = parseInt(this.children[3].children[1].lastChild.innerHTML);
        pokemon2.def = parseInt(this.children[3].children[2].lastChild.innerHTML);
        pokemon2.spAtk = parseInt(this.children[3].children[3].lastChild.innerHTML);
        pokemon2.spDef = parseInt(this.children[3].children[4].lastChild.innerHTML);
        pokemon2.spe = parseInt(this.children[3].children[5].lastChild.innerHTML);
        let nameValue2 = this.getAttribute("data-name");
        pokemon2.pokeName = nameValue2.toUpperCase();
        let idValue2 = this.getAttribute("data-id");
        pokemon2.id = idValue2;
        pokemon2.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idValue2}.gif`;
        this.classList.add("markerTwo")
        let $$footer = document.querySelector("footer");
        $$footer.classList.add("hidden");
        let $$button = document.querySelector(".button-active");
        $$button.classList.add("hidden");
        playSound(selectorSound);
        setTimeout(initCombat, 5000);
    }
}


//Seleccionamos las variables que van a operar en el flujo de combate
let $$playerOneButtons = document.body.querySelectorAll(".button1");
let $$playerTwoButtons = document.body.querySelectorAll(".button2");
let $$playerOneArea = document.body.querySelector("#player-one-area");
let $$playerTwoArea = document.body.querySelector("#player-two-area");
let $$playerOneHp = document.body.querySelector(".player-one-hp");
let $$playerTwoHp = document.body.querySelector(".player-two-hp");
let $$textLog = document.body.querySelector(".text-logger");
let currentOneAttack = null;
let currentOneSpAttack = null;
let currentOneHp = null;
let currentTwoAttack = null;
let currentTwoSpAttack = null;
let currentTwoHp = null;
let trickRoomStatus = false;


//Funcion que oculta el primer panel y abre el segundo
function hideOneOpenTwo() {
    for (let button of $$playerTwoButtons) {
        button.classList.remove("hidden");
    }
    p2Area.classList.remove("hidden");
    for (let button of $$playerOneButtons) {
        button.classList.add("hidden");
    }
}

//Funcion que una vez terminado el flujo del turno
//se abre la ventana que permite al jugador uno elegir sus movimientos
function openOne() {
    $$textLog.classList.add("hidden")
    for (let button of $$playerOneButtons) {
        button.classList.remove("hidden");
    }
    p1Area.classList.remove("hidden");
}


//Funcion que recoge la info del ataque del jugador 1
//Define si está atacando especial o fisico, y lo compara con la defensa especial o fisica del contrincante
//Si tiene mas defensa que ataque el ataque se reduce al 20% del valor de ataque
//En caso contrario hace un 50% del daño del valor de ataque.
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
    };
}


//Funcion que recoge la info del ataque del jugador 2
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
//Se activa una vez los dos jugadores han seleccionado un movimiento
function initTextLog() {
    for (let button of $$playerTwoButtons) {
        button.classList.add("hidden");
    };
    p1Area.classList.add("hidden");
    p2Area.classList.add("hidden");

    $$textLog.classList.remove("hidden")

    //Control token
    let winnerToken = false;

    //Localizador de sonido de batalla
    const battleSound = document.querySelector(".battle-sound");

    //Selectores de pokemon para las animaciones
    let pokemonOne = document.querySelector(".player-one-pokemon");
    let pokemonTwo = document.querySelector(".player-two-pokemon");

    //Primero comprueba si Trick Room esta activo,
    //Si lo esta, invierte las velocidades
    if (trickRoomStatus === true && pokemon1.spe <= pokemon2.spe) {
        combatLogText.innerHTML = "¡Uy parece que el espacio esta enrarecido! Parece que el pokemon más lento se mueve más rapido!";
        oneAttack();
        twoAttack();
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon1.pokeName} ataca primero`;
        }, 1000);
        setTimeout(function() {
            //Aplicamos la actualizacion de las barra de vida
            $$playerTwoHp.innerHTML = currentTwoHp;
            let hpBar2 = document.querySelector(".poke2");

            // Definimos las variables y las condiciones que pasamos a la funcion que actualiza la vida
            let currentHp2 = currentTwoHp;
            let maxHp2 = pokemon2.hp;

            hpBarUpdate(hpBar2, currentHp2, maxHp2);

            //Animaciones de movimiento para el ataque y parpadeo para el daño
            pokemonOne.style.left = "250px";
            pokemonTwo.classList.toggle("blinking");
            setTimeout(function() {
                pokemonOne.style.left = "200px";
                pokemonTwo.classList.toggle("blinking");
            }, 500);

            //Comprobamos si ha ganado el jugador que ataca primero y cerramos la partida en caso afirmativo
            if (currentTwoHp <= 0) {
                pauseSound(battleSound);
                playSound(winnerSound);
                winnerToken = true;
                setTimeout(function() {
                    alert("El jugador 1 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon2.pokeName} son ${currentTwoHp}`;
        }, 2000);

        //Continuamos el flujo con el segundo pokemon
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon2.pokeName} ataca segundo`;
        }, 3000);
        setTimeout(function() {
            $$playerOneHp.innerHTML = currentOneHp;
            let hpBar1 = document.querySelector(".poke1");

            let currentHp1 = currentOneHp;
            let maxHp1 = pokemon1.hp;

            hpBarUpdate(hpBar1, currentHp1, maxHp1);

            pokemonTwo.style.left = "600px";
            pokemonOne.classList.toggle("blinking");
            setTimeout(function() {
                pokemonTwo.style.left = "650px";
                pokemonOne.classList.toggle("blinking");
            }, 500);

            if (currentOneHp <= 0 && winnerToken === false) {
                pauseSound(battleSound);
                playSound(winnerSound);
                setTimeout(function() {
                    alert("El jugador 2 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon1.pokeName} son ${currentOneHp}`;
        }, 4000);
        
        //Resetea la apertura de los controladores
        setTimeout(openOne, 5001);
    } else if (trickRoomStatus === true && pokemon2.spe <= pokemon1.spe) {
        combatLogText.innerHTML = "¡Uy parece que el espacio esta enrarecido! Parece que el pokemon más lento se mueve más rapido!";
        twoAttack();
        oneAttack();
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon2.pokeName} ataca primero`;
        }, 1000);
        setTimeout(function() {
            $$playerOneHp.innerHTML = currentOneHp;
            let hpBar1 = document.querySelector(".poke1");

            let currentHp1 = currentOneHp;
            let maxHp1 = pokemon1.hp;

            hpBarUpdate(hpBar1, currentHp1, maxHp1);

            pokemonTwo.style.left = "600px";
            pokemonOne.classList.toggle("blinking");
            setTimeout(function() {
                pokemonTwo.style.left = "650px";
                pokemonOne.classList.toggle("blinking");
            }, 500);

            if (currentOneHp <= 0) {
                pauseSound(battleSound);
                playSound(winnerSound);
                winnerToken = true;
                setTimeout(function() {
                    alert("El jugador 2 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon1.pokeName} son ${currentOneHp}`;
        }, 2000);
        setTimeout(function() {
            console.log(`${pokemon1.pokeName} ataca segundo`);
        }, 3000);
        setTimeout(function() {
            $$playerTwoHp.innerHTML = currentTwoHp;
            let hpBar2 = document.querySelector(".poke2");

            let currentHp2 = currentTwoHp;
            let maxHp2 = pokemon2.hp;

            hpBarUpdate(hpBar2, currentHp2, maxHp2);

            pokemonOne.style.left = "250px";
            pokemonTwo.classList.toggle("blinking");
            setTimeout(function() {
                pokemonOne.style.left = "200px";
                pokemonTwo.classList.toggle("blinking");
            }, 500);

            if (currentTwoHp <= 0 && winnerToken === false) {
                pauseSound(battleSound);
                playSound(winnerSound);
                setTimeout(function() {
                    alert("El jugador 1 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon2.pokeName} son ${currentTwoHp}`;
        }, 4000);
        setTimeout(openOne, 5001);
    } else if (trickRoomStatus === false && pokemon1.spe <= pokemon2.spe) {
        combatLogText.innerHTML = "¡Parece que los pokemon estan comodos! El pokemon más rápido ataca antes!";
        twoAttack();
        oneAttack();
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon2.pokeName} ataca primero`;
        }, 1000);
        setTimeout(function() {
            $$playerOneHp.innerHTML = currentOneHp;
            let hpBar1 = document.querySelector(".poke1");

            let currentHp1 = currentOneHp;
            let maxHp1 = pokemon1.hp;

            hpBarUpdate(hpBar1, currentHp1, maxHp1);

            pokemonTwo.style.left = "600px";
            pokemonOne.classList.toggle("blinking");
            setTimeout(function() {
                pokemonTwo.style.left = "650px";
                pokemonOne.classList.toggle("blinking");
            }, 500);

            if (currentOneHp <= 0) {
                pauseSound(battleSound);
                playSound(winnerSound);
                winnerToken = true;
                setTimeout(function() {
                    alert("El jugador 2 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon1.pokeName} son ${currentOneHp}`;
        }, 2000);
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon1.pokeName} ataca segundo`;
        }, 3000);
        setTimeout(function() {
            $$playerTwoHp.innerHTML = currentTwoHp;
            let hpBar2 = document.querySelector(".poke2");

            let currentHp2 = currentTwoHp;
            let maxHp2 = pokemon2.hp;

            hpBarUpdate(hpBar2, currentHp2, maxHp2);

            pokemonOne.style.left = "250px";
            pokemonTwo.classList.toggle("blinking");
            setTimeout(function() {
                pokemonOne.style.left = "200px";
                pokemonTwo.classList.toggle("blinking");
            }, 500);

            if (currentTwoHp <= 0 && winnerToken === false) {
                pauseSound(battleSound);
                playSound(winnerSound);
                setTimeout(function() {
                    alert("El jugador 1 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon2.pokeName} son ${currentTwoHp}`;
        }, 4000);
        setTimeout(openOne, 5001);
    } else {
        combatLogText.innerHTML = "¡Parece que los pokemon estan comodos! El pokemon más rápido ataca antes!";
        oneAttack();
        twoAttack();
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon1.pokeName} ataca primero`;
        }, 1000);
        setTimeout(function() {
            $$playerTwoHp.innerHTML = currentTwoHp;
            let hpBar2 = document.querySelector(".poke2");

            let currentHp2 = currentTwoHp;
            let maxHp2 = pokemon2.hp;

            hpBarUpdate(hpBar2, currentHp2, maxHp2);

            pokemonOne.style.left = "250px";
            pokemonTwo.classList.toggle("blinking");
            setTimeout(function() {
                pokemonOne.style.left = "200px";
                pokemonTwo.classList.toggle("blinking");
            }, 500);

            if (currentTwoHp <= 0) {
                pauseSound(battleSound);
                playSound(winnerSound);
                winnerToken = true;
                setTimeout(function() {
                    alert("El jugador 1 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon2.pokeName} son ${currentTwoHp}`;
        }, 2000);
        setTimeout(function() {
            combatLogText.innerHTML = `${pokemon2.pokeName} ataca segundo`;
        }, 3000);
        setTimeout(function() {
            $$playerOneHp.innerHTML = currentOneHp;
            let hpBar1 = document.querySelector(".poke1");

            let currentHp1 = currentOneHp;
            let maxHp1 = pokemon1.hp;

            hpBarUpdate(hpBar1, currentHp1, maxHp1);

            pokemonTwo.style.left = "600px";
            pokemonOne.classList.toggle("blinking");
            setTimeout(function() {
                pokemonTwo.style.left = "650px";
                pokemonOne.classList.toggle("blinking");
            }, 500);

            if (currentOneHp <= 0 && winnerToken === false) {
                pauseSound(battleSound);
                playSound(winnerSound);
                setTimeout(function() {
                    alert("El jugador 2 ha ganado el combate");
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }, 3000);
            }
            combatLogText.innerHTML = `Los HP de ${pokemon1.pokeName} son ${currentOneHp}`;
        }, 4000);
        setTimeout(openOne, 5001);
    }
    winnerToken = false;
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
        pokemon1.spe = parseInt(pokemon1.spe) + 20;
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
        pokemon2.spe = parseInt(pokemon2.spe) + 20;
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
    let $$typesArea = document.querySelector(".translate-types-area");
    $$typesArea.classList.add("hidden");
    let $$pokeCombat = document.querySelector(".container-combat");
    $$pokeCombat.classList.remove("hidden");
    let $$filterPair = document.querySelector(".filter-pair");
    $$filterPair.classList.add("hidden");
    let $$pokedexArea = document.querySelector(".pokedex-area");
    $$pokedexArea.classList.add("hidden");
    $$pokedexArea.innerHTML = "";

    //Empieza a sonar la musica de combate
    const $$audio = document.createElement("audio");
    $$audio.innerHTML = `
        <audio autoplay loop class="battle-sound hidden">
            <source src="./assets/pokemon-opening.mp3" type="audio/mp3">
            Tu navegador no soporta el elemento de audio.
        </audio>
    `;
    const $$combat = document.querySelector(".container-combat");
    $$combat.appendChild($$audio);

    //Añade los event listeners a player1
    for (let button of $$playerOneButtons) {
        button.addEventListener("click", playerOneMove);
    }
    //Añade los event listeners a player2
    for (let button of $$playerTwoButtons) {
        button.addEventListener("click", playerTwoMove);
    }
    //Añade los hp, las imagenes y el nomobre de cada pokemon
    currentOneHp = pokemon1.hp;
    $$playerOneHp.innerHTML = currentOneHp;
    currentTwoHp = pokemon2.hp;
    $$playerTwoHp.innerHTML = currentTwoHp;
    let $$playerOneimage = document.querySelector(".player-one-pokemon");
    $$playerOneimage.setAttribute("src", pokemon1.img);
    let $$playerTwoName = document.querySelector(".poke-name2");
    $$playerTwoName.innerHTML = pokemon2.pokeName;
    let $$playerOneName = document.querySelector(".poke-name1");
    $$playerOneName.innerHTML = pokemon1.pokeName;
    $$playerOneimage.setAttribute("src", pokemon1.img);
    let $$playerTwoimage = document.querySelector(".player-two-pokemon");
    $$playerTwoimage.setAttribute("src", pokemon2.img);
}

//funcion que actualiza la barra de vida
function hpBarUpdate(hpBar, currentHp, maxHp) {
    // Calcula el porcentaje de vida actual en relación con la vida máxima
    let percentageHp = (currentHp / maxHp) * 100;

    // Actualiza la barra de vida, y le da un porcentaje para el width
    hpBar.style.width = percentageHp + "%";
    if (percentageHp <= 0) {
        hpBar.style.width = 0;
    }

    // Establece el color de fondo según el porcentaje de vida, segun su ancho
    if (percentageHp > 50) {
        hpBar.style.backgroundColor = "green";
    } else if (percentageHp > 20) {
        hpBar.style.backgroundColor = "orange";
    } else {
        hpBar.style.backgroundColor = "red";
    }
}

//Recarga la pagina vuelve a la home
let $$logoButton = document.querySelector(".logo");
$$logoButton.addEventListener('click', function() {
    location.reload();
})

//Añade sonidos on click
function playSound(sound) {
    sound.play();
}

//Elimina sonidos
function pauseSound(sound) {
    sound.pause();
}
