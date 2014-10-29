//CoffeeScript generated from main/bone-hand/leap.bone-hand.coffee
(function() {
  var HandMesh, baseBoneRotation, boneColor, boneHandLost, boneRadius, boneScale, initScene, jointColor, jointRadius, jointScale, material, onHand, scope;

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
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0.5, 1);
    scope.scene.add(directionalLight);
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0.5, -0.5, -1);
    scope.scene.add(directionalLight);
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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

  HandMesh = (function() {
    HandMesh.unusedHandMeshes = [];

    HandMesh.get = function() {
      var handMesh;
      if (HandMesh.unusedHandMeshes.length > 0) {
        handMesh = HandMesh.unusedHandMeshes.pop();
      } else {
        handMesh = HandMesh.create();
      }
      handMesh.show();
      return handMesh;
    };

    HandMesh.prototype.replace = function() {
      this.hide();
      return HandMesh.unusedHandMeshes.push(this);
    };

    HandMesh.create = function() {
      var mesh;
      mesh = new HandMesh;
      mesh.setVisibility(false);
      HandMesh.unusedHandMeshes.push(mesh);
      return mesh;
    };

    function HandMesh() {
      var armBones, armTopAndBottomRotation, boneCount, boneXOffset, finger, halfArmLength, i, j, mesh, _i, _j, _k, _l;
      material = !isNaN(scope.opacity) ? new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: scope.opacity
      }) : new THREE.MeshPhongMaterial();
      boneRadius = 40 * boneScale;
      jointRadius = 40 * jointScale;
      this.fingerMeshes = [];
      for (i = _i = 0; _i < 5; i = ++_i) {
        finger = [];
        boneCount = i === 0 ? 3 : 4;
        for (j = _j = 0; 0 <= boneCount ? _j < boneCount : _j > boneCount; j = 0 <= boneCount ? ++_j : --_j) {
          mesh = new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone());
          mesh.material.color.copy(jointColor);
          scope.scene.add(mesh);
          finger.push(mesh);
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(boneRadius, boneRadius, 40, 32), material.clone());
          mesh.material.color.copy(boneColor);
          scope.scene.add(mesh);
          finger.push(mesh);
        }
        mesh = new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone());
        mesh.material.color.copy(jointColor);
        scope.scene.add(mesh);
        finger.push(mesh);
        this.fingerMeshes.push(finger);
      }
      if (scope.arm) {
        this.armMesh = new THREE.Object3D;
        boneXOffset = (hand.arm.width / 2) - (boneRadius / 2);
        halfArmLength = hand.arm.length / 2;
        armBones = [];
        for (i = _k = 0; _k <= 3; i = ++_k) {
          armBones.push(new THREE.Mesh(new THREE.CylinderGeometry(boneRadius, boneRadius, (i < 2 ? hand.arm.length : hand.arm.width), 32), material.clone()));
          armBones[i].material.color.copy(boneColor);
          this.armMesh.add(armBones[i]);
        }
        armBones[0].position.setX(boneXOffset);
        armBones[1].position.setX(-boneXOffset);
        armBones[2].position.setY(halfArmLength);
        armBones[3].position.setY(-halfArmLength);
        armTopAndBottomRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
        armBones[2].quaternion.multiply(armTopAndBottomRotation);
        armBones[3].quaternion.multiply(armTopAndBottomRotation);
        armBones = [];
        for (i = _l = 0; _l <= 3; i = ++_l) {
          armBones.push(new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 32, 32), material.clone()));
          armBones[i].material.color.copy(jointColor);
          this.armMesh.add(armBones[i]);
        }
        armBones[0].position.set(-boneXOffset, halfArmLength, 0);
        armBones[1].position.set(boneXOffset, halfArmLength, 0);
        armBones[2].position.set(boneXOffset, -halfArmLength, 0);
        armBones[3].position.set(-boneXOffset, -halfArmLength, 0);
        scope.scene.add(this.armMesh);
      }
    }

    HandMesh.prototype.scaleTo = function(hand) {
      var baseScale, bone, finger, i, j, lengthScale, mesh, _i;
      baseScale = hand.middleFinger.proximal.length / this.fingerMeshes[2][1].geometry.parameters.height;
      for (i = _i = 0; _i < 5; i = ++_i) {
        finger = hand.fingers[i];
        j = 0;
        while (true) {
          if (j === this.fingerMeshes[i].length - 1) {
            mesh = this.fingerMeshes[i][j];
            mesh.scale.set(baseScale, baseScale, baseScale);
            break;
          }
          bone = finger.bones[3 - (j / 2)];
          mesh = this.fingerMeshes[i][j];
          mesh.scale.set(baseScale, baseScale, baseScale);
          j++;
          mesh = this.fingerMeshes[i][j];
          lengthScale = bone.length / mesh.geometry.parameters.height;
          mesh.scale.set(baseScale, lengthScale, baseScale);
          j++;
        }
      }
      return this;
    };

    HandMesh.prototype.formTo = function(hand) {
      var bone, finger, i, j, mesh, _i;
      for (i = _i = 0; _i < 5; i = ++_i) {
        finger = hand.fingers[i];
        j = 0;
        while (true) {
          if (j === this.fingerMeshes[i].length - 1) {
            mesh = this.fingerMeshes[i][j];
            mesh.position.fromArray(bone.prevJoint);
            break;
          }
          bone = finger.bones[3 - (j / 2)];
          mesh = this.fingerMeshes[i][j];
          mesh.position.fromArray(bone.nextJoint);
          ++j;
          mesh = this.fingerMeshes[i][j];
          mesh.position.fromArray(bone.center());
          mesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(bone.matrix()));
          mesh.quaternion.multiply(baseBoneRotation);
          ++j;
        }
      }
      if (this.armMesh) {
        this.armMesh.position.fromArray(hand.arm.center());
        this.armMesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(hand.arm.matrix()));
        this.armMesh.quaternion.multiply(baseBoneRotation);
      }
      return this;
    };

    HandMesh.prototype.setVisibility = function(visible) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; _i < 5; i = ++_i) {
        j = 0;
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (true) {
            this.fingerMeshes[i][j].visible = visible;
            ++j;
            if (j === this.fingerMeshes[i].length) {
              break;
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    HandMesh.prototype.show = function() {
      return this.setVisibility(true);
    };

    HandMesh.prototype.hide = function() {
      return this.setVisibility(false);
    };

    return HandMesh;

  })();

  onHand = function(hand) {
    var handMesh;
    if (!scope.scene) {
      return;
    }
    handMesh = hand.data('handMesh');
    if (!handMesh) {
      handMesh = HandMesh.get().scaleTo(hand);
      hand.data('handMesh', handMesh);
    }
    return handMesh.formTo(hand);
  };

  boneHandLost = function(hand) {
    var handMesh;
    handMesh = hand.data('handMesh');
    if (handMesh) {
      return handMesh.replace();
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
    if (scope.scene) {
      HandMesh.create();
      HandMesh.create();
    }
    this.on('handLost', boneHandLost);
    return {
      hand: onHand
    };
  });

}).call(this);
