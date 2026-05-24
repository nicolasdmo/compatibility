/**
 * Question bank for ¿Cuánto me conocés?
 *
 * 36 questions across 6 categories, 6 per category.
 * Each option carries archetype scoring weights.
 *
 * Phase logic:
 *  - "universal-open"  : first 4 questions, everyone sees these
 *  - "adaptive"        : pool of 28 questions; 6 are selected based on running scores
 *  - "universal-close" : last 2 questions, everyone sees these
 *
 * Total shown per person: 12 questions (4 + 6 + 2)
 */

export type ArchetypeKey =
  | 'planificador'
  | 'espontaneo'
  | 'cuidador'
  | 'directo'
  | 'reflexivo'
  | 'intenso';

export type Category =
  | 'rutinas'
  | 'vinculos'
  | 'emociones'
  | 'dilemas'
  | 'gustos'
  | 'comunicacion';

export type Phase = 'universal-open' | 'adaptive' | 'universal-close';

export interface QuestionOption {
  letter: 'a' | 'b' | 'c' | 'd';
  emoji:  string;
  text:   string;
  /** Archetype points awarded for this choice. Primary = 2, secondary = 1. */
  scores: Partial<Record<ArchetypeKey, number>>;
}

export interface Question {
  id:       string;
  category: Category;
  phase:    Phase;
  text:     string;
  options:  [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

// ─── RUTINAS ──────────────────────────────────────────────────────────────────

const RUTINAS: Question[] = [
  {
    id: 'R1', category: 'rutinas', phase: 'universal-open',
    text: '¿Cómo llegás a un plan?',
    options: [
      { letter: 'a', emoji: '🕐', text: 'Antes del horario — ya estaba esperando.',   scores: { planificador: 2 } },
      { letter: 'b', emoji: '🎯', text: 'Exactamente en horario, ni un minuto más.',   scores: { planificador: 1, directo: 1 } },
      { letter: 'c', emoji: '⏰', text: '15-20 minutos tarde, siempre.',               scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '📞', text: 'Tarde, con "ya voy" en camino.',              scores: { espontaneo: 2, intenso: 1 } },
    ],
  },
  {
    id: 'R2', category: 'rutinas', phase: 'adaptive',
    text: '¿Qué tan seguido revisás el teléfono?',
    options: [
      { letter: 'a', emoji: '📵', text: 'Solo cuando suena, lo ignoro bastante.',        scores: { reflexivo: 2, directo: 1 } },
      { letter: 'b', emoji: '📱', text: 'Varias veces al día, lo normal.',               scores: { espontaneo: 1 } },
      { letter: 'c', emoji: '🔔', text: 'Constantemente, no puedo evitarlo.',            scores: { intenso: 2, espontaneo: 1 } },
      { letter: 'd', emoji: '⏰', text: 'En ciertos momentos del día, lo tengo claro.', scores: { planificador: 2 } },
    ],
  },
  {
    id: 'R3', category: 'rutinas', phase: 'adaptive',
    text: '¿Cómo está tu cuarto ahora mismo?',
    options: [
      { letter: 'a', emoji: '🏠', text: 'Todo en su lugar, siempre.',                       scores: { planificador: 2 } },
      { letter: 'b', emoji: '📦', text: 'Ordenado cuando hay visita.',                       scores: { reflexivo: 1, espontaneo: 1 } },
      { letter: 'c', emoji: '🌀', text: 'Caótico pero sé exactamente dónde está todo.',      scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '🙈', text: 'No mires debajo de la cama.',                       scores: { espontaneo: 2, intenso: 1 } },
    ],
  },
  {
    id: 'R4', category: 'rutinas', phase: 'adaptive',
    text: '¿Cómo sos con el dinero?',
    options: [
      { letter: 'a', emoji: '💰', text: 'Ahorro parte fijo cada mes, siempre.',             scores: { planificador: 2 } },
      { letter: 'b', emoji: '💳', text: 'Gasto lo que necesito, el resto queda.',           scores: { reflexivo: 1, directo: 1 } },
      { letter: 'c', emoji: '🎲', text: 'Si hay plata se gasta.',                           scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '📈', text: 'Todo o nada: meses de ahorro y meses de locura.',  scores: { intenso: 2 } },
    ],
  },
  {
    id: 'R5', category: 'rutinas', phase: 'adaptive',
    text: '¿Cuándo mandás un mensaje que tenés pendiente?',
    options: [
      { letter: 'a', emoji: '⚡', text: 'Enseguida, odio tener pendientes.',                    scores: { planificador: 2, directo: 1 } },
      { letter: 'b', emoji: '⏳', text: 'Cuando tengo tiempo y la cabeza clara.',               scores: { reflexivo: 2 } },
      { letter: 'c', emoji: '😬', text: 'Lo veo, lo dejo para después... y se me olvida.',      scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '🌙', text: 'Tarde a la noche cuando me acuerdo.',                   scores: { intenso: 1, reflexivo: 1 } },
    ],
  },
  {
    id: 'R6', category: 'rutinas', phase: 'adaptive',
    text: '¿Cómo planificás el fin de semana?',
    options: [
      { letter: 'a', emoji: '🗓️', text: 'El miércoles ya sé qué voy a hacer.',         scores: { planificador: 2 } },
      { letter: 'b', emoji: '🤷', text: 'El viernes veo qué hay.',                       scores: { espontaneo: 2 } },
      { letter: 'c', emoji: '📱', text: 'Tiro mensajes y veo quién da señales.',          scores: { espontaneo: 1, cuidador: 1 } },
      { letter: 'd', emoji: '🏠', text: 'Prefiero no planear, si surge algo genial.',    scores: { espontaneo: 2, reflexivo: 1 } },
    ],
  },
];

// ─── VÍNCULOS ─────────────────────────────────────────────────────────────────

const VINCULOS: Question[] = [
  {
    id: 'V1', category: 'vinculos', phase: 'universal-open',
    text: 'En un grupo de amigos, ¿qué rol tenés?',
    options: [
      { letter: 'a', emoji: '🎯', text: 'El que organiza y coordina los planes.',           scores: { planificador: 2 } },
      { letter: 'b', emoji: '👂', text: 'El que escucha y contiene.',                       scores: { cuidador: 2 } },
      { letter: 'c', emoji: '⚡', text: 'El que pone energía y divierte a todos.',           scores: { espontaneo: 2, intenso: 1 } },
      { letter: 'd', emoji: '🗣️', text: 'El que dice lo que nadie más se anima a decir.',  scores: { directo: 2 } },
    ],
  },
  {
    id: 'V2', category: 'vinculos', phase: 'adaptive',
    text: 'Un amigo te pide ayuda con algo que no querés hacer. ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '❤️', text: 'Lo ayudo sin chistar.',                                     scores: { cuidador: 2 } },
      { letter: 'b', emoji: '😤', text: 'Lo ayudo pero con cara.',                                   scores: { intenso: 2, cuidador: 1 } },
      { letter: 'c', emoji: '🚫', text: 'Le digo que no puedo sin dar muchas vueltas.',              scores: { directo: 2 } },
      { letter: 'd', emoji: '🔄', text: 'Le explico por qué no puedo y le ofrezco otra cosa.',       scores: { reflexivo: 2, cuidador: 1 } },
    ],
  },
  {
    id: 'V3', category: 'vinculos', phase: 'adaptive',
    text: 'Cuando peleás con alguien cercano, ¿cómo lo resolvés?',
    options: [
      { letter: 'a', emoji: '🔥', text: 'Hablo en el momento, necesito cerrarlo ya.',        scores: { directo: 2, intenso: 1 } },
      { letter: 'b', emoji: '⏸️', text: 'Espero a que pase el enojo y después hablo.',       scores: { reflexivo: 2 } },
      { letter: 'c', emoji: '😤', text: 'Espero que el otro dé el primer paso.',              scores: { intenso: 2 } },
      { letter: 'd', emoji: '🌊', text: 'Hago como que no pasó hasta que se disipa.',         scores: { espontaneo: 2, cuidador: 1 } },
    ],
  },
  {
    id: 'V4', category: 'vinculos', phase: 'adaptive',
    text: 'Un amigo toma una decisión que sabés que le va a salir mal. ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '🗣️', text: 'Se lo digo directo.',                              scores: { directo: 2 } },
      { letter: 'b', emoji: '💡', text: 'Trato de sugerirle sin imponer.',                  scores: { cuidador: 2, reflexivo: 1 } },
      { letter: 'c', emoji: '🤝', text: 'Lo apoyo igual, es su decisión.',                  scores: { cuidador: 2, espontaneo: 1 } },
      { letter: 'd', emoji: '🤐', text: 'Me callo, aprenderá solo.',                        scores: { reflexivo: 2, directo: 1 } },
    ],
  },
  {
    id: 'V5', category: 'vinculos', phase: 'adaptive',
    text: '¿Cuánta gente hay en tu círculo real?',
    options: [
      { letter: 'a', emoji: '🔒', text: 'Poquísima, soy muy selectivo.',         scores: { reflexivo: 2, intenso: 1 } },
      { letter: 'b', emoji: '👥', text: 'Unos pocos bien elegidos.',              scores: { reflexivo: 1, directo: 1 } },
      { letter: 'c', emoji: '🌐', text: 'Un grupo amplio, distintos contextos.',  scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '🤗', text: 'Muchos, me resulta fácil conectar.',     scores: { espontaneo: 2, cuidador: 1 } },
    ],
  },
  {
    id: 'V6', category: 'vinculos', phase: 'adaptive',
    text: '¿Cómo expresás que alguien te importa?',
    options: [
      { letter: 'a', emoji: '💪', text: 'Con actos más que con palabras.',          scores: { directo: 2, planificador: 1 } },
      { letter: 'b', emoji: '💬', text: 'Lo digo directamente, sin rodeos.',         scores: { directo: 2 } },
      { letter: 'c', emoji: '👂', text: 'Estando presente y escuchando.',             scores: { cuidador: 2 } },
      { letter: 'd', emoji: '🎁', text: 'Con detalles y sorpresas personalizadas.',   scores: { cuidador: 2, intenso: 1 } },
    ],
  },
];

