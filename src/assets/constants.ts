//constants.js

//History.jsx
import analysis1 from '/images/analysis1.png';
import analysis2 from '/images/analysis2.png';
import analysis3 from '/images/analysis3.png';
import analysis4 from '/images/analysis4.png';
import analysis5 from '/images/analysis5.png';

//Scanner.jsx
import recent1 from '/images/recent1.png';
import recent2 from '/images/recent2.png';
import recent3 from '/images/recent3.png';

//Library.jsx
import ascaris from '/images/parasites-ascaris.png';
import enterobius from '/images/parasites-enterobius.jpg';
import trichuris from '/images/parasites-trichuris.jpg';
import necator from '/images/parasites-necator.jpg';
import giardia from '/images/parasites-giardia.jpg';
//LifeCycle
import cdvAscarisEgg from '/images/cdv-ascaris-egg.jpg';
import cdvAscarisIntestine from '/images/cdv-ascaris-intestine.png';
import cdvAscarisLarvae from '/images/cdv-ascaris-larvae.jpg';
import cdvAscarisLung from '/images/cdv-ascaris-lung.jpg';
import cdvEnterobiusAnus from '/images/cdv-enterobius-anus.png';
import cdvEnterobiusColon from '/images/cdv-enterobius-colon.jpg';
import cdvEnterobiusEgg from '/images/cdv-enterobius-egg.jpg';
import cdvEnterobiusLarvae from '/images/cdv-enterobius-larvae.jpg';
import cdvGiardiaColonization from '/images/cdv-giardia-colonization.jpg';
import cdvGiardiaCyst from '/images/cdv-giardia-cyst.jpg';
import cdvGiardiaElimination from '/images/cdv-giardia-elimination.png';
import cdvGiardiaTrophozoite from '/images/cdv-giardia-trophozoite.jpg';
import cdvNecatorAdult from '/images/cdv-necator-adult.jpg';
import cdvNecatorEgg from '/images/cdv-necator-egg.jpg';
import cdvNecatorFLarvae from '/images/cdv-necator-f-larvae.jpg';
import cdvNecatorRLarvae from '/images/cdv-necator-r-larvae.jpg';
import cdvTrichurisIEgg from '/images/cdv-trichuris-i-egg.jpg';
import cdvTrichurisIntestine from '/images/cdv-trichuris-intestine.jpg';
import cdvTrichurisLarvae from '/images/cdv-trichuris-larvae.jpg';
import cdvTrichurisMEgg from '/images/cdv-trichuris-m-egg.jpg';

import {
  IAnalysis,
  IDetectedParasite,
  IMapData,
  IModelDetails,
  IParasite,
  IParasiteDetail,
} from '../types';

// Helper function to generate content from detected parasites
const generateContent = (detectedParasites: IDetectedParasite[]): string => {
  if (detectedParasites && detectedParasites.length > 0) {
    const parasiteInfo = detectedParasites.map((p) => p.label).join(', ');
    const avgConfidence =
      detectedParasites.reduce((sum, p) => sum + p.value, 0) / detectedParasites.length;
    return `Detectado: ${parasiteInfo}, Confianza Promedio: ${Math.round(avgConfidence)}%`;
  }
  return 'Detectado: No se encontraron parásitos';
};

// History.jsx
export const recentAnalyses: IAnalysis[] = [
  {
    id: 1,
    date: '2024-01-15 10:30 AM',
    content: 'Detectado: Ascaris lumbricoides (3), Confianza Promedio: 95%',
    imgURL: analysis1,
    detectedParasites: [
      { label: 'Ascaris lumbricoides', value: 95 },
      { label: 'Trichuris trichiura', value: 89 },
    ],
  },
  {
    id: 2,
    date: '2024-01-14 02:45 PM',
    content: 'Detectado: Giardia duodenalis (2), Confianza Promedio: 88%',
    imgURL: analysis2,
    detectedParasites: [{ label: 'Giardia duodenalis', value: 88 }],
  },
  {
    id: 3,
    date: '2024-01-13 09:15 AM',
    content: 'Detectado: Enterobius vermicularis (1), Confianza Promedio: 75%',
    imgURL: analysis3,
    detectedParasites: [{ label: 'Enterobius vermicularis', value: 75 }],
  },
  {
    id: 4,
    date: '2024-01-12 04:00 PM',
    content: 'Detectado: Trichuris trichiura (4), Confianza Promedio: 92%',
    imgURL: analysis4,
    detectedParasites: [{ label: 'Trichuris trichiura', value: 92 }],
  },
  {
    id: 5,
    date: '2024-01-11 11:00 AM',
    content: 'Detectado: No se encontraron parásitos, Confianza Promedio: 99%',
    imgURL: analysis5,
    detectedParasites: [],
  },
];

