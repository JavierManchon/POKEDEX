let ol$$ = document.body.querySelector("ol");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/"
console.log(apiUrl+1);
//Hago la prueba con 3 pokes porque tarda mucho en cargar
//IMPORTANTE, IMPLEMENTAR PAGINACION PARA OPTIMIZAR LA CARGA
const pokeNum = 12;


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
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
            };
        });

        //Devuelvo el array con la info mapeada
        return pokemon;

    } catch(error) {
        console.error("No se pudo obtener los datos de los pokemon", error);
    }
}

//Llamo a la funcion getData() que devuleve una promesa, por lo tanto uso el then/catch para ejecutar
// una vez se haya recuperado toda la info del array que devuelve getData() cuando se ejecuta
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
            let p$$ = document.createElement("p");
            p$$.className = "card-subtitle";
            let span$$ = document.createElement("span");
            span$$.className = "card-subtitle";

            li$$.appendChild(h2$$);
            h2$$.textContent = pokemonData[i].name;
            li$$.appendChild(img$$);
            img$$.setAttribute("src", pokemonData[i].image);
            img$$.setAttribute("alt", `Imagen de ${pokemonData[i].name}`);
            li$$.appendChild(p$$);
            p$$.textContent = pokemonData[i].type;
            li$$.appendChild(span$$);
            //Añado el condicional para que imprima los id en un formato homogeneo
            if (pokemonData[i].id < 10) {
                span$$.textContent = `#00${pokemonData[i].id}`;
            } else if (pokemonData[i].id < 100) {
                span$$.textContent = `#0${pokemonData[i].id}`;
            } else {
                span$$.textContent = `#${pokemonData[i].id}`;
            }

            ol$$.appendChild(li$$);
        }
    })

    //Catch para seguir controlando los posibles errores
    .catch((error) => {
        console.error("Error al obtener los datos de los pokemon", error);
    });
