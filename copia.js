//Variables lógicas
var tamanoTablero = 0;
var tableroLogico = [];
var celdaActiva = "0-0";
var jugadorActual = 1;
var fichasRestantes1 = 0;
var fichasRestantes2 = 0;
var partidaFinalizada = false; 

//Variables de interfaz
// var contenedor1 = document.getElementById("fichas1");
var contenedor1 = $("fichas1");
// var contenedor2 = document.getElementById("fichas2");
var contenedor2 = $("fichas2");
var tablero = document.getElementById("tablero");
var mensaje = document.getElementById("estado");


document.onkeydown = function(e){
	pulsarTecla(e.keyCode);
}

//Comenzamos el juego según la elección del usuario en el primer menú
function iniciar(){
	
	//Obtener el input del tamaño de tablero
	var input = document.getElementById("numeroCasillas");
	tamanoTablero = parseInt(input.value);
	

	//Validar que es un tamaño correcto
	if(tamanoTablero < 3 || tamanoTablero > 6){
		var mensaje = document.getElementById("mensajeError");
		mensaje.innerHTML = "El tamaño no es correcto";
		mensaje.style.display = "block";
	}
	else{
		var modal = document.getElementById("fondoModal");
		modal.style.display = "none";
		crearTablero();
	}

}


//Función que inicia el tablero y los contadores
function crearTablero(){
	//Inicializar variables
	tableroLogico = [];
	celdaActiva = "0-0";
	jugadorActual = 1;
	fichasRestantes1 = tamanoTablero;
	fichasRestantes2 = tamanoTablero;
	partidaFinalizada = false; 

	mensaje.innerHTML = "Turno del jugador 1";


	/////////////Establecer el alto fijo de los contenedores
	//110 x ficha + 57
	var altura = 110 * tamanoTablero + 57;
	// contenedor1.style.height = altura + "px";
	$(contenedor1).css("height",altura + "px");
	// contenedor2.style.height = altura + "px";
	$(contenedor2).css("height",altura + "px");

	////////////Recargar contenedores de fichas
	for (var i = 0; i < tamanoTablero; i++) {
		var ficha1 = document.createElement("DIV");
		var ficha2 = document.createElement("DIV");
		contenedor1.appendChild(ficha1);
		// $(contenedor1).append(ficha1);
		contenedor2.appendChild(ficha2);
		// $(contenedor2).append(ficha2);
	}

	//Añadir la clase correspondiente al número de columnas
	switch(tamanoTablero){
		case 3:
			tablero.classList.add("tresColumnas");
			break;
		case 4:
			tablero.classList.add("cuatroColumnas");
			break;
		case 5:
			tablero.classList.add("cincoColumnas");
			break;
		case 6:
			tablero.classList.add("seisColumnas");
			break;
	}


	//Rellenamos el tablero lógico y el visual
	for (var i = 0; i < tamanoTablero; i++) { //filas
		tableroLogico[i] = [];
		for (var j = 0; j < tamanoTablero; j++) { //columnas
			//Se añaden los divs que harán de celdas, con sus respectivos eventos
			var celda = document.createElement("DIV");
			celda.id = i+"-"+j;
			celda.classList.add("celda");
			celda.onmouseenter = function(e){
				cambiarCeldaSeleccionada(e.target.id);
			};
			celda.onclick = function(e){
				colocarFicha();
			};
			tablero.appendChild(celda);
			tableroLogico[i][j] = 0;
		}
	}
}

//Función para registrar las pulsaciones de las teclas
function pulsarTecla(codigo){
	var nuevaPosicion = 0;

	//obtenermos los índices actuales
	var indices = celdaActiva.split("-");
	var x = indices[0];
	var y = indices[1];

	switch(codigo){
		case 37: //izquierda
			//restamos columna
			if(y>0)
				y--;
			break;
		case 38: //arriba
			if(x>0)
				x--;
			break;
		case 39: //derecha
			if(y<tamanoTablero-1)
				y++;
			break;
		case 40: //abajo
			if(x<tamanoTablero-1)
				x++;
			break;
		case 13: //intro
			colocarFicha();
			break;
		case 32: //espacio
			colocarFicha();
			break;
	}

	cambiarCeldaSeleccionada(x+"-"+y);
}

//Función para cambiar la celda actualmente seleccionada
function cambiarCeldaSeleccionada(id){
	//Quitar la selección a la actualmente seleccionada
	var celdaAnterior = document.getElementById(celdaActiva);
	if(celdaAnterior)
		celdaAnterior.classList.remove("seleccionada");
	//Añadir la selección en la nueva
	celdaActiva = id;
	var celdaActual =  document.getElementById(id);
	celdaActual.classList.add("seleccionada");
}

