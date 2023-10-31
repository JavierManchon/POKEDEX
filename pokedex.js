let ol$$ = document.body.querySelector("ol");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/"
const pokeNum = 151;

//Colores segun el tipo principal del pokemon como recurso, para las burbujas y los containers del id
//Añado la combinacion de rgb a modo de array, por si tuviera que utilizarlo en estilos inline
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


//Defino una funcion asincrona que haga la solicitud a la API que devuelva en formato 
//json la info del numero de poke que quiera extraer mediante un bucle for como dice el ejercicio
async function getData() {
    //Añado try/catch para el control de errores
    try {
        let results = [];
        for (let i = 1; i < (pokeNum + 1); i++) {
            let response = await fetch(apiUrl + i);
            let data = await response.json();
            results.push(data);
        }
        
        //En base al array generado mapeo los resultados para obtener los datos que necesito
        const pokemon = results.map((result) => {
            return {
            name: result.name,
            image: result.sprites.other.home["front_default"],
            type: result.types.map((type) => type.type.name),
            id: result.id
            };
        });

        //Devuelvo el array con la info mapeada
        return pokemon;

    } catch(error) {
        console.error("No se pudo obtener los datos de los pokemon", error);
    }
}

//Llamo a la funcion getData() que devuleve una promesa, por lo tanto uso el then/catch para ejecutar la funcion
// una vez se haya recuperado toda la info del array que devuelve getData() cuando se ejecuta.
// En cada iteracion genero los elementos que quiero que se pinten y añado los atributos para que se apliquen las clases
getData()
    .then((pokemonData) => {
        for (let i = 0; i < pokemonData.length; i++) {
            let li$$ = document.createElement("li");
            li$$.className = "card";
            let h2$$ = document.createElement("h2");
            h2$$.className = "card-title";
            let img$$ = document.createElement("img");
            img$$.className = "card-image";
            let p1$$ = document.createElement("p");
            p1$$.className = "card-type";
            let p2$$ = document.createElement("p");
            p2$$.className = "card-type";
            let span$$ = document.createElement("span");
            span$$.className = "card-id";
            let cardContainer$$ = document.createElement("div");
            cardContainer$$.className = "card-id-container";
            let types$$ = document.createElement("div");
            types$$.className = "card-type-row";

            li$$.appendChild(cardContainer$$);
            cardContainer$$.appendChild(span$$);
            //Añado el condicional para que imprima los id en un formato homogeneo
            if (pokemonData[i].id < 10) {
                span$$.textContent = `#00${pokemonData[i].id}`;
            } else if (pokemonData[i].id < 100) {
                span$$.textContent = `#0${pokemonData[i].id}`;
            } else {
                span$$.textContent = `#${pokemonData[i].id}`;
            }
            cardContainer$$.appendChild(img$$);
            //Compruebo el primer tipo del pokemon con el objeto que contiene los tipos
            //Cuando encuentre una coincidencia le aplica la clase que contiene el color al background
            for (let key in colorType) {
                if (key === pokemonData[i].type[0]) {
                    cardContainer$$.classList.add(`type-${key}`);
                }
            }
            img$$.setAttribute("src", pokemonData[i].image);
            img$$.setAttribute("alt", `Imagen de ${pokemonData[i].name}`);
            li$$.appendChild(h2$$);
            h2$$.textContent = pokemonData[i].name;
            types$$.appendChild(p1$$);
            //Defino el fondo de cada burbuja de tipo, y si hay dos tipos, lo añado tambien
            p1$$.textContent = pokemonData[i].type[0];
            p1$$.classList.add(`type-${pokemonData[i].type[0]}`);
            if (pokemonData[i].type[1]) {
                types$$.appendChild(p2$$);
                p2$$.textContent = pokemonData[i].type[1];
                p2$$.classList.add(`type-${pokemonData[i].type[1]}`); 
            }
            li$$.appendChild(types$$);

            ol$$.appendChild(li$$);
        }
    })

    //Catch para seguir controlando los posibles errores
    .catch((error) => {
        console.error("Error al obtener los datos de los pokemon", error);
    });
