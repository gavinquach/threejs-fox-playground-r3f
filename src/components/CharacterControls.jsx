
const CharacterControls = (model, mixer, animationsMap, orbitControl, camera, currentAction) => {
    const W = 'w';
    const A = 'a';
    const S = 's';
    const D = 'd';
    const SHIFT = 'shift';
    const DIRECTIONS = [W, A, S, D];

    // state
    let toggleRun = true;

    // temporary data
    const walkDirection = new Vector3();
    const rotateAngle = new Vector3(0, 1, 0);
    const rotateQuarternion = new Quaternion();
    const cameraTarget = new Vector3();

    // constants
    const fadeDuration = 0.2;
    const runVelocity = 5;
    const walkVelocity = 2;

    // INIT
    animationsMap.forEach((value, key) => {
        if (key == currentAction) {
            value.play();
        }
    });
    updateCameraTarget(0, 0);

    const switchRunToggle = () => {
        toggleRun = !toggleRun;
    };

    const update = (delta, keysPressed) => {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);

        var play = '';
        if (directionPressed && toggleRun) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        } else {
            play = 'Survey';
        }

        if (currentAction != play) {
            const toPlay = animationsMap.get(play);
            const current = animationsMap.get(currentAction);

            current.fadeOut(fadeDuration);
            toPlay.reset().fadeIn(fadeDuration).play();

            currentAction = play;
        }

        mixer.update(delta);

        if (currentAction == 'Run' || currentAction == 'Walk') {
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2(
                (camera.position.x - model.position.x),
                (camera.position.z - model.position.z));
            // diagonal movement angle offset
            var directionOffset = calculateDirectionOffset(keysPressed);

            // rotate model
            rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffset);
            model.quaternion.rotateTowards(rotateQuarternion, 0.2);

            // calculate direction
            camera.getWorldDirection(walkDirection);
            walkDirection.y = 0;
            walkDirection.normalize();
            walkDirection.applyAxisAngle(rotateAngle, directionOffset);

            // run/walk velocity
            const velocity = currentAction == 'Run' ? runVelocity : walkVelocity;

            // move model & camera
            const moveX = walkDirection.x * velocity * delta;
            const moveZ = walkDirection.z * velocity * delta;
            model.position.x += moveX;
            model.position.z += moveZ;
            updateCameraTarget(moveX, moveZ);
        }
    };

    const updateCameraTarget = (moveX, moveZ) => {
        // move camera
        camera.position.x += moveX;
        camera.position.z += moveZ;

        // update camera target
        cameraTarget.x = model.position.x;
        cameraTarget.y = model.position.y + 1;
        cameraTarget.z = model.position.z;
        orbitControl.target = cameraTarget;
    };

    const calculateDirectionOffset = (keysPressed) => {
        var directionOffset = 0; // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4; // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4; // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
            } else {
                directionOffset = Math.PI; // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2; // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2; // d
        }

        return directionOffset;
    };
};

export default CharacterControls;