// ─── EMOCIONES ────────────────────────────────────────────────────────────────

const EMOCIONES: Question[] = [
  {
    id: 'E1', category: 'emociones', phase: 'universal-close',
    text: 'Cuando algo te enoja mucho, ¿qué pasa primero?',
    options: [
      { letter: 'a', emoji: '💥', text: 'Lo suelto en el momento.',                            scores: { directo: 2, intenso: 1 } },
      { letter: 'b', emoji: '🔇', text: 'Me callo y hiervo por dentro.',                       scores: { intenso: 2 } },
      { letter: 'c', emoji: '🧘', text: 'Espero a estar tranquilo y después lo hablo.',         scores: { reflexivo: 2 } },
      { letter: 'd', emoji: '🔍', text: 'Entiendo por qué pasó antes de reaccionar.',           scores: { reflexivo: 2, planificador: 1 } },
    ],
  },
  {
    id: 'E2', category: 'emociones', phase: 'adaptive',
    text: '¿Cuándo fue la última vez que lloraste?',
    options: [
      { letter: 'a', emoji: '😭', text: 'Hace poco, soy expresivo.',               scores: { intenso: 2, cuidador: 1 } },
      { letter: 'b', emoji: '🤔', text: 'No recuerdo bien, es bastante raro.',     scores: { directo: 2 } },
      { letter: 'c', emoji: '🌊', text: 'Solo con cosas muy importantes.',          scores: { reflexivo: 1, intenso: 1 } },
      { letter: 'd', emoji: '🔐', text: 'En privado, nadie lo sabe.',               scores: { intenso: 2, reflexivo: 1 } },
    ],
  },
  {
    id: 'E3', category: 'emociones', phase: 'adaptive',
    text: 'Cuando algo te preocupa mucho, ¿cómo lo procesás?',
    options: [
      { letter: 'a', emoji: '🧠', text: 'Pensándolo solo hasta que lo ordeno.',           scores: { reflexivo: 2 } },
      { letter: 'b', emoji: '🗣️', text: 'Hablándolo — externalizarlo me ayuda.',          scores: { cuidador: 1, intenso: 1 } },
      { letter: 'c', emoji: '🎮', text: 'Distrayéndome, ocupando la cabeza con otra cosa.', scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '😴', text: 'Con el tiempo, se aclara solo.',                 scores: { espontaneo: 1, reflexivo: 1 } },
    ],
  },
  {
    id: 'E4', category: 'emociones', phase: 'adaptive',
    text: '¿Qué tan fácil te resulta pedir perdón?',
    options: [
      { letter: 'a', emoji: '✅', text: 'Lo pido enseguida si sé que me equivoqué.',      scores: { directo: 2, cuidador: 1 } },
      { letter: 'b', emoji: '😤', text: 'Me cuesta, pero lo hago con esfuerzo.',          scores: { intenso: 2 } },
      { letter: 'c', emoji: '🤝', text: 'Prefiero mostrarlo con hechos.',                  scores: { directo: 2 } },
      { letter: 'd', emoji: '⏳', text: 'Solo si el otro también reconoce lo suyo.',       scores: { intenso: 2, directo: 1 } },
    ],
  },
  {
    id: 'E5', category: 'emociones', phase: 'adaptive',
    text: 'Cuando te dan una crítica, ¿qué pasa?',
    options: [
      { letter: 'a', emoji: '🤔', text: 'Me duele, pero la evalúo y saco lo útil.',      scores: { reflexivo: 2, intenso: 1 } },
      { letter: 'b', emoji: '💪', text: 'Me la banco y analizo si es válida.',            scores: { directo: 2 } },
      { letter: 'c', emoji: '💔', text: 'Me la tomo personal aunque no quiera.',          scores: { intenso: 2 } },
      { letter: 'd', emoji: '😐', text: 'La escucho, digo que sí, después la filtro.',    scores: { espontaneo: 2, reflexivo: 1 } },
    ],
  },
  {
    id: 'E6', category: 'emociones', phase: 'adaptive',
    text: '¿Qué tan impulsivo sos?',
    options: [
      { letter: 'a', emoji: '⚡', text: 'Mucho: actúo primero, pienso después.',       scores: { intenso: 2, espontaneo: 1 } },
      { letter: 'b', emoji: '🔥', text: 'A veces, cuando algo me apasiona mucho.',     scores: { intenso: 1, espontaneo: 1 } },
      { letter: 'c', emoji: '🧘', text: 'Poco, siempre proceso antes de actuar.',      scores: { reflexivo: 2 } },
      { letter: 'd', emoji: '🔒', text: 'Casi nunca, necesito sentirme seguro.',        scores: { planificador: 2, reflexivo: 1 } },
    ],
  },
];

