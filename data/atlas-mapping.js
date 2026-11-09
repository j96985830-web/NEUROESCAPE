/*
 * Mapeo auditado del GLB oficial de NIH 3D antes de la integración.
 * Fuente del modelo: Brain, Male v1.3, NIH 3D 3DPX-020960 (versión 1.01).
 * Los nombres coinciden con la jerarquía expuesta por el visor oficial del GLB.
 * No se usa una aproximación anatómica cuando el atlas no ofrece un nodo claro.
 */
window.NEUROSCAPE_ATLAS = {
  model: {
    name: "3d-vh-m-allen-brain.glb",
    entry: "3DPX-020960",
    version: "1.01",
    fileId: "742148",
    // La aplicación carga una copia local para evitar que el navegador bloquee
    // la petición GLB entre el origen de NEUROSCAPE y el dominio de NIH 3D.
    // No se usa un modelo alternativo si este archivo no está disponible.
    localUrl: "assets/3d-vh-m-allen-brain.glb",
    officialDownloadUrl: "https://3d.nih.gov/api/files/742148",
    landingPage: "https://3d.nih.gov/entries/20960?version=1.01",
    license: "CC BY 4.0",
    attribution: "Kristen Browne; Heidi Schlehlein. 2023. 3D Reference Organ for Brain, Male v1.3. NIH 3D. https://doi.org/10.48539/HBM929.XKCL.339",
    sourceDescription: "Derivado del Allen Human Reference Atlas – 3D, 2020; las 141 estructuras de referencia fueron reflejadas para formar un cerebro completo."
  },
  audit: {
    inspectedIn: "Visor oficial NIH 3D",
    hierarchyRoot: "Allen_brain",
    totalHierarchyLabels: 287,
    rules: [
      "Un mapeo directo usa el nodo anatómico homónimo del atlas.",
      "Un mapeo compuesto solo agrupa nodos explícitamente nombrados por el atlas.",
      "Una estructura sin nodo claro permanece sin selección 3D; no se usa un sustituto anatómico."
    ]
  },
  mappings: {
    frontal: {
      type: "composite",
      note: "El atlas no contiene un único nodo “frontal lobe”. La ficha agrupa giros y regiones frontales explícitos.",
      nodes: [
        "Allen_superior_frontal_gyrus_L", "Allen_superior_frontal_gyrus_R",
        "Allen_middle_frontal_gyrus_L", "Allen_middle_frontal_gyrus_R",
        "Allen_inferior_frontal_gyrus_triangular_part_L", "Allen_inferior_frontal_gyrus_triangular_part_R",
        "Allen_inferior_frontal_gyrus_opercular_part_L", "Allen_inferior_frontal_gyrus_opercular_part_R",
        "Allen_frontal_operculum_L", "Allen_frontal_operculum_R",
        "Allen_frontal_pole_L", "Allen_frontal_pole_R"
      ]
    },
    prefrontal: {
      type: "composite",
      note: "No existe un nodo “prefrontal cortex”. Es una agrupación pedagógica marcada como compuesta, no una parcela oficial del atlas.",
      nodes: [
        "Allen_frontal_pole_L", "Allen_frontal_pole_R",
        "Allen_superior_frontal_gyrus_L", "Allen_superior_frontal_gyrus_R",
        "Allen_middle_frontal_gyrus_L", "Allen_middle_frontal_gyrus_R",
        "Allen_inferior_frontal_gyrus_triangular_part_L", "Allen_inferior_frontal_gyrus_triangular_part_R",
        "Allen_inferior_frontal_gyrus_opercular_part_L", "Allen_inferior_frontal_gyrus_opercular_part_R",
        "Allen_medial_orbital_gyrus_L", "Allen_medial_orbital_gyrus_R",
        "Allen_lateral_orbital_gyrus_L", "Allen_lateral_orbital_gyrus_R"
      ]
    },
    temporal: {
      type: "composite",
      note: "Cobertura auditada para la nueva ficha de Lóbulo temporal. Agrupa únicamente regiones temporales identificadas; el hipocampo se mantiene como ficha independiente.",
      nodes: [
        "Allen_superior_temporal_gyrus_L", "Allen_superior_temporal_gyrus_R",
        "Allen_middle_temporal_gyrus_L", "Allen_middle_temporal_gyrus_R",
        "Allen_inferior_temporal_gyrus_L", "Allen_inferior_temporal_gyrus_R",
        "Allen_occipitotemporal_fusiform_gyrus_temporal_part_L", "Allen_occipitotemporal_fusiform_gyrus_temporal_part_R",
        "Allen_transverse_temporal_gyrus_Heschls_gyrus_L", "Allen_transverse_temporal_gyrus_Heschls_gyrus_R",
        "Allen_planum_temporale_L", "Allen_planum_temporale_R",
        "Allen_temporal_pole_L", "Allen_temporal_pole_R",
        "Allen_planum_polare_L", "Allen_planum_polare_R",
        "Allen_anterior_parahippocampal_gyrus_L", "Allen_anterior_parahippocampal_gyrus_R",
        "Allen_posterior_parahippocampal_gyrus_L", "Allen_posterior_parahippocampal_gyrus_R",
        "Allen_perirhinal_gyrus_rostral_part_of_FuGt_L", "Allen_perirhinal_gyrus_rostral_part_of_FuGt_R"
      ]
    },
    hipocampo: {
      type: "composite",
      note: "El hipocampo está segmentado en cabeza, cuerpo y cola por hemisferio.",
      nodes: [
        "Allen_head_of_hippocampus_L", "Allen_body_of_hippocampus_L", "Allen_tail_of_hippocampus_L",
        "Allen_head_of_hippocampus_R", "Allen_body_of_hippocampus_R", "Allen_tail_of_hippocampus_R"
      ]
    },
    amigdala: {
      type: "direct",
      note: "El atlas ofrece el complejo amigdalino bilateral como nodo explícito.",
      nodes: ["Allen_amygdaloid_complex_L", "Allen_amygdaloid_complex_R"]
    },
    limbico: {
      type: "composite",
      note: "“Sistema límbico” no es un nodo único del atlas. La visualización reúne las estructuras explícitas que ya forman parte de las fichas relacionadas, sin reclamar una frontera anatómica única.",
      nodes: [
        "Allen_amygdaloid_complex_L", "Allen_amygdaloid_complex_R",
        "Allen_head_of_hippocampus_L", "Allen_body_of_hippocampus_L", "Allen_tail_of_hippocampus_L",
        "Allen_head_of_hippocampus_R", "Allen_body_of_hippocampus_R", "Allen_tail_of_hippocampus_R",
        "Allen_cingulate_gyrus_rostral_anterior_part_L", "Allen_cingulate_gyrus_rostral_anterior_part_R",
        "Allen_cingulate_gyrus_caudal_posterior_part_L", "Allen_cingulate_gyrus_caudal_posterior_part_R",
        "Allen_anterior_parahippocampal_gyrus_L", "Allen_anterior_parahippocampal_gyrus_R",
        "Allen_posterior_parahippocampal_gyrus_L", "Allen_posterior_parahippocampal_gyrus_R"
      ]
    },
    talamo: {
      type: "direct",
      note: "El tálamo bilateral tiene nodos homónimos; los núcleos quedan disponibles como futura ampliación.",
      nodes: ["Allen_thalamus_L", "Allen_thalamus_R"]
    },
    hipotalamo: {
      type: "direct",
      note: "El hipotálamo bilateral tiene nodos homónimos; regiones preóptica, tuberal y mamilar están disponibles como subestructuras futuras.",
      nodes: ["Allen_hypothalamus_L", "Allen_hypothalamus_R"]
    },
    reticular: {
      type: "not-available",
      note: "No aparece un nodo de formación reticular en la jerarquía del GLB. No se asigna tegmento pontino, mesencefálico o bulbar como sustituto.",
      nodes: []
    },
    cerebelo: {
      type: "composite",
      note: "Grupo compuesto únicamente por componentes que el atlas nombra de forma explícita. Se excluye “white matter of hindbrain” porque el propio atlas no la identifica exclusivamente como cerebelo.",
      nodes: [
        "Allen_cerebellar_vermis_L", "Allen_cerebellar_vermis_R",
        "Allen_cerebellar_deep_nuclei_L", "Allen_cerebellar_deep_nuclei_R",
        "Allen_paravermis_of_cerebellum_L", "Allen_paravermis_of_cerebellum_R",
        "Allen_lateral_hemisphere_of_cerebellum_L", "Allen_lateral_hemisphere_of_cerebellum_R"
      ]
    },
    calloso: {
      type: "direct",
      note: "El cuerpo calloso está representado por nodos izquierdo y derecho.",
      nodes: ["Allen_corpus_callosum_L", "Allen_corpus_callosum_R"]
    }
  }
};
