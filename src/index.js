import { ShaderStore } from './shaderControl/ShaderStore';
import Couch from './media/dog.jpeg';

function start() {
  let store;
  const tex = new Image();
  tex.onload = () => {
    store = new ShaderStore(document.getElementById('main'), tex, 'base');
  };
  tex.onerror = (err) => console.warn(err);
  tex.src = Couch;
}

start();