// Modificación en src/assets/constants.ts

// 1. Sincronizar el orden exacto de los índices de clase del modelo (0 a 7)
export const parasiteTypes: string[] = [
  'Ascaris lumbricoides', // Clase 0
  'Blastocystis hominis', // Clase 1
  'Enterobius vermicularis', // Clase 2
  'Giardia lamblia', // Clase 3
  'Necator americanus', // Clase 4
  'Trichuris trichiura', // Clase 5
  'Entamoeba histolytica/dispar', // Clase 6
  'Cryptosporidium spp.', // Clase 7
];

export const months: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const feedbackStatus: string[] = ['En Progreso', 'Revisado', 'Completado'];

// Scanner.jsx
export const possibleParasites: string[] = [
  'Giardia duodenalis',
  'Entamoeba histolytica',
  'Cryptosporidium parvum',
  'Cyclospora cayetanensis',
  'Trichomonas vaginalis',
  'Ascaris lumbricoides',
  'Strongyloides stercoralis',
  'Ancylostoma duodenale',
  'Enterobius vermicularis',
  'Toxoplasma gondii',
];

export const recentImages: IAnalysis[] = [
  {
    id: 1,
    imgURL: recent1,
    date: '2024-01-01 03:00 PM',
    fileName: 'sample_image_1.png',
    detectedParasites: [
      { label: 'Ascaris lumbricoides', value: 95 },
      { label: 'Trichuris trichiura', value: 89 },
    ],
    content: generateContent([
      { label: 'Ascaris lumbricoides', value: 95 },
      { label: 'Trichuris trichiura', value: 89 },
    ]),
  },
  {
    id: 2,
    imgURL: recent2,
    date: '2024-01-02 01:00 AM',
    fileName: 'sample_image_2.png',
    detectedParasites: [{ label: 'Giardia duodenalis', value: 88 }],
    content: generateContent([{ label: 'Giardia duodenalis', value: 88 }]),
  },
  {
    id: 3,
    imgURL: recent3,
    date: '2024-01-03 12:00 M',
    fileName: 'sample_image_3.png',
    detectedParasites: [{ label: 'Enterobius vermicularis', value: 75 }],
    content: generateContent([{ label: 'Enterobius vermicularis', value: 75 }]),
  },
];

// Library.jsx
// 2. Expandir el array completo de la librería estática
// (Nota: puedes usar marcadores de imágenes temporales mientras subes los assets reales)
export const parasites: IParasite[] = [
  {
    id: 0,
    name: 'Ascaris lumbricoides',
    description:
      'Nematodo intestinal gigante. Infección común por geohelmintos mediante ingesta de huevos embrionados.',
    imgURL: ascaris,
  },
  {
    id: 1,
    name: 'Blastocystis hominis',
    description:
      'Protozoario polimórfico controversial. Alta prevalencia post-desastre debido a saneamiento deficiente.',
    imgURL: '/images/parasites-default.png', // Reemplazar luego por tu asset
  },
  {
    id: 2,
    name: 'Enterobius vermicularis',
    description:
      'Conocido como oxiuro. Causa enterobiasis infantil transmitida por vía fecal-oral o inhalación de huevos.',
    imgURL: enterobius,
  },
  {
    id: 3,
    name: 'Giardia lamblia',
    description:
      'Protozoario flagelado. Produce quistes altamente infecciosos que colonizan el duodeno provocando malabsorción.',
    imgURL: giardia,
  },
  {
    id: 4,
    name: 'Necator americanus',
    description:
      'Gusano gancho (uncinaria). Larvas filariformes penetran la piel causando anemia ferropénica severa.',
    imgURL: necator,
  },
  {
    id: 5,
    name: 'Trichuris trichiura',
    description:
      'Gusano látigo. Geohelminto que parasita el ciego, pudiendo provocar disentería y prolapso rectal en cargas masivas.',
    imgURL: trichuris,
  },
  {
    id: 6,
    name: 'Entamoeba histolytica/dispar',
    description:
      'Agente causal de la amebiasis y disentería amebiana severa por agua o alimentos expuestos a lodos fecales.',
    imgURL: '/images/parasites-default.png',
  },
  {
    id: 7,
    name: 'Cryptosporidium spp.',
    description:
      'Protozoario hídrico oportunista. Sus ooquistes poseen una pared gruesa inmune a la cloración estándar.',
    imgURL: '/images/parasites-default.png',
  },
];

