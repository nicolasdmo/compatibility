/**
 * Hand-crafted compatibility insights between archetype pairs.
 *
 * Each pair (A, B) returns:
 *  - clicks:       3 short statements about what works between them
 *  - clashes:      2-3 statements about friction points
 *  - communication: 1 paragraph on how they communicate best
 *  - role:         1 paragraph about B's role in the dynamic (B's perspective)
 *
 * The key is `${aArchetype}-${bArchetype}` (A is the test creator, B is the guesser).
 * Falls back to a generic template if the specific pair isn't defined.
 */

import { ARCHETYPES, type Archetype } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';

export interface CompatInsights {
  clicks:        string[];
  clashes:       string[];
  communication: string;
  role:          string;
}

// ────────────────────────────────────────────────────────────────────────────
// Hand-crafted pairs — high-traffic combinations get their own content.
// Anything missing falls through to the generic generator at the bottom.
// ────────────────────────────────────────────────────────────────────────────

const PAIRS: Partial<Record<string, CompatInsights>> = {

  // ── Planificador (A) × resto ──────────────────────────────────────────────

  'planificador-planificador': {
    clicks: [
      'Los dos respiran orden — comparten la calma de saber qué viene mañana.',
      'Ninguno necesita que el otro improvise. Eso baja la ansiedad de fondo.',
      'Tienen rituales — y los rituales son intimidad para ustedes.',
    ],
    clashes: [
      'Cuando algo se sale del plan, los dos se tensan al mismo tiempo. Nadie modera.',
      'Pueden caer en la trampa de planificar la espontaneidad hasta matarla.',
    ],
    communication: 'Hablan mejor con agenda y tema definidos. Una sobremesa con propósito vale más que diez "charlemos cuando puedas". Manden voice notes largos en vez de chats fragmentados.',
    role: 'Sos un espejo de su forma de habitar el tiempo. Eso le da seguridad: no le pesa explicarte por qué necesita revisar todo dos veces — porque vos haces lo mismo. Tu rol es validar su sistema sin querer optimizarlo.',
  },

  'planificador-espontaneo': {
    clicks: [
      'Vos le traés el caos vivificante que su agenda nunca incluye.',
      'Tu falta de plan la obliga a soltar — y, en el fondo, lo necesita.',
      'Se complementan: ella te da estructura, vos le das aire.',
    ],
    clashes: [
      'A ella le cuesta tu "vemos sobre la marcha". Lo lee como falta de compromiso.',
      'A vos te asfixia su "ya tengo todo organizado". Lo leés como control.',
    ],
    communication: 'Negocien explícitamente: dos planes con detalle por semana, dos sin plan ninguno. Si vos llegás tarde, avisá; si ella te apura, recordale que la flexibilidad no es desprolijidad.',
    role: 'Sos su válvula de escape. Cuando todo está armado y la perfección la está aplastando, vos sos quien le dice "tirémoslo todo y vamos a comer afuera". No le des estructura — eso ya lo tiene de sobra.',
  },

  'planificador-cuidador': {
    clicks: [
      'Los dos piensan en el otro antes que en ellos mismos — ella organiza, vos contenés.',
      'Hay una corriente de cuidado mutuo silencioso, que ninguno necesita verbalizar.',
      'Ambos detestan los conflictos abiertos. Eso baja la temperatura emocional del vínculo.',
    ],
    clashes: [
      'Pueden esperar que el otro adivine lo que necesitan — y ninguno lo hace.',
      'Su orden a veces no deja espacio para tu intuición emocional.',
    ],
    communication: 'Hablen en frío, no en caliente. Si algo te molestó, esperá 24 horas y andá con propuestas concretas, no con quejas vagas. Ella necesita data, no temperatura.',
    role: 'Sos su descanso emocional. Mientras ella organiza el mundo, vos organizás los afectos. Cuando vuelva agotada de cuidar de todo, sé el lugar donde se puede simplemente sentar.',
  },

  'planificador-directo': {
    clicks: [
      'Los dos van al grano — sin rodeos, sin telenovela.',
      'Ella respeta tu tiempo, vos respetás su claridad. Eficiencia mutua.',
      'Hay confianza: cuando uno dice algo, el otro le cree.',
    ],
    clashes: [
      'A veces los dos olvidan que no todo se resuelve con un plan o una verdad cruda.',
      'Pueden volverse fríos juntos — falta calor cuando ambos resuelven en modo ejecutivo.',
    ],
    communication: 'Reservense espacios sin productividad ni resolución. Una caminata sin agenda, comida lenta, silencios. Sino, se vuelve sociedad anónima.',
    role: 'Sos su contrapeso de honestidad sin filtro. Cuando ella esté planeando algo que no tiene sentido emocional, decílo — sabe que tu palabra vale porque no la usás liviano.',
  },

  'planificador-reflexivo': {
    clicks: [
      'Ambos piensan antes de actuar. Comparten ese ritmo lento, profundo.',
      'Vos analizás, ella ejecuta — el combo más potente para proyectos.',
      'Se entienden en el silencio. No necesitan llenar el aire.',
    ],
    clashes: [
      'Pueden quedarse analizando y planificando para siempre, sin que pase nada vivo.',
      'Cuando algo emocional aparece, los dos se retraen. Nadie corta el clima.',
    ],
    communication: 'Hablen por escrito cuando la cosa pesa. Los dos procesan mejor sin la presión del tiempo real. Pero pongan deadlines a la conversación, sino quedan en pausa eterna.',
    role: 'Sos su consejero estratégico de confianza. Ella ejecuta como nadie, pero a veces necesita que alguien le pregunte: "¿esto que estás haciendo es lo que querés, o lo que toca?"',
  },

  'planificador-intenso': {
    clicks: [
      'Tu intensidad la saca de su rutina — y, secretamente, lo agradece.',
      'Vos sentís fuerte, ella sostiene cuando vos te apagás.',
      'Hay polaridad: ella es agua mansa, vos sos fuego.',
    ],
    clashes: [
      'Tus 100% emocionales la abruman. Le cuesta no querer "resolver" lo que estás sintiendo.',
      'A vos te exaspera que ella no se entregue con la misma temperatura.',
    ],
    communication: 'Vos vas a explotar primero. Cuando lo sientas viniendo, avisá: "necesito espacio, no te asustes". Ella entonces sabe que no es contra ella.',
    role: 'Sos quien le recuerda que las cosas también se sienten, no solo se planifican. No retrocedas — tu intensidad es un regalo, no un problema a resolver.',
  },

  // ── Espontaneo (A) × resto ────────────────────────────────────────────────

  'espontaneo-planificador': {
    clicks: [
      'Vos le das estructura sin asfixiarla — y a ella eso la calma.',
      'Ella te enseña que vivir el presente puede convivir con un plan.',
      'Se ríen de sus diferencias en vez de pelearse por ellas.',
    ],
    clashes: [
      'Tu necesidad de saber qué pasa el martes la apura.',
      'Su "veamos sobre la marcha" te frustra cuando necesitás certezas.',
    ],
    communication: 'No le mandes mensajes con planes cerrados. Tirá ideas abiertas: "tengo ganas de hacer algo el sábado, ¿se te ocurre algo?". Le das aire pero igual la incluís.',
    role: 'Sos su ancla. Cuando ella se está dispersando entre 18 ideas, vos sos quien le dice "elegí una y vamos". No le pongas más estructura — solo dirección.',
  },

  'espontaneo-espontaneo': {
    clicks: [
      'Vivir el presente juntos es un superpoder. Nadie los entendería.',
      'Pueden cambiar de plan tres veces sin pelearse — eso es libertad real.',
      'Se ríen mucho. La improvisación los une.',
    ],
    clashes: [
      'Ninguno reserva el restaurante, nadie compra los pasajes. Se quedan afuera de cosas.',
      'Pueden no comprometerse con nada serio porque "mañana vemos".',
    ],
    communication: 'Manden audios largos, mensajes spontáneos, todo en tiempo real. Pero pongan un día fijo a la semana para algo: cualquier cosa, pero algo. Sino el vínculo se diluye.',
    role: 'Sos su cómplice de aventuras. Pero alguien tiene que ser el responsable a veces — turnense, no esperen a que el otro lo haga.',
  },

  'espontaneo-cuidador': {
    clicks: [
      'Vos sentís y ejecutás; ella siente y contiene. Se equilibran.',
      'Le aportás energía nueva, ella te aporta sostén.',
      'Hay calor entre ustedes. No tienen que fingir nada.',
    ],
    clashes: [
      'A ella le da culpa cuando vos te vas a mil aventuras solo.',
      'A vos te puede pesar su nivel de atención. Lo confundís con dependencia.',
    ],
    communication: 'Ella necesita que verbalices lo que sentís — no solo lo que hacés. Una llamada de 10 min vale más que diez stories etiquetándola.',
    role: 'Sos su recordatorio de que la vida también es disfrute, no solo cuidado. Invitala a romper la rutina con vos — pero asegurate de que sienta que la elegís, no que la usás como escape.',
  },

  'espontaneo-directo': {
    clicks: [
      'Los dos dicen las cosas como son. Cero juegos.',
      'Vos vivís rápido, ella opina rápido — combo eficiente.',
      'Hay química en la honestidad. Sin filtros, sin máscaras.',
    ],
    clashes: [
      'Su crudeza a veces te baja el vuelo emocional.',
      'Tu falta de seguimiento la frustra. "Lo dijiste ayer y hoy ya cambiaste."',
    ],
    communication: 'Mucho mejor en persona o por audio. Los mensajes de texto los terminan malinterpretando — vos los lees livianos, ella los manda directos.',
    role: 'Sos quien le recuerda que no todo se resuelve con verdad. A veces necesita calidez antes que claridad. Aportá eso — sin perder tu autenticidad.',
  },

  'espontaneo-reflexivo': {
    clicks: [
      'Ella te observa mientras vos hacés — y lo entiende todo sin que digas nada.',
      'Vos le sacás del análisis, ella te invita a profundizar.',
      'Hay misterio entre ustedes — no se aburren.',
    ],
    clashes: [
      'Su silencio a veces lo leés como rechazo. Y no lo es.',
      'Tu impulsividad a veces la deja afuera. No le diste tiempo a procesar.',
    ],
    communication: 'Dale tiempo. Cuando le contás algo grande, no esperes respuesta inmediata. Si te dice "déjame pensarlo", es buena señal — no es rechazo.',
    role: 'Sos su provocación dulce. Sin vos, se quedaría pensando. Empujala a la acción — pero con respeto a su ritmo, no con tu velocidad.',
  },

  'espontaneo-intenso': {
    clicks: [
      'Los dos sienten fuerte. No hay "modo light" con ustedes.',
      'Cuando se conectan, no existe el resto del mundo.',
      'Hay química combustible — pero combustible al fin.',
    ],
    clashes: [
      'Pueden encenderse y apagarse el mismo día. Es agotador.',
      'Ninguno modera al otro. Falta freno en momentos clave.',
    ],
    communication: 'Aprendan a pausar. Cuando los dos están encendidos, las palabras vuelan y hieren. Bajen la temperatura antes de hablar de algo importante.',
    role: 'Sos su par de intensidad. Eso es liberador para ella — no tiene que disimular. Pero también podés ser su techo: alguien tiene que decir "basta por hoy".',
  },

  // ── Cuidador (A) × resto ──────────────────────────────────────────────────

  'cuidador-planificador': {
    clicks: [
      'Vos sostenés con datos, ella sostiene con presencia. Combo blindado.',
      'Ambos detestan el conflicto frontal. Eso baja la tensión del vínculo.',
      'Se cuidan mutuamente sin invadirse.',
    ],
    clashes: [
      'Tu necesidad de control puede pisar su intuición.',
      'Su tendencia a no decirte cuando algo le molesta te frustra.',
    ],
    communication: 'Preguntale directo: "¿estás bien?" — y si dice "sí" rápido, repreguntá. No se anima a decirte cuando algo le pesa. Hacele espacio.',
    role: 'Sos quien organiza para que ella pueda cuidar tranquila. No le saques esa función — es su forma de amar. Solo recordale que también merece ser cuidada.',
  },

  'cuidador-espontaneo': {
    clicks: [
      'Vos le traés ligereza a su intensidad emocional.',
      'Ella se relaja con vos — sabe que no le vas a exigir nada.',
      'Hay frescura. No es un vínculo pesado.',
    ],
    clashes: [
      'Tu "vamos viendo" a veces ella lo lee como desinterés.',
      'A vos te puede agobiar su atención constante.',
    ],
    communication: 'Si te pregunta cómo estás, no contestes "bien" automático. Ella escucha en serio — dale algo real, aunque sea breve.',
    role: 'Sos su recreo. Cuando ella ya está saturada de cargar a todos, vos sos quien le dice "vení, no hagamos nada, solo estar". Ese "nada" para ella es oro.',
  },

  'cuidador-cuidador': {
    clicks: [
      'Cuidan al otro como nadie cuida a nadie. Hay refugio mutuo.',
      'Ninguno se siente solo emocionalmente.',
      'Saben leer los micro-gestos del otro. Comunicación silenciosa avanzada.',
    ],
    clashes: [
      'Pueden olvidarse de cuidarse a sí mismos por cuidar al otro. Co-dependencia silenciosa.',
      'A veces ninguno pide lo que necesita y los dos esperan que el otro adivine.',
    ],
    communication: 'Practiquen pedir explícitamente. "Necesito que me abraces", "necesito que me dejes en paz". Sin pedido claro, los dos terminan agotados.',
    role: 'Sos su par de empatía. No tenés que explicarle por qué te pesa todo — ya lo sabe. Pero recordale que también podés pedir, no solo dar.',
  },

  'cuidador-directo': {
    clicks: [
      'Vos sos su filtro de realidad — le decís cuando se está rompiendo por otros.',
      'Ella te ablanda. Vos la endurecés justo.',
      'Combo de calor + verdad. Vínculo honesto y tierno.',
    ],
    clashes: [
      'Tu crudeza la puede lastimar — ella siente todo más fuerte.',
      'Su disposición a cargar con todo te puede dar bronca cuando se rompe.',
    ],
    communication: 'Vos tenés que aprender a envolver. "Esto que hiciste no me gustó" funciona mejor que "esto está mal". Ella necesita el cómo, no solo el qué.',
    role: 'Sos su escudo. Decile que NO a las cosas que ella no se anima. Sé el que pone los límites que ella no puede poner sola.',
  },

  'cuidador-reflexivo': {
    clicks: [
      'Vos pensás profundo, ella siente profundo. Misma profundidad.',
      'Se cuidan en silencio, sin necesidad de explicarse.',
      'Hay paz entre ustedes — no hay ruido innecesario.',
    ],
    clashes: [
      'Tu necesidad de espacio ella la lee como abandono.',
      'Su entrega total te puede sentir invasiva cuando vos estás procesando.',
    ],
    communication: 'Avisá antes de retirarte. "Necesito 2 días para procesar esto, no es por vos". Le baja muchísimo la ansiedad si sabe que volvés.',
    role: 'Sos su espejo interior. Mientras todos esperan algo de ella, vos sos quien le pregunta qué quiere ella. Esa pregunta cambia su semana.',
  },

  'cuidador-intenso': {
    clicks: [
      'Tu intensidad le hace bien — la sacude del rol de cuidar a todos.',
      'Ella te recibe sin juzgarte. Eso para vos es raro y precioso.',
      'Hay verdad en el vínculo. Ninguno está actuando.',
    ],
    clashes: [
      'Tus explosiones la pueden dejar herida. Ella absorbe todo.',
      'Su disponibilidad infinita a veces vos la usás de vertedero.',
    ],
    communication: 'Después de cada explosión, volvé y pedí perdón concreto. Ella no necesita drama de reconciliación — solo saber que vos sabés lo que pasó.',
    role: 'Sos su zona segura. Hace mucho que nadie la deja sentir caos sin querer ordenarlo. Mostrale que se puede ser intenso y amable a la vez.',
  },

  // ── Directo (A) × resto ───────────────────────────────────────────────────

  'directo-directo': {
    clicks: [
      'Cero diplomacia entre ustedes. Liberador.',
      'Saben que cuando algo se dice, está dicho. No vuelven sobre eso.',
      'Hay respeto mutuo de tiempo, espacio y palabra.',
    ],
    clashes: [
      'Cuando los dos están duros, ninguno cede. Estancamientos largos.',
      'Pueden olvidarse del cariño verbal — lo dan por entendido.',
    ],
    communication: 'Reserven momentos suaves a propósito. Si no, terminan siendo dos managers en pareja. Manden algo cariñoso sin razón, una vez por día.',
    role: 'Sos su par igualitario. No esperés que ella endulce su forma — vos tampoco lo hacés. Pero recordale que la crudeza es elección, no obligación.',
  },

  'directo-cuidador': {
    clicks: [
      'Ella te ablanda — y eso te hace mejor persona.',
      'Vos le decís lo que nadie le dice por miedo a herirla.',
      'Combo verdad + ternura. Difícil pedir más.',
    ],
    clashes: [
      'Tu directo puede romperle algo importante — ella no lo verbaliza pero le pesa.',
      'Su tendencia a evitar conflicto te exaspera.',
    ],
    communication: 'Cuando le digas algo duro, agregale contexto: "te lo digo porque me importa, no porque te quiera lastimar". Esa frase cambia todo.',
    role: 'Sos quien la abraza después del impacto. No discutas su forma — recibí. Y cuando estés segura de su lugar, marcale los límites que ella nunca pondría.',
  },

  'directo-planificador': {
    clicks: [
      'Los dos respetan el tiempo del otro. Nada de vueltas.',
      'Vos decís, ella ejecuta. Comunicación eficiente.',
      'Hay confianza basada en consistencia: lo que dicen, hacen.',
    ],
    clashes: [
      'Pueden quedarse cortos en lo afectivo — los dos privilegian lo funcional.',
      'Cuando algo emocional surge, ninguno está cómodo navegándolo.',
    ],
    communication: 'Reserven 10 minutos diarios para hablar de algo NO logístico. ¿Cómo te sentiste hoy? ¿Qué te dolió? Si no, el vínculo se vuelve socio.',
    role: 'Sos su sparring intelectual. Discutí ideas con ella, no logística. Esa es la conversación que la enciende.',
  },

  'directo-espontaneo': {
    clicks: [
      'Vos le agitás el agua estancada. Le hacés bien.',
      'Hay humor irónico entre ustedes. Se ríen de las mismas cosas.',
      'Ella valora que no le mientas — vos valoras que no te aburras.',
    ],
    clashes: [
      'Su impredecibilidad a veces choca con su necesidad de claridad.',
      'Vos podés bajar su vuelo con una frase mal calibrada.',
    ],
    communication: 'No le hagas planes con detalle absurdo. Tirale opciones livianas. Pero también: cuando algo es importante para vos, decílo tal cual, sin envolver.',
    role: 'Sos su anti-rutina. No te conviertas en su gerente. Mantenete imprevisible — eso la mantiene viva.',
  },

  'directo-reflexivo': {
    clicks: [
      'Vos lanzás verdades, ella las decanta. Combo profundo.',
      'Hay respeto por el silencio — no necesitan llenar todo.',
      'Cuando ella habla, vale oro. Vos lo registrás.',
    ],
    clashes: [
      'Tu velocidad la deja procesando dos pasos atrás.',
      'Su silencio te puede leer como pasividad. No lo es.',
    ],
    communication: 'Hacele preguntas abiertas y esperá. No llenes el silencio con tu respuesta. Su respuesta tarda — pero llega cargada.',
    role: 'Sos quien la saca de la cabeza. Sin vos, se quedaría analizando. Empujala — pero con la fuerza de la verdad, no de la prisa.',
  },

  'directo-intenso': {
    clicks: [
      'Los dos van con todo. No hay tibieza.',
      'Vos respetás su intensidad — no la querés calmar.',
      'Hay polaridad sexual, emocional, todo. No es vínculo light.',
    ],
    clashes: [
      'Cuando chocan, chocan en serio. Pueden hacerse mucho daño rápido.',
      'Ninguno modera al otro. Necesitan tregua propuesta por terceros.',
    ],
    communication: 'Tregua después de pelea grande: 24h sin tocar el tema. Vuelvan en frío, con compromiso explícito de no atacar. Si no, se hieren más.',
    role: 'Sos su par en intensidad. Pero también podés ser el primero en pedir disculpas — eso le marca el camino. Ella no sabe cómo, vos sí.',
  },

  // ── Reflexivo (A) × resto ─────────────────────────────────────────────────

  'reflexivo-reflexivo': {
    clicks: [
      'Conversaciones de horas sin que el tiempo pese.',
      'Se entienden con miradas, no necesitan explicarse.',
      'Hay quietud entre ustedes. Eso es raro en el mundo.',
    ],
    clashes: [
      'Pueden quedarse analizando sin actuar nunca.',
      'Si uno se retira, el otro no sabe si volver o respetar — y se traba todo.',
    ],
    communication: 'Pongan un día semanal para hablar de "cómo estamos". Si no, el silencio se acumula y nadie corta. Lo no dicho los va separando.',
    role: 'Sos su par mental. No quieras llenar el silencio — quedate. Pero también: cuando ella se retira mucho, andá a buscarla suave. No siempre puede ella sola.',
  },

  'reflexivo-planificador': {
    clicks: [
      'Vos pensás, ella ejecuta. Equipo poderoso.',
      'Ambos respetan el ritmo lento — no se apuran mutuamente.',
      'Hay coherencia entre lo que dicen y hacen.',
    ],
    clashes: [
      'Pueden volverse mecánicos. Falta espontaneidad emocional.',
      'Cuando algo te duele, ella quiere "resolverlo" — no abrazarlo.',
    ],
    communication: 'Decile cuando solo necesitás escucha, no soluciones. "Necesito que me oigas, no que arregles nada" — esa frase la guía.',
    role: 'Sos quien le pregunta el por qué detrás del qué. Ella se queda en la ejecución; vos abrís la pregunta más profunda. Eso le sirve más de lo que admite.',
  },

  'reflexivo-espontaneo': {
    clicks: [
      'Vos pensás todo, ella te saca a vivir.',
      'Ella te hace reír de tus propios análisis interminables.',
      'Hay aire fresco. No es vínculo asfixiante.',
    ],
    clashes: [
      'Tu necesidad de procesar la frustra — ella quiere acción.',
      'Su impulso te puede llevar a lugares donde no querías estar.',
    ],
    communication: 'Dale tiempo para procesar — pero no infinito. Si te dice "necesito pensarlo", contestá: "ok, ¿lo hablamos el jueves?". Le pone marco.',
    role: 'Sos su distracción saludable. Sin vos, vive análisis paralizado. Sacalo a hacer cosas — pero sin invadir su espacio cuando ella quiere quietud.',
  },

  'reflexivo-cuidador': {
    clicks: [
      'Ambos profundos. Comparten ese ritmo lento del alma.',
      'Vos contenés sin invadir, ella se siente vista.',
      'Hay refugio mutuo silencioso.',
    ],
    clashes: [
      'Su retiro a vos te puede doler — querés cuidarla pero no te deja.',
      'Tu intensidad emocional la puede saturar si llega sin aviso.',
    ],
    communication: 'Avisá cuando estás emocionalmente disponible y cuando no. Ella necesita esa información — sino, vacila entre acercarse y retirarse.',
    role: 'Sos quien le ofrece sostén sin pedir explicaciones. Ella es quien siempre piensa todo — vos sos quien le dice "no tenés que explicarme nada hoy".',
  },

  'reflexivo-directo': {
    clicks: [
      'Vos sacudís su análisis con verdades incómodas. Le sirve.',
      'Ella te enseña a profundizar antes de hablar.',
      'Hay aprendizaje mutuo. Vínculo que crece.',
    ],
    clashes: [
      'Tu crudeza la puede cerrar — necesita tiempo para abrirse.',
      'Su silencio te frustra cuando vos querés respuestas.',
    ],
    communication: 'Hacele preguntas y esperá. No "¿qué te parece?" inmediato — más "¿qué pensás de esto? avisame en un rato si querés". Le das aire.',
    role: 'Sos quien la empuja a salir de la cabeza. Pero no la apures — esperala. Y cuando salga, valida lo que diga, aunque sea breve.',
  },

  'reflexivo-intenso': {
    clicks: [
      'Tu fuego la enciende — sin vos se queda en pensamiento puro.',
      'Ella te ancla cuando tu intensidad se desborda.',
      'Hay química magnética. Profundo + intenso.',
    ],
    clashes: [
      'Tu velocidad emocional la abruma. Necesita más tiempo.',
      'Su procesar a vos te puede parecer falta de pasión.',
    ],
    communication: 'Cuando expreses algo grande, repetí la idea esencial varias veces — pero distinto cada vez. Le das tiempo a captar todas las capas.',
    role: 'Sos su catalizador. Ella siente todo pero a veces lo guarda — vos sos quien la invita a expresarlo. Pero respetá: a veces guardar también es válido.',
  },

  // ── Intenso (A) × resto ───────────────────────────────────────────────────

  'intenso-intenso': {
    clicks: [
      'Nadie los entendería como ustedes se entienden. Mismo voltaje.',
      'Lo que sienten lo sienten al palo. Vínculo electrocutado.',
      'No hay tibieza — y eso es liberador para ambos.',
    ],
    clashes: [
      'Pueden destruirse mutuamente con la misma velocidad con la que se quieren.',
      'Necesitan terceros que pongan freno — solos no pueden.',
    ],
    communication: 'Tregua programada: cuando uno explota, hay 6 horas sin tocar el tema. Vuelvan en frío con propuesta concreta, no con queja vieja.',
    role: 'Sos su par de fuego. Pero también podés ser su agua: alguien tiene que enfriar primero. Asumí ese rol cuando ella no pueda.',
  },

  'intenso-planificador': {
    clicks: [
      'Vos sentís fuerte, ella ordena. Polos que se atraen.',
      'Ella te baja al piso cuando vos te volás.',
      'Hay estructura que vos necesitás, vos no querés admitir.',
    ],
    clashes: [
      'Su orden a veces vos lo leés como frialdad.',
      'Tu intensidad ella la lee como falta de control — quiere ayudarte a "resolverlo".',
    ],
    communication: 'Cuando estés explotando, no le pidas que entienda — pedile presencia. "No me ayudes, solo quedate" — esa frase la guía perfecto.',
    role: 'Sos quien le recuerda que la vida también es caos hermoso. No la tranquilices — agitala con dulzura. Ella necesita salir del control un poco.',
  },

  'intenso-espontaneo': {
    clicks: [
      'Los dos viven al máximo. Energía pura.',
      'Comparten la falta de filtro — se entienden sin disimular.',
      'Hay aventura constante. Nunca se aburren.',
    ],
    clashes: [
      'Ninguno modera al otro. Pueden agotarse mutuamente.',
      'Cuando vos te apagás, ella no sabe qué hacer — busca aire.',
    ],
    communication: 'Hablen mucho en movimiento — caminando, bailando, manejando. La intensidad pura sin acción los puede llevar a peleas explosivas.',
    role: 'Sos su par de aventura. Pero también: cuando estés muy a mil, dejale tomar las riendas un rato. Le hace bien sentir que aporta dirección, no solo gasolina.',
  },

  'intenso-cuidador': {
    clicks: [
      'Ella te recibe completo, sin pedirte que te modules.',
      'Vos sentís en lugares donde nadie te dejaba sentir.',
      'Hay refugio sin renuncia. Podés ser vos en bruto.',
    ],
    clashes: [
      'Tus explosiones la lastiman — absorbe demasiado.',
      'Su disponibilidad infinita podés usarla mal cuando estás a mil.',
    ],
    communication: 'Después de cada explosión, volvé con humildad. No con drama, no con poesía — con un "perdón, no estuvo bien". Eso para ella vale más que mil reconciliaciones intensas.',
    role: 'Sos quien la ve a ella, no solo te ve ella a vos. Preguntale "¿y vos cómo estás?" — pero en serio. Esa inversión cambia el vínculo.',
  },

  'intenso-directo': {
    clicks: [
      'Los dos van con todo — sin tibiezas.',
      'Vos sentís, ella te dice las verdades que vos sabés pero no querés ver.',
      'Hay respeto duro. No hay manipulación.',
    ],
    clashes: [
      'Su crudeza en tus momentos de explosión te puede romper.',
      'Tu intensidad ella la lee a veces como manipulación. No lo es, pero lo parece.',
    ],
    communication: 'Cuando esté en pico emocional, decile "no me digas la verdad ahora, decímela mañana". Te da espacio sin que ella sienta que la callás.',
    role: 'Sos quien la baja al piso. Su honestidad sin tu intensidad sería fría. Tu intensidad sin su honestidad sería caos. Se necesitan.',
  },

  'intenso-reflexivo': {
    clicks: [
      'Ella procesa lo que vos sentís — te ayuda a entenderte.',
      'Vos la sacás del análisis con experiencia pura.',
      'Hay profundidad. Vínculo que no se agota.',
    ],
    clashes: [
      'Su lentitud te puede frustrar cuando vos querés expresar YA.',
      'Tu velocidad emocional la satura. Necesita más espacio.',
    ],
    communication: 'Después de algo intenso, dale 24h. Volvé con "¿pudiste procesar lo que pasó ayer?". Le mostrás que respetás su ritmo sin renunciar a hablar.',
    role: 'Sos quien la invita a sentir, no solo pensar. Pero respetá que su forma de sentir es callada. No le pidas tu intensidad — pedile su profundidad.',
  },
};

