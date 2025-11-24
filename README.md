# Battleship - Hundir la Flota 🚢

Un juego de Battleship (Hundir la Flota) implementado en JavaScript puro con lógica de juego completamente testeada con Jest.

## Características

- ✅ **Tableros 10x10**: Representación completa del juego clásico
- ✅ **Barcos de diferentes tamaños**: 1 crucero (4), 2 destructores (3), 3 fragatas (2), 4 corbetas (1)
- ✅ **Colocación de barcos**: Automática o manual (flexible para expansiones)
- ✅ **Sistema de turnos**: Jugador humano vs Computadora con IA
- ✅ **Ataques interactivos**: Clica en el tablero enemigo para disparar
- ✅ **Seguimiento de hits/misses**: Visualización clara de impactos y agua
- ✅ **Condición de victoria**: El juego termina cuando todos los barcos de un jugador están hundidos
- ✅ **Tests Jest**: 10+ tests unitarios para lógica de juego (Ship, Gameboard, Player, GameManager)
- ✅ **Interfaz web**: HTML/CSS responsivo para jugar en navegador

## Requisitos cumplidos (Odin Project Battleship)

- [x] Ship class con métodos `hit()` e `isSunk()`
- [x] Gameboard class con `placeShip()`, `receiveAttack()`, `allShipsSunk()`
- [x] Player class (human y computer)
- [x] GameManager para control de turnos y flujo del juego
- [x] UIManager para renderizado de tableros
- [x] Colocación automática de barcos
- [x] Turnos alternos (jugador → computadora)
- [x] Computadora juega aleatoriamente sin repetir movimientos
- [x] Condición de fin de juego
- [x] Interfaz HTML/CSS/JS funcional
- [x] Tests Jest completos

## Estructura del Proyecto

```
Battleship/
├── src/
│   ├── Ship.js           # Factory para barcos
│   ├── Gameboard.js      # Factory para tableros
│   ├── Player.js         # Factory para jugadores
│   ├── GameManager.js    # Gestor de turnos y flujo
│   ├── UIManager.js      # Gestor de renderizado UI
│   ├── ShipPlacer.js     # Colocación de barcos
│   └── index.js          # Exportador principal
├── tests/
│   ├── ship.test.js      # Tests para Ship
│   ├── gameboard.test.js # Tests para Gameboard
│   └── player.test.js    # Tests para Player
├── public/
│   ├── index.html        # Página principal
│   ├── style.css         # Estilos
│   └── app.js            # Controlador UI
├── package.json
├── .gitignore
└── README.md
```

## Instalación

1. Clona o descarga el repositorio:
```bash
git clone git@github.com:javiermondine/Battleship.git
cd Battleship
```

2. Instala dependencias:
```bash
npm install
```

## Uso

### Ejecutar Tests

Para verificar que toda la lógica funciona correctamente:

```bash
npm test
```

Resultado esperado:
```
Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
```

### Jugar en el Navegador

1. Abre `public/index.html` en un navegador web
2. Haz clic en "Colocar Barcos Aleatoriamente"
3. Haz clic en "Comenzar Juego"
4. Clica en el tablero enemigo (derecha) para atacar
5. La computadora responde automáticamente
6. El juego termina cuando todos los barcos de alguien están hundidos

### Jugar desde Node.js

```bash
node -e "
const { createPlayer, createGameManager } = require('./src/index.js');
const player = createPlayer('human');
const computer = createPlayer('computer');

// Auto-place ships
const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
sizes.forEach(size => {
  let placed = false;
  for (let i = 0; i < 100 && !placed; i++) {
    const dir = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const x = Math.floor(Math.random() * (dir === 'h' ? 6 : 10));
    const y = Math.floor(Math.random() * (dir === 'v' ? 6 : 10));
    try {
      player.gameboard.placeShip(x, y, size, dir);
      computer.gameboard.placeShip(x, y, size, dir);
      placed = true;
    } catch {}
  }
});

console.log('Juego listo para jugar');
console.log('Tableros inicializados con 10 barcos cada uno');
"
```