//Función para colocar fichas en la celda actualmente seleccionada
function colocarFicha(){
	if(!partidaFinalizada){
		//obtenermos los índices actuales
		var indices = celdaActiva.split("-");
		var x = indices[0];
		var y = indices[1];

		//Ver qué hay en la posición actual
		var valor = tableroLogico[x][y];

		var colocarFicha = false;

		//Verificar que la casilla esté libre
		if(valor == 0){
		 	//Comprobar que quedan fichas por poner
		 	if((jugadorActual == 1 && fichasRestantes1>0) || (jugadorActual == 2 && fichasRestantes2>0)){
		 		colocarFicha = true;
		 	}else{
		 		mensaje.innerHTML = "No quedan fichas";
		 	}
		}
		//Si la casilla no está libre
		else{
		 	//Comprobar que la ficha es nuestra
		 	if((jugadorActual == valor) ){
			 	//Que aún queden fichas
			 	if((jugadorActual == 1 && fichasRestantes1 > 0) || (jugadorActual == 2 && fichasRestantes2 > 0) ){
			 		mensaje.innerHTML = "Aún quedan fichas por colocar";
			 	}
			 	//Si no nos quedan fichas
			 	else{
		 			//Cargar ficha en el contedor del jugador activo
		 			var ficha = document.createElement("DIV");
			 		if(jugadorActual == 1){
			 			fichasRestantes1++;
			 			contenedor1.appendChild(ficha);
			 		}else{
			 			fichasRestantes2++;
			 			contenedor2.appendChild(ficha);
			 		}
			 		//Borrar ficha del tablero
			 		var celda = document.getElementById(x+"-"+y);
			 		celda.classList.remove("jugador1");
			 		celda.classList.remove("jugador2");
			 		tableroLogico[x][y] = 0;
			 	}

			}else{
				mensaje.innerHTML = "Casilla ocupada";
			}

		}


		 ///////////////////Cuando colocamos ficha, restar una de la reserva del jugador actual, y colocarla en el tablero
		 if(colocarFicha){
		 	restarFicha(jugadorActual);
		 	tableroLogico[x][y] = jugadorActual;
		 	var celda = document.getElementById(x+"-"+y);
		 	if(jugadorActual == 1)
		 		celda.classList.add("jugador1");
		 	else
		 		celda.classList.add("jugador2");

		 	comprobarVictoria();
		}
	}

}

//////////////Función para restar fichas de la reserva
function restarFicha(jugador){
	if(jugadorActual == 1){
		fichasRestantes1--;
		// contenedor1.lastChild.remove();
		$(contenedor1).remove();
	}
	else{
		fichasRestantes2--;
		// contenedor2.lastChild.remove();
		$(contenedor2).remove();
	}
}


//Función para comprobar la victoria
function comprobarVictoria(){

	//Primero comprobamos que al jugador no le quedan fichas
	var contador = 0;
	if((jugadorActual == 1 && fichasRestantes1 == 0) || (jugadorActual == 2 && fichasRestantes2 == 0)){
		var seguir = true;
		//Comprobar las filas
		for (var i = 0; i < tamanoTablero && contador < tamanoTablero; i++) { //Recorre las diferentes filas
			contador = 0;
			seguir = true;

			for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada fila
				if(tableroLogico[i][j] == jugadorActual)
					contador++;
				else{
					seguir = false;
				}
			}
		}
		//Comprobar las columnas
		if(contador != tamanoTablero){
			for (var i = 0; i < tamanoTablero && contador < tamanoTablero; i++) { //Recorre las diferentes columnas
				contador = 0;
				seguir = true;

				for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada columna
					if(tableroLogico[j][i] == jugadorActual)
						contador++;
					else{
						seguir = false;
					}
				}
			}
			//Comprobar la diagonal 1
			if(contador != tamanoTablero){
				contador = 0;
				seguir = true;
				for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada columna
					if(tableroLogico[j][j] == jugadorActual)
						contador++;
					else{
						seguir = false;
					}
				}
				//Comprobar la diagonal 2
				if(contador != tamanoTablero){
					contador = 0;
					seguir = true;
					var j = tamanoTablero-1;	
					for (var i = 0; i < tamanoTablero && contador < tamanoTablero && seguir; i++) { //Recorre las casillas de cada columna
						if(tableroLogico[i][j-i] == jugadorActual)
							contador++;
						else{
							seguir = false;
						}
					}
				}
			}
		}
	}
	if(contador == tamanoTablero){
		mensaje.innerHTML = "¡El jugador "+jugadorActual+" ha ganado!";
		partidaFinalizada = true;
		var btnRepetir = document.getElementById("repetir");
		btnRepetir.style.display = "inline";
	}else{
		//Cambio de jugador
		if(jugadorActual == 1)
	 		jugadorActual = 2;
	 	else
	 		jugadorActual = 1;

	 	mensaje.innerHTML = "Turno del jugador "+jugadorActual;		
	}

}

function reiniciar(){
	location.reload();
}

//Comienza una nueva partida con el mismo tablero
function nuevaPartida(){
	tablero.innerHTML = "";
	contenedor1.innerHTML = "";
	var p = document.createElement("P");
	p.innerHTML = "Fichas jugador 1";
	contenedor1.appendChild(p);
	contenedor2.innerHTML = "";
	p = document.createElement("P");
	p.innerHTML = "Fichas jugador 2";
	contenedor2.appendChild(p);
	crearTablero();
}