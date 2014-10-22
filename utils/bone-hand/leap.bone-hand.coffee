scope = null

initScene = (targetEl)->
  scope.scene = new THREE.Scene()
  scope.renderer = renderer = new THREE.WebGLRenderer({
    alpha: true
  })

  width = window.innerWidth
  height = window.innerHeight

  renderer.setClearColor(0x000000, 0)
  renderer.setSize(width, height)

  renderer.domElement.className = "leap-boneHand"

  targetEl.appendChild(renderer.domElement)

  directionalLight = directionalLight = new THREE.DirectionalLight( 0xffffff, 1 )
  directionalLight.position.set( 0, 0.5, 1 )
  scope.scene.add(directionalLight)

  directionalLight = directionalLight = new THREE.DirectionalLight( 0xffffff, 1 )
  directionalLight.position.set( 0.5, -0.5, -1 )
  scope.scene.add(directionalLight)

  directionalLight = directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
  directionalLight.position.set( -0.5, 0, -0.2 )
  scope.scene.add(directionalLight)

  scope.camera = camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)

  camera.position.fromArray([0, 300, 500]);
  camera.lookAt(new THREE.Vector3(0, 160, 0));


  scope.scene.add(camera)

  renderer.render(scope.scene, camera)


  window.addEventListener 'resize', ->
    width = window.innerWidth
    height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize( width, height )

    renderer.render(scope.scene, camera)
  , false

  render = ->
    renderer.render(scope.scene, camera);
    window.requestAnimationFrame(render);

  render()



# bone hand methods copied from leapdev

baseBoneRotation = (new THREE.Quaternion).setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, 0)
);


jointColor = (new THREE.Color).setHex(0x5daa00)
boneColor = (new THREE.Color).setHex(0xffffff)

boneScale  = 1 / 6
jointScale = 1 / 5

boneRadius = null
jointRadius = null

material = null

boneHand = (hand) ->
  return if !scope.scene


  hand.fingers.forEach (finger) ->

    # the handFound listener doesn't actually fire if in live mode with hand-in-screen
    # we manually check for finger meshes and initialize if necessary
    boneMeshes = finger.data("boneMeshes")
    jointMeshes = finger.data("jointMeshes")

    unless boneMeshes
      boneMeshes = []
      jointMeshes = []

      material = if !isNaN(scope.opacity)
        new THREE.MeshPhongMaterial(transparent: true, opacity: scope.opacity)
      else
        new THREE.MeshPhongMaterial()


      boneRadius  = hand.middleFinger.proximal.length * boneScale
      jointRadius = hand.middleFinger.proximal.length * jointScale

      unless finger.bones
        console.warn("error, no bones on", hand.id)
        return

      finger.bones.forEach (bone) ->

        # create joints


        # CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        boneMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(boneRadius, boneRadius, bone.length, 32),
          material.clone()
        )
        boneMesh.material.color.copy(boneColor)
        scope.scene.add boneMesh
        boneMeshes.push boneMesh

        jointMesh = new THREE.Mesh(
          new THREE.SphereGeometry(jointRadius, 32, 32),
          material.clone()
        )
        jointMesh.material.color.copy(jointColor)
        scope.scene.add jointMesh
        jointMeshes.push jointMesh

      jointMesh = new THREE.Mesh(
        new THREE.SphereGeometry(jointRadius, 32, 32),
        material.clone()
      )
      jointMesh.material.color.copy(jointColor)
      scope.scene.add jointMesh
      jointMeshes.push jointMesh

      finger.data "boneMeshes", boneMeshes
      finger.data "jointMeshes", jointMeshes

    boneMeshes.forEach (mesh, i) ->
      bone = finger.bones[i]
      mesh.position.fromArray bone.center()
      mesh.setRotationFromMatrix (new THREE.Matrix4).fromArray(bone.matrix())
      mesh.quaternion.multiply baseBoneRotation

    jointMeshes.forEach (mesh, i) ->
      bone = finger.bones[i]
      if bone
        mesh.position.fromArray bone.prevJoint
      else
        bone = finger.bones[i-1]
        mesh.position.fromArray bone.nextJoint


  if scope.arm
    armMesh = hand.data('armMesh')

    unless armMesh
      armMesh = new THREE.Object3D;
      scope.scene.add(armMesh);
      hand.data('armMesh', armMesh);

      boneXOffset = (hand.arm.width / 2) - (boneRadius / 2)
      halfArmLength = hand.arm.length / 2

      armBones = []
      for i in [0..3]
        armBones.push(new THREE.Mesh(
          # CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
          new THREE.CylinderGeometry(boneRadius, boneRadius,
            ( if  i < 2 then hand.arm.length else hand.arm.width )
          , 32),
          material.clone()
        ))
        armBones[i].material.color.copy(boneColor)
        armMesh.add(armBones[i])

      # CW from Top center
      armBones[0].position.setX(boneXOffset) # radius
      armBones[1].position.setX(-boneXOffset) # ulna
      armBones[2].position.setY(halfArmLength)
      armBones[3].position.setY(-halfArmLength)
      armTopAndBottomRotation = (new THREE.Quaternion).setFromEuler(
        new THREE.Euler(0, 0, Math.PI / 2)
      );

      armBones[2].quaternion.multiply(armTopAndBottomRotation)
      armBones[3].quaternion.multiply(armTopAndBottomRotation)

      armBones = []
      for i in [0..3]
        armBones.push(new THREE.Mesh(
          new THREE.SphereGeometry(jointRadius, 32, 32),
          material.clone()
        ))
        armBones[i].material.color.copy(jointColor)
        armMesh.add(armBones[i])

      # CW from TL
      armBones[0].position.set( - boneXOffset,   halfArmLength, 0)
      armBones[1].position.set(   boneXOffset,   halfArmLength, 0)
      armBones[2].position.set(   boneXOffset, - halfArmLength, 0)
      armBones[3].position.set( - boneXOffset, - halfArmLength, 0)


    armMesh.position.fromArray(hand.arm.center());

    armMesh.setRotationFromMatrix(
      (new THREE.Matrix4).fromArray( hand.arm.matrix() ) # does this get transformed?
    );
    armMesh.quaternion.multiply(baseBoneRotation);




boneHandLost = (hand) ->
  hand.fingers.forEach (finger) ->
    boneMeshes = finger.data("boneMeshes")
    jointMeshes = finger.data("jointMeshes")


    return unless boneMeshes

    boneMeshes.forEach (mesh) ->
      scope.scene.remove mesh

    jointMeshes.forEach (mesh) ->
      scope.scene.remove mesh

    finger.data(boneMeshes: null)
    finger.data(jointMeshes: null)

  if scope.arm
    armMesh = hand.data('armMesh');
    scope.scene.remove(armMesh);
    hand.data('armMesh', null);


Leap.plugin 'boneHand', (options = {}) ->
  # make sure scope is globally available
  scope = options

  scope.boneScale  && boneScale  = scope.boneScale
  scope.jointScale && jointScale = scope.jointScale

  scope.boneColor  && boneColor  = scope.boneColor
  scope.jointColor && jointColor = scope.jointColor

  @use('handEntry')
  @use('handHold')

  # this allows a null scene to be passed in for delayed-initialization.
  if scope.scene == undefined
    console.assert(scope.targetEl)
    initScene(scope.targetEl)

  @on 'handLost', boneHandLost

  {
    hand: boneHand
  }