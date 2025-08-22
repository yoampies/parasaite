//constants.js

//History.jsx
import analysis1 from "/images/analysis1.png"
import analysis2 from "/images/analysis2.png"
import analysis3 from "/images/analysis3.png"
import analysis4 from "/images/analysis4.png"
import analysis5 from "/images/analysis5.png"

//Scanner.jsx
import recent1 from "/images/recent1.png"
import recent2 from "/images/recent2.png"
import recent3 from "/images/recent3.png"

//Library.jsx
import ascaris from "/images/parasites-ascaris.png"
import enterobius from "/images/parasites-enterobius.jpg"
import trichuris from "/images/parasites-trichuris.jpg"
import necator from "/images/parasites-necator.jpg"
import giardia from "/images/parasites-giardia.jpg"

// Helper function to generate content from detected parasites
const generateContent = (detectedParasites) => {
  if (detectedParasites && detectedParasites.length > 0) {
    const parasiteInfo = detectedParasites.map(p => p.label).join(', ');
    const avgConfidence = detectedParasites.reduce((sum, p) => sum + p.value, 0) / detectedParasites.length;
    return `Detectado: ${parasiteInfo}, Confianza Promedio: ${Math.round(avgConfidence)}%`;
  }
  return 'Detectado: No se encontraron parásitos';
};


// History.jsx
export const recentAnalyses = [
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
        content: 'Detectado: Giardia duodenale (2), Confianza Promedio: 88%',
        imgURL: analysis2,
        detectedParasites: [
            { label: 'Giardia duodenale', value: 88 },
        ],
    },
    {
        id: 3,
        date: '2024-01-13 09:15 AM',
        content: 'Detectado: Enterobius vermicularis (1), Confianza Promedio: 75%',
        imgURL: analysis3,
        detectedParasites: [
            { label: 'Enterobius vermicularis', value: 75 },
        ],
    },
    {
        id: 4,
        date: '2024-01-12 04:00 PM',
        content: 'Detectado: Trichuris trichiura (4), Confianza Promedio: 92%',
        imgURL: analysis4,
        detectedParasites: [
            { label: 'Trichuris trichiura', value: 92 },
        ],
    },
    {
        id: 5,
        date: '2024-01-11 11:00 AM',
        content: 'Detectado: No se encontraron parásitos, Confianza Promedio: 99%',
        imgURL: analysis5,
        detectedParasites: [],
    },
];

export const parasiteTypes = [
  'Ascaris lumbricoides',
  'Enterobius vermicularis',
  'Trichuris trichiura',
  'Necator americanus',
  'Giardia duodenale',
];

export const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const feedbackStatus = ['En Progreso', 'Revisado', 'Completado'];

