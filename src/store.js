import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  colors: ["#CCC","#EFBD4E","#80C670","#726DE8","#EF674E","#353934"],
  decals: ['react', 'three2', 'pmndrs']
})

export { state };