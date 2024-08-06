import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { 
  Center, 
  useGLTF, 
  Environment,
  AccumulativeShadows,
  Decal,
  RandomizedLight,
  useTexture
} from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { state } from '../store';


export const App = ({ position = [-1, 0, 2.5], fov = 25 }) => {
  return (
    <Canvas 
      camera={{ position, fov }}
      gl={{ preserveDrawingBuffer: true }}
      eventSource={document.getElementById("root")}
      eventPrefix='client'
      shadows
    >
      <ambientLight intensity={2} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr"/>
      
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

function Shirt(props) {
  const snap = useSnapshot(state);
  const texture = useTexture('three2.png')
  const { nodes, materials } = useGLTF('./src/assets/shirt_baked.glb');

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
  })

  return (
    <mesh
      castShadow
      {...props}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0.5, -0.2, 0]}
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      <Decal 
        map={texture}
        position={[-0.1, -0.3 , 0.15]}
        rotation={[0,0,0]}
        scale={0.8}
        opacity={0.7}
      />
    </mesh>
  )
}

function Backdrop() {
  const shadows = useRef();

  useFrame((state, delta) => {
    easing.dampC(shadows.current.getMesh().material.color, state.selectedColor, 0.25, delta)
  })

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.65}
      scale={10}
      rotation={[Math.PI /2, 0, 0]}
      position={[0, 0, -0.14]}
      color='#fff'
    >
      <RandomizedLight 
        amount={4}
        radius={9}
        intensity={0.35}
        ambient={1}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={1}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const groupRef = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position, 
      [snap.intro ? -state.viewport.width / 1.7 : -0.8, 0, 2], 
      0.25, 
      delta
    )
    easing.dampE(
      groupRef.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    )
  })

  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}

useGLTF.preload('./src/assets/shirt_baked.glb');

export default App;