// ─── DILEMAS ──────────────────────────────────────────────────────────────────

const DILEMAS: Question[] = [
  {
    id: 'D1', category: 'dilemas', phase: 'universal-open',
    text: 'Un sábado libre, sin compromisos. ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '📋', text: 'Ya tenía algo planificado desde antes.',        scores: { planificador: 2 } },
      { letter: 'b', emoji: '💤', text: 'Me quedo en casa recargando pilas.',             scores: { reflexivo: 2 } },
      { letter: 'c', emoji: '📱', text: 'Tiro un mensaje a ver qué hay.',                 scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '🎲', text: 'Cualquier cosa que surja, sin filtros.',         scores: { espontaneo: 2, intenso: 1 } },
    ],
  },
  {
    id: 'D2', category: 'dilemas', phase: 'adaptive',
    text: 'Te ofrecen un trabajo increíble en otra ciudad. ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '✈️', text: 'Me voy — hay que animarse.',                                    scores: { espontaneo: 2, intenso: 1 } },
      { letter: 'b', emoji: '📊', text: 'Solo si tengo todo calculado: sueldo, vivienda, futuro.',       scores: { planificador: 2 } },
      { letter: 'c', emoji: '💔', text: 'Me cuesta dejar mis vínculos, seguramente no voy.',             scores: { cuidador: 2 } },
      { letter: 'd', emoji: '🤔', text: 'Lo pienso mucho... y probablemente me quedo.',                  scores: { reflexivo: 2, planificador: 1 } },
    ],
  },
  {
    id: 'D3', category: 'dilemas', phase: 'adaptive',
    text: 'Planeabas hacer algo solo y te invitan a salir. ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '📌', text: 'Me quedo con lo que tenía planeado.',               scores: { planificador: 2, directo: 1 } },
      { letter: 'b', emoji: '🤔', text: 'Depende del plan y de con quién.',                  scores: { reflexivo: 2 } },
      { letter: 'c', emoji: '🎉', text: 'Salgo, lo otro puede esperar.',                      scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '😤', text: 'Salgo, pero me queda un toque de molestia.',         scores: { planificador: 1, intenso: 1 } },
    ],
  },
  {
    id: 'D4', category: 'dilemas', phase: 'adaptive',
    text: '¿Cómo tomás una decisión importante?',
    options: [
      { letter: 'a', emoji: '📐', text: 'Analizando todos los factores con calma.',     scores: { reflexivo: 2, planificador: 1 } },
      { letter: 'b', emoji: '🔥', text: 'Siguiendo mi instinto.',                        scores: { intenso: 2, espontaneo: 1 } },
      { letter: 'c', emoji: '💬', text: 'Consultando con alguien de confianza.',          scores: { cuidador: 2 } },
      { letter: 'd', emoji: '⚡', text: 'Peso pros y contras rápido y decido.',           scores: { directo: 2 } },
    ],
  },
  {
    id: 'D5', category: 'dilemas', phase: 'adaptive',
    text: '¿Qué te cuesta más en el día a día?',
    options: [
      { letter: 'a', emoji: '🚫', text: 'Decir que no.',                   scores: { cuidador: 2 } },
      { letter: 'b', emoji: '🙏', text: 'Pedir ayuda.',                    scores: { directo: 2, intenso: 1 } },
      { letter: 'c', emoji: '🚀', text: 'Empezar cosas nuevas.',            scores: { reflexivo: 2, planificador: 1 } },
      { letter: 'd', emoji: '🏁', text: 'Terminar lo que empiezo.',         scores: { espontaneo: 2, intenso: 1 } },
    ],
  },
  {
    id: 'D6', category: 'dilemas', phase: 'adaptive',
    text: 'En un conflicto, ¿qué preferís?',
    options: [
      { letter: 'a', emoji: '🎯', text: 'Tener razón.',                              scores: { directo: 2, intenso: 1 } },
      { letter: 'b', emoji: '🤝', text: 'Que quede bien con todos.',                 scores: { cuidador: 2 } },
      { letter: 'c', emoji: '💡', text: 'La mejor solución, aunque no sea la mía.',  scores: { reflexivo: 2 } },
      { letter: 'd', emoji: '⏩', text: 'Que se resuelva rápido y seguir.',           scores: { espontaneo: 2, directo: 1 } },
    ],
  },
];

