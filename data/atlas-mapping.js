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
    ],
    findings: [
      "Los nodos «Allen_frontal_pole_L/R» se retiraron de las fichas Lóbulo frontal y Corteza prefrontal: en el GLB su geometría se ubica en la mitad posterior e inferior del encéfalo (coordenada anteroposterior entre −63 y +3 mm respecto del centro, altura baja), no en el polo frontal. Verificar contra el visor oficial de NIH 3D antes de reincorporarlos.",
      "Ejes del GLB: X = izquierda(−)/derecha(+), Y = abajo/arriba, Z = posterior(−)/anterior(+). Se usan para los planos de corte."
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
        "Allen_frontal_operculum_L", "Allen_frontal_operculum_R"
      ]
    },
    prefrontal: {
      type: "composite",
      note: "No existe un nodo “prefrontal cortex”. Es una agrupación pedagógica marcada como compuesta, no una parcela oficial del atlas.",
      nodes: [
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
    },
    "corteza-motora": {
      type: "direct",
      note: "El atlas ofrece el giro precentral como nodo explícito. No separa corteza motora primaria de áreas premotoras.",
      nodes: [
        "Allen_precentral_gyrus_L", "Allen_precentral_gyrus_R"
      ]
    },
    "corteza-somatosensorial": {
      type: "direct",
      note: "El atlas ofrece el giro postcentral como nodo explícito.",
      nodes: [
        "Allen_postcentral_gyrus_L", "Allen_postcentral_gyrus_R"
      ]
    },
    "lobulo-parietal": {
      type: "composite",
      note: "Agrupación didáctica: el atlas no ofrece un nodo único de lóbulo parietal. Agrupa lóbulo parietal superior, giros supramarginal y angular y precúneo; el giro postcentral tiene ficha propia.",
      nodes: [
        "Allen_supraparietal_lobule_L", "Allen_supraparietal_lobule_R",
        "Allen_supramarginal_gyrus_L", "Allen_supramarginal_gyrus_R",
        "Allen_angular_gyrus_L", "Allen_angular_gyrus_R",
        "Allen_precuneus_L", "Allen_precuneus_R"
      ]
    },
    "lobulo-occipital": {
      type: "composite",
      note: "Agrupación didáctica de los giros occipitales que el atlas nombra de forma explícita.",
      nodes: [
        "Allen_occipital_pole_L", "Allen_occipital_pole_R",
        "Allen_cuneus_L", "Allen_cuneus_R",
        "Allen_lingual_gyrus_medial_occipitotemporal_gyrus_L", "Allen_lingual_gyrus_medial_occipitotemporal_gyrus_R",
        "Allen_lateral_occipitotemporal_fusiform_gyrus_occipital_part_L", "Allen_lateral_occipitotemporal_fusiform_gyrus_occipital_part_R",
        "Allen_inferior_occipital_gyrus_L", "Allen_inferior_occipital_gyrus_R",
        "Allen_superior_occipital_gyrus_L", "Allen_superior_occipital_gyrus_R"
      ]
    },
    insula: {
      type: "composite",
      note: "Agrupa los giros insulares largos y cortos, el limen de la ínsula y las áreas insulares agranulares que el atlas nombra de forma explícita.",
      nodes: [
        "Allen_long_insular_gyri_L", "Allen_long_insular_gyri_R",
        "Allen_short_insular_gyri_L", "Allen_short_insular_gyri_R",
        "Allen_limen_insula_L", "Allen_limen_insula_R",
        "Allen_frontal_agranular_insular_cortex_area_Fl_L", "Allen_frontal_agranular_insular_cortex_area_Fl_R",
        "Allen_temporal_agranular_insular_cortex_area_Tl_L", "Allen_temporal_agranular_insular_cortex_area_Tl_R"
      ]
    },
    "sistema-olfatorio": {
      type: "composite",
      note: "Agrupa los componentes olfatorios que el atlas nombra de forma explícita.",
      nodes: [
        "Allen_olfactory_bulb_L", "Allen_olfactory_bulb_R",
        "Allen_olfactory_tract_L", "Allen_olfactory_tract_R",
        "Allen_anterior_olfactory_nucleus_L", "Allen_anterior_olfactory_nucleus_R",
        "Allen_piriform_region_L", "Allen_piriform_region_R",
        "Allen_lateral_olfactory_gyrus_L", "Allen_lateral_olfactory_gyrus_R"
      ]
    },
    "ganglios-basales": {
      type: "composite",
      note: "Agrupación didáctica: el atlas ofrece caudado (cabeza, cuerpo y cola), putamen, núcleo accumbens y segmentos del globo pálido como nodos separados; no existe un nodo único de ganglios basales.",
      nodes: [
        "Allen_head_of_caudate_L", "Allen_head_of_caudate_R",
        "Allen_body_of_caudate_L", "Allen_body_of_caudate_R",
        "Allen_tail_of_caudate_L", "Allen_tail_of_caudate_R",
        "Allen_putamen_L", "Allen_putamen_R",
        "Allen_posteroventral_putamen_L", "Allen_posteroventral_putamen_R",
        "Allen_nucleus_accumbens_L", "Allen_nucleus_accumbens_R",
        "Allen_external_segment_of_globus_pallidus_L", "Allen_external_segment_of_globus_pallidus_R",
        "Allen_internal_segment_of_globus_pallidus_L", "Allen_internal_segment_of_globus_pallidus_R"
      ]
    },
    "sistema-ventricular": {
      type: "composite",
      note: "Agrupa las cavidades ventriculares que el atlas nombra de forma explícita.",
      nodes: [
        "Allen_anterior_horn_of_lateral_ventricle_L", "Allen_anterior_horn_of_lateral_ventricle_R",
        "Allen_body_of_lateral_ventricle_L", "Allen_body_of_lateral_ventricle_R",
        "Allen_posterior_horn_of_lateral_ventricle_L", "Allen_posterior_horn_of_lateral_ventricle_R",
        "Allen_inferior_horn_of_lateral_ventricle_L", "Allen_inferior_horn_of_lateral_ventricle_R",
        "Allen_atrium_of_lateral_ventricle_L", "Allen_atrium_of_lateral_ventricle_R",
        "Allen_third_ventricle_L", "Allen_third_ventricle_R",
        "Allen_cerebral_aqueduct_L", "Allen_cerebral_aqueduct_R",
        "Allen_fourth_ventricle_L", "Allen_fourth_ventricle_R",
        "Allen_central_canal_of_medulla_oblongata_L", "Allen_central_canal_of_medulla_oblongata_R"
      ]
    },
    "sustancia-negra": {
      type: "direct",
      note: "El atlas ofrece la sustancia negra como nodo explícito bilateral.",
      nodes: [
        "Allen_substantia_nigra_L", "Allen_substantia_nigra_R"
      ]
    },
    mesencefalo: {
      type: "composite",
      note: "Agrupa las estructuras mesencefálicas que el atlas nombra de forma explícita. No se asigna formación reticular.",
      nodes: [
        "Allen_superior_colliculus_L", "Allen_superior_colliculus_R",
        "Allen_inferior_colliculus_L", "Allen_inferior_colliculus_R",
        "Allen_red_nucleus_L", "Allen_red_nucleus_R",
        "Allen_cerebral_peduncle_crus_cerebri_L", "Allen_cerebral_peduncle_crus_cerebri_R",
        "Allen_midbrain_tegmentum_L", "Allen_midbrain_tegmentum_R",
        "Allen_pretectal_region_L", "Allen_pretectal_region_R",
        "Allen_substantia_nigra_L", "Allen_substantia_nigra_R"
      ]
    },
    puente: {
      type: "composite",
      note: "Agrupa la porción basilar, el tegmento pontino y el pedúnculo cerebeloso medio. No se asigna formación reticular.",
      nodes: [
        "Allen_basilar_part_of_pons_L", "Allen_basilar_part_of_pons_R",
        "Allen_pontine_tegmentum_L", "Allen_pontine_tegmentum_R",
        "Allen_middle_cerebellar_peduncle_L", "Allen_middle_cerebellar_peduncle_R"
      ]
    },
    bulbo: {
      type: "composite",
      note: "Agrupa las estructuras bulbares que el atlas nombra de forma explícita. No se asigna formación reticular.",
      nodes: [
        "Allen_pyramidal_part_of_medulla_oblongata_L", "Allen_pyramidal_part_of_medulla_oblongata_R",
        "Allen_tegmentum_of_medulla_oblongata_L", "Allen_tegmentum_of_medulla_oblongata_R",
        "Allen_inferior_olive_L", "Allen_inferior_olive_R",
        "Allen_inferior_cerebellar_peduncle_L", "Allen_inferior_cerebellar_peduncle_R"
      ]
    },
    fornix: {
      type: "composite",
      note: "Agrupa el fórnix y el tracto mamilotalámico, nombrados de forma explícita por el atlas.",
      nodes: [
        "Allen_fornix_L", "Allen_fornix_R",
        "Allen_mammillothalamic_tract_L", "Allen_mammillothalamic_tract_R"
      ]
    },
    "via-visual": {
      type: "composite",
      note: "Agrupa quiasma óptico, tracto óptico, núcleo geniculado lateral y radiación óptica, nombrados de forma explícita por el atlas.",
      nodes: [
        "Allen_optic_tract_L", "Allen_optic_tract_R",
        "Allen_dorsal_lateral_geniculate_nucleus_L", "Allen_dorsal_lateral_geniculate_nucleus_R",
        "Allen_optic_radiation_L", "Allen_optic_radiation_R",
        "VH_M_optic_chiasm"
      ]
    }
  }
};
