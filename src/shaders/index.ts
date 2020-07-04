import baseFragment from './baseFragmentShader.js';
import baseVertex from './baseVertexShader.js';
import baseFeedback from './baseFeedbackShader.js';
import melt from './melt.js';
import pixel from './pixel.js';
import scan from './scan.js';
import prefix from './prefix.js';

interface ShaderOpts {
  baseFrag: string;
  baseVert: string;
  fboFrag?: string;
}

interface IShaders {
  [key: string]: ShaderOpts;
}

export const shaders: IShaders = {
  base: {
    baseFrag: `${prefix}${baseFragment}`,
    baseVert: baseVertex,
    fboFrag: `${prefix}${baseFeedback}`,
  },
  scan: {
    baseFrag: `${prefix}${baseFragment}`,
    baseVert: baseVertex,
    fboFrag: `${prefix}${scan}`,
  },
  pixel: {
    baseFrag: `${prefix}${baseFragment}`,
    baseVert: baseVertex,
    fboFrag: `${prefix}${pixel}`,
  },
  melt: {
    baseFrag: `${prefix}${baseFragment}`,
    baseVert: baseVertex,
    fboFrag: `${prefix}${melt}`,
  },
};
