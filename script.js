// import fetch from 'node-fetch';

function fetchAllPokemon() {
	fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
		.then((response) => response.json())
		.then((pokemonData) =>
			pokemonData.results.forEach((pokemon) => console.log(pokemon.url))
		)
		.catch((erro) => console.log('Ocorreu um erro no acesso a API', erro));
}

function fetchPokemon(nomePokemon) {
	fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`)
		.then((response) => response.json())
		.then((pokemonData) => {createPokemonCard(pokemonData)})
		.catch((erro) => console.log('Ocorreu um erro no acesso a API', erro));
}

function createPokemonCard(pokemon) {
	const cardContainer = document.querySelector('#container-cards');
	const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('cards')
	const pokemonName = document.createElement('h1');
	pokemonName.textContent = pokemon.name;
	const pokemonPicture = document.createElement('img');
	pokemonPicture.src = pokemon.sprites.front_default;
	const pokemonId = document.createElement('p');
	pokemonId.textContent = pokemon.id;
	pokemonCard.appendChild(pokemonName);
	pokemonCard.appendChild(pokemonPicture);
	pokemonCard.appendChild(pokemonId);
  pokemon.name !== 'arceus' ? createTyping(pokemon.types[0].type.name, pokemon.types[1].type.name, pokemonCard) : createArceusTyping(pokemonCard)
	cardContainer.appendChild(pokemonCard);
}

function createTyping(type1, type2, card) {
	const firstType = document.createElement('p');
	firstType.textContent = type1;
  firstType.classList.add(type1)
	card.appendChild(firstType);
	if (type2) {
		const secondType = document.createElement('p');
		secondType.textContent = type2;
    secondType.classList.add(type2)
		card.appendChild(secondType);
	}
}

function createArceusTyping(card) {
  const firstType = document.createElement('p');
	firstType.textContent = 'Any';
  firstType.classList.add('arceus');
  card.appendChild(firstType)
}

fetchPokemon('charizard');
fetchPokemon('zapdos');
fetchPokemon('lucario');
