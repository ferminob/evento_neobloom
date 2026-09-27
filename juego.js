// ==========================================================
// EVENTO NEOBLOOM
// ==========================================================

// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const W = 640;
const H = 480;

const GAME_TIME = 60;

const SPRITE_SIZE = 64;
const GUANTE_SIZE = 64;

const GUANTE_OFFSET_X = 22;
const GUANTE_OFFSET_Y = 22;

// Tiempo que permanece encendida una luz
const TIEMPO_LUZ = 660;

// Tiempo entre una luz y la siguiente
const INTERVALO_LUZ = 2000;

// Tiempo durante el cual aparece la predicción
// antes de que se encienda la próxima luz.
const TIEMPO_PREDICCION = 1500;


// ==========================================================
// SPRITES
// ==========================================================

let hoja;
let luzApagada;
let luzPrendida;
let guante;


// ==========================================================
// CANVAS
// ==========================================================

let canvasJuego;


// ==========================================================
// ESTADO
// ==========================================================

let gameState = "MENU";

// MENU
// PLAYING
// GAME_OVER


// ==========================================================
// DATOS DEL JUEGO
// ==========================================================

let hojas = [];

let score = 0;

let tiempoInicio = 0;

let tiempoRestante = GAME_TIME;


// ==========================================================
// SISTEMA DE LUCES
// ==========================================================

// Índice de la hoja que tiene la luz encendida.
// -1 significa que no hay ninguna.

let hojaActiva = -1;


// Índice de la hoja que se va a encender
// próximamente.
// -1 significa que no hay predicción.

let hojaPredicha = -1;


// Momento en el que debe ocurrir el próximo cambio.

let proximaLuz = 0;


// ==========================================================
// SISTEMA DE ESPORAS
// ==========================================================

// Esporas ambientales que flotan por toda la pantalla.

let esporas = [];

const CANTIDAD_ESPORAS = 2000;


// Esporas que forman el remolino
// alrededor de la hoja predicha.

let esporasRemolino = [];

const CANTIDAD_REMOLINO = 28;


// ==========================================================
// CARGAR SPRITES
// ==========================================================

function preload() {

  hoja = loadImage(
    "assets/hoja.png"
  );

  luzApagada = loadImage(
    "assets/luz_apagada.png"
  );

  luzPrendida = loadImage(
    "assets/luz_prendida.png"
  );

  guante = loadImage(
    "assets/guante.png"
  );

}


// ==========================================================
// SETUP
// ==========================================================

function setup() {

  canvasJuego = createCanvas(
    W,
    H
  );

  canvasJuego.parent("juego");

  imageMode(CENTER);

  textFont("Arial");

  crearHojas();

  crearEsporas();

  crearEsporasRemolino();

}


// ==========================================================
// CREAR HOJAS
// ==========================================================

function crearHojas() {

  hojas = [];

  const columnas = [
    100,
    245,
    395,
    540
  ];

  const filas = [
    130,
    250,
    370
  ];

  for (let y of filas) {

    for (let x of columnas) {

      hojas.push({

        // Posición de la hoja
        x: x,
        y: y + 32,

        // Posición de la luz
        lightX: x,
        lightY: y - 32,

        // Estado de la luz
        activa: false

      });

    }

  }

}


// ==========================================================
// CREAR ESPORAS AMBIENTALES
// ==========================================================

function crearEsporas() {

  esporas = [];

  for (
    let i = 0;
    i < CANTIDAD_ESPORAS;
    i++
  ) {

    esporas.push({

      x: random(W),

      y: random(H),

      vx: random(-0.18, 0.18),

      vy: random(-0.12, 0.12),

      tamano: random(1.5, 3.5),

      alfa: random(35, 105),

      fase: random(TWO_PI),

      velocidad: random(0.01, 0.025)

    });

  }

}


// ==========================================================
// CREAR ESPORAS DEL REMOLINO
// ==========================================================