## Lógica del Juego

### Ship (Barco)

```javascript
const ship = createShip(3); // Barco de 3 posiciones
ship.hit();               // Incrementa contador de impactos
ship.hits();              // → 1
ship.isSunk();            // → false (necesita 3 impactos)
```

### Gameboard (Tablero)

```javascript
const gb = createGameboard(10);
gb.placeShip(0, 0, 3, 'horizontal'); // Coloca barco en (0,0) horizontal, tamaño 3
gb.receiveAttack(0, 0);              // { hit: true, shipId: 0 }
gb.receiveAttack(5, 5);              // { hit: false } (agua)
gb.getMissedShots();                 // [{ x: 5, y: 5 }]
gb.allShipsSunk();                   // false (si quedan barcos intactos)
```

### Player (Jugador)

```javascript
const player = createPlayer('human');
const cpu = createPlayer('computer');

player.makeMove(3, 4);   // Registra movimiento
cpu.playComputerMove();  // Genera movimiento aleatorio y lo registra
```

### GameManager (Gestor)

```javascript
const gm = createGameManager();
gm.initGame(player, computer);
gm.playerAttack(5, 5);    // Ataque del jugador
gm.computerAttack();      // Ataque de la computadora
gm.isGameOver();          // → false
gm.getWinner();           // → null (hasta que haya ganador)
```

## UI - Interfaz de Juego

### Pantalla de Preparación
- Botón para colocar barcos aleatoriamente
- Botón para comenzar el juego
- Botón para nueva partida

### Pantalla de Juego
- **Tablero Izquierdo**: Tu tablero (muestra tus barcos)
  - Azul: Barco intacto (■)
  - Rojo: Barco impactado (✕)
  - Gris: Disparo recibido (○)

- **Tablero Derecho**: Tablero enemigo (clicable)
  - Haz clic en cualquier celda para atacar
  - Rojo: Impacto en barco enemigo (✕)
  - Gris: Agua disparada (○)

### Información de Estado
- Turno actual
- Contador de barcos hundidos (enemigo / tuyo)

## Tests

Los tests cubren:

### Ship Tests
- ✓ Creación de barco con longitud correcta
- ✓ Incremento de impactos
- ✓ Cálculo de hundimiento
- ✓ Validación de entrada inválida

### Gameboard Tests
- ✓ Colocación de barcos
- ✓ Detección de solapamientos
- ✓ Registro de impactos y disparos fallidos
- ✓ Cálculo de victoria (todos hundidos)

### Player Tests
- ✓ Creación de jugador (human/computer)
- ✓ Movimientos de computadora sin repetición
- ✓ Validación de movimientos repetidos

Ejecutar tests con cobertura:
```bash
npm test -- --coverage
```

## Mejoras Futuras (Extra Credit)

- [ ] Drag & Drop para colocar barcos manualmente en la UI
- [ ] Modo 2 jugadores (pasar laptop)
- [ ] IA mejorada (intentar adyacentes tras impacto)
- [ ] Guardado de juego (LocalStorage)
- [ ] Diferentes niveles de dificultad
- [ ] Animaciones y efectos visuales
- [ ] Sonidos de juego

## Tecnologías

- **JavaScript** (ES6+, CommonJS)
- **Jest** (Testing framework)
- **HTML5** + **CSS3** (UI)
- **Node.js** (Runtime)

## Notas de Implementación

- **CommonJS**: Se usó CommonJS en lugar de ESM para compatibilidad directa con Jest sin necesidad de Babel
- **Factories**: Se usó patrón factory en lugar de clases para mayor flexibilidad
- **Validación**: Todos los inputs se validan y lanzan errores descriptivos
- **Separation of Concerns**: Lógica de juego separada de lógica de UI
- **No Dependencies**: Cero dependencias de producción (solo Jest en dev)

## Autor

Implementado siguiendo las instrucciones de The Odin Project - JavaScript Path - Battleship

## Licencia

MIT
