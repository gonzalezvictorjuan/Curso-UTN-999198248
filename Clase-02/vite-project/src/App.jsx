import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import TarjetaUsuario from './TarjetaUsuario';
import Saludo from './Saludo';
import { useEffect, useState } from 'react';

function App() {
  const usuario = {
    nombre: 'María',
    email: 'maria@example.com',
  };

  const [contador, setContador] = useState(0);

  const mouseOver = () => {
    console.log('pepe');
  };

  const incrementar = () => {
    setContador(contador + 1);
    // console.log(contador);
  };

  const decrementar = () => {
    setContador(contador - 1);
    // console.log(contador);
  };

  const resetear = () => {
    setContador(0);
  };

  useEffect(() => {
    console.log(contador);
  }, [contador]);

  useEffect(() => {
    console.log('hola');
  }, []);

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Saludo />
      <TarjetaUsuario
        nombre={usuario.nombre}
        email={usuario.email}
        mostrarEmail={false}
      >
        <Saludo />
        <Saludo />
        <h2>pepito</h2>
      </TarjetaUsuario>

      <div className='contador'>
        <p onMouseOver={mouseOver}>Contador: {contador}</p>
        <button onClick={incrementar}>+</button>
        <button onClick={decrementar}>-</button>
        <button onClick={resetear}>Reset</button>
      </div>
    </>
  );
}

export default App;