/**
 * Returns insights for the (A, B) pair.
 * If no hand-written content exists, generates a generic template
 * from each archetype's known traits.
 */
export function getCompatInsights(
  aKey: ArchetypeKey,
  bKey: ArchetypeKey
): CompatInsights {
  const direct = PAIRS[`${aKey}-${bKey}`];
  if (direct) return direct;

  // Generic fallback using known archetype data
  const A: Archetype = ARCHETYPES[aKey];
  const B: Archetype = ARCHETYPES[bKey];

  return {
    clicks: [
      `${A.name.replace('El ', '')} y ${B.name.replace('El ', '')}: ambos comparten una mirada genuina del mundo.`,
      `Vos aportás ${B.strengths[0].toLowerCase()}. Eso le hace bien a su tendencia ${A.tagline.toLowerCase()}`,
      `Cuando se entienden, hay algo difícil de explicar. Confianza profunda.`,
    ],
    clashes: [
      `A veces su ${A.growthZone.toLowerCase().split('.')[0]} choca con tu forma de ser.`,
      `Tu ${B.growthZone.toLowerCase().split('.')[0]} le puede generar incomodidad.`,
    ],
    communication: `${A.name.replace('El ', '')} en conflicto: ${A.inConflict.toLowerCase()} Vos como ${B.name.replace('El ', '')}: ${B.inConflict.toLowerCase()} Estas dos formas pueden chocar — encontrar un punto medio explícito ayuda mucho.`,
    role: `Sos su contrapeso. ${A.name.replace('El ', '')} bajo presión: ${A.underPressure.toLowerCase()} Tu rol es estar presente cuando eso pasa — sin querer cambiarlo, solo acompañar.`,
  };
}
