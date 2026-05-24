import type { ArchetypeKey } from './questions';

export interface Archetype {
  key:         ArchetypeKey;
  name:        string;        // "El Planificador"
  tagline:     string;        // one-liner
  description: string;
  strengths:   string[];
  growthZone:  string;
  emoji:       string;
  color:       string;        // hex accent
  rarity:      number;        // estimated % 0–100
  inRelationships: string;
  underPressure:   string;
  inConflict:      string;
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {

  planificador: {
    key: 'planificador',
    name: 'El Planificador',
    tagline: 'Necesita tener todo claro antes de dar el primer paso.',
    description:
      'Antes de que el plan empiece, vos ya lo terminaste de revisar. Tenés una capacidad natural para anticipar problemas, organizar detalles y crear sistemas que funcionan.\n\nNo es que no te animés — es que preferís llegar preparado. Esa diferencia es enorme: mientras otros improvisan, vos ya ejecutás. La gente que te rodea aprecia tu confiabilidad sin saberlo.\n\nTu debilidad: a veces el plan perfecto te impide arrancar. La acción imperfecta suele ganarle a la planificación perfecta.',
    strengths: ['Organización excepcional', 'Confiabilidad total', 'Pensamiento anticipatorio', 'Ejecución consistente'],
    growthZone: 'Aprender a soltar el control cuando el plan cambia. No todo puede anticiparse — y está bien.',
    emoji: '📋',
    color: '#2C5F8A',
    rarity: 18,
    inRelationships: 'Sos el que recuerda los detalles que los demás olvidaron. Tu forma de amar es prever, organizar y proteger.',
    underPressure: 'Te volvés más rígido y metódico. Buscás orden donde hay caos, lo que puede tensionar a quienes te rodean.',
    inConflict: 'Tendés a querer resolver todo con un plan. Si el conflicto es emocional, eso puede no alcanzar.',
  },

  espontaneo: {
    key: 'espontaneo',
    name: 'El Espontáneo',
    tagline: 'Vive el momento y decide sobre la marcha.',
    description:
      'Mientras otros planifican, vos ya estás viviendo. Tu manera de habitar el mundo es fluida, presente y sin demasiados filtros — y eso tiene una energía que atrae.\n\nNecesitás variedad. La rutina te apaga. Cuando algo te interesa, te entregás completamente; cuando deja de interesarte, te cuesta fingir que no.\n\nTu fortaleza está en la adaptación: cuando los planes fallan, vos flotás. Tu desafío es construir consistencia sin perder esa libertad que te define.',
    strengths: ['Adaptabilidad rápida', 'Presencia total', 'Energía contagiosa', 'Tolerancia a la incertidumbre'],
    growthZone: 'Desarrollar consistencia. No todas las cosas valen la misma atención, pero algunas merecen que te quedes aunque no te resulte fácil.',
    emoji: '🌊',
    color: '#2A7A5E',
    rarity: 22,
    inRelationships: 'Sos el que propone cosas nuevas y mantiene la chispa. A veces es difícil saber qué querés a largo plazo.',
    underPressure: 'Te desconectás o cambiás de tema. Procesar en movimiento es tu mecanismo.',
    inConflict: 'Tendés a evitar o minimizar. Preferís que el tiempo lo resuelva, aunque eso a veces deja cosas sin cerrar.',
  },

  cuidador: {
    key: 'cuidador',
    name: 'El Cuidador',
    tagline: 'Siempre pone al otro primero.',
    description:
      'Tu antena para percibir lo que necesitan los demás es extraordinaria. Antes de que te lo digan, ya lo notaste — y ya estás haciendo algo al respecto.\n\nEso te hace increíblemente valioso para quienes te rodean. También te hace vulnerable: a veces priorizás tanto a los demás que te quedás sin energía para vos.\n\nAprender a cuidarte a vos mismo con la misma dedicación que cuidás a otros es tu tarea más importante.',
    strengths: ['Empatía profunda', 'Presencia emocional', 'Generosidad genuina', 'Lealtad sin condiciones'],
    growthZone: 'Poner límites sin culpa. Decir que no también es un acto de amor, hacia los demás y hacia vos.',
    emoji: '🤝',
    color: '#7A4A8A',
    rarity: 20,
    inRelationships: 'Sos el sostén del vínculo. Das mucho y a veces esperás que el otro adivine que también necesitás.',
    underPressure: 'Seguís cuidando a otros aunque estés cayendo. Ocultar lo que sentís es tu modo de "no ser una carga".',
    inConflict: 'Priorizás que quede bien con todos, aunque eso implique tragarte lo tuyo.',
  },

  directo: {
    key: 'directo',
    name: 'El Directo',
    tagline: 'Dice lo que piensa. Le cuesta filtrar.',
    description:
      'No necesitás rodeos. Cuando algo está bien, lo decís; cuando está mal, también. Esa transparencia es tu sello — y una de las cosas que más valoran de vos quienes te conocen bien.\n\nLa gente que no te conoce a veces te lee como seco o agresivo. Los que te conocen saben que tu honestidad viene de respeto, no de crueldad.\n\nTu desafío: que el filtro de cómo decís las cosas no apague lo que querés decir.',
    strengths: ['Honestidad sin rodeos', 'Claridad en la comunicación', 'Eficiencia', 'Respeto por el tiempo ajeno'],
    growthZone: 'Desarrollar la habilidad de decir lo mismo con más suavidad cuando el contexto lo pide.',
    emoji: '🎯',
    color: '#8A4A2A',
    rarity: 16,
    inRelationships: 'Sos quien dice lo que el otro necesita escuchar, aunque no lo quiera. Eso genera confianza real.',
    underPressure: 'Te volvés más escueto y eficiente. Priorizás resolver, no procesar.',
    inConflict: 'Vas al punto rápido. A veces el otro necesita más tiempo del que vos le das.',
  },

  reflexivo: {
    key: 'reflexivo',
    name: 'El Reflexivo',
    tagline: 'Procesa todo antes de hablar.',
    description:
      'Antes de reaccionar, ya lo procesaste tres veces. Esa profundidad es lo que te permite ver lo que los demás no ven — matices, consecuencias, conexiones.\n\nNo es que seas lento. Es que no querés decir algo que no esté bien dicho. Tu palabra vale más porque la elegís con cuidado.\n\nTu desafío es no quedarte en el análisis para siempre. Llega un punto en que la acción aporta más información que pensar.',
    strengths: ['Profundidad de pensamiento', 'Perspectiva amplia', 'Cuidado en las palabras', 'Análisis fino'],
    growthZone: 'Actuar antes de tener toda la información. La duda perfecta no existe — la acción imperfecta sí.',
    emoji: '🧠',
    color: '#4A6A2A',
    rarity: 15,
    inRelationships: 'Escuchás de verdad. Las personas se sienten vistas con vos, aunque no siempre sepan por qué.',
    underPressure: 'Te retirás y procesás. Necesitás tiempo y espacio para volver a estar bien.',
    inConflict: 'Preferís entender todo antes de reaccionar. Eso puede percibirse como frialdad cuando el otro quiere reacción.',
  },

  intenso: {
    key: 'intenso',
    name: 'El Intenso',
    tagline: 'Todo o nada. No hay grises.',
    description:
      'Cuando algo te importa, te importa completamente. No sabés hacer las cosas a medias — ni el amor, ni el trabajo, ni el enojo.\n\nEsa intensidad es magnética. La gente se enamora de tu pasión. También puede agotarse si no encuentra la misma energía de vuelta.\n\nTu desafío es aprender que no todo requiere el 100% de vos — y que dar menos en algo no significa que te importa menos.',
    strengths: ['Pasión genuina', 'Compromiso total', 'Autenticidad sin filtros', 'Presencia que se siente'],
    growthZone: 'Aprender a regular la intensidad. A veces el silencio y la calma también son poderosos.',
    emoji: '🔥',
    color: '#8A2A2A',
    rarity: 14,
    inRelationships: 'Amás fuerte. Cuando estás, estás completamente. Eso puede ser lo mejor y lo más difícil de vos.',
    underPressure: 'Explotás o implosionás — no hay mucho punto medio. Necesitás salida para lo que sentís.',
    inConflict: 'La intensidad sube rápido. A veces el cuerpo reacciona antes de que la cabeza pueda intervenir.',
  },
};

export const ARCHETYPE_KEYS = Object.keys(ARCHETYPES) as ArchetypeKey[];