// Scanner.jsx
export const possibleParasites = [
  'Giardia duodenale',
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

export const recentImages = [
    {
        id: 1,
        imgURL: recent1,
        date: '2024-01-01 03:00 PM',
        fileName: 'sample_image_1.png',
        detectedParasites: [
            { label: 'Ascaris lumbricoides', value: 95 },
            { label: 'Trichuris trichiura', value: 89 },
        ],
        // ⭐ ADDED THIS LINE ⭐
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
        detectedParasites: [
            { label: 'Giardia duodenale', value: 88 },
        ],
        // ⭐ ADDED THIS LINE ⭐
        content: generateContent([
            { label: 'Giardia duodenale', value: 88 },
        ]),
    },
    {
        id: 3,
        imgURL: recent3,
        date: '2024-01-03 12:00 M',
        fileName: 'sample_image_3.png',
        detectedParasites: [
            { label: 'Enterobius vermicularis', value: 75 },
        ],
        // ⭐ ADDED THIS LINE ⭐
        content: generateContent([
            { label: 'Enterobius vermicularis', value: 75 },
        ]),
    },
];

// Library.jsx
export const parasites = [
  {
    id: 1,
    name: 'Ascaris lumbricoides',
    description: 'Ascaris lumbricoides es un parásito nematodo (gusano redondo) que causa la ascariasis. Es la infección por helmintos más común a nivel mundial.',
    imgURL: ascaris,
  },
  {
    id: 2,
    name: 'Enterobius vermicularis',
    description:
      'Enterobius vermicularis, conocido como oxiuro, es un nematodo que causa la enterobiasis. Es una de las infecciones por parásitos más comunes en los niños.',
    imgURL: enterobius,
  },
  {
    id: 3,
    name: 'Trichuris trichiura',
    description:
      'Trichuris trichiura, o gusano látigo, es un parásito nematodo que causa la tricuriasis. Es un geohelminto, común en áreas tropicales y subtropicales.',
    imgURL: trichuris,
  },
  {
    id: 4,
    name: 'Necator americanus',
    description:
      'Necator americanus es un nematodo parásito conocido como gusano gancho. Causa la uncinariasis, una de las principales causas de anemia en regiones tropicales.',
    imgURL: necator,
  },
  {
    id: 5,
    name: 'Giardia duodenale',
    description:
      'Giardia duodenale, también conocida como Giardia lamblia, es un protozoo flagelado que causa la giardiasis, una enfermedad diarreica común.',
    imgURL: giardia,
  },
];

// ParasiteDetails.jsx
export const parasiteData = {
  'ascaris-lumbricoides': {
    title: 'Ascaris lumbricoides',
    subtitle: 'Lombriz intestinal gigante',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Ascaris lumbricoides es un parásito nematodo (gusano redondo) que causa la ascariasis. Es la infección por helmintos más común a nivel mundial, especialmente en áreas con saneamiento deficiente. El parásito se transmite a través de la ingestión de huevos de Ascaris presentes en el suelo o alimentos contaminados. Su ciclo de vida es complejo, involucrando una migración por los pulmones antes de madurar en el intestino.',
            imgUrl: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=video&cd=&cad=rja&uact=8&ved=2ahUKEwjq5diFk6CPAxUfVTABHZyLJ5UQtwJ6BAgZEAI&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Do9Iny7sLM2o&usg=AOvVaw1uU-nII32NzE0w7ULyCBYn&opi=89978449',
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
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv7',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Los machos adultos son más pequeños y tienen una cola curvada, mientras que las hembras son más grandes y rectas. Su anatomía interna es compleja, incluyendo un sistema reproductivo prominente. Los modelos 3D proporcionan una vista completa de estas características.',
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv8',
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
              { title: 'Huevos', description: 'Ingeridos por el huésped, eclosionan en el intestino', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv9' },
              { title: 'Larvas', description: 'Migran del intestino al torrente sanguíneo, pasando por hígado y pulmones', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG0' },
              {
                title: 'Tracto respiratorio',
                description: 'Las larvas son tosidas y tragadas, volviendo al intestino delgado',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG1',
              },
              { title: 'Adultos', description: 'Maduran en el intestino delgado, se aparean y ponen huevos', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG2' },
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
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG3',
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
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG4',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Las hembras adultas tienen una cola larga y afilada, de ahí su nombre de "oxiuro" o "gusano en forma de alfiler". Su morfología es un rasgo distintivo para su identificación.',
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG5',
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
              { title: 'Huevos', description: 'Ingeridos, eclosionan en el intestino delgado', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG6' },
              { title: 'Larvas', description: 'Migran al intestino grueso y maduran', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG7' },
              { title: 'Adultos', description: 'Viven en el colon; hembras grávidas migran a la región perianal', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG8' },
              { title: 'Oviposición', description: 'Las hembras ponen huevos en la piel perianal, causando picazón', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG9' },
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
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg0',
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
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg1',
          },
          {
            title: 'Morfología del Adulto',
            text: 'El macho adulto tiene el extremo posterior enrollado, mientras que la hembra tiene una cola recta. Se adhieren a la mucosa del intestino grueso, especialmente del ciego, lo que les da su nombre.',
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg2',
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
              { title: 'Huevos inmaduros', description: 'Eliminados en las heces, maduran en el suelo', imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg3' },
              {
                title: 'Huevos embrionados',
                description: 'Se vuelven infecciosos después de 15-30 días en el suelo. Son ingeridos',
                imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg4',
              },
              { title: 'Larvas', description: 'Eclosionan en el intestino delgado y migran al ciego', imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg5' },
              {
                title: 'Adultos',
                description: 'Se adhieren a la pared del intestino grueso y producen huevos',
                imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg6',
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
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg7',
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
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg8',
          },
          {
            title: 'Morfología del Adulto',
            text: 'Los adultos tienen una forma de "C" y se adhieren a la mucosa intestinal para alimentarse de sangre, lo que puede causar anemia. La boca tiene dos placas cortantes que son distintivas.',
            imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg9',
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
              { title: 'Huevos', description: 'Eliminados en las heces, eclosionan en el suelo', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG20' },
              { title: 'Larvas Rhabditiformes', description: 'Etapa de alimentación en el suelo', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG21' },
              {
                title: 'Larvas Filariformes',
                description: 'Infecciosas, penetran la piel y viajan a los pulmones',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG22',
              },
              {
                title: 'Adultos',
                description: 'Son deglutidos, maduran en el intestino delgado, se adhieren y se alimentan',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG23',
              },
            ],
          },
        ],
      },
    },
  },
  'giardia-duodenale': {
    title: 'Giardia duodenale',
    subtitle: 'Protozoo flagelado',
    tabs: {
      overview: {
        sections: [
          {
            title: 'Descripción general',
            text: 'Giardia duodenale, también conocida como Giardia lamblia, es un protozoo flagelado que causa la giardiasis. Es una de las causas más comunes de enfermedades diarreicas a nivel mundial. La infección se adquiere a través de la ingestión de quistes resistentes que se encuentran en el agua o alimentos contaminados.',
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG14',
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
            text: 'Giardia duodenale existe en dos formas morfológicas: el quiste y el trofozoíto. El trofozoíto es la forma activa y patógena, mientras que el quiste es la forma infecciosa y resistente en el ambiente.',
          },
          {
            title: 'Morfología del Quiste',
            text: 'El quiste es ovalado y altamente resistente al cloro y a la desecación, lo que permite su supervivencia en el agua y el suelo. Contiene los componentes del futuro trofozoíto. Esta morfología es clave para su diagnóstico.',
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG15',
          },
          {
            title: 'Morfología del Trofozoíto',
            text: 'El trofozoíto tiene forma de pera, con simetría bilateral y cuatro pares de flagelos que le permiten moverse. Posee una ventosa adhesiva ventral que utiliza para adherirse a la pared del intestino delgado del huésped.',
            imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG16',
          },
        ],
      },
      lifeCycle: {
        sections: [
          {
            title: 'Ciclo de Vida',
            text: 'El ciclo de vida de Giardia duodenale es simple y se completa en un solo huésped. Implica la alternancia entre la forma de quiste (infecciosa) y la de trofozoíto (activa).',
          },
          {
            title: 'Etapas del Ciclo de Vida',
            stages: [
              {
                title: 'Ingestión',
                description: 'El huésped ingiere quistes de Giardia en agua o alimentos contaminados',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG17',
              },
              {
                title: 'Exquistación',
                description: 'En el intestino delgado, el quiste se transforma en trofozoíto',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG18',
              },
              {
                title: 'Colonización',
                description: 'Los trofozoítos se adhieren al revestimiento intestinal para alimentarse y reproducirse',
                imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG19',
              },
              {
                title: 'Enquistamiento',
                description: 'En el colon, los trofozoítos se transforman nuevamente en quistes',
                imgUrl: 'https://lh3.googleusercontent.com/\n...\nI0',
              },
              {
                title: 'Eliminación',
                description: 'Los quistes son eliminados en las heces, listos para infectar a un nuevo huésped',
                imgUrl: 'https://lh3.googleusercontent.com/\n...\nI1',
              },
            ],
          },
        ],
      },
    },
  },
};