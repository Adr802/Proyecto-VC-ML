



var markedCells = []; // Array para almacenar los IDs de las celdas marcadas
var currentPlayer = null; // Variable para almacenar el jugador actual
var csvData = null;

addEventListener("DOMContentLoaded", (event) => {
    fetch('http://localhost:3000/getCSV')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            csvData = data;
            console.log("Datos del CSV:", csvData['data']);
            createTable();
        })
        .catch(error => {
            console.error('Error al cargar el CSV:', error);
        });
});

function createTable() {
    const board = document.getElementById('content');
    const size = 5;

    // Crear el tablero
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${row}-${col}`;
            cell.dataset.value = ''; // Inicializa el atributo dataset
            cell.addEventListener('click', () => markCell(cell));
            board.appendChild(cell);
        }
    }
    loadTable()
}

function markCell(cell) {
    const cellId = cell.id;
    const isFirstMark = markedCells.length === 0;
    const isSecondMark = markedCells.length === 1;

    if (isFirstMark) {
        // Si es la primera celda marcada
        if (cell.dataset.value === '0') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se puede marcar una celda vacía como la primera",
            });
            return;
        }
        cell.classList.add('marked');
        markedCells.push(cellId);
    } else if (isSecondMark) {
        // Si es la segunda celda marcada
        cell.classList.add('marked');
        markedCells.push(cellId);
    } else {
        // Si ya hay dos celdas marcadas
        // Eliminar la segunda celda marcada
        const secondMarkedCellId = markedCells[1]; // Obtener el ID de la segunda celda marcada
        const secondMarkedCell = document.getElementById(secondMarkedCellId);
        if (secondMarkedCell) {
            secondMarkedCell.classList.remove('marked');
        }

        // Marcar la nueva celda y agregar el nuevo ID al array
        cell.classList.add('marked');
        markedCells[1] = cellId; // Reemplazar la segunda celda en el array
    }

    // Actualizar el jugador basado en la primera celda marcada
    if (markedCells.length > 0) {
        const firstMarkedCellId = markedCells[0];
        const firstMarkedCell = document.getElementById(firstMarkedCellId);
        if (firstMarkedCell) {
            currentPlayer = firstMarkedCell.dataset.value === '2' ? 2 : 1;
        }
    }


}

function loadTable() {
    imgRandom = Math.floor(Math.random() * csvData['data'].length)
    jugada = csvData['data'][imgRandom]
    const tablero = Object.values(jugada).filter(value => typeof value === 'number');
    //console.log(tablero)

    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.classList.remove('marked');
    });

    markedCells = [];

    // Asignar valores a cada celda
    cells.forEach((cell, index) => {
        const value = tablero[index];
        cell.textContent = value === 2 ? 'X' : value === 1 ? 'O' : ''; 
        cell.dataset.value = value; 
    });
}

function validateMove() {
    const cells = document.querySelectorAll('.cell');
    // Generar el estado del tablero solo con valores numéricos
    const boardState = Array.from(cells).map(cell => parseInt(cell.dataset.value, 10));

    // Inicializar el array de movimientos
    const moves = [];

    if (markedCells.length < 2) {
        Swal.fire({
            title: "Error",
            text: "Debe seleccionar dos fichas para validar la jugada.",
            icon: "error"
        });
        return;
    }

    const [currentId, moveId] = markedCells;
    const [currentX, currentY] = currentId.split('-').map(Number);
    const [moveX, moveY] = moveId.split('-').map(Number);

    // Llenar el array de movimientos con las posiciones y el jugador
    moves.push(currentX, currentY, moveX, moveY, currentPlayer);

    // Añadir los movimientos al estado del tablero
    moves.forEach((value) => {
        boardState.push(value);
    });

    console.log(JSON.stringify(boardState))

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(boardState)
    };

    fetch('http://127.0.0.1:5000/predict', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            if (responseData == 0) {
                Swal.fire({
                    title: "Jugada Inválida",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Jugada Válida",
                    icon: "success"
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function cleanMarked() {
    const cells = document.querySelectorAll('.cell');

    // Limpiar celdas marcadas
    cells.forEach(cell => {
        cell.classList.remove('marked');
    });

    markedCells = [];

}