// ─── GUSTOS ───────────────────────────────────────────────────────────────────

const GUSTOS: Question[] = [
  {
    id: 'G1', category: 'gustos', phase: 'universal-open',
    text: '¿Qué tipo de viaje preferís?',
    options: [
      { letter: 'a', emoji: '🗓️', text: 'Todo planificado: hotel, actividades, horarios.',  scores: { planificador: 2 } },
      { letter: 'b', emoji: '🗺️', text: 'Destino definido pero libre dentro del viaje.',     scores: { reflexivo: 1, espontaneo: 1 } },
      { letter: 'c', emoji: '🎒', text: 'Mochilero, a ver qué pasa.',                        scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '🏖️', text: 'Resort o descanso total, nada de correr.',          scores: { cuidador: 1, reflexivo: 1 } },
    ],
  },
  {
    id: 'G2', category: 'gustos', phase: 'adaptive',
    text: 'Una película para ver solo esta noche. ¿Cuál elegís?',
    options: [
      { letter: 'a', emoji: '🎭', text: 'Drama o algo que me haga pensar.',         scores: { reflexivo: 2, intenso: 1 } },
      { letter: 'b', emoji: '😂', text: 'Comedia o algo liviano.',                  scores: { espontaneo: 2, cuidador: 1 } },
      { letter: 'c', emoji: '💥', text: 'Acción o suspenso.',                       scores: { directo: 2, intenso: 1 } },
      { letter: 'd', emoji: '📚', text: 'Documental, prefiero aprender algo.',      scores: { reflexivo: 2, planificador: 1 } },
    ],
  },
  {
    id: 'G3', category: 'gustos', phase: 'adaptive',
    text: '¿Cómo preferís aprender algo nuevo?',
    options: [
      { letter: 'a', emoji: '📖', text: 'Investigando bien antes de arrancar.',     scores: { reflexivo: 2, planificador: 1 } },
      { letter: 'b', emoji: '🏃', text: 'Tirándome a hacerlo y viendo.',             scores: { espontaneo: 2, directo: 1 } },
      { letter: 'c', emoji: '👩‍🏫', text: 'Que alguien me lo explique paso a paso.', scores: { cuidador: 1, reflexivo: 1 } },
      { letter: 'd', emoji: '🎓', text: 'Un curso estructurado, con orden.',          scores: { planificador: 2 } },
    ],
  },
  {
    id: 'G4', category: 'gustos', phase: 'adaptive',
    text: '¿Qué música ponés cuando estás solo?',
    options: [
      { letter: 'a', emoji: '🎵', text: 'La misma playlist de siempre.',           scores: { planificador: 1, reflexivo: 1 } },
      { letter: 'b', emoji: '🔊', text: 'Lo que me pida el cuerpo en ese momento.', scores: { espontaneo: 2, intenso: 1 } },
      { letter: 'c', emoji: '🎤', text: 'Algo que me active.',                      scores: { directo: 1, intenso: 1 } },
      { letter: 'd', emoji: '🔇', text: 'No pongo música, prefiero el silencio.',   scores: { reflexivo: 2 } },
    ],
  },
  {
    id: 'G5', category: 'gustos', phase: 'adaptive',
    text: 'Hay un problema técnico (compu, aparato, lo que sea). ¿Qué hacés?',
    options: [
      { letter: 'a', emoji: '🔍', text: 'Busco info y lo intento resolver solo.',          scores: { planificador: 2, directo: 1 } },
      { letter: 'b', emoji: '📞', text: 'Llamo a alguien que sepa.',                       scores: { cuidador: 1, espontaneo: 1 } },
      { letter: 'c', emoji: '💥', text: 'Me frustro más de la cuenta.',                    scores: { intenso: 2 } },
      { letter: 'd', emoji: '🙈', text: 'Lo dejo y espero que se solucione solo.',         scores: { espontaneo: 2 } },
    ],
  },
  {
    id: 'G6', category: 'gustos', phase: 'adaptive',
    text: '¿Qué te molesta más en otras personas?',
    options: [
      { letter: 'a', emoji: '⏰', text: 'La impuntualidad.',            scores: { planificador: 2 } },
      { letter: 'b', emoji: '🚫', text: 'La falta de honestidad.',      scores: { directo: 2 } },
      { letter: 'c', emoji: '💔', text: 'El egoísmo.',                  scores: { cuidador: 2 } },
      { letter: 'd', emoji: '🔒', text: 'La rigidez.',                  scores: { espontaneo: 2, intenso: 1 } },
    ],
  },
];

