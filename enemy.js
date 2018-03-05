var enemyShader;

function initEnemyShader() {
    enemyShader = initShaders("enemy-vs","enemy-fs");
    
    // active ce shader
    gl.useProgram(enemyShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    enemyShader.vertexPositionAttribute = gl.getAttribLocation(enemyShader, "aVertexPosition");
    gl.enableVertexAttribArray(enemyShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    enemyShader.vertexCoordAttribute = gl.getAttribLocation(enemyShader, "aVertexCoord");
    gl.enableVertexAttribArray(enemyShader.vertexCoordAttribute);

     // adresse de la variable uniforme uOffset dans le shader
    enemyShader.positionUniform = gl.getUniformLocation(enemyShader, "uPosition");
}

function Enemy() {
    this.initParameters();

    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // un tableau contenant les positions des sommets (sur CPU donc)
    var wo2 = 0.5*this.width;
    var ho2 = 0.5*this.height;

    var vertices = [
        -wo2,-ho2, -0.5,
         wo2,-ho2, -0.5,
         wo2, ho2, -0.5,
        -wo2, ho2, -0.5
    ];

    // on envoie ces positions au GPU ici (et on se rappelle de leur nombre/taille)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;
        
    // meme principe pour les couleurs
    this.coordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    var coords = [
         0.0, 0.0, 
         1.0, 0.0, 
         1.0, 1.0, 
         0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;
    
    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    var tri = [0,1,2,0,2,3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;
}

Enemy.prototype.initParameters = function() {
    this.width = 0.2;
    this.height = 0.2;
    this.position = [0.0, 0.7];
    this.etat = 0;
    this.texture = null;
}

Enemy.prototype.setParameters = function(elapsed) {
    switch (this.etat){
        case 0:
            this.deplacer(elapsed);
            break;
        case 1:
            this.explose(elapsed);
            break;
    }
}

Enemy.prototype.deplacer = function(elapsed){
    this.position[1] -= elapsed/1000;
}

Enemy.prototype.explose = function(elapsed){

}

Enemy.prototype.getPosition = function(elapsed){
    return this.position;
}

Enemy.prototype.setPosition = function(x,y) {
    this.position = [x,y];
}

Enemy.prototype.shader = function() {
    return enemyShader;
}

Enemy.prototype.sendUniformVariables = function() {
    gl.uniform2fv(enemyShader.positionUniform,this.position);
}

Enemy.prototype.draw = function() {
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(enemyShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(enemyShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


