import { negocio } from '../config/negocio'

const c = negocio.condiciones

export type Pregunta = { p: string; r: string }

/** Respuestas generales (conocimiento del sector) + respuestas que dependen de condiciones confirmadas. */
export const preguntas: Pregunta[] = [
  {
    p: '¿Cuánto cuesta el césped artificial?',
    r: 'Depende del modelo (altura y densidad de la fibra), de los metros cuadrados y del estado de la superficie donde va a ir. Por eso preferimos darte un presupuesto con tus medidas reales en lugar de un precio orientativo que luego no se cumple. Rellena el formulario con el municipio, los metros aproximados y, si puedes, unas fotos de la zona.',
  },
  {
    p: '¿Hacéis la instalación?',
    r:
      c.instalacion === true
        ? 'Sí. Podemos suministrar solo el césped o encargarnos también de la instalación. Indícalo en el formulario de presupuesto.'
        : c.instalacion === false
          ? 'Suministramos el césped y el material necesario para colocarlo. La instalación no está incluida en nuestro servicio.'
          : 'Indícanos en el formulario si necesitas instalación o solo el césped. Te confirmaremos las opciones disponibles para tu caso en el presupuesto.',
  },
  {
    p: '¿Se puede poner césped artificial sobre baldosa u hormigón?',
    r: 'Sí, es una de las aplicaciones más habituales en terrazas y patios. Lo importante es que la superficie tenga pendiente y salida para el agua, porque el agua atraviesa el césped por los orificios de drenaje de la base y debe poder escurrir por debajo. Sobre tierra, en cambio, hay que preparar antes la base: retirar raíces, nivelar, compactar y colocar una malla antihierbas.',
  },
  {
    p: '¿El césped artificial se calienta al sol?',
    r: 'Sí. Como cualquier superficie sintética, bajo el sol directo de pleno verano se calienta más que el césped natural. En zonas muy expuestas ayuda refrescarlo con agua antes de usarlo, contar con algo de sombra (pérgola, toldo, árboles) y elegir un modelo adecuado para ese uso. Te lo comentamos al preparar el presupuesto.',
  },
  {
    p: '¿Qué mantenimiento necesita?',
    r: 'Poco, pero alguno: cepillarlo de vez en cuando a contrapelo para levantar la fibra, retirar hojas y restos, y darle un manguerazo para limpiar el polvo. En zonas con mascotas conviene aclarar con agua con más frecuencia. No necesita riego, siega ni abonos.',
  },
  {
    p: '¿Es apto para perros y niños?',
    r: 'En general sí, y es uno de los motivos por los que muchas familias lo eligen. Aun así, no todos los modelos se comportan igual con el uso intenso o con mascotas, así que conviene elegir uno pensado para ese uso. Cuéntanoslo en la solicitud y te recomendaremos el más adecuado entre los modelos disponibles.',
  },
  {
    p: '¿Qué altura de césped me conviene?',
    r: 'Para terrazas y zonas de mucho paso suelen funcionar mejor las fibras más cortas, que se mantienen más fácilmente; para jardines donde prima el aspecto, las fibras medias y largas dan un resultado más natural. Lo explicamos con detalle en nuestra guía para elegir césped artificial.',
  },
  {
    p: '¿Hacéis entregas en toda Mallorca?',
    r: c.entrega
      ? c.entrega
      : 'Atendemos solicitudes de toda Mallorca. Las condiciones de entrega (plazo y coste) dependen del municipio y del volumen del pedido, y te las detallamos en el presupuesto.',
  },
  {
    p: '¿Trabajáis en Menorca, Ibiza o Formentera?',
    r: 'De momento empezamos en Mallorca. Si estás en otra isla, puedes enviarnos igualmente tu solicitud y te diremos si podemos atenderla.',
  },
  {
    p: '¿Qué garantía tiene el césped?',
    r: c.garantia
      ? c.garantia
      : 'La garantía la establece el fabricante para cada modelo. Te indicaremos por escrito la garantía exacta del modelo que elijas junto con el presupuesto.',
  },
  {
    p: '¿Puedo ver y tocar el césped antes de decidir?',
    r:
      c.muestras === true
        ? 'Sí. Disponemos de muestras de los modelos. Pídenoslas en el formulario y te diremos cómo verlas.'
        : 'Pregúntanos por muestras en el formulario de presupuesto y te indicaremos las opciones disponibles.',
  },
  {
    p: '¿Qué necesitáis para darme presupuesto?',
    r: 'El municipio, los metros cuadrados aproximados, el tipo de espacio (jardín, terraza, patio o zona de piscina), sobre qué superficie va (tierra, baldosa, hormigón…), si necesitas instalación y, si puedes, dos o tres fotos de la zona. Con eso podemos responderte con una propuesta concreta.',
  },
]