function crearEsporasRemolino() {

  esporasRemolino = [];

  for (
    let i = 0;
    i < CANTIDAD_REMOLINO;
    i++
  ) {

    esporasRemolino.push({

      angulo: random(TWO_PI),

      radio: random(34, 72),

      velocidad: random(0.015, 0.035),

      tamano: random(1.5, 3.5),

      alfa: random(45, 105),

      fase: random(TWO_PI)

    });

  }

}


// ==========================================================
// DRAW
// ==========================================================

function draw() {

  actualizarCursor();

  // Fondo
  background(
    225
  );


  // ========================================================
  // MENÚ
  // ========================================================

  if (
    gameState === "MENU"
  ) {

    dibujarMenu();

  }


  // ========================================================
  // JUGANDO
  // ========================================================

  else if (
    gameState === "PLAYING"
  ) {

    actualizarJuego();

    dibujarJuego();

    dibujarGuante();

  }


  // ========================================================
  // GAME OVER
  // ========================================================

  else if (
    gameState === "GAME_OVER"
  ) {

    dibujarJuego();

    dibujarGameOver();

  }

}


// ==========================================================
// CURSOR
// ==========================================================

function actualizarCursor() {

  if (!canvasJuego) {

    return;

  }

  if (
    gameState === "PLAYING"
  ) {

    canvasJuego.elt.style.cursor =
      "none";

  }

  else {

    canvasJuego.elt.style.cursor =
      "default";

  }

}


// ==========================================================
// MENÚ
// ==========================================================

function dibujarMenu() {

  fill(40);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(42);

  text(
    "SINCRONÍA",
    W / 2,
    145
  );


  // Descripción

  fill(80);

  textSize(16);

  text(
    "Hacé click en las hojas cuando se encienda la luz",
    W / 2,
    200
  );


  // Botón

  dibujarBoton(
    W / 2,
    290,
    180,
    60,
    "JUGAR"
  );

}


// ==========================================================
// BOTÓN
// ==========================================================

function dibujarBoton(
  x,
  y,
  ancho,
  alto,
  texto
) {

  let sobreBoton =
    mouseX >= x - ancho / 2 &&
    mouseX <= x + ancho / 2 &&
    mouseY >= y - alto / 2 &&
    mouseY <= y + alto / 2;


  noStroke();


  if (sobreBoton) {

    fill(
      90,
      120,
      160
    );

  }

  else {

    fill(
      70,
      90,
      120
    );

  }


  rect(
    x - ancho / 2,
    y - alto / 2,
    ancho,
    alto,
    6
  );


  fill(255);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(18);

  text(
    texto,
    x,
    y
  );

}


// ==========================================================
// ACTUALIZAR JUEGO
// ==========================================================

function actualizarJuego() {

  // --------------------------------------------------------
  // TIEMPO TOTAL
  // --------------------------------------------------------

  let tiempoTranscurrido =
    (millis() - tiempoInicio) /
    1000;


  tiempoRestante =
    max(
      0,
      GAME_TIME -
      floor(tiempoTranscurrido)
    );


  // --------------------------------------------------------
  // TERMINAR PARTIDA
  // --------------------------------------------------------

  if (
    tiempoTranscurrido >=
    GAME_TIME
  ) {

    terminarJuego();

    return;

  }


  // --------------------------------------------------------
  // ESPORAS
  // --------------------------------------------------------

  actualizarEsporas();


  // --------------------------------------------------------
  // SISTEMA DE LUCES
  // --------------------------------------------------------

  // No hay ninguna luz activa
  if (
    hojaActiva === -1
  ) {

    if (
      millis() >= proximaLuz
    ) {

      activarLuzAleatoria();

    }

  }


  // Hay una luz activa
  else {

    if (
      millis() >= proximaLuz
    ) {

      // Apagar la luz
      hojas[hojaActiva].activa =
        false;


      // No hay luz activa
      hojaActiva =
        -1;


      // Limpiar cualquier predicción
      hojaPredicha =
        -1;


      // Esperar antes de elegir otra
      proximaLuz =
        millis() +
        INTERVALO_LUZ;


      // Elegir inmediatamente
      // cuál será la próxima hoja.
      prepararProximaLuz();

    }

  }


  // --------------------------------------------------------
  // ACTUALIZAR REMOLINO
  // --------------------------------------------------------

  actualizarRemolino();

}


