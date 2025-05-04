import React, { useState, useEffect } from 'react';

function Home() {
  const [pokemon, setPokemon] = useState(null);
  const [collection, setCollection] = useState(() => JSON.parse(localStorage.getItem('collection')) || []);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [currentBall, setCurrentBall] = useState(null);
  const [catchStep, setCatchStep] = useState(null);

  const findPokemon = async () => {
    setPokemon(null);
    try {
      const res = await fetch('/api/random-pokemon');
      const data = await res.json();
      if (!data.error) setPokemon(data);
    } catch {
      alert("Не удалось получить покемона.");
    }
  };

  const handleCatchClick = () => {
    const pokeballs = [
      { name: 'Обычный Покебол', chance: 0.6, image: '/pokeballs/pokeball.png' },
      { name: 'Супер Покебол', chance: 0.8, image: '/pokeballs/superball.png' },
      { name: 'Ультра Покебол', chance: 0.95, image: '/pokeballs/ultraball.png' },
    ];
    const chosenBall = pokeballs[Math.floor(Math.random() * pokeballs.length)];
    setCurrentBall(chosenBall);
    setCatchStep('showBall');
  };

  const attemptCatch = () => {
    if (!pokemon || !currentBall) return;

    const isCaught = Math.random() < currentBall.chance;

    if (isCaught) {
      const power =
        10 +
        Math.floor(pokemon.base_experience / 10) +
        (pokemon.abilities?.length || 0) * 2 +
        (pokemon.types?.length || 0) * 3;

      const newPokemon = { ...pokemon, power };
      const caught = [...collection, newPokemon];
      setCollection(caught);
      localStorage.setItem('collection', JSON.stringify(caught));
      const audio = new Audio('/sounds/06-caught-a-pokemon.mp3');
      audio.play();
      alert(`${pokemon.name} пойман с помощью ${currentBall.name}! Сила: ${power}`);
    } else {
      alert(`${pokemon.name} сбежал! ${currentBall.name} не сработал.`);
    }

    setPokemon(null);
    setCurrentBall(null);
    setCatchStep(null);
  };

  useEffect(() => {
    if (!pokemon) return;
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10;
      const left = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${top}%`, left: `${left}%` });
    }, 1000);
    return () => clearInterval(interval);
  }, [pokemon]);

  return (
    <main>
      <div className='main'>
        <h1>Поймай Покемона</h1>
        <button onClick={findPokemon}>Найти Покемона</button>

        {pokemon && (
          <div className='pokemon'>
            <h2 id='name'>{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />

            {catchStep === null && (
              <button
                onClick={handleCatchClick}
                className="moving-button"
                style={{
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                Поймать
              </button>
            )}

            {catchStep === 'showBall' && currentBall && (
              <div className="pokeball-display">
                <p>Вы получили: {currentBall.name}</p>
                <img src={currentBall.image} alt={currentBall.name} />
                <button onClick={attemptCatch}>Попробовать поймать</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
