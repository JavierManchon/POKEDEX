//Defino los recursos con los que empiezo
const board$$ = document.querySelector("#pokedex");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

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
const pokeNum = 151;

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
        card$$.classList.add("transUp");

        board$$.appendChild(card$$);
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


//Funcion para el filtro IN PROGRESS
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
//Imprime solo los pokemon que tienen tipo unico o que el segundo tipo coincide
//Buscar una forma de si el primero de los dos coincide tambien lo imprima
//(!pokemon.textContent.includes(this.innerHTML))

const typesFilter$$ = document.querySelectorAll(".filter");
for(let type of typesFilter$$) {
    type.addEventListener("click", filterByType);
}