// ==========================================================
// PREPARAR PRÓXIMA LUZ
// ==========================================================

function prepararProximaLuz() {

  let nuevaHoja;


  // Elegir una hoja al azar

  do {

    nuevaHoja =
      floor(
        random(
          hojas.length
        )
      );

  }

  while (
    (
      nuevaHoja === hojaActiva ||
      nuevaHoja === hojaPredicha
    ) &&
    hojas.length > 1
  );


  hojaPredicha =
    nuevaHoja;

}


// ==========================================================
// ACTIVAR LUZ ALEATORIA
// ==========================================================

function activarLuzAleatoria() {

  // Si todavía no existe una predicción,
  // crearla.

  if (
    hojaPredicha === -1
  ) {

    prepararProximaLuz();

  }


  // La predicción se convierte
  // en la hoja activa.

  hojaActiva =
    hojaPredicha;


  // Encenderla

  hojas[hojaActiva].activa =
    true;


  // Ya no hay predicción:
  // la pista desaparece al encenderse.

  hojaPredicha =
    -1;


  // Programar cuándo se apaga

  proximaLuz =
    millis() +
    TIEMPO_LUZ;

}


// ==========================================================
// ACTUALIZAR ESPORAS
// ==========================================================

function actualizarEsporas() {

  for (
    let e of esporas
  ) {

    // Movimiento suave

    e.x +=
      e.vx +
      sin(
        frameCount * e.velocidad +
        e.fase
      ) * 0.08;


    e.y +=
      e.vy +
      cos(
        frameCount * e.velocidad * 0.8 +
        e.fase
      ) * 0.06;


    // Si salen por los bordes,
    // reaparecen del otro lado.

    if (
      e.x < -5
    ) {

      e.x =
        W + 5;

    }

    if (
      e.x > W + 5
    ) {

      e.x =
        -5;

    }

    if (
      e.y < -5
    ) {

      e.y =
        H + 5;

    }

    if (
      e.y > H + 5
    ) {

      e.y =
        -5;

    }

  }

}


// ==========================================================
// ACTUALIZAR REMOLINO
// ==========================================================

function actualizarRemolino() {

  // No hay predicción

  if (
    hojaPredicha === -1
  ) {

    return;

  }


  // Momento en que empieza a aparecer
  // la predicción.

  let inicioPrediccion =
    proximaLuz -
    TIEMPO_PREDICCION;


  // Todavía no llegó el momento
  // de mostrarla.

  if (
    millis() <
    inicioPrediccion
  ) {

    return;

  }


  // Tiempo restante hasta la luz

  let tiempoRestantePrediccion =
    proximaLuz -
    millis();


  // Progreso de 0 a 1

  let progreso =
    1 -
    constrain(
      tiempoRestantePrediccion /
      TIEMPO_PREDICCION,
      0,
      1
    );


  for (
    let e of esporasRemolino
  ) {

    // Las esporas giran cada vez
    // más rápido cuando se acerca
    // el momento de la luz.

    e.angulo +=
      e.velocidad *
      (1 + progreso * 2);


    // El radio se va concentrando
    // ligeramente hacia la hoja.

    let radioObjetivo =
      lerp(
        e.radio,
        34,
        progreso * 0.035
      );

    e.radio =
      radioObjetivo;


    // Pequeña pulsación individual

    e.radio +=
      sin(
        frameCount * 0.035 +
        e.fase
      ) * 0.5;

  }

}


// ==========================================================
// DIBUJAR JUEGO
// ==========================================================

