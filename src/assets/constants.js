//History.jsx
export const recentAnalyses = [
  { id: 1, date: "2024-01-15 10:30 AM", content: "Detectado: Ascaris lumbricoides (3), Confianza Promedio: 95%", imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdfbm3CDY0NleMFV0EYe3e8aH-5Blx1dgN2YTBE1D73_pThB2brPR-ZZPRhhqpMXUvknz0qfVwcg2w1N7kZdd8Z_BNd9mjuPIaAVsNTiDJ0lYEymZDpQylWOyJuUWVh_k8eiDaxZr8MiCLHS9YrpTNN12qNT5J2IFrIBU4zVh07nQ1U6DUHWFFRwPy2sLBNBT2vmyW6aO5cZE89CcHKkhgtTZ6abFV-txenzlC3z-PBJVPZ16vJovDSvNbzLIh_NoFsp9zc788u-lX" },
  { id: 2, date: "2024-01-14 02:45 PM", content: "Detectado: Giardia duodenale (2), Confianza Promedio: 88%", imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsECcwAgWbGYmFDFqd-rAHcz1mfOMYflFPEwgViRn9Jo8kmrHWsELDaL3kkTtpgNH-8NuhDHIyZ_adMtHpdloOI4MGtKpkPWpWhAgodexxuImgqjYiUY3PhGiHlOBUt27s2l5PXv4SiQmwRKoPY0pIkORTfr91A5xIwim2CKQ2D44P_LJZfbBCi_2OU-5_a3vUXFwuDo_8QfpxJXJhiShNE8_ojMcASIR3sqRBFSqD_GuxZUC-gmbu-jnH40jzBRg7lgucEjPm4IjD" },
  { id: 3, date: "2024-01-13 09:15 AM", content: "Detectado: Enterobius vermicularis (1), Confianza Promedio: 75%", imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHQY8zm2e5OgAPyylQiwk20KryUMN9VPufcYhbVKOgQvdqGLCzYcLw70_QANFyjASJjOj7-rdF8V85RskMzNiUhWQC7gB3L7xhy_ad1DDr3kgkkIXPao9W-rD0ms6KHRXwIU8qIUE_2Sims4kwlhl4q15xhF2OD_ZM-TbxVUjGYWNmnxt3BMLzm5f51esz8ZzAVdMLq_aid-BKrCWhbPLGEabgJcIQwZIX9SGcLsfr8GfZIPhWV7L7yfm8oHip1kc2YBUUhxy7_-OE" },
  { id: 4, date: "2024-01-12 04:00 PM", content: "Detectado: Trichuris trichiura (4), Confianza Promedio: 92%", imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv" },
  { id: 5, date: "2024-01-11 11:00 AM", content: "Detectado: No se encontraron parásitos, Confianza Promedio: 99%", imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG" },
];

export const parasiteTypes = [
  "Ascaris lumbricoides",
  "Enterobius vermicularis",
  "Trichuris trichiura",
  "Necator americanus",
  "Giardia duodenale"
];

export const weekDays = [
    {id: 1, name: "D"},
    {id: 2, name: "L"},
    {id: 3, name: "M"},
    {id: 4, name: "M"},
    {id: 5, name: "J"},
    {id: 6, name: "V"},
    {id: 7, name: "S"}
];

export const feedbackStatus = [
    "Feedback Pendiente",
    "Feedback Enviado"
];

//Scanner.jsx
export const recentImages = [
  {id: 1, imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhRvycVo35Tj-vhLDOOqNAnoZ5xwnivz9lA9pUiUJJRAab50T_SdTnq190ZUC_niIBpbTS5Vhcm1gSW-SwCWmZRuhauGwwjnCt6yqVVvM0kr7FO3OiU9esMqyBwHz3Ury2BfMoE4iUwbw4ZURPczL3fgesxAtAE_-CbAmHH0auvTNi3US0gsMUba-Vlgt3FIIpAyIMmIfGiHvPaJfsfAfS444nnhtszZoQ-1DwE-u7jYcaf4rKn56BkC0xOc9_QcXBpU_wBmgHXJ-b"},
  {id: 2, imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Ev-z_K8S5J57mhT8QazsJdJFxGJE7J3yVEl7tgN_-iSGlHLh-eyN-yLgO0ZNe4Nys6AduknmjQCV8-9l4qoA2lzR_urdWPfmvR7cK2zAHqlRIPKcag0Ktsxz61_IRLv9DGfWHcvm3mwn-WXJBHnyYXUqLCsXXvcZhXcrgxZVAr3WJLiEtp8EPVpyIOk-T2EWLdwh9OWRORMZA_o-GUAewgKkpCWOvQICJ4jGv6_miS35EyV8bie7ObvA9yn8UovYLrF3stm7NsS0"},
  {id: 3, imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKjJys1OW6VOdrxa9gTEMfN9bYLgmd1m8JUyZXZiZxJEZ3LiOanBt_s_gqoIvO6sK-KUSOpoHFmHiqBiKyaQTgeM30qQIernq97omtFXZPBwsYn1evcYQ0rnT2ymmtksZm1KxTxfwlGlRv65-fnmxGI85RhjsAFK3hf-QvLpp1e25l4L8MIoUwGoXmmXimlRZOHBPFX90J_p6_zOmdfIcz38Q1ExVrrOBEPzHC6I6eaIZnKNxU7GeuEdR30-KWQ640qubxXKLUVgT1"}
];

//Library.jax
export const parasites = [
  {
    id: 1,
    name: "Ascaris lumbricoides",
    description: "Ascaris lumbricoides es un parásito nematodo (gusano redondo) que causa la ascariasis. Es la infección por helmintos más común a nivel mundial.",
    imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv6",
  },
  {
    id: 2,
    name: "Enterobius vermicularis",
    description: "Enterobius vermicularis, conocido como oxiuro, es un nematodo que causa la enterobiasis. Es una de las infecciones por parásitos más comunes en los niños.",
    imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG3",
  },
  {
    id: 3,
    name: "Trichuris trichiura",
    description: "Trichuris trichiura, o gusano látigo, es un parásito nematodo que causa la tricuriasis. Es un geohelminto, común en áreas tropicales y subtropicales.",
    imgURL: "https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg0",
  },
  {
    id: 4,
    name: "Necator americanus",
    description: "Necator americanus es un nematodo parásito conocido como gusano gancho. Causa la uncinariasis, una de las principales causas de anemia en regiones tropicales.",
    imgURL: "https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg7",
  },
  {
    id: 5,
    name: "Giardia duodenale",
    description: "Giardia duodenale, también conocida como Giardia lamblia, es un protozoo flagelado que causa la giardiasis, una enfermedad diarreica común.",
    imgURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDOxuxaZqELAr7USNhFX9v0iRD5wm9yNugOm8-Xhs8ZzGZyWCqJpUPzyfy1sBneJHqZATobP08r3T1RMeDNpiVfaDfNLe0lCw3DtgxMI717Krzp5BT1UxfBfhd0XN6AlE0KSbnZk8LLU5Bsl0IPe2I1MsMxg9a9iodiCSLF_rXCLK_GxGy9PD1soCvPW6xYSLVdLP209i8XwzmMACJvgCZJfeo1gQf8ROIgwlmsmEQKscJJlycXOoN60aUZ92ezFdDjJPALof3mTE",
  },
];

//ParasiteDetails.jsx
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
              imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvu9BNeEJX10kEj2Sp6ILTpNA8Ub8pVI8zHuuCQyn87t_fFHCi8mL2pCbTXGy1DyVah-saE7KZ_u0cf9DeUvqR4mSyDwO8k5MP3bYpvFxxYsR-eTbHyjep1jOdsuOSdh0Y54sAYSAikSnReMrV51gKZAeRvd-GdFobBwGJdYtt1-HP6RCrFQ2qjY5QV-jSeVVuBeFzKa3bsIvNwpG38MOIBcw6fFsvje0DTirRnG2j940zZE0SQUd06acBE4zOrBkQo0mNYfX7Vzjv6',
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
                { title: 'Tracto respiratorio', description: 'Las larvas son tosidas y tragadas, volviendo al intestino delgado', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCigkBSx9w3rGJCcdrk3AZVzznMNXiEmgfz2aFMqSWUAmBO5HcNn1MqTOo9ygLqPC82cGGGALwatY0gvhEHDUJAnCIL3ZUKCINvaUShKHNT2_CglCfxVYdneS1iXp1ScDwjQeX0xbXZ4BDuiY5fSJS8zVOB3_G7DFMciGRKmsZUltGZktkP_pmi_LDCmfH2IVZkIeLPmSsk4679g4yquK5rSH9R7UQOJaDPTloiQ61b3DlfQa1n27egFP1Nftzd6uvt0QOWOu2wjySG1' },
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
                { title: 'Huevos embrionados', description: 'Se vuelven infecciosos después de 15-30 días en el suelo. Son ingeridos', imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg4' },
                { title: 'Larvas', description: 'Eclosionan en el intestino delgado y migran al ciego', imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg5' },
                { title: 'Adultos', description: 'Se adhieren a la pared del intestino grueso y producen huevos', imgUrl: 'https://lh3.googleusercontent.com/-l_CawD1EBeg/AAAAAAAAAAI/AAAAAAAAJxI/QbLdxKBUDjA/s0-c-k-no-ns/photo.jpg6' },
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
                { title: 'Huevos', description: 'Eliminados en las heces, eclosionan en el suelo', imgUrl: 'http://googleusercontent.com/profile/picture/60' },
                { title: 'Larvas Rhabditiformes', description: 'Etapa de alimentación en el suelo', imgUrl: 'http://googleusercontent.com/profile/picture/61' },
                { title: 'Larvas Filariformes', description: 'Infecciosas, penetran la piel y viajan a los pulmones', imgUrl: 'http://googleusercontent.com/profile/picture/62' },
                { title: 'Adultos', description: 'Son deglutidos, maduran en el intestino delgado, se adhieren y se alimentan', imgUrl: 'http://googleusercontent.com/profile/picture/63' },
              ],
            },
          ],
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
              imgUrl: 'http://googleusercontent.com/profile/picture/64',
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
              imgUrl: 'http://googleusercontent.com/profile/picture/65',
            },
            {
              title: 'Morfología del Trofozoíto',
              text: 'El trofozoíto tiene forma de pera, con simetría bilateral y cuatro pares de flagelos que le permiten moverse. Posee una ventosa adhesiva ventral que utiliza para adherirse a la pared del intestino delgado del huésped.',
              imgUrl: 'http://googleusercontent.com/profile/picture/66',
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
                { title: 'Ingestión', description: 'El huésped ingiere quistes de Giardia en agua o alimentos contaminados', imgUrl: 'http://googleusercontent.com/profile/picture/67' },
                { title: 'Exquistación', description: 'En el intestino delgado, el quiste se transforma en trofozoíto', imgUrl: 'http://googleusercontent.com/profile/picture/68' },
                { title: 'Colonización', description: 'Los trofozoítos se adhieren al revestimiento intestinal para alimentarse y reproducirse', imgUrl: 'http://googleusercontent.com/profile/picture/69' },
                { title: 'Enquistamiento', description: 'En el colon, los trofozoítos se transforman nuevamente en quistes', imgUrl: 'https://lh3.googleusercontent.com/\n...\nI0' },
                { title: 'Eliminación', description: 'Los quistes son eliminados en las heces, listos para infectar a un nuevo huésped', imgUrl: 'https://lh3.googleusercontent.com/\n...\nI1' },
              ],
            },
          ],
        },
      },
    },
  },
};