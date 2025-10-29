const fs = require('fs');

// Leer los archivos JSON
const conciertos = JSON.parse(fs.readFileSync('./ticketmaster.conciertos.json', 'utf8'));
const generos = JSON.parse(fs.readFileSync('./ticketmaster.generos.json', 'utf8'));

// Funciones para generar datos aleatorios
const generateState = () => {
  const states = ['active', 'inactive', 'pending', 'cancelled', 'completed'];
  return states[Math.floor(Math.random() * states.length)];
};

const generateIsActive = () => {
  return Math.random() > 0.1; // 90% de probabilidad de estar activos
};

// Actualizar conciertos
const updatedConciertos = conciertos.map(concierto => {
  const fecha = new Date(concierto.fecha);
  const now = new Date();
  
  // Determinar el estado basado en la fecha
  let state = 'active';
  if (fecha < now) {
    state = 'completed';
  } else if (fecha > new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
    state = 'pending';
  }
  
  return {
    ...concierto,
    state: state,
    is_active: state !== 'cancelled'
  };
});

// Actualizar géneros
const updatedGeneros = generos.map(genero => {
  return {
    ...genero,
    state: generateState(),
    is_active: generateIsActive()
  };
});

// Escribir los archivos actualizados
fs.writeFileSync('./ticketmaster.conciertos.json', JSON.stringify(updatedConciertos, null, 2));
fs.writeFileSync('./ticketmaster.generos.json', JSON.stringify(updatedGeneros, null, 2));

console.log('✅ Datos actualizados correctamente');
console.log(`📊 Conciertos actualizados: ${updatedConciertos.length}`);
console.log(`🎵 Géneros actualizados: ${updatedGeneros.length}`);