function dibujarJuego() {

  dibujarHUD();


  


  // --------------------------------------------------------
  // LUCES Y HOJAS
  // --------------------------------------------------------

  for (
    let h of hojas
  ) {


    // ------------------------------------------------------
    // LUZ
    // ------------------------------------------------------

    if (
      h.activa
    ) {

      image(
        luzPrendida,
        h.lightX,
        h.lightY,
        SPRITE_SIZE,
        SPRITE_SIZE
      );

    }

    else {

      image(
        luzApagada,
        h.lightX,
        h.lightY,
        SPRITE_SIZE,
        SPRITE_SIZE
      );

    }


    // ------------------------------------------------------
    // HOJA
    // ------------------------------------------------------

    image(
      hoja,
      h.x,
      h.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

  }
  // --------------------------------------------------------
  // ESPORAS AMBIENTALES
  // --------------------------------------------------------

  dibujarEsporas();

  // --------------------------------------------------------
  // REMOLINO DE PREDICCIÓN
  // --------------------------------------------------------

  dibujarRemolino();

}


// ==========================================================
// DIBUJAR ESPORAS
// ==========================================================

function dibujarEsporas() {

  noStroke();

  for (
    let e of esporas
  ) {

    fill(
      145,
      70,
      190,
      e.alfa
    );


    ellipse(
      e.x,
      e.y,
      e.tamano,
      e.tamano
    );

  }

}


// ==========================================================
// DIBUJAR REMOLINO
// ==========================================================

function dibujarRemolino() {

  if (
    hojaPredicha === -1
  ) {

    return;

  }


  // Momento en que comienza
  // a aparecer.

  let inicioPrediccion =
    proximaLuz -
    TIEMPO_PREDICCION;


  if (
    millis() <
    inicioPrediccion
  ) {

    return;

  }


  let objetivo =
    hojas[hojaPredicha];


  // Progreso de la predicción

  let progreso =
    1 -
    constrain(
      (
        proximaLuz -
        millis()
      ) /
      TIEMPO_PREDICCION,
      0,
      1
    );


  noStroke();


  for (
    let e of esporasRemolino
  ) {

    // Las esporas van cerrándose
    // alrededor de la hoja.

    let radio =
      e.radio -
      progreso * 5;


    // Movimiento orbital

    let x =
      objetivo.x +
      cos(e.angulo) *
      radio;


    let y =
      objetivo.y +
      sin(e.angulo) *
      radio;


    // Pequeña variación para que
    // no parezca un círculo perfecto.

    x +=
      sin(
        frameCount * 0.04 +
        e.fase
      ) * 2;


    y +=
      cos(
        frameCount * 0.035 +
        e.fase
      ) * 2;


    // La opacidad aumenta un poco
    // al acercarse la activación,
    // pero nunca llega a ser sólida.

    let alfa =
      lerp(
        35,
        e.alfa,
        progreso
      );


    fill(
      145,
      70,
      190,
      alfa
    );


    ellipse(
      x,
      y,
      e.tamano,
      e.tamano
    );

  }

}


// ==========================================================
// HUD
// ==========================================================

function dibujarHUD() {

  fill(40);

  noStroke();

  textSize(16);


  // SCORE

  textAlign(
    LEFT,
    CENTER
  );

  text(
    "SCORE: " +
    nf(score, 2),
    15,
    20
  );


  // TIEMPO

  textAlign(
    RIGHT,
    CENTER
  );

  text(
    "TIEMPO: " +
    tiempoRestante +
    " s",
    W - 15,
    20
  );

}


// ==========================================================
// GUANTE
// ==========================================================

function dibujarGuante() {

  image(
    guante,
    mouseX + GUANTE_OFFSET_X,
    mouseY + GUANTE_OFFSET_Y,
    GUANTE_SIZE,
    GUANTE_SIZE
  );

}


// ==========================================================
// TERMINAR JUEGO
// ==========================================================

function terminarJuego() {

  gameState =
    "GAME_OVER";


  hojaActiva =
    -1;


  hojaPredicha =
    -1;


  for (
    let h of hojas
  ) {

    h.activa =
      false;

  }

}


// ==========================================================
// GAME OVER
// ==========================================================

function dibujarGameOver() {

  // --------------------------------------------------------
  // CAPA
  // --------------------------------------------------------

  noStroke();

  fill(
    225,
    225,
    225,
    235
  );

  rect(
    0,
    0,
    W,
    H
  );


  // --------------------------------------------------------
  // FIN
  // --------------------------------------------------------

  fill(40);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(38);

  text(
    "FIN",
    W / 2,
    120
  );


  // --------------------------------------------------------
  // PUNTAJE
  // --------------------------------------------------------

  textSize(22);

  text(
    "PUNTAJE",
    W / 2,
    190
  );


  textSize(42);

  text(
    score,
    W / 2,
    240
  );


  // --------------------------------------------------------
  // BOTONES
  // --------------------------------------------------------

  dibujarBoton(
    W / 2,
    330,
    200,
    55,
    "VOLVER A JUGAR"
  );


  dibujarBoton(
    W / 2,
    400,
    200,
    55,
    "VOLVER AL MENÚ"
  );

}


// ==========================================================
// INICIAR JUEGO
// ==========================================================

function iniciarJuego() {

  score =
    0;


  tiempoRestante =
    GAME_TIME;


  tiempoInicio =
    millis();


  // No hay luz activa inicialmente

  hojaActiva =
    -1;


  // No hay predicción inicialmente

  hojaPredicha =
    -1;


  // Primera luz después del intervalo

  proximaLuz =
    millis() +
    INTERVALO_LUZ;

    prepararProximaLuz();


  // Apagar todas

  for (
    let h of hojas
  ) {

    h.activa =
      false;

  }


  // Reiniciar esporas

  crearEsporas();

  crearEsporasRemolino();


  gameState =
    "PLAYING";

}


// ==========================================================
// VOLVER AL MENÚ
// ==========================================================

function volverAlMenu() {

  hojaActiva =
    -1;


  hojaPredicha =
    -1;


  for (
    let h of hojas
  ) {

    h.activa =
      false;

  }


  gameState =
    "MENU";

}


// ==========================================================
// MOUSE
// ==========================================================

function mousePressed() {


  // ========================================================
  // MENÚ
  // ========================================================

  if (
    gameState === "MENU"
  ) {

    if (
      mouseX >= W / 2 - 90 &&
      mouseX <= W / 2 + 90 &&
      mouseY >= 260 &&
      mouseY <= 320
    ) {

      iniciarJuego();

    }

    return;

  }


  // ========================================================
  // JUGANDO
  // ========================================================

  if (
    gameState === "PLAYING"
  ) {

    for (
      let h of hojas
    ) {

      let distancia =
        dist(
          mouseX,
          mouseY,
          h.x,
          h.y
        );


      if (
        distancia < 32
      ) {


        // --------------------------------------------------
        // CLICK CORRECTO
        // --------------------------------------------------

        if (
          h.activa
        ) {

          score++;


          h.activa =
            false;


          hojaActiva =
            -1;


          hojaPredicha =
            -1;


          // Después del acierto,
          // esperar antes de la siguiente luz.

          proximaLuz =
            millis() +
            INTERVALO_LUZ;


          // Elegir inmediatamente
          // la próxima hoja que será predicha.

          prepararProximaLuz();

        }


        break;

      }

    }

    return;

  }


  // ========================================================
  // GAME OVER
  // ========================================================

  if (
    gameState === "GAME_OVER"
  ) {


    // ------------------------------------------------------
    // VOLVER A JUGAR
    // ------------------------------------------------------

    if (
      mouseX >= W / 2 - 100 &&
      mouseX <= W / 2 + 100 &&
      mouseY >= 302 &&
      mouseY <= 358
    ) {

      iniciarJuego();

      return;

    }


    // ------------------------------------------------------
    // VOLVER AL MENÚ
    // ------------------------------------------------------

    if (
      mouseX >= W / 2 - 100 &&
      mouseX <= W / 2 + 100 &&
      mouseY >= 372 &&
      mouseY <= 428
    ) {

      volverAlMenu();

      return;

    }

  }

}