// ParasiteDetails.jsx
export const parasiteData: Record<string, IParasiteDetail> = {
  'ascaris-lumbricoides': {
    title: 'Ascaris lumbricoides',
    subtitle: 'Lombriz intestinal gigante',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Ascaris lumbricoides es un parásito nematodo (gusano redondo) que causa la ascariasis. Es la infección por helmintos más común a nivel mundial, especialmente en áreas con saneamiento deficiente. El parásito se transmite a través de la ingestión de huevos de Ascaris presentes en el suelo o alimentos contaminados. Su ciclo de vida es complejo, involucrando una migración por los pulmones antes de madurar en el intestino.',
            imgUrl: '',
          },
          {
            title: 'Importancia Clínica',
            text: 'La ascariasis puede ser asintomática, pero las infecciones severas pueden causar desnutrición, obstrucción intestinal y complicaciones respiratorias (síndrome de Löffler) durante la fase de migración larvaria. La prevención se centra en la mejora del saneamiento y la higiene personal.',
          },
        ],
      },
      morphology: {
        sections: [
          {
            title: 'Morfología',
            text: 'Ascaris lumbricoides es el nematodo intestinal más grande de humanos. Los adultos tienen una forma cilíndrica y un color blanco rosado. La morfología es clave para su identificación en muestras de heces y tejidos.',
          },
          {
            title: 'Morfología del Huevo',
            text: 'Los huevos de Ascaris son de forma ovalada, con una cubierta gruesa y mamilonada (con protuberancias). Son muy resistentes en el ambiente. Los modelos 3D interactivos permiten una visualización detallada de su estructura.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv7',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Los machos adultos son más pequeños y tienen una cola curvada, mientras que las hembras son más grandes y rectas. Su anatomía interna es compleja, incluyendo un sistema reproductivo prominente. Los modelos 3D proporcionan una vista completa de estas características.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv8',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Ascaris lumbricoides comienza con la ingestión de huevos embrionados, seguido de un viaje por el cuerpo y la maduración en el intestino.',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Huevos',
                description: 'Ingeridos por el huésped, eclosionan en el intestino',
                imgUrl: cdvAscarisEgg,
              },
              {
                title: 'Larvas',
                description:
                  'Migran del intestino al torrente sanguíneo, pasando por hígado y pulmones',
                imgUrl: cdvAscarisLarvae,
              },
              {
                title: 'Tracto respiratorio',
                description: 'Las larvas son tosidas y tragadas, volviendo al intestino delgado',
                imgUrl: cdvAscarisLung,
              },
              {
                title: 'Adultos',
                description: 'Maduran en el intestino delgado, se aparean y ponen huevos',
                imgUrl: cdvAscarisIntestine,
              },
            ],
          },
        ],
      },
    },
  },
  'enterobius-vermicularis': {
    title: 'Enterobius vermicularis',
    subtitle: 'Oxiuro',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Enterobius vermicularis, conocido como oxiuro, es un nematodo que causa la enterobiasis. Es una de las infecciones por parásitos más comunes en los niños en todo el mundo. La transmisión es fecal-oral, a través de la ingesta de huevos, y a menudo por autoinfección o infección entre miembros de la misma familia.',
            imgUrl: '',
          },
          {
            title: 'Importancia Clínica',
            text: 'El síntoma principal de la enterobiasis es el prurito anal, especialmente por la noche, cuando las hembras migran a la zona perianal para poner sus huevos. Esto puede causar insomnio e irritabilidad. El diagnóstico se realiza con la prueba de la cinta adhesiva, que detecta los huevos en el área perianal.',
          },
        ],
      },
      morphology: {
        sections: [
          {
            title: 'Morfología',
            text: 'Enterobius vermicularis es un parásito pequeño, de color blanco y con forma de hilo. Los machos son más pequeños que las hembras y tienen una cola curvada.',
          },
          {
            title: 'Morfología del Huevo',
            text: 'Los huevos son característicamente asimétricos, aplanados en un lado y con forma de "D". Tienen una cáscara transparente y son muy ligeros, lo que facilita su dispersión por el aire. Los modelos 3D son útiles para su visualización.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG4',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Las hembras adultas tienen una cola larga y afilada, de ahí su nombre de "oxiuro" o "gusano en forma de alfiler". Su morfología es un rasgo distintivo para su identificación.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG5',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Enterobius vermicularis es directo. Comienza con la ingestión de huevos y se completa en el tracto gastrointestinal del mismo huésped.',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Huevos',
                description: 'Ingeridos, eclosionan en el intestino delgado',
                imgUrl: cdvEnterobiusEgg,
              },
              {
                title: 'Larvas',
                description: 'Migran al intestino grueso y maduran',
                imgUrl: cdvEnterobiusLarvae,
              },
              {
                title: 'Adultos',
                description: 'Viven en el colon; hembras grávidas migran a la región perianal',
                imgUrl: cdvEnterobiusColon,
              },
              {
                title: 'Oviposición',
                description: 'Las hembras ponen huevos en la piel perianal, causando picazón',
                imgUrl: cdvEnterobiusAnus,
              },
            ],
          },
        ],
      },
    },
  },
  'trichuris-trichiura': {
    title: 'Trichuris trichiura',
    subtitle: 'Gusano látigo',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Trichuris trichiura, o gusano látigo, es un parásito nematodo que causa la tricuriasis. Es un geohelminto, lo que significa que sus huevos se desarrollan en el suelo antes de volverse infecciosos. Las infecciones son más comunes en áreas tropicales y subtropicales con saneamiento deficiente.',
            imgUrl: '',
          },
          {
            title: 'Importancia Clínica',
            text: 'Infecciones ligeras son a menudo asintomáticas, pero las infecciones crónicas pueden causar dolor abdominal, diarrea sanguinolenta, anemia y, en casos severos, prolapso rectal. El tratamiento antiparasitario es efectivo, y la prevención incluye la higiene y el saneamiento.',
          },
        ],
      },
      morphology: {
        sections: [
          {
            title: 'Morfología',
            text: 'Trichuris trichiura es conocido por su forma distintiva de látigo. Su parte anterior es larga y delgada, mientras que la posterior es corta y gruesa.',
          },
          {
            title: 'Morfología del Huevo',
            text: 'Los huevos son únicos, con forma de barril o limón y tapones polares en ambos extremos. Su color es marrón-amarillento. Esta morfología es un rasgo distintivo para su diagnóstico microscópico.',
            imgUrl:
              'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg1',
          },
          {
            title: 'Morfología del Adulto',
            text: 'El macho adulto tiene el extremo posterior enrollado, mientras que la hembra tiene una cola recta. Se adhieren a la mucosa del intestino grueso, especialmente del ciego, lo que les da su nombre.',
            imgUrl:
              'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg2',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Trichuris trichiura es directo, con una etapa de maduración de los huevos en el suelo antes de la infección.',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Huevos inmaduros',
                description: 'Eliminados en las heces, maduran en el suelo',
                imgUrl: cdvTrichurisIEgg,
              },
              {
                title: 'Huevos embrionados',
                description:
                  'Se vuelven infecciosos después de 15-30 días en el suelo. Son ingeridos',
                imgUrl: cdvTrichurisMEgg,
              },
              {
                title: 'Larvas',
                description: 'Eclosionan en el intestino delgado y migran al ciego',
                imgUrl: cdvTrichurisLarvae,
              },
              {
                title: 'Adultos',
                description: 'Se adhieren a la pared del intestino grueso y producen huevos',
                imgUrl: cdvTrichurisIntestine,
              },
            ],
          },
        ],
      },
    },
  },
  'necator-americanus': {
    title: 'Necator americanus',
    subtitle: 'Gusano gancho del Nuevo Mundo',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Necator americanus es un nematodo parásito conocido como gusano gancho. Causa la uncinariasis, una de las principales causas de anemia en regiones tropicales. La infección ocurre cuando las larvas en el suelo penetran la piel del huésped humano.',
            imgUrl: '',
          },
          {
            title: 'Importancia Clínica',
            text: 'La uncinariasis puede causar erupción cutánea en el sitio de penetración, síntomas pulmonares leves y, en infecciones crónicas, anemia por deficiencia de hierro. El control se basa en el saneamiento adecuado y el tratamiento en masa en áreas endémicas.',
          },
        ],
      },
      morphology: {
        sections: [
          {
            title: 'Morfología',
            text: 'Necator americanus es un gusano pequeño y curvo. Su característica más distintiva es su cápsula bucal, que contiene placas cortantes para adherirse a la pared intestinal.',
          },
          {
            title: 'Morfología de la Larva',
            text: 'Las larvas filariformes son la etapa infecciosa. Tienen una cubierta externa que las hace resistentes a las condiciones ambientales, lo que les permite sobrevivir en el suelo y esperar a un huésped. Su morfología es clave para la identificación.',
            imgUrl:
              'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg8',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Los adultos tienen una forma de "C" y se adhieren a la mucosa intestinal para alimentarse de sangre, lo que puede causar anemia. La boca tiene dos placas cortantes que son distintivas.',
            imgUrl:
              'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg9',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Necator americanus es complejo, comenzando con la penetración de la piel por parte de las larvas y terminando con su maduración en el intestino delgado.',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Huevos',
                description: 'Eliminados en las heces, eclosionan en el suelo',
                imgUrl: cdvNecatorEgg,
              },
              {
                title: 'Larvas Rhabditiformes',
                description: 'Etapa de alimentación en el suelo',
                imgUrl: cdvNecatorRLarvae,
              },
              {
                title: 'Larvas Filariformes',
                description: 'Infecciosas, penetran la piel y viajan a los pulmones',
                imgUrl: cdvNecatorFLarvae,
              },
              {
                title: 'Adultos',
                description:
                  'Son deglutidos, maduran en el intestino delgado, se adhieren y se alimentan',
                imgUrl: cdvNecatorAdult,
              },
            ],
          },
        ],
      },
    },
  },
  'giardia-duodenalis': {
    title: 'Giardia duodenalis',
    subtitle: 'Protozoo flagelado',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Giardia duodenalis, también conocida como Giardia lamblia, es un protozoo flagelado que causa la giardiasis. Es una de las causas más comunes de enfermedades diarreicas a nivel mundial. La infección se adquiere a través de la ingestión de quistes resistentes que se encuentran en el agua o alimentos contaminados.',
            imgUrl: '',
          },
          {
            title: 'Importancia Clínica',
            text: 'La giardiasis puede causar diarrea acuosa, calambres abdominales, hinchazón, fatiga y pérdida de peso. En algunos casos, la infección puede volverse crónica, llevando a la malabsorción de nutrientes. Es especialmente un problema en guarderías y áreas con agua no potable.',
          },
        ],
      },
      morphology: {
        sections: [
          {
            title: 'Morfología',
            text: 'Giardia duodenalis existe en dos formas morfológicas: el quiste y el trofozoíto. El trofozoíto es la forma activa y patógena, mientras que el quiste es la forma infecciosa y resistente en el ambiente.',
          },
          {
            title: 'Morfología del Quiste',
            text: 'El quiste es ovalado y altamente resistente al cloro y a la desecación, lo que permite su supervivencia en el agua y el suelo. Contiene los componentes del futuro trofozoíto. Esta morfología es clave para su diagnóstico.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG15',
          },
          {
            title: 'Morfología del Trofozoíto',
            text: 'El trofozoíto tiene forma de pera, con simetría bilateral y cuatro pares de flagelos que le permiten moverse. Posee una ventosa adhesiva ventral que utiliza para adherirse a la pared del intestino delgado del huésped.',
            imgUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG16',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Giardia duodenalis es simple y se completa en un solo huésped. Implica la alternancia entre la forma de quiste (infecciosa) y la de trofozoíto (activa).',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Ingestión',
                description:
                  'El huésped ingiere quistes de Giardia en agua o alimentos contaminados',
                imgUrl: cdvGiardiaCyst,
              },
              {
                title: 'Exquistación',
                description: 'En el intestino delgado, el quiste se transforma en trofozoíto',
                imgUrl: cdvGiardiaTrophozoite,
              },
              {
                title: 'Colonización',
                description:
                  'Los trofozoítos se adhieren al revestimiento intestinal para alimentarse y reproducirse',
                imgUrl: cdvGiardiaColonization,
              },
              {
                title: 'Enquistamiento',
                description: 'En el colon, los trofozoítos se transforman nuevamente en quistes',
                imgUrl: cdvGiardiaElimination,
              },
              {
                title: 'Eliminación',
                description:
                  'Los quistes son eliminados en las heces, listos para infectar a un nuevo huésped',
                imgUrl: cdvGiardiaElimination,
              },
            ],
          },
        ],
      },
    },
  },
};

