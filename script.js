// import fetch from 'node-fetch';
let allCards = [];

async function fetchAllPokemon() {
	const allPokes = await (
		await fetch('https://pokeapi.co/api/v2/pokemon?limit=898&offset=0')
	).json();
	const resolvedPromises = await Promise.all(
		allPokes.results.map((item) => fetchPokemon(item.name))
	);
	resolvedPromises.forEach(async (item) => {
		const result = await item.json();
		createPokemonCard(result);
	});
}

function fetchPokemon(nomePokemon) {
	return fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);
}

function createPokemonCard(pokemon) {
	const cardContainer = document.querySelector('#container-cards');
	const pokemonCard = document.createElement('div');
	pokemonCard.classList.add('cards');
	const pokemonName = document.createElement('h4');
	pokemonName.textContent = pokemon.name;
	const pokemonPicture = document.createElement('img');
	pokemonPicture.src = pokemon.sprites.front_default;
	const pokemonId = document.createElement('small');
	pokemonId.textContent = `#${pokemon.id}`;
	pokemonCard.appendChild(pokemonName);
	pokemonCard.appendChild(pokemonPicture);
	pokemonCard.appendChild(pokemonId);
	if (pokemon.name !== 'arceus') {
		if (pokemon.types[1]) {
			createTyping(
				pokemon.types[0].type.name,
				pokemon.types[1].type.name,
				pokemonCard
			);
		} else {
			createTyping(pokemon.types[0].type.name, false, pokemonCard);
		}
	} else {
		createArceusTyping;
	}
	cardContainer.appendChild(pokemonCard);
}

function createTyping(type1, type2, card) {
	const firstType = document.createElement('p');
	const typeContainer = document.createElement('div');
	typeContainer.classList.add('type-container');
	firstType.textContent = type1;
	firstType.classList.add(type1, 'type');
	typeContainer.appendChild(firstType);
	if (type2) {
		const secondType = document.createElement('p');
		secondType.textContent = type2;
		secondType.classList.add(type2, 'type');
		typeContainer.appendChild(secondType);
	}
	card.appendChild(typeContainer);
}

function createArceusTyping(card) {
	const firstType = document.createElement('p');
	firstType.textContent = 'Any';
	firstType.classList.add('arceus', 'type');
	card.appendChild(firstType);
}

async function createAllPokeList() {
	try {
		fetchAllPokemon();
	} catch (error) {
		console.log('Ocorreu um erro: ', error.message);
	}
}

window.onload = createAllPokeList;

function filterPokemon(event) {
	if (allCards.length === 0) allCards = document.querySelectorAll('.cards');
	const input = event.target.value;
	document.querySelectorAll('.cards').length === allCards.length
		? allCards.forEach((card) => card.parentElement.removeChild(card))
		: [...document.querySelectorAll('.cards')].forEach((card) =>
				card.parentElement.removeChild(card)
		  );
	const cardFilter = [...allCards].filter(
		(card) =>
			card.children[0].textContent.includes(input) ||
			card.children[2].textContent.includes(input)
	);
	cardFilter.forEach((card) =>
		document.querySelector('#container-cards').appendChild(card)
	);
	if (input.length === 0) {
		allCards.forEach((card) =>
			document.querySelector('#container-cards').appendChild(card)
		);
	}
}

document
	.querySelector('#container-pesquisa input')
	.addEventListener('keyup', filterPokemon);
