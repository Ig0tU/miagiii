interface ProdiaModelDescription {
  id: string;
  label: string;
  gen: 'sd' | 'sdxl';
  priority?: number;
}

const HARDCODED_MODELS = {
  models: [
    ...(['sdxl', 'sd'] as 'sd'[]).map(gen => (
      gen === 'sdxl'
        ? [
            {
              id: 'dreamshaperXLAlpha2',
              label: 'Dreamshaper XL Alpha 2',
              gen,
              priority: 20,
            },
            { id: 'dynavisionXL_0411', label: 'Dynavision XL 0411', gen },
            { id: 'juggernautXL_v45', label: 'Juggernaut XL V45', gen },
            { id: 'realismEngineSDXL_v10', label: 'Realism Engine SDXL V10', gen },
            { id: 'sd_xl_base_1.0', label: 'SDXL Base V1.0', gen, priority: 20 },
          ]
        : [
            { id: '3Guofeng3_v34', label: '3 Guofeng3 V3.4', gen },
            { id: 'absolutereality_V16', label: 'Absolute Reality V1.6', gen },
            { id: 'absolutereality_v181', label: 'Absolute Reality V1.8.1', gen },
            { id: 'amIReal_V41', label: 'Am I Real V4.1', gen },
            { id: 'analog-diffusion-1.0.ckpt', label: 'Analog V1', gen },
            { id: 'anythingv3_0-pruned.ckpt', label: 'Anything V3', gen },
            { id: 'anything-v4.5-pruned.ckpt', label: 'Anything V4.5', gen },
            { id: 'anythingV5_PrtRE', label: 'Anything V5', gen },
            { id: 'AOM3A3_orangemixs', label: 'AbyssOrangeMix V3', gen },
            { id: 'blazing_drive_v10g', label: 'Blazing Drive V10g', gen },
            { id: 'cetusMix_Version35', label: 'CetusMix Version35', gen },
            { id: 'childrensStories_v13D', label: "Children's Stories V1 3D", gen },
            { id: 'childrensStories_v1SemiReal', label: "Children's Stories V1 SemiReal", gen },
            { id: 'childrensStories_v1ToonAnime', label: "Children's Stories V1 Toon-Anime", gen },
            { id: 'Counterfeit_v30', label: 'Counterfeit V3.0', gen },
            { id: 'cuteyukimixAdorable_midchapter3', label: 'CuteYukimix MidChapter3', gen },
            { id: 'cyberrealistic_v33', label: 'CyberRealistic V3.3', gen },
            { id: 'dalcefo_v4', label: 'Dalcefo V4', gen },
            { id: 'deliberate_v2', label: 'Deliberate V2', gen, priority: 5 },
            { id: 'deliberate_v3', label: 'Deliberate V3', gen },
            { id: 'dreamlike-anime-1.0.safetensors', label: 'Dreamlike Anime V1', gen },
            { id: 'dreamlike-diffusion-1.0.safetensors', label: 'Dreamlike Diffusion V1', gen },
            { id: 'dreamlike-photoreal-2.0.safetensors', label: 'Dreamlike Photoreal V2', gen },
            { id: 'dreamshaper_6BakedVae', label: 'Dreamshaper 6 baked vae', gen },
            { id: 'dreamshaper_7', label: 'Dreamshaper 7', gen },
            { id: 'dreamshaper_8', label: 'Dreamshaper 8', gen },
            { id: 'edgeOfRealism_eorV20', label: 'Edge of Realism EOR V2.0', gen },
            { id: 'EimisAnimeDiffusion_V1.ckpt', label: 'Eimis Anime Diffusion V1.0', gen },
            { id: 'elldreths-vivid-mix', label: "Elldreth's Vivid", gen },
            { id: 'epicrealism_naturalSinRC1VAE', label: 'EpiCRealism Natural Sin RC1', gen },
            { id: 'ICantBelieveItsNotPhotography_seco', label: "I Can't Believe It's Not Photography Seco", gen },
            { id: 'juggernaut_aftermath', label: 'Juggernaut Aftermath', gen },
            { id: 'lofi_v4', label: 'Lofi V4', gen },
            { id: 'lyriel_v16', label: 'Lyriel V1.6', gen },
            { id: 'majicmixRealistic_v4', label: 'MajicMix Realistic V4', gen },
            { id: 'mechamix_v10', label: 'MechaMix V1.0', gen },
            { id: 'meinamix_meinaV9', label: 'MeinaMix Meina V9', gen },
            { id: 'meinamix_meinaV11', label: 'MeinaMix Meina V11', gen },
            { id: 'neverendingDream_v122', label: 'Neverending Dream V1.22', gen },
            { id: 'openjourney_V4.ckpt', label: 'Openjourney V4', gen },
            { id: 'pastelMixStylizedAnime_pruned_fp16', label: 'Pastel-Mix', gen },
            { id: 'portraitplus_V1.0', label: 'Portrait+ V1', gen },
            { id: 'protogenx34', label: 'Protogen x3.4', gen },
            { id: 'Realistic_Vision_V1.4-pruned-fp16', label: 'Realistic Vision V1.4', gen },
            { id: 'Realistic_Vision_V2.0', label: 'Realistic Vision V2.0', gen },
            { id: 'Realistic_Vision_V4.0', label: 'Realistic Vision V4.0', gen },
            { id: 'Realistic_Vision_V5.0', label: 'Realistic Vision V5.0', gen, priority: 15 },
            { id: 'redshift_diffusion-V10', label: 'Redshift Diffusion V1.0', gen },
            { id: 'revAnimated_v122', label: 'ReV Animated V1.2.2', gen },
            { id: 'rundiffusionFX25D_v10', label: 'RunDiffusion FX 2.5D V1.0', gen },
            { id: 'rundiffusionFX_v10', label: 'RunDiffusion FX Photorealistic V1.0', gen },
            { id: 'sdv1_4', label: 'SD V1.4', gen },
            { id: 'v1-5-pruned-emaonly', label: 'SD V1.5', gen, priority: 9 },
            { id: 'shoninsBeautiful_v10', label: "Shonin's Beautiful People V1.0", gen },
            { id: 'theallys-mix-ii-churned', label: "TheAlly's Mix II", gen },
            { id: 'timeless-1.0.ckpt', label: 'Timeless V1', gen },
            { id: 'toonyou_beta6', label: 'ToonYou Beta 6', gen },
          ]
    )),
  ] as const,
} as const;

export type HardcodedModels = typeof HARDCODED_MODELS;
