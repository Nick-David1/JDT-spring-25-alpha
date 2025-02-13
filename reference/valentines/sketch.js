// Update global progress variables
let stemProgress = 0;
let flowerProgress = 0;
let leafProgress = 0;
let textProgress = 0;

const flowerSketch = function(p) {
  p.preload = function() {
    p.font = p.loadFont('cursive.ttf');
  };

  p.setup = function() {
    p.createCanvas(700, 700, p.WEBGL);
    p.colorMode(p.HSB);
    p.angleMode(p.DEGREES);
    p.strokeWeight(4);
    p.isTextPhase = true;
    setTimeout(function(){ p.isTextPhase = false; }, 3000);
  };

  // Modified drawLeaf to draw progressively based on provided progress (0 to 1)
  function drawLeaf(p, position, size, angle, progress) {
    p.push();
    p.translate(position.x, position.y, position.z);
    p.rotateY(angle);
    
    // Leaf color gradient
    let leafHue = p.random(100, 130); // Natural green variation
    p.fill(leafHue, 80, 60);
    p.noStroke();
    
    // Draw part of the leaf shape based on progress
    for(let r = 0; r <= progress; r += 0.1) {
      p.beginShape();
      for(let theta = -90; theta <= 90; theta += 5) {
        let curve = Math.pow(Math.abs(theta/90), 0.8) * 50 * r;
        let wave = p.sin(theta * 3) * 5 * (1 - r);
        let x = size * p.sin(theta) * (0.5 + r/2) + wave;
        let y = size * r * 2 - size;
        let z = curve * (1 - r/2);
        p.vertex(x, y, z);
      }
      p.endShape(p.CLOSE);
    }
    p.pop();
  }

  // New function to draw the stem progressively from bottom up
  function drawStem(p) {
    p.push();
    p.noStroke();
    p.fill(120, 80, 60);
    p.translate(0, 50, 0);
    
    let stemBottomY = 250; // bottom of stem
    let stemTopY = -150;    // extended top so stem reaches base of flower
    let stemHeight = stemBottomY - stemTopY;
    let currentY = stemBottomY - stemProgress * stemHeight;
    
    let segments = 200;  // number of vertical segments
    let r = 8;          // increased stem radius for fuller appearance
    let angleSteps = 30; // more subdivisions for a complete circle
    
    for (let i = 0; i < segments; i++) {
      let t1 = i / segments;
      let t2 = (i + 1) / segments;
      let y1 = stemBottomY - t1 * stemHeight;
      let y2 = stemBottomY - t2 * stemHeight;
      
      // Clamp y2 to currentY
      if (y2 < currentY) {
        y2 = currentY;
      }
      // If this band is completely above currentY, stop drawing
      if (y1 < currentY) {
        break;
      }
      
      p.beginShape(p.QUAD_STRIP);
      for (let j = 0; j <= angleSteps; j++) {
        let angle = j / angleSteps * 2 * Math.PI;
        let x = r * Math.cos(angle);
        let z = r * Math.sin(angle);
        p.vertex(x, y1, z);
        p.vertex(x, y2, z);
      }
      p.endShape();
      
      if (y2 === currentY) {
        break;
      }
    }
    p.pop();
  }

  p.draw = function() {
    p.background(0);
    p.orbitControl(4, 4);
    p.rotateX(-30);
    
    // Progressive Stem Drawing
    drawStem(p);
    
    // Progressive Leaf Drawing: keep only the bottom most leaf
    drawLeaf(p, p.createVector(0, 100, 0), 30, 45, leafProgress);
    
    // Progressive Flower Drawing with smooth interpolation
    let maxSteps = Math.floor(1.02 / 0.02) + 1;
    if (leafProgress >= 1) {
      let fullSteps = Math.floor(flowerProgress);
      for (let i = 0; i < fullSteps; i++) {
        p.stroke(340, -i * 0.02 * 50 + 100, i * 0.02 * 50 + 50);
        p.beginShape(p.POINTS);
        for (let theta = -360; theta <= 2700; theta += 2) {
          let phi = (180/2) * Math.exp(-theta / (8 * 180));
          let petalCut = 1 - (1 / 2) * Math.pow((5 / 4) * Math.pow(1 - (((3.6 * theta) % 360) / 180), 2) - 1 / 4, 2);
          let hangDown = 2 * Math.pow(i * 0.02, 2) * Math.pow(1.3 * i * 0.02 - 1, 2) * p.sin(phi);
          if (petalCut * (i * 0.02 * p.sin(phi) + hangDown * p.cos(phi)) > 0) {
            let pX = 260 * petalCut * (i * 0.02 * p.sin(phi) + hangDown * p.cos(phi)) * p.sin(theta);
            let pY = -260 * petalCut * (i * 0.02 * p.cos(phi) - hangDown * p.sin(phi));
            let pZ = 260 * petalCut * (i * 0.02 * p.sin(phi) + hangDown * p.cos(phi)) * p.cos(theta);
            p.vertex(pX, pY, pZ);
          }
        }
        p.endShape();
      }
      let rem = flowerProgress - Math.floor(flowerProgress);
      if (rem > 0 && Math.floor(flowerProgress) < maxSteps) {
        let r = Math.floor(flowerProgress) * 0.02 + rem * 0.02;
        p.stroke(340, -r * 50 + 100, r * 50 + 50);
        p.beginShape(p.POINTS);
        for (let theta = -360; theta <= 2700; theta += 2) {
          let phi = (180/2) * Math.exp(-theta / (8 * 180));
          let petalCut = 1 - (1 / 2) * Math.pow((5 / 4) * Math.pow(1 - (((3.6 * theta) % 360) / 180), 2) - 1 / 4, 2);
          let hangDown = 2 * Math.pow(r, 2) * Math.pow(1.3 * r - 1, 2) * p.sin(phi);
          if (petalCut * (r * p.sin(phi) + hangDown * p.cos(phi)) > 0) {
            let pX = 260 * petalCut * (r * p.sin(phi) + hangDown * p.cos(phi)) * p.sin(theta);
            let pY = -260 * petalCut * (r * p.cos(phi) - hangDown * p.sin(phi));
            let pZ = 260 * petalCut * (r * p.sin(phi) + hangDown * p.cos(phi)) * p.cos(theta);
            p.vertex(pX, pY, pZ);
          }
        }
        p.endShape();
      }
    }
    
    // Update progress: stem first, then leaf, then flower
    if (stemProgress < 1) {
      stemProgress += 0.005;
      if (stemProgress > 1) stemProgress = 1;
    } else if (leafProgress < 1) {
      leafProgress += 0.01;
      if (leafProgress > 1) leafProgress = 1;
    } else {
      if (flowerProgress < maxSteps) {
        flowerProgress += 0.1;
        if (flowerProgress > maxSteps) flowerProgress = maxSteps;
      }
    }
    
    // Draw 'Happy Valentines Day' text in the same 3D space above the flower
    if (stemProgress >= 1 && leafProgress >= 1 && flowerProgress >= Math.floor(Math.floor(1.02/0.02)+1)) {
      let message = "Happy Valentines Day, Love Nick";
      if (textProgress < message.length) {
        textProgress += 0.25; // Increase to control speed
      }
      let displayText = message.substring(0, Math.floor(textProgress));
      p.push();
      p.textFont(p.font);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(50);
      p.fill('#FF9999');
      p.translate(0, -300, 0);
      p.text(displayText, 0, 0);
      p.pop();
    }
  };
};

new p5(flowerSketch, 'paper');