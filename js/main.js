// Estas variables limitan los pokemones por cada call a la API y el numero total de pokemons 
let offset=0;
const limit=12;
const totalPokemons=1010;


// Elemeneto padre para insertar cartas Pokemon 
const contentCard=document.querySelectorAll('#content-card')
// Contenedor padre del boton More Pokemons
const contentButtonLoadMore=document.querySelector('.pagination')
// Boton para ver mas Carts Pokemon
const loadMoreButton = document.querySelector('#loadMoreButton')
  // Formulario para hacer usar el addEventListener
const search= document.querySelector('#search')
// Contenedor padre de cartas y demas elementos
const contentElements= document.querySelector('#contentElements');
// Contenedor footer



// Objeto para guardar funciones de manera mas organizada
const pokeFuncions={};

// Funcion para convertir data en una clase pokemon
pokeFuncions.getPokemon=(name) => {

  const url=`https://pokeapi.co/api/v2/pokemon/${name}`;

  return fetch(url)
  .then(response => response.json())
  .then(data => data)
  .then(getAndAssignValues)
  .catch(err => console.error('No se encontro el elemento', name, err))
}

// Funcion/metodo para solicitar data de varios pokemons en un rango establecido
pokeFuncions.getPokemons=(offset, limit) => {

  const url=`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}}`;

  return fetch(url)
  .then(response => response.json())
  .then(data=> data.results)
  .then(pokemons => pokemons.map(pokeFuncions.getPokemonDetail))
  .then((detailRequests) => Promise.all(detailRequests))
  .then((pokemonsDetails) => pokemonsDetails)
  .catch(error => {
    console.error('Error:', error);
    location.reload()
  });
}

// Funcion/metodo para solicitar data de un conjunto de pokemons
pokeFuncions.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
      .then((response) => response.json())
      .then(getAndAssignValues)
}


// Funcion para convertir data.json a una clase mas facil de manipular
function getAndAssignValues(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.Hp = pokeDetail.stats[0].base_stat;
    pokemon.statAttack =pokeDetail.stats[1].base_stat;
    pokemon.statDefense =pokeDetail.stats[2].base_stat;
    pokemon.statSpeed =pokeDetail.stats[5].base_stat;
    

    pokemon.height =pokeDetail.height;
    pokemon.weight =pokeDetail.weight;

    pokemon.photo = pokeDetail['sprites']['other']['dream_world']['front_default'];
    pokemon.photo2 = pokeDetail['sprites']['front_default']
    pokemon.photoA = pokeDetail['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    return pokemon
}


//Insertar cartas en el DOM

async function loadPokemonItens(offset, limit) {

  try{

    let pokemons=[]
    pokemons=await pokeFuncions.getPokemons(offset, limit)

      const structureCards =pokemons.map(createCard)

      let traveledValue=0;

      // Este ciclo for lo cree para recorrer columna por columna e ir ubicando las cartas Why? Bootstrap Framework

      for(let i=0;i<structureCards.length;i++){


        if( traveledValue<contentCard.length){
            contentCard[traveledValue].innerHTML+=structureCards[i]
            traveledValue++;

            console.log(traveledValue)
        }

        else {
          traveledValue = 0;
          contentCard[traveledValue].innerHTML += structureCards[i];
          traveledValue++;
          console.log(traveledValue);
        }


        
        
      }

      const cards=document.querySelectorAll('#cards');
      // Ejecuto en cada elemento con un forEach una funcion para crear un modal con la informacion del pokemon
    cards.forEach(activeModalPokemon);
  }

  catch (error){
    console.log('la cagaste mi rey', error)

  }

      
}


// Creamos el modal con la informacion obtenida al hacer click en una carta pokemon
function activeModalPokemon(card){

      card.addEventListener('click', () => {


      const specificTextCard = card.querySelector('.card-text');
      let extractOnlyLetters=specificTextCard.textContent.match(/[a-zA-Z-]/g);
      let convertlettersToStrings=extractOnlyLetters.join('');
      let textCardValue=convertlettersToStrings.toLowerCase()

      pokeFuncions.getPokemon(textCardValue).then(pokemon => { 
        
        const structureModal = createModal(pokemon)
        let newDivForReplace = document.createElement('div');
        newDivForReplace.innerHTML = structureModal;
        contentElements.appendChild(newDivForReplace)
        
        let myModalPokemon = document.querySelector('#pokemonModal');
        let modalBootstrap = new bootstrap.Modal(myModalPokemon);
        modalBootstrap.show();

        myModalPokemon.addEventListener('hidden.bs.modal', function () {
        myModalPokemon.remove();
      });
        ;})
      })

}

// Insertar una sola carta o modal al DOM

function loadPokemon(name) {
    pokeFuncions.getPokemon(name).then(pokemon => {
      const structureCard = createCard(pokemon)
      contentCard[1].innerHTML += structureCard
      const cards=document.querySelectorAll('#cards');
    cards.forEach(activeModalPokemon);
    contentButtonLoadMore.innerHTML = '';
    contentButtonLoadMore.removeAttribute("style");
    contentButtonLoadMore.setAttribute('style', 'height: 0; padding:0');
    
    }).catch(noExistThisPokemon())

}


// Creamos y asignamos valores a la estructura de la carta Pokemon
function createCard(pokemon){
  return  `  <div id="cards" class="card" style="width: 18rem;">
  <div class="card-body">
  <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
    <p class="card-text">#${pokemon.number}${' '}${pokemon.name.toUpperCase()}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type.toUpperCase()}</li>`).join('')}
                </ol>
  </div>
