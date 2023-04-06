import { PerspectiveCamera, OrbitControls, Sky } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { Debug, Physics, RigidBody } from '@react-three/rapier';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';

import Fox from './components/Fox';
import Orange from './components/Orange';

export default function App() {
    const { perfVisible } = useControls({
        perfVisible: true
    });

    const { sunPosition } = useControls('sky', {
        sunPosition: { value: [3, 5, 3] }
    });

    const { camera } = useThree();

    const controlRef = useRef(null);
    const characterRigidBody = useRef(null);

    return (
        <>
            {perfVisible && <Perf position='top-left' />}

            <PerspectiveCamera
                makeDefault
                fov={70}
                near={0.1}
                far={500}
                position={[-18, 15, -18]}
            />

            <OrbitControls makeDefault ref={controlRef} />

            <Sky sunPosition={sunPosition} />
            <directionalLight
                castShadow
                position={sunPosition}
                intensity={1.5}
                shadow-normalBias={0.1}
            />
            <ambientLight intensity={0.4} />
            <hemisphereLight intensity={1.0} />

            <Physics>
                <RigidBody ref={characterRigidBody} friction={0.0} restitution={0.3}>
                    <Fox rigidBody={characterRigidBody} camera={camera} orbitControl={controlRef.current} />
                </RigidBody>

                <RigidBody>
                    <mesh castShadow position={[- 2, 2, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody>
                    <mesh castShadow position={[2, 2, 0]}>
                        <boxGeometry />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    type="fixed"
                    onCollisionEnter={() => console.log('enter orange')}
                    onCollisionExit={() => console.log('exit orange')}
                    position={[5, 2, 5]}
                >
                    <Orange />
                </RigidBody>

                <RigidBody type="fixed">
                    <mesh receiveShadow position-y={-0.1}>
                        <boxGeometry args={[100, 0.1, 100]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <Debug />
            </Physics>
        </>
    );
}