// ─── COMUNICACIÓN ─────────────────────────────────────────────────────────────

const COMUNICACION: Question[] = [
  {
    id: 'C1', category: 'comunicacion', phase: 'universal-close',
    text: '¿Qué hacés cuando no estás de acuerdo con algo?',
    options: [
      { letter: 'a', emoji: '🗣️', text: 'Lo digo en el momento.',                scores: { directo: 2 } },
      { letter: 'b', emoji: '⏱️', text: 'Espero el momento indicado.',             scores: { reflexivo: 2 } },
      { letter: 'c', emoji: '😤', text: 'Se me nota en la cara aunque no diga nada.', scores: { intenso: 2 } },
      { letter: 'd', emoji: '🤐', text: 'Me guardo la opinión y sigo.',             scores: { espontaneo: 1, reflexivo: 1 } },
    ],
  },
  {
    id: 'C2', category: 'comunicacion', phase: 'adaptive',
    text: 'Cuando tenés que dar malas noticias, ¿cómo lo hacés?',
    options: [
      { letter: 'a', emoji: '💬', text: 'Directo al punto — es lo más respetuoso.',             scores: { directo: 2 } },
      { letter: 'b', emoji: '🕐', text: 'Busco el momento y las palabras justas.',              scores: { reflexivo: 2, cuidador: 1 } },
      { letter: 'c', emoji: '😬', text: 'Lo evito el mayor tiempo posible.',                   scores: { espontaneo: 2 } },
      { letter: 'd', emoji: '💔', text: 'Lo hago pero me quedo pensando cómo lo tomó.',        scores: { cuidador: 2, intenso: 1 } },
    ],
  },
  {
    id: 'C3', category: 'comunicacion', phase: 'adaptive',
    text: '¿Cómo sos para los mensajes?',
    options: [
      { letter: 'a', emoji: '📝', text: 'Cortos y al punto.',                         scores: { directo: 2 } },
      { letter: 'b', emoji: '📜', text: 'Largos y detallados.',                        scores: { reflexivo: 2, intenso: 1 } },
      { letter: 'c', emoji: '🎙️', text: 'Audios siempre, no me gusta escribir.',      scores: { espontaneo: 2, intenso: 1 } },
      { letter: 'd', emoji: '🔀', text: 'Depende del tema y del estado de ánimo.',     scores: { reflexivo: 1, espontaneo: 1 } },
    ],
  },
  {
    id: 'C4', category: 'comunicacion', phase: 'adaptive',
    text: '¿Cuánto compartís de tu vida personal?',
    options: [
      { letter: 'a', emoji: '🔒', text: 'Poco, soy bastante reservado.',                         scores: { reflexivo: 2, directo: 1 } },
      { letter: 'b', emoji: '💝', text: 'Con mi círculo íntimo, absolutamente todo.',             scores: { intenso: 2, cuidador: 1 } },
      { letter: 'c', emoji: '🌐', text: 'Bastante, me gusta conectar con la gente.',             scores: { cuidador: 1, espontaneo: 1 } },
      { letter: 'd', emoji: '🎭', text: 'Depende mucho de con quién estoy.',                     scores: { reflexivo: 2 } },
    ],
  },
  {
    id: 'C5', category: 'comunicacion', phase: 'adaptive',
    text: 'Cuando discutís, ¿qué pasa?',
    options: [
      { letter: 'a', emoji: '🔊', text: 'Levanto la voz sin querer.',                     scores: { intenso: 2 } },
      { letter: 'b', emoji: '🚪', text: 'Me cierro y dejo de hablar.',                    scores: { intenso: 1, reflexivo: 1 } },
      { letter: 'c', emoji: '🧘', text: 'Mantengo la calma, siempre.',                    scores: { reflexivo: 2, cuidador: 1 } },
      { letter: 'd', emoji: '🏳️', text: 'Termino siendo yo el que baja los brazos.',     scores: { cuidador: 2 } },
    ],
  },
  {
    id: 'C6', category: 'comunicacion', phase: 'adaptive',
    text: '¿Cómo te manejás con los conflictos?',
    options: [
      { letter: 'a', emoji: '⚡', text: 'Los enfrento, necesito resolverlos.',      scores: { directo: 2, intenso: 1 } },
      { letter: 'b', emoji: '🌊', text: 'Los evito cuando puedo.',                  scores: { espontaneo: 2, cuidador: 1 } },
      { letter: 'c', emoji: '🧠', text: 'Los proceso solo antes de hablar.',        scores: { reflexivo: 2 } },
      { letter: 'd', emoji: '🤝', text: 'Trato de que todos queden bien.',          scores: { cuidador: 2 } },
    ],
  },
];

