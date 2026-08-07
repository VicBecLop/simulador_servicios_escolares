/**
 * SIMULADOR DE ATENCIÓN EN SERVICIOS ESCOLARES
 * Arquitectura Vanilla JS Modular
 */

document.addEventListener('DOMContentLoaded', () => {
    SimuladorApp.init();
});

const SimuladorApp = {
    // Estado global del simulador
    state: {
        casos: [],
        retos: [],
        legislacion: [],
        casoActualIndex: 0,
        retoActualIndex: 0,
        retosDelCasoActual: [],
        puntuacion: 0,
        puntosPorReto: 100
    },

    // Inicialización del simulador
    async init() {
        await this.cargarDatos();
        this.cacheDOM();
        this.bindEvents();
    },

    // Referencias a elementos DOM
    cacheDOM() {
        this.dom = {
            screens: document.querySelectorAll('.screen'),
            headerStats: document.getElementById('header-stats'),
            scoreDisplay: document.getElementById('score-display'),
            progressBar: document.getElementById('progress-bar'),
            
            // Botones de navegación
            btnStart: document.getElementById('btn-start'),
            btnBeginCase: document.getElementById('btn-begin-case'),
            btnViewFile: document.getElementById('btn-view-file'),
            btnSolveCase: document.getElementById('btn-solve-case'),
            btnToLegal: document.getElementById('btn-to-legal'),
            btnNextStep: document.getElementById('btn-next-step'),
            btnNextChallenge: document.getElementById('btn-next-challenge'),
            btnRestart: document.getElementById('btn-restart'),

            // Campos del Estudiante
            studentImg: document.getElementById('student-img'),
            studentName: document.getElementById('student-name'),
            studentSituation: document.getElementById('student-situation'),
            studentAudio: document.getElementById('student-audio'),

            // Campos del Expediente
            fileName: document.getElementById('file-name'),
            fileStatus: document.getElementById('file-status'),
            fileProblem: document.getElementById('file-problem'),
            fileRequest: document.getElementById('file-request'),

            // Campos del Reto
            challengeNumber: document.getElementById('challenge-number'),
            challengeQuestion: document.getElementById('challenge-question'),
            optionsContainer: document.getElementById('options-container'),
            feedbackBox: document.getElementById('feedback-box'),
            feedbackTitle: document.getElementById('feedback-title'),
            feedbackText: document.getElementById('feedback-text'),

            // Campos Legales
            legalRegulation: document.getElementById('legal-regulation'),
            legalArticle: document.getElementById('legal-article'),
            legalContent: document.getElementById('legal-content'),
            legalNote: document.getElementById('legal-note'),

            // Resumen Final
            finalScore: document.getElementById('final-score'),
            summaryMessage: document.getElementById('summary-message')
        };
    },

    // Suscripción de eventos
    bindEvents() {
        this.dom.btnStart.addEventListener('click', () => this.showScreen('screen-intro'));
        this.dom.btnBeginCase.addEventListener('click', () => {
            this.dom.headerStats.classList.remove('hidden');
            this.cargarCasoActual();
        });
        this.dom.btnViewFile.addEventListener('click', () => this.showScreen('screen-file'));
        this.dom.btnSolveCase.addEventListener('click', () => this.cargarRetoActual());
        this.dom.btnToLegal.addEventListener('click', () => this.mostrarFundamentoLegal());
        this.dom.btnNextStep.addEventListener('click', () => this.avanzarFlujo());
        this.dom.btnNextChallenge.addEventListener('click', () => this.continuarSiguienteEntregable());
        this.dom.btnRestart.addEventListener('click', () => this.reiniciarSimulador());
    },

    // Carga asíncrona de archivos JSON locales
    async cargarDatos() {
        try {
            const [respCasos, respRetos, respLegis] = await Promise.all([
                fetch('casos.json'),
                fetch('retos.json'),
                fetch('legislacion.json')
            ]);

            this.state.casos = await respCasos.json();
            this.state.retos = await respRetos.json();
            this.state.legislacion = await respLegis.json();
        } catch (error) {
            console.error("Error cargando los datos JSON del simulador:", error);
            alert("Error de carga. Asegúrate de ejecutar la app mediante un servidor local o un navegador compatible.");
        }
    },

    // Control del enrutamiento simple entre pantallas
    showScreen(screenId) {
        this.dom.screens.forEach(screen => {
            screen.classList.remove('active');
            if (screen.id === screenId) {
                screen.classList.add('active');
            }
        });
    },

    // Renderiza el caso correspondiente
    cargarCasoActual() {
        const caso = this.state.casos[this.state.casoActualIndex];
        if (!caso) {
            this.mostrarResumenFinal();
            return;
        }

        // Filtrar retos asociados al caso actual
        this.state.retosDelCasoActual = this.state.retos.filter(r => r.id_caso === caso.id);
        this.state.retoActualIndex = 0;

        // Inyectar datos del estudiante
        this.dom.studentImg.src = caso.imagen;
        this.dom.studentName.textContent = caso.nombre;
        this.dom.studentSituation.textContent = caso.descripcion;
        this.dom.studentAudio.src = caso.audio;

        // Inyectar expediente
        this.dom.fileName.textContent = caso.nombre;
        this.dom.fileStatus.textContent = caso.estatus_academico || "Regular";
        this.dom.fileProblem.textContent = caso.problema;
        this.dom.fileRequest.textContent = caso.solicitud;

        this.actualizarProgreso();
        this.showScreen('screen-student');
    },

    // Renderiza el reto/pregunta actual
    cargarRetoActual() {
        const reto = this.state.retosDelCasoActual[this.state.retoActualIndex];
        
        // Detener audios si estuvieran reproduciéndose
        this.dom.studentAudio.pause();

        this.dom.challengeNumber.textContent = `Caso ${this.state.casoActualIndex + 1} - Reto #${this.state.retoActualIndex + 1}`;
        this.dom.challengeQuestion.textContent = reto.pregunta;
        
        // Limpiar y poblar contenedor de opciones
        this.dom.optionsContainer.innerHTML = '';
        this.dom.feedbackBox.classList.add('hidden');

        reto.opciones.forEach((opcion, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> &nbsp; ${opcion}`;
            btn.addEventListener('click', () => this.evaluarRespuesta(index, reto, btn));
            this.dom.optionsContainer.appendChild(btn);
        });

        this.showScreen('screen-challenge');
    },

    // Lógica de evaluación de respuestas
    evaluarRespuesta(opcionSeleccionada, reto, botonSeleccionado) {
        const botones = this.dom.optionsContainer.querySelectorAll('.option-btn');
        botones.forEach(btn => btn.disabled = true); // Bloquear respuestas múltiples

        const esCorrecta = opcionSeleccionada === reto.respuesta_correcta;

        if (esCorrecta) {
            botonSeleccionado.classList.add('correct');
            this.state.puntuacion += this.state.puntosPorReto;
            this.dom.scoreDisplay.textContent = this.state.puntuacion;
            
            this.dom.feedbackTitle.textContent = "¡Respuesta Correcta!";
            this.dom.feedbackBox.className = "feedback-box correct";
        } else {
            botonSeleccionado.classList.add('incorrect');
            botones[reto.respuesta_correcta].classList.add('correct'); // Resaltar la correcta
            
            this.dom.feedbackTitle.textContent = "Respuesta Incorrecta";
            this.dom.feedbackBox.className = "feedback-box incorrect";
        }

        this.dom.feedbackText.textContent = reto.retroalimentacion;
        this.dom.feedbackBox.classList.remove('hidden');
    },

    // Muestra la fundamentación legal vinculada
    mostrarFundamentoLegal() {
        const reto = this.state.retosDelCasoActual[this.state.retoActualIndex];
        const ley = this.state.legislacion.find(l => l.id_legislacion === reto.id_legislacion);

        if (ley) {
            this.dom.legalRegulation.textContent = ley.reglamento;
            this.dom.legalArticle.textContent = ley.articulo;
            this.dom.legalContent.textContent = `"${ley.contenido}"`;
            this.dom.legalNote.textContent = ley.nota_aclaratoria;
        }

        this.showScreen('screen-legal');
    },

    // Controla la transición de avance entre retos o casos
    avanzarFlujo() {
        this.state.retoActualIndex++;
        if (this.state.retoActualIndex < this.state.retosDelCasoActual.length) {
            this.cargarRetoActual();
        } else {
            this.state.casoActualIndex++;
            this.mostrarPantallaContinuacion();
        }
    },

    // Muestra la pantalla intermedia de rendimiento
    mostrarPantallaContinuacion() {
        this.dom.finalScore.textContent = this.state.puntuacion;
        this.actualizarProgreso();

        if (this.state.casoActualIndex < this.state.casos.length) {
            this.dom.summaryMessage.textContent = "¡Has completado el caso satisfactoriamente! Estás listo para atender al siguiente alumno.";
            this.dom.btnNextChallenge.classList.remove('hidden');
            this.dom.btnRestart.classList.add('hidden');
        } else {
            this.mostrarResumenFinal();
        }

        this.showScreen('screen-summary');
    },

    continuarSiguienteEntregable() {
        this.cargarCasoActual();
    },

    // Resumen al finalizar todos los casos
    mostrarResumenFinal() {
        this.dom.finalScore.textContent = this.state.puntuacion;
        this.dom.summaryMessage.textContent = `¡Simulación Finalizada! Has completado la atención de todos los casos de Servicios Escolares.`;
        this.dom.btnNextChallenge.classList.add('hidden');
        this.dom.btnRestart.classList.remove('hidden');
        this.showScreen('screen-summary');
    },

    // Actualiza la barra de progreso global
    actualizarProgreso() {
        const porcentaje = (this.state.casoActualIndex / this.state.casos.length) * 100;
        this.dom.progressBar.style.width = `${porcentaje}%`;
    },

    // Reinicia el estado global
    reiniciarSimulador() {
        this.state.casoActualIndex = 0;
        this.state.retoActualIndex = 0;
        this.state.puntuacion = 0;
        this.dom.scoreDisplay.textContent = '0';
        this.showScreen('screen-welcome');
        this.dom.headerStats.classList.add('hidden');
    }
};
