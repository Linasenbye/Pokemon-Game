import React, { useState } from 'react';

function Collection() {
  const [collection, setCollection] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('collection')) || [];
    return saved.map(p => ({ ...p, power: p.power || 10 }));
  });
  const [enemy, setEnemy] = useState(null);

  const releasePokemon = (index) => {
    if (!window.confirm("Вы точно хотите отпустить покемона?")) return;
    const updated = [...collection];
    updated.splice(index, 1);
    setCollection(updated);
    localStorage.setItem('collection', JSON.stringify(updated));
  };

  const trainPokemon = (index) => {
    const updated = [...collection];
    const gain = Math.max(1, Math.floor(5 * Math.log(updated[index].power)));
    updated[index].power += gain;
    setCollection(updated);
    localStorage.setItem('collection', JSON.stringify(updated));
    alert(`${updated[index].name} натренирован! +${gain} силы.`);
  };

  const startBattle = async (index) => {
    const res = await fetch('/api/random-pokemon');
    const data = await res.json();

    const enemyPower =
      10 +
      Math.floor(data.base_experience / 10) +
      (data.abilities?.length || 0) * 2 +
      (data.types?.length || 0) * 3 +
      Math.floor(Math.random() * 10);

    const myPower = collection[index].power + Math.floor(Math.random() * 5);
    setEnemy({ ...data, power: enemyPower });

    const result = myPower >= enemyPower ? 'победили' : 'проиграли';
    alert(`Вы ${result} ${data.name}! (${myPower} против ${enemyPower})`);
  };

  return (
    <div className='main'>
      <h1>Пойманные Покемоны</h1>
      <div className="collection">
        {collection.length === 0 ? (
          <p>У вас пока нет покемонов.</p>
        ) : (
          <div className="pokemon-grid">
            {collection.map((p, i) => (
              <div key={i} className="myPokemon">
                <img src={p.sprites.front_default} alt={p.name} />
                <div id='name'>{p.name}</div>
                <p id='power'>Сила: {p.power}</p>
                <div className="action-buttons">
                  <button className='colBut release' onClick={() => releasePokemon(i)}>Отпустить</button>
                  <div className="bottom-buttons">
                    <button className='colBut' onClick={() => trainPokemon(i)}>Тренировать</button>
                    <button className='colBut' onClick={() => startBattle(i)}>Сразиться</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {enemy && (
        <div style={{ marginTop: 20 }}>
          <h3>Враг: {enemy.name}</h3>
          <img src={enemy.sprites.front_default} alt={enemy.name} />
          <p>Сила врага: {enemy.power}</p>
        </div>
      )}
    </div>
  );
}

export default Collection;