export const data: IMapData[] = [
  { id: '02', detections: 45 }, // Amazonas
  { id: '03', detections: 120 }, // Anzoategui
  { id: '04', detections: 20 }, // Apure
  { id: '05', detections: 250 }, // Aragua
  { id: '06', detections: 85 }, // Barinas
  { id: '07', detections: 300 }, // Bolívar
  { id: '08', detections: 150 }, // Carabobo
  { id: '09', detections: 70 }, // Cojedes
  { id: '10', detections: 15 }, // Delta Amacuro
  { id: '01', detections: 350 }, // Distrito Capital
  { id: '11', detections: 90 }, // Falcón
  { id: '12', detections: 110 }, // Guárico
  { id: '13', detections: 180 }, // Lara
  { id: '14', detections: 220 }, // Mérida
  { id: '15', detections: 400 }, // Miranda
  { id: '16', detections: 60 }, // Monagas
  { id: '17', detections: 10 }, // Nueva Esparta
  { id: '18', detections: 130 }, // Portuguesa
  { id: '19', detections: 40 }, // Sucre
  { id: '20', detections: 190 }, // Táchira
  { id: '21', detections: 160 }, // Trujillo
  { id: '24', detections: 380 }, // Vargas (La Guaira)
  { id: '22', detections: 55 }, // Yaracuy
  { id: '00', detections: 5 }, // Zona en Reclamación
  { id: '23', detections: 280 }, // Zulia
];