// ─── Master bank ──────────────────────────────────────────────────────────────

export const QUESTION_BANK: Question[] = [
  ...RUTINAS,
  ...VINCULOS,
  ...EMOCIONES,
  ...DILEMAS,
  ...GUSTOS,
  ...COMUNICACION,
];

export const QUESTION_MAP = Object.fromEntries(
  QUESTION_BANK.map((q) => [q.id, q])
) as Record<string, Question>;

/** The 4 questions shown first — fixed for everyone. */
export const UNIVERSAL_OPEN_IDS = ['R1', 'V1', 'D1', 'G1'] as const;

/** The 2 questions shown last — fixed for everyone. */
export const UNIVERSAL_CLOSE_IDS = ['E1', 'C1'] as const;

/** Questions available for adaptive selection (everything else). */
export const ADAPTIVE_POOL = QUESTION_BANK.filter(
  (q) =>
    q.phase === 'adaptive' &&
    !UNIVERSAL_OPEN_IDS.includes(q.id as never) &&
    !UNIVERSAL_CLOSE_IDS.includes(q.id as never)
);

export const TOTAL_ADAPTIVE_SHOWN = 6; // how many adaptive questions per person
export const TOTAL_QUESTIONS_PER_TEST = UNIVERSAL_OPEN_IDS.length + TOTAL_ADAPTIVE_SHOWN + UNIVERSAL_CLOSE_IDS.length; // 12
