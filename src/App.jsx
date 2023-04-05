import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import Fox from './components/Fox';
import Orange from './components/Orange';
import { Debug, Physics, RigidBody } from '@react-three/rapier';

export default function App() {
    const { perfVisible } = useControls({
        perfVisible: true
    });

    return <>
        {perfVisible && <Perf position='top-left' />}

        <PerspectiveCamera
            makeDefault
            position={[-18, 15, -18]}
            fov={75}
            near={0.1}
            far={500}
        />

        <OrbitControls makeDefault />

        <directionalLight
            castShadow
            position={[1, 2, 3]}
            intensity={3.0}
            shadow-normalBias={0.1}
        />
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={1.0} />

        <Physics>
            <RigidBody friction={0.0} restitution={0.3}>
                <Fox />
            </RigidBody>

            <mesh castShadow position={[- 2, 2, 0]}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow position={[2, 2, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <RigidBody type="fixed"><Orange /></RigidBody>

            <RigidBody type="fixed">
                <mesh receiveShadow position-y={-0.1}>
                    <boxGeometry args={[100, 0.1, 100]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <Debug />
        </Physics>


    </>;
}