</div>`
}

// Creamos y asignamos valores a la estructura del Modal Pokemon
function createModal(pokemon){
  return ` <div class="modal fade" id="pokemonModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="pokeInfoGeneral">
      <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
      <p class="card-text">${pokemon.name.toUpperCase()}</p>
      <ol class="types">
      ${pokemon.types.map((type) => `<li class="type ${type}">${type.toUpperCase()}</li>`).join('')}
  </ol>
      </div>
      <div class="pokeInfoSpecific">
      <h3>Information Fisic</h3>
      <div class="box-fisic">
      <div class="box-items-fisic">
      <p class='title-items-fisic'>HEIGHT</p>
      <p>${pokemon.height}</p>
      </div>
      <div class="box-items-fisic">
      <p class='title-items-fisic'>WEIGHT</p>
      <p>${pokemon.weight}</p>
      </div>
      </div>
      <h3>Stats</h3>
      <div class="box-stats">
      <div class="box-bar">
      <p>HP</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.Hp}%;" aria-valuenow="${pokemon.Hp}" aria-valuemin="0" aria-valuemax="250">${pokemon.Hp}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>ATTACK</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statAttack}%;" aria-valuenow="${pokemon.statAttack}" aria-valuemin="0" aria-valuemax="250">${pokemon.statAttack}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>DEFENSE</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statDefense}%;" aria-valuenow="${pokemon.statDefense}" aria-valuemin="0" aria-valuemax="250">${pokemon.statDefense}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>SPEED</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statSpeed}%;" aria-valuenow="${pokemon.statSpeed}" aria-valuemin="0" aria-valuemax="250">${pokemon.statSpeed}%</div>
      </div>  
      </div>
      </div>
                </div>
      </div>
    </div>
  </div>
</div>`
}

// Arrow funcion para establecer el limite de pokemons para solictar a la API
loadMoreButton.addEventListener('click', () => {
  offset += limit
  const limitPokemons = offset + limit

  if (limitPokemons >= totalPokemons) {
      const newLimit = totalPokemons - offset
      loadPokemonItens(offset, newLimit)

      loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {

      loadPokemonItens(offset, limit)

  }
})

// Evento para buscar pokemons en la NavBar.
search.addEventListener('submit',(stopRedirectionDefault) =>{

  stopRedirectionDefault.preventDefault()


// Valor ingresado en la barra de busqueda
 const name=document.querySelector('#input-search').value.toLowerCase();

const cards=document.querySelectorAll('#cards')
// Remueve todas las cartas 
for (let i = 0; i < cards.length; i++) {
    cards[i].remove();
}


contentButtonLoadMore.innerHTML = '';


// Ejecutamos la funcion que nos devuelve la carta del pokemon con el valor del input
loadPokemon(name)
})

// Call y insercion de Cartas Pokemon
loadPokemonItens(offset, limit)

// Funcion creada para manejar el error de no encontrar un pokemon en la API
function noExistThisPokemon(){

  const name=document.querySelector('#input-search').value.toLowerCase();

  const a=`
  <div class="box-error">
    <p class='text-error'>No existe el puchamon "${name}".Intenta de nuevo con un nombre valido.</p>
</div>`

contentButtonLoadMore.innerHTML=a;

contentButtonLoadMore.setAttribute('style', 'margin-bottom: 20rem');
}