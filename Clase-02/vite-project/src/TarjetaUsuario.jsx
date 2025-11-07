// Componente hijo que recibe props
function TarjetaUsuario({ nombre, email, mostrarEmail, children }) {
  return (
    <div className='tarjeta'>
      <h3>{nombre}</h3>
      {mostrarEmail && <p>{email}</p>}
      {children && children}
    </div>
  );
}

// Exportar componente
export default TarjetaUsuario;
