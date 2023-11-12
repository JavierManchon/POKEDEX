//Defino los recursos con los que empiezo
const board$$ = document.querySelector("#pokedex");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let screenStatus = 1;
let contenderActive = null;

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

//boton de filtro
const homeButton = document.querySelector(".home");
const filterArea = document.querySelector("#types-area")
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

//boton de pokemon (abre combate)
const pokeButton = document.querySelector(".logo");
pokeButton.addEventListener("click", openCombat);

function openCombat() {
    let $$CardsList = document.body.querySelectorAll(".card");
    for (let card of $$CardsList) {
        card.addEventListener("click", addToCombat);
    }
}

function addToCombat() {
    if (contenderActive === null) {
        pokemon1.hp = this.children[3].children[0].lastChild.innerHTML;
        pokemon1.atk = this.children[3].children[1].lastChild.innerHTML;
        pokemon1.def = this.children[3].children[2].lastChild.innerHTML;
        pokemon1.spAtk = this.children[3].children[3].lastChild.innerHTML;
        pokemon1.spDef = this.children[3].children[4].lastChild.innerHTML;
        pokemon1.spe = this.children[3].children[5].lastChild.innerHTML;
        let nameValue1 = this.getAttribute("data-name");
        pokemon1.pokeName = nameValue1;
        let idValue1 = this.getAttribute("data-id");
        pokemon1.id = idValue1;
        pokemon1.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${idValue1}.png`
        contenderActive = 1;
    } else {
        contenderActive = null;
        pokemon2.hp = this.children[3].children[0].lastChild.innerHTML;
        pokemon2.atk = this.children[3].children[1].lastChild.innerHTML;
        pokemon2.def = this.children[3].children[2].lastChild.innerHTML;
        pokemon2.spAtk = this.children[3].children[3].lastChild.innerHTML;
        pokemon2.spDef = this.children[3].children[4].lastChild.innerHTML;
        pokemon2.spe = this.children[3].children[5].lastChild.innerHTML;
        let nameValue2 = this.getAttribute("data-name");
        pokemon1.pokeName = nameValue2;
        let idValue2 = this.getAttribute("data-id");
        pokemon2.id = idValue2;
        pokemon2.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idValue2}.png`;
        initCombat();
    }
}

//Script para el combate
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
    let $$pokedexArea = document.querySelector(".pokedex-area");
    $$pokedexArea.classList.add("hidden");
    $$pokedexArea.innerHTML = "";
    let $$pokeLogo = document.querySelector(".logo");
    $$pokeLogo.classList.add("hidden");
    let $$pokeCombat = document.querySelector(".container-combat");
    $$pokeCombat.classList.remove("hidden");


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
    let $$playerOneimage = document.querySelector(".player-one-pokemon");
    $$playerOneimage.setAttribute("src", pokemon1.img);
    let $$playerTwoimage = document.querySelector(".player-two-pokemon");
    $$playerTwoimage.setAttribute("src", pokemon2.img);
}




