export type Source = {
  name: string;
  type: string;
  path: string[] | string;
};

export const sources: Source[] = [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/posx.jpg",
      "textures/environmentMap/negx.jpg",
      "textures/environmentMap/posy.jpg",
      "textures/environmentMap/negy.jpg",
      "textures/environmentMap/posz.jpg",
      "textures/environmentMap/negz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  // GRAVEL
  {
    name: "gravelAmbientOcclusion",
    type: "texture",
    path: "textures/gravel/AmbientOcclusion.jpg",
  },
  {
    name: "gravelBaseColor",
    type: "texture",
    path: "textures/gravel/BaseColor.jpg",
  },
  {
    name: "gravelHeight",
    type: "texture",
    path: "textures/gravel/Height.png",
  },
  {
    name: "gravelNormal",
    type: "texture",
    path: "textures/gravel/Normal.jpg",
  },
  {
    name: "gravelRoughness",
    type: "texture",
    path: "textures/gravel/Roughness.jpg",
  },
  // TILES
  {
    name: "tilesAmbientOcclusion",
    type: "texture",
    path: "textures/tiles/AmbientOcclusion.jpg",
  },
  {
    name: "tilesBaseColor",
    type: "texture",
    path: "textures/tiles/BaseColor.jpg",
  },
  {
    name: "tilesHeight",
    type: "texture",
    path: "textures/tiles/Height.png",
  },
  {
    name: "tilesNormal",
    type: "texture",
    path: "textures/tiles/Normal.jpg",
  },
  {
    name: "tilesRoughness",
    type: "texture",
    path: "textures/tiles/Roughness.jpg",
  },
];
