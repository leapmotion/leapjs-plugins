//CoffeeScript generated from main/bone-hand/leap.bone-hand.coffee
(function() {
  var baseBoneRotation, boneColor, boneHand, boneHandLost, boneRadius, boneScale, initScene, jointColor, jointRadius, jointScale, material, scope;

  scope = null;

  initScene = function(targetEl) {
    var camera, directionalLight, height, render, renderer, width;
    scope.scene = new THREE.Scene();
    scope.renderer = renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.domElement.className = "leap-boneHand";
    targetEl.appendChild(renderer.domElement);
    directionalLight = directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0.5, 1);
    scope.scene.add(directionalLight);
    directionalLight = directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0.5, -0.5, -1);
    scope.scene.add(directionalLight);
    directionalLight = directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-0.5, 0, -0.2);
    scope.scene.add(directionalLight);
    scope.camera = camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.fromArray([0, 300, 500]);
    camera.lookAt(new THREE.Vector3(0, 160, 0));
    scope.scene.add(camera);
    renderer.render(scope.scene, camera);
    window.addEventListener('resize', function() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      return renderer.render(scope.scene, camera);
    }, false);
    render = function() {
      renderer.render(scope.scene, camera);
      return window.requestAnimationFrame(render);
    };
    return render();
  };

  baseBoneRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));

  jointColor = (new THREE.Color).setHex(0x5daa00);

  boneColor = (new THREE.Color).setHex(0xffffff);

  boneScale = 1 / 6;

  jointScale = 1 / 5;

  boneRadius = null;

  jointRadius = null;

  material = null;

  boneHand = function(hand) {
    var armBones, armMesh, armTopAndBottomRotation, boneXOffset, halfArmLength, i, _i, _j;
    if (!scope.scene) {
      return;
    }
    hand.fingers.forEach(function(finger) {
      var boneMeshes, jointMesh, jointMeshes;
      boneMeshes = finger.data("boneMeshes");
      jointMeshes = finger.data("jointMeshes");
      if (!boneMeshes) {
        boneMeshes = [];
        jointMeshes = [];
        material = !isNaN(scope.opacity) ? new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: scope.opacity
        }) : new THREE.MeshPhongMaterial();
        boneRadius = hand.middleFinger.proximal.length * boneScale;
        jointRadius = hand.middleFinger.proximal.length * jointScale;
        if (!finger.bones) {
          console.warn("error, no bones on", hand.id);
          return;
        }
        finger.bones.forEach(function(bone) {
          var boneMesh, jointMesh;
          boneMesh = new THREE.Mesh(new THREE.CylinderGeometry(boneRadius, boneRadius, bone.length, 32), material.clone());
          boneMesh.material.color.copy(boneColor);
          scope.scene.add(boneMesh);
          boneMeshes.push(boneMesh);
          jointMesh = new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone());
          jointMesh.material.color.copy(jointColor);
          scope.scene.add(jointMesh);
          return jointMeshes.push(jointMesh);
        });
        jointMesh = new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone());
        jointMesh.material.color.copy(jointColor);
        scope.scene.add(jointMesh);
        jointMeshes.push(jointMesh);
        finger.data("boneMeshes", boneMeshes);
        finger.data("jointMeshes", jointMeshes);
      }
      boneMeshes.forEach(function(mesh, i) {
        var bone;
        bone = finger.bones[i];
        mesh.position.fromArray(bone.center());
        mesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(bone.matrix()));
        return mesh.quaternion.multiply(baseBoneRotation);
      });
      return jointMeshes.forEach(function(mesh, i) {
        var bone;
        bone = finger.bones[i];
        if (bone) {
          return mesh.position.fromArray(bone.prevJoint);
        } else {
          bone = finger.bones[i - 1];
          return mesh.position.fromArray(bone.nextJoint);
        }
      });
    });
    if (scope.arm) {
      armMesh = hand.data('armMesh');
      if (!armMesh) {
        armMesh = new THREE.Object3D;
        scope.scene.add(armMesh);
        hand.data('armMesh', armMesh);
        boneXOffset = (hand.arm.width / 2) - (boneRadius / 2);
        halfArmLength = hand.arm.length / 2;
        armBones = [];
        for (i = _i = 0; _i <= 3; i = ++_i) {
          armBones.push(new THREE.Mesh(new THREE.CylinderGeometry(boneRadius, boneRadius, (i < 2 ? hand.arm.length : hand.arm.width), 32), material.clone()));
          armBones[i].material.color.copy(boneColor);
          armMesh.add(armBones[i]);
        }
        armBones[0].position.setX(boneXOffset);
        armBones[1].position.setX(-boneXOffset);
        armBones[2].position.setY(halfArmLength);
        armBones[3].position.setY(-halfArmLength);
        armTopAndBottomRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
        armBones[2].quaternion.multiply(armTopAndBottomRotation);
        armBones[3].quaternion.multiply(armTopAndBottomRotation);
        armBones = [];
        for (i = _j = 0; _j <= 3; i = ++_j) {
          armBones.push(new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone()));
          armBones[i].material.color.copy(jointColor);
          armMesh.add(armBones[i]);
        }
        armBones[0].position.set(-boneXOffset, halfArmLength, 0);
        armBones[1].position.set(boneXOffset, halfArmLength, 0);
        armBones[2].position.set(boneXOffset, -halfArmLength, 0);
        armBones[3].position.set(-boneXOffset, -halfArmLength, 0);
      }
      armMesh.position.fromArray(hand.arm.center());
      armMesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(hand.arm.matrix()));
      return armMesh.quaternion.multiply(baseBoneRotation);
    }
  };

  boneHandLost = function(hand) {
    var armMesh;
    hand.fingers.forEach(function(finger) {
      var boneMeshes, jointMeshes;
      boneMeshes = finger.data("boneMeshes");
      jointMeshes = finger.data("jointMeshes");
      if (!boneMeshes) {
        return;
      }
      boneMeshes.forEach(function(mesh) {
        return scope.scene.remove(mesh);
      });
      jointMeshes.forEach(function(mesh) {
        return scope.scene.remove(mesh);
      });
      finger.data({
        boneMeshes: null
      });
      return finger.data({
        jointMeshes: null
      });
    });
    if (scope.arm) {
      armMesh = hand.data('armMesh');
      scope.scene.remove(armMesh);
      return hand.data('armMesh', null);
    }
  };

  Leap.plugin('boneHand', function(options) {
    if (options == null) {
      options = {};
    }
    scope = options;
    scope.boneScale && (boneScale = scope.boneScale);
    scope.jointScale && (jointScale = scope.jointScale);
    scope.boneColor && (boneColor = scope.boneColor);
    scope.jointColor && (jointColor = scope.jointColor);
    this.use('handEntry');
    this.use('handHold');
    if (scope.scene === void 0) {
      console.assert(scope.targetEl);
      initScene(scope.targetEl);
    }
    this.on('handLost', boneHandLost);
    return {
      hand: boneHand
    };
  });

}).call(this);
