$(function() {

	var checkSize = 40;
		
	var chessField = new THREE.Group();
		chessField.position.set( checkSize * -4, 0, checkSize * 4 );
	var chessPlane = new THREE.Mesh( new THREE.PlaneGeometry( checkSize * 8, checkSize * 8 ), new THREE.MeshPhongMaterial( { color: 0x090909, envMap: reflectionCube } ) );
		chessPlane.position.y = -0.5;
		chessPlane.rotation.x = Math.PI * -0.5;
	var container = new THREE.Group();
		container.add( chessPlane );
		container.add( chessField );
		
	var baseSet = {
		pawn: null,
		rook: null,
		knight: null,
		bishop: null,
		queen: null,
		king: null
	};
	
	var stand = [
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 12.5, 0, 0 ),
		new THREE.Vector3( 12.5, 0, 2 ),
		new THREE.Vector3( 10, 0, 3 ),
		new THREE.Vector3( 10.5, 0, 4 ),
		new THREE.Vector3( 10, 0, 5 )
	];
	
	function pawn(){	
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 3, 0, 20 ) );
			points.push( new THREE.Vector3( 5, 0, 25 ) );
			points.push( new THREE.Vector3( 2, 0, 30 ) );
			points.push( new THREE.Vector3( 0, 0, 30 ) );
		
		baseSet.pawn = createLatheGeometry( points );
	};
	
	function rook() {
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 5, 0, 25 ) );
			points.push( new THREE.Vector3( 7.5, 0, 25 ) );
			points.push( new THREE.Vector3( 7.5, 0, 32.5 ) );
			points.push( new THREE.Vector3( 5, 0, 32.5 ) );
			points.push( new THREE.Vector3( 5, 0, 30 ) );
			points.push( new THREE.Vector3( 0, 0, 30 ) );
			
		baseSet.rook = createLatheGeometry( points );
	};
	
	function bishop() {
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 7.5, 0, 10 ) );
			points.push( new THREE.Vector3( 2.5, 0, 22.5 ) );
			points.push( new THREE.Vector3( 6, 0, 25 ) );
			points.push( new THREE.Vector3( 2.5, 0, 25 ) );
			points.push( new THREE.Vector3( 5, 0, 28.5 ) );
			points.push( new THREE.Vector3( 1, 0, 32.5 ) );
			points.push( new THREE.Vector3( 2.5, 0, 35 ) );
			points.push( new THREE.Vector3( 1, 0, 37.5 ) );
			points.push( new THREE.Vector3( 0, 0, 37.5 ) );
			
		baseSet.bishop = createLatheGeometry( points );
	};

	function queen() {
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 2.5, 0, 20 ) );
			points.push( new THREE.Vector3( 2, 0, 25 ) );
			points.push( new THREE.Vector3( 3, 0, 27 ) );
			points.push( new THREE.Vector3( 7.5, 0, 30 ) );
			points.push( new THREE.Vector3( 3, 0, 30 ) );
			points.push( new THREE.Vector3( 4, 0, 35 ) );
			points.push( new THREE.Vector3( 6, 0, 40 ) );
			points.push( new THREE.Vector3( 4, 0, 40 ) );
			points.push( new THREE.Vector3( 1.25, 0, 42 ) );
			points.push( new THREE.Vector3( 2, 0, 43.5 ) );
			points.push( new THREE.Vector3( 1.2, 0, 45 ) );
			points.push( new THREE.Vector3( 0, 0, 45 ) );
			
		baseSet.queen = createLatheGeometry( points );
	};
	
	function king() {
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 3, 0, 27 ) );
			points.push( new THREE.Vector3( 7.5, 0, 30 ) );
			points.push( new THREE.Vector3( 3, 0, 30 ) );
			points.push( new THREE.Vector3( 4, 0, 35 ) );
			points.push( new THREE.Vector3( 6, 0, 40 ) );
			points.push( new THREE.Vector3( 4, 0, 40 ) );
			points.push( new THREE.Vector3( 1.25, 0, 42 ) );
			points.push( new THREE.Vector3( 2, 0, 43.5 ) );
			points.push( new THREE.Vector3( 0, 0, 55 ) );
		
		baseSet.king = createLatheGeometry( points );
	};
	
	function knight() {
		var points = [];
			points = points.concat( stand );
			points.push( new THREE.Vector3( 0, 0, 5 ) );
		var standGeometry = createLatheGeometry( points );
		
		// extrusion
		var thickness = 4;
		var extrudeOptions = {
                    amount: 0,
                    bevelThickness: thickness,
                    bevelSize: 0.5,
                    bevelSegments: 32,
                    bevelEnabled: true,
                    curveSegments: 10,
                    steps: 1
                };
				
		var horseShape = new THREE.Shape();
			horseShape.moveTo( 0, 0 );
			horseShape.lineTo( -10, 0 );
			horseShape.lineTo( -5, 10 );
			horseShape.lineTo( 2.5, 17.5 );
			horseShape.lineTo( 0, 20 );
			horseShape.lineTo( -8, 18 );
			horseShape.lineTo( -10, 20 );
			horseShape.lineTo( -5, 25 );
			horseShape.lineTo( -7.5, 30 );
			horseShape.lineTo( -2.5, 27.5 );
			horseShape.lineTo( 0, 30 );
			horseShape.lineTo( 5, 28 );
			horseShape.lineTo( 8, 25 );
			horseShape.lineTo( 12.5, 20 );
			horseShape.lineTo( 12.5, 15 );
			horseShape.lineTo( 10, 0 );
			horseShape.lineTo( 0, 0 );
		
		var horseGeometry = new THREE.ExtrudeGeometry( horseShape, extrudeOptions );
			horseGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 5, 0 ) );

		standGeometry.merge( horseGeometry );
		
		baseSet.knight = standGeometry;
	};
	
	function createLatheGeometry( points ){
		var lathe = new THREE.LatheGeometry( points, 128 );
			lathe.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI * -0.5 ) );
		return lathe;
	};
	
	pawn();
	rook();
	bishop();
	queen();
	king();
	knight();
	
	function createPiece( piece, material, position ){
		var mesh = new THREE.Mesh( piece, material );
		chessField.add( mesh );
		return {
			piece: mesh,
			position: position, 
			initPosition: position
		};
	};
	
	function createHalfSet( blackwhite ){
		var halfSet = [];
		
		var material = new THREE.MeshPhongMaterial( { color: blackwhite, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3, shininess: 300 } );
		
		// from left to right
		var posRow = blackwhite === "black" ? "8" : "1";
		var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		
		halfSet.push( createPiece( baseSet.rook, material, chars[0] + posRow ) );
		halfSet.push( createPiece( baseSet.knight, material, chars[1] + posRow ) );
		halfSet.push( createPiece( baseSet.bishop, material, chars[2] + posRow ) );
		halfSet.push( createPiece( baseSet.queen, material, chars[3] + posRow ) );
		halfSet.push( createPiece( baseSet.king, material, chars[4] + posRow ) );
		halfSet.push( createPiece( baseSet.bishop, material, chars[5] + posRow ) );
		halfSet.push( createPiece( baseSet.knight, material, chars[6] + posRow ) );
		halfSet.push( createPiece( baseSet.rook, material, chars[7] + posRow ) );
		
		// pawns
		posRow = blackwhite === "black" ? "7" : "2";
		chars.forEach(
			function( chr ){
				halfSet.push( createPiece( baseSet.pawn, material, chr + posRow ) );
			}
		);
		
		var turn = Math.PI * 0.5;
		if ( blackwhite === "white" ) turn = turn * -1;
			
		halfSet[1].piece.rotation.y = turn;
		halfSet[6].piece.rotation.y = turn;
		
		return halfSet;
		
	};

	function createChecks(){

		for( var i = 0; i < 8; i++ )
			for( var j = 0; j < 8; j++){
				if ( ( i + j ) % 2 != 0 ){
					var check = new THREE.Mesh( new THREE.PlaneGeometry( checkSize, checkSize ), new THREE.MeshPhongMaterial( { color: "white" } ) );
						check.position.set( checkSize * 0.5 + checkSize * i, -0.05, -( checkSize * 0.5 + checkSize * j ) );
						check.rotation.x = Math.PI * -0.5;
					chessField.add( check );
				}
			}

	};

	createChecks();

	function createText( text, size ) {
				
		var thickness = .1;
		var fontFamily = "droid sans";
		
		var textGeometry = new THREE.TextGeometry( text, 
				{ 
					font: fontFamily, 
					size: size, 
					height: thickness,
					//weight: 'bold',
					bevelEnabled: true,
					bevelThickness: .1,
					bevelSize: .1,
					curveSegments: 32
				}
			);

		textGeometry.computeBoundingBox();
		var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
		var textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
		var textThickness = textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z;

		textGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( textWidth * -0.5, textHeight * -0.5, 0 ) );

		var textMaterial = new THREE.MeshPhongMaterial({ color: 0xcd7f32, envMap: reflectionCube });

		var textMesh = new THREE.Mesh( textGeometry, textMaterial );

		return textMesh;
	};

	function createNumbersAndLetters(){
		var ltrs = "abcdefgh";
		var ltrsSize = checkSize * 0.5;

		for( var i = 0; i < 8; i++ ){
			
			var letter = ltrs[i];
			//letter white
			var letterWhite = createText( letter, ltrsSize );
				letterWhite.rotation.x = Math.PI * -0.5;
				letterWhite.position.set( checkSize * 0.5 + checkSize * i, 0, checkSize - checkSize * 0.5 );
			chessField.add( letterWhite );
			//letter black
			var letterBlack = createText( letter, ltrsSize );
				letterBlack.rotation.x = Math.PI * -0.5;
				letterBlack.rotation.z = Math.PI;
				letterBlack.position.set( checkSize * 0.5 + checkSize * i, 0, -checkSize * 9 + checkSize * 0.5 );
			chessField.add( letterBlack );
			//cypher white
			var cypherWhite = createText( i + 1, ltrsSize );
				cypherWhite.rotation.x = Math.PI * -0.5;
				cypherWhite.position.set( checkSize * -0.5, 0, -checkSize * 0.5 - checkSize * i );
			chessField.add( cypherWhite );
			//cypher black
			var cypherBlack = createText( i + 1, ltrsSize );
				cypherBlack.rotation.x = Math.PI * -0.5;
				cypherBlack.rotation.z = Math.PI;
				cypherBlack.position.set( -checkSize * 0.5 + checkSize * 9, 0, -checkSize * 0.5 - checkSize * i );
			chessField.add( cypherBlack );

		};
	}
	
	createNumbersAndLetters();

	return {
		checkSize: checkSize,
		chessField: chessField,
		container: container,
		geometries: baseSet,
		pieces:
		[
			createHalfSet( "white" ),
			createHalfSet( "black" )
		],
		arrange: function(){
			var size = this.checkSize;
			this.pieces.forEach( function( pieceshalfset ){
					pieceshalfset.forEach( function( singlepiece ){
							var position = singlepiece.initPosition;
							singlepiece.position = position;
							var chr = position[0];
							var row = position[1] - 1;
							
							var chrn = "abcdefgh".indexOf( chr );
							
							var figure = singlepiece.piece;
							figure.position.set( size * 0.5 + size * chrn, 0, -( size * 0.5 + size * row ) );
						}
					)
				}
			)
		}
	};
	
});