export const model_mesh_details: Record<string, IModelDetails> = {
  // ====================================================================
  // 1. ASCARIS LUMBRICOIDES
  // ====================================================================
  'ascaris-lumbricoides_A': {
    Cabeza_mesh: {
      title: 'Extremo Anterior (Boca)',
      description:
        'Área de la boca con tres labios prominentes, utilizada para la ingesta de alimentos.',
    },
    ExtAnt_mesh: {
      title: 'Parte Anterior del Cuerpo',
      description: 'Contiene estructuras digestivas y esofágicas.',
    },
    ExtPost_mesh: {
      title: 'Parte Posterior del Cuerpo',
      description:
        'Sección que contiene los órganos reproductivos y, en el macho, las espículas copuladoras.',
    },
    Cola_mesh: {
      title: 'Cola (Macho/Hembra)',
      description: 'Forma curvada en el macho y recta en la hembra adulta.',
    },
    DEFAULT: {
      title: 'Ascaris lumbricoides Adulto',
      description: 'Haz clic en una parte del modelo para ver su función.',
    },
    // --- DETALLES DE RAYOS X (ADULTO) ---
    XRAY_DETAILS: {
      title: 'Sistemas Orgánicos Internos',
      description:
        'Se revela el tubo digestivo completo (esófago, intestino) y las estructuras reproductivas (ovarios, útero) altamente enrolladas que ocupan gran parte de la cavidad corporal.',
    },
  },

  'ascaris-lumbricoides_H': {
    mesh_0: {
      title: 'Cáscara Mamilonada y Capa Albúmina',
      description:
        'Capa externa gruesa y rugosa (mamilonada) que proporciona resistencia extrema en el medio ambiente.',
    },
    DEFAULT: {
      title: 'Huevo de Ascaris lumbricoides',
      description:
        'Modelo del huevo. En la vista de Rayos X, se observarán las múltiples capas internas (albúmina, quitina) y el embrión.',
    },
    // --- DETALLES DE RAYOS X (HUEVO) ---
    XRAY_DETAILS: {
      title: 'Capas de Protección y Embrión',
      description:
        'Se aprecian las tres capas esenciales: la capa vitelina (lípidos), la capa de quitina (estructura) y el contenido celular interno o el embrión en desarrollo.',
    },
  },

  // ====================================================================
  // 2. ENTEROBIUS VERMICULARIS
  // ====================================================================
  'enterobius-vermicularis_A': {
    Cabeza_mesh: {
      title: 'Extremo Anterior y Alas Cefálicas',
      description:
        'El área de la boca que, en las hembras, presenta expansiones cuticulares distintivas (alas cefálicas).',
    },
    ExtAnt_mesh: {
      title: 'Esófago y Bulbo',
      description:
        'La región que contiene el esófago, caracterizada por un bulbo posterior que ayuda a la succión.',
    },
    ExtPost_mesh: {
      title: 'Útero (Hembra)',
      description:
        'En la hembra, la porción del cuerpo que contiene el útero, a menudo lleno de huevos antes de la oviposición.',
    },
    Cola_mesh: {
      title: 'Cola Filiforme',
      description: 'La cola larga y afilada, distintiva del oxiuro (pinworm).',
    },
    DEFAULT: {
      title: 'Enterobius vermicularis Adulto',
      description: 'Haz clic en una parte del modelo para ver su función.',
    },
    // --- DETALLES DE RAYOS X (ADULTO) ---
    XRAY_DETAILS: {
      title: 'Detalles del Aparato Reproductor',
      description:
        'En la hembra adulta, el modo Rayos X destaca el útero, que a menudo está completamente distendido (lleno) con miles de huevos maduros listos para la oviposición perianal.',
    },
  },

  'enterobius-vermicularis_H': {
    mesh_0: {
      title: 'Cáscara Lisa y Asimétrica',
      description:
        "Capa externa lisa y transparente. Su forma es característicamente asimétrica, aplanada en un lado (parecido a una 'D').",
    },
    DEFAULT: {
      title: 'Huevo de Enterobius vermicularis',
      description:
        'Modelo del huevo. En la vista de Rayos X, se apreciará la larva en su interior, ya que se excretan larvados.',
    },
    // --- DETALLES DE RAYOS X (HUEVO) ---
    XRAY_DETAILS: {
      title: 'Larva en su Interior',
      description:
        'La vista Rayos X muestra la larva completamente desarrollada, enrollada dentro del huevo. Esto confirma que son infecciosos inmediatamente después de ser depositados.',
    },
  },

  // ====================================================================
  // 3. TRICHURIS TRICHIURA
  // ====================================================================
  'trichuris-trichiura_A': {
    ExtAnt_mesh: {
      title: 'Extremo Anterior Delgado (Látigo)',
      description:
        'La parte delgada y filiforme del gusano, utilizada para insertarse en la mucosa intestinal y anclarse.',
    },
    ExtPost_mesh: {
      title: 'Extremo Posterior Grueso (Mango)',
      description:
        'La parte más gruesa del cuerpo, donde se encuentran los principales órganos digestivos y reproductivos.',
    },
    DEFAULT: {
      title: 'Trichuris trichiura Adulto',
      description: 'Haz clic en una parte del modelo para ver su función.',
    },
    // --- DETALLES DE RAYOS X (ADULTO) ---
    XRAY_DETAILS: {
      title: 'Esófago Esticosoma y Órganos',
      description:
        'Se observa el esticosoma, una estructura esofágica glandular distintiva que secreta enzimas, clave para su fijación en el intestino grueso. También se ven los órganos reproductivos en la parte gruesa.',
    },
  },

  'trichuris-trichiura_H': {
    mesh_0: {
      title: 'Cáscara en Forma de Barril y Tapones Polares',
      description:
        'Capa externa marrón y gruesa que le da una forma de barril o limón, con tapones polares hialinos en ambos extremos.',
    },
    DEFAULT: {
      title: 'Huevo de Trichuris trichiura',
      description:
        'Modelo del huevo. En la vista de Rayos X, destacará el embrión inmaduro y el área de los tapones polares.',
    },
    // --- DETALLES DE RAYOS X (HUEVO) ---
    XRAY_DETAILS: {
      title: 'Célula Inmadura y Tapones Polares',
      description:
        'La vista Rayos X muestra el contenido celular inmaduro y la densidad de los tapones polares en ambos extremos, que sellan la cáscara para su protección ambiental.',
    },
  },

  // ====================================================================
  // 4. NECATOR AMERICANUS
  // ====================================================================
  'necator-americanus_A': {
    Cabeza_mesh: {
      title: 'Cápsula Bucal',
      description:
        'La boca con placas cortantes que utiliza para adherirse a la pared intestinal y alimentarse de la sangre del huésped, causando anemia.',
    },
    Cuerpo_mesh: {
      title: 'Cuerpo Adulto',
      description:
        "El cuerpo en forma de 'C' o 'S' invertida, donde tiene lugar la digestión y la reproducción.",
    },
    DEFAULT: {
      title: 'Necator americanus Adulto',
      description: 'Haz clic en una parte del modelo para ver su función.',
    },
    // --- DETALLES DE RAYOS X (ADULTO) ---
    XRAY_DETAILS: {
      title: 'Bursa Copulatriz y Órganos',
      description:
        'En el macho, la vista resalta la Bursa Copulatriz con sus rayos distintivos, usada para el acoplamiento. En ambos sexos, se aprecian las estructuras internas clave para la succión de sangre.',
    },
  },

  'necator-americanus_H': {
    mesh_0: {
      title: 'Cáscara Lisa y Segmentación',
      description:
        'Capa externa muy delgada e incolora, lo que facilita observar las primeras etapas de segmentación de la célula interna.',
    },
    DEFAULT: {
      title: 'Huevo de Necator americanus',
      description:
        'Modelo del huevo. En la vista de Rayos X, se apreciará el espacio claro entre la capa exterior y el contenido celular.',
    },
    // --- DETALLES DE RAYOS X (HUEVO) ---
    XRAY_DETAILS: {
      title: 'Contenido Celular y Espacio Perivitellino',
      description:
        'La vista Rayos X destaca la clara división celular interna (segmentación) y el notable espacio perivitellino entre la cáscara y el contenido celular.',
    },
  },

  // ====================================================================
  // 5. GIARDIA DUODENALIS (Trofozoíto y Quiste)
  // ====================================================================
  'giardia-duodenalis_A': {
    Nucleo_mesh: {
      title: 'Núcleos',
      description:
        'Giardia posee dos núcleos prominentes (binucleado), que contienen el material genético del parásito.',
    },
    DiscoVent_mesh: {
      title: 'Disco Adhesivo Ventral',
      description:
        "Una estructura cóncava que el trofozoíto utiliza como 'ventosa' para adherirse firmemente a la mucosa del intestino delgado.",
    },
    CuerpoMedio_mesh: {
      title: 'Axostilo y Cuerpos Medios',
      description:
        'Estructuras internas que proporcionan soporte y rigidez, funcionando como un citoesqueleto central.',
    },
    Cuerpo_mesh: {
      title: 'Cuerpo del Trofozoíto',
      description:
        'La forma activa del parásito, caracterizada por su forma piriforme (de pera) y su simetría bilateral.',
    },
    Flagelos_mesh: {
      title: 'Flagelos',
      description:
        'Ocho apéndices filamentosos (cuatro pares) que permiten el movimiento rápido y activo del trofozoíto en el intestino.',
    },
    DEFAULT: {
      title: 'Giardia duodenalis Trofozoíto',
      description: 'Haz clic en una parte para ver su función detallada.',
    },
    // --- DETALLES DE RAYOS X (TROFOZOÍTO) ---
    XRAY_DETAILS: {
      title: 'Estructuras Internas (Dorsal)',
      description:
        'La vista Rayos X revela los dos núcleos y el axostilo que corre por el centro, proporcionando una vista de las estructuras de soporte internas ocultas bajo el cuerpo.',
    },
  },

  'giardia-duodenalis_H': {
    mesh_0: {
      title: 'Pared Quística Gruesa y Elíptica',
      description:
        'La pared quística es gruesa y altamente resistente al ambiente y a la cloración, siendo la forma infecciosa del parásito.',
    },
    DEFAULT: {
      title: 'Quiste de Giardia duodenalis',
      description:
        'Modelo del quiste. En la vista de Rayos X, se observarán las estructuras internas duplicadas (núcleos y axostilo) listas para la exquistación.',
    },
    // --- DETALLES DE RAYOS X (QUISTE) ---
    XRAY_DETAILS: {
      title: 'Estructuras Internas Duplicadas',
      description:
        'Se ven los cuatro núcleos (a diferencia de los dos del trofozoíto) y las estructuras duplicadas (axostilo y cuerpos medios), indicando que el parásito está listo para la división al salir del quiste.',
    },
  },
};

export const PARASITE_MODELS = {
  ASCARIS_A: '/3d_models/ascaris-lumbricoides_A.glb',
  ASCARIS_H: '/3d_models/ascaris-lumbricoides_H.glb',
  ENTEROBIUS_A: '/3d_models/enterobius-vermicularis_A.glb',
  ENTEROBIUS_H: '/3d_models/enterobius-vermicularis_H.glb',
  GIARDIA_A: '/3d_models/giardia-duodenalis_A.glb',
  GIARDIA_H: '/3d_models/giardia-duodenalis_H.glb',
  NECATOR_A: '/3d_models/necator-americanus_A.glb',
  NECATOR_H: '/3d_models/necator-americanus_H.glb',
  TRICHURIS_A: '/3d_models/trichuris-trichiura_A.glb',
  TRICHURIS_H: '/3d_models/trichuris-trichiura_H.glb',
};
