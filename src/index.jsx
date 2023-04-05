import './style.css';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <StrictMode>
        <Suspense>
            <Canvas shadows>
                <App />
            </Canvas>
        </Suspense>
    </StrictMode>
);