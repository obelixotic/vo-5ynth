//1 dec 18 - PCOMP WIP - (sketch28.js ICM FINAL + arduino integration)
//record button disable when play on - done
//only play melody when atleast one note in array to avoid console error - done
//fix bpm at 65 - done
//fix labels on buttons and disable voice layers buttons as toggle switches (n/a to drums) - done
//complexity slder!!!! - done
//stop melody/arp/bass when slider to minimum - done

//to fix - volume slider map to p1,p2,p3 and fix ranges AND POT4 INTEGRATION

var files = [];
var filenames = [1542499854829, 1542499918082, 1542499970266];
var filename = "";
var notes = ["C3", "F3", "A3"];
var serial;
var latestData = "waiting for data";
let audioContext;
let mic;
let pitch;
let values = [];
let f=0;
var theNote = "";
var recorder, soundFile;
var state = 0;
var melodyScale = [];
var arpScale = [];
var chordScale = [];
var testScale = [];
var synth;
var synth2;
var synth3;
var synth4;
var sampler;
var sampler2;
var sampler3;
var sampler4;
var note1 = "";
var note1_5 = "";
var note2 = "";
var note3 = "";
var note3_5 = "";
var note2_12 = "";
var minArrayLength = 0;
var playButton;
var soundFile;
var buttonCstate = false;
var buttonDstate = false;
var buttonFstate = false;
var buttonGstate = false;
var buttonAstate = false;
var buttonCCstate = false;
var buttonDDstate = false;
var b1, b2, b3, b4, b5, b6, b7, b8, b9, b10;
var p1, p2, p3, p4;
var beatOn = true;
var complexityValue;

// melodyScale = ["C5", "D5", "F5", "G5"];
// arpScale = ["C4", "D4", "F4", "G4"];
chordScale = ["A3", "C4", "D4", "F4", "G4"];
// testScale = ["C4", "D4", "F4", "G4", "A4", "C5"];

synth = new Tone.PolySynth({
  "envelope": {
    "attack": 3,
    "decay": 0,
    "sustain": 0,
    "release": 0.001,
    }
}).toMaster();

synth.set({"oscillator": {
          "type": "sine"
					}
});

synth2 = new Tone.PolySynth({
  "envelope": {
    "attack": 3,
    "decay": 0,
    "sustain": 0,
    "release": 0.001,
    }
}).toMaster();

synth2.set({"oscillator": {
          "type": "sine"
					}
});

synth3 = new Tone.PolySynth({
  "envelope": {
    "attack": 0.01,
    "decay": 0,
    "sustain": 0.3,
    "release": 0.01,
    }
}).toMaster();

synth3.set({"oscillator": {
          "type": "sine"
					}
});

synth4 = new Tone.PolySynth({
  "envelope": {
    "attack": 3,
    "decay": 0,
    "sustain": 0.1,
    "release": 0.01,
    }
}).toMaster();

synth4.set({"oscillator": {
          "type": "sine"
					}
});

Tone.Transport.bpm.value = 65;

var melody = new Tone.Pattern(function(time, note){
  note1 = note;
  // var timey1 = ["2t", "4t", "8t", "8t", "8t", "16t"][floor(random(6))];
  var timey1 = ["4t", "8t", "8t", "16t", "16t", "32t"][floor(random(complexityValue))];
  melody.interval = timey1;
  var fifth = Tone.Frequency(note).transpose(-5);
  sampler.triggerAttackRelease(note, "8t", time, 1);
  synth.triggerAttackRelease(note, "4t", time, 0.5);
  sampler2.triggerAttackRelease(fifth, "8t", time, 1);
  synth2.triggerAttackRelease(fifth, "4t", time, 0.5);
}, melodyScale, "randomOnce");
melody.loop = true;

var arpeggio = new Tone.Pattern(function(time, note){
  note2 = note;
  var timey1 = ["4t", "8t", "8t", "16t", "16t", "32t"][floor(random(complexityValue))];
  // var timey1 = ["4n", "4t", "8t", "16t"][floor(random(3))];
  arpeggio.interval = timey1;
  // var octave = Tone.frequency(note2).transpose(-12);
  sampler3.triggerAttackRelease(note2, "32t", time, 1);
  synth3.triggerAttackRelease(note2, "16t", time, 0.5);
}, arpScale, "randomOnce");
arpeggio.loop = true;
// arpeggio.interval = "4t";

var chord = new Tone.Pattern(function(time, note){
  note3 = note;
  var bass = Tone.Frequency(note).transpose(-12);
  var fifth = Tone.Frequency(note).transpose(-5);
  note3_5 = fifth.toNote();
  sampler4.triggerAttackRelease(bass, "2m", time, 1);
  sampler4.triggerAttackRelease(fifth, "2m", time, 0.5);
  synth4.triggerAttackRelease(bass, "4n", time, 1);
  synth4.triggerAttackRelease(fifth, "4n", time, 0.5);
}, chordScale, "randomOnce");

chord.loop = true;
chord.interval = "2n";

// Add a snare drum sound
// Play a kick/snare pattern

// SOUNDS

// Create a Players object and load the "kick.mp3" and "snare.mp3" files
var kit = new Tone.Players({
  "kick": "./kick.mp3",
  "snare":"./snare.mp3"
});
kit.toMaster();
let audioLoop = new Tone.Event(playBeat, ["kick", "snare"]);
audioLoop.loop = true;
audioLoop.loopEnd = "4n";
audioLoop.start("4n");
// audioLoop.volume = -56;

// kit.toMaster();
// let audioLoop = Tone.Transport.scheduleRepeat(playBeat, "4n");

function preload() {
  files = loadJSON("/getfiles");
}

function setup(){
  createCanvas(400,400);
  // console.log(files);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();

  serial = new p5.SerialPort();
  serial.on('data', gotData);
  serial.open("/dev/cu.usbmodem14201");

  mic.start(startPitch);
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  createP('keyPress to record', 20, 20);
  // Tone.Transport.start();
  // melody.start(0);
  // harmony.start(0);
  // chord.start(0);

  textSize(30);

  playButton = createButton('Play');
  playButton.position(330, 80+120);
  playButton.mousePressed(togglePlay);

  melodyButton = createButton("MelodyOff");
  melodyButton.position(40, 80+120);
  // melodyButton.mousePressed(toggleMelody);

  drumsButton = createButton("DrumsOff");
  drumsButton.position(330, 80+250);
  drumsButton.mousePressed(toggleDrums);

  arpeggioButton = createButton("ArpeggioOff");
  arpeggioButton.position(40, 180+120);
  // arpeggioButton.mousePressed(toggleArpeggio);

  chordButton = createButton("BassOff");
  chordButton.position(40, 280+120);
  // chordButton.mousePressed(toggleChord);

  buttonC = createButton("C");
  buttonC.position(40, 500);
  buttonC.mousePressed(addCtoArray);

  buttonD = createButton("D");
  buttonD.position(90, 500);
  buttonD.mousePressed(addDtoArray);

  buttonF = createButton("F");
  buttonF.position(190-50, 500);
  buttonF.mousePressed(addFtoArray);

  buttonG = createButton("G");
  buttonG.position(240-50, 500);
  buttonG.mousePressed(addGtoArray);

  buttonA = createButton("A");
  buttonA.position(290-50, 500);
  buttonA.mousePressed(addAtoArray);

  buttonB = createButton("CC");
  buttonB.position(340-50, 500);
  buttonB.mousePressed(addCCtoArray);

  buttonB = createButton("DD");
  buttonB.position(340, 500);
  buttonB.mousePressed(addDDtoArray);

  // bpmSlider = createSlider(60, 90, 70, 10);
  melodySlider = createSlider(-48, -24, -40, 1);
  // harmonySlider = createSlider(-48, -24, -12, 1);
  arpeggioSlider = createSlider(-24, 2, -12, 1);
  chordSlider = createSlider(-24, 2, -2, 1);
  complexitySlider = createSlider(1, 6, 2, 1);
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  var sensors = split(currentString, ','); // split the string on the commas
    if (sensors.length > 13) { // if there are three elements
      b1 = sensors[0]; //C
      b2 = sensors[1]; //D
      b3 = sensors[2]; //F
      b4 = sensors[3]; //G
      b5 = sensors[4]; //A
      b6 = sensors[5]; //CC
      b7 = sensors[6]; //DD
      b8 = sensors[7]; //DRUMS
      b9 = sensors[8]; //REC
      b10 = sensors[9]; //PLAY/STOP
      p1 = map(sensors[10], 0, 1023, 0, -24);
      p2 = map(sensors[11], 0, 1023, 2, -24);
      p3 = map(sensors[12], 0, 1023, 2, -24);
      p4 = map(sensors[13], 0, 1023, 6, 1);
    }
  console.log(b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, p1, p2, p3, p4);

  if(b1==0 && buttonCstate==false){
    melodyScale.push("C5");
    arpScale.push("C4");
    buttonCstate = true;
    console.log(melodyScale);
  } else if (b1==1 && buttonCstate==true){
    let i = melodyScale.indexOf("C5");
    let k = arpScale.indexOf("C4");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonCstate = false;
    console.log(melodyScale);
  }

  if(b2==0 && buttonDstate==false){
    melodyScale.push("D5");
    arpScale.push("D4");
    buttonDstate = true;
    console.log(melodyScale);
  } else if (b2==1 && buttonDstate==true){
    let i = melodyScale.indexOf("D5");
    let k = arpScale.indexOf("D4");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonDstate = false;
    console.log(melodyScale);
  }

  if(b3==0 && buttonFstate==false){
    melodyScale.push("F5");
    arpScale.push("F4");
    buttonFstate = true;
  } else if (b3==1 && buttonFstate==true){
    let i = melodyScale.indexOf("F5");
    let k = arpScale.indexOf("F4");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonFstate = false;
  }

  if(b4==0 && buttonGstate==false){
    melodyScale.push("G5");
    arpScale.push("G4");
    buttonGstate = true;
  } else if (b4==1 && buttonGstate==true){
    let i = melodyScale.indexOf("G5");
    let k = arpScale.indexOf("G4");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonGstate = false;
  }

  if(b5==0 && buttonAstate==false){
    melodyScale.push("A5");
    arpScale.push("A4");
    buttonAstate = true;
  } else if (b5==1 && buttonAstate==true){
    let i = melodyScale.indexOf("A5");
    let k = arpScale.indexOf("A4");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonAstate = false;
  }

  if(b6==0 && buttonCCstate==false){
    melodyScale.push("C6");
    arpScale.push("C5");
    buttonCCstate = true;
  } else if (b6==1 && buttonCCstate==true){
    let i = melodyScale.indexOf("C6");
    let k = arpScale.indexOf("C5");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonCCstate = false;
  }

  if(b7==0 && buttonDDstate==false){
    melodyScale.push("D6");
    arpScale.push("D5");
    buttonDDstate = true;
  } else if (b7==1 && buttonDDstate==true){
    let i = melodyScale.indexOf("D6");
    let k = arpScale.indexOf("D5");
    melodyScale.splice(i,1);
    arpScale.splice(k,1);
    buttonDDstate = false;
  }

  if(b8==0) {
    beatOn = false;
    drumsButton.html("DrumsOn");
  } else if(b8==1){
    beatOn = true;
    drumsButton.html("DrumsOff");
  }

  if(b9==0){
    if (state%4==0 && mic.enabled) {
      // record to our p5.SoundFile
      // setTimeout(function(){
      if(Tone.Transport.state == "started"){
        togglePlay();
      }
      recorder.record(soundFile);
      logValues(f);
      // createP('Recording!', 20, 20);
      console.log("RECORDING AND LISTENING");
      state=1;
      stateManager();
    // },500);
    }
  }

  if(b10==1) {
    	Tone.Transport.stop();
      melody.stop();
      arpeggio.stop();
      chord.stop();
      toggleDrums();
      playButton.html('Play');
      melodyButton.html("SynthOff");
      arpeggioButton.html("MelodyOff");
      chordButton.html("BassOff");
    } else if(b10==0){
    	Tone.Transport.start();
      melody.start("2n");
      arpeggio.start("2n");
      chord.start("4n");
      toggleDrums();
      playButton.html('Stop');
      melodyButton.html("SynthOn");
      arpeggioButton.html("MelodyOn");
      chordButton.html("BassOn");
    }
  //   Tone.Transport.start();
  //   melody.start("2n");
  //   arpeggio.start("2n");
  //   chord.start("4n");
  // } else {
  //   Tone.Transport.stop();
  //   melody.stop();
  //   arpeggio.stop();
  //   chord.stop();
  }

function playBeat(time, drumsample) {
  if (kit.loaded && beatOn) {
    let beat = Tone.Transport.position.split(":")[1];
    if(beat%2==0){
    	kit.get(drumsample[1]).start();
    }
    else{
    	kit.get(drumsample[0]).start();
    }
  }
}

// function playBeat() {
//   if (kit.loaded && beatOn) {
//     let beat = Tone.Transport.position.split(":")[1];
//     if(beat%2==0){
//     	kit.get("snare").start();
//     }
//     else{
//     	kit.get("kick").start();
//     }
//   }
// }

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  select('#status').html('Model Loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      select('#result').html(frequency);
      f = frequency;
    // } else {
    //   select('#result').html('No pitch detected');
    }
    // console.log("listening...");
    if(state%4==0){
      setTimeout(getPitch, 100);
    }
  })
}

function logValues(f){
  if(f > 0){
    values.push(f);
  }
  console.log(values);
}

function keyPressed() {
  // make sure user enabled the mic
  if (state%4==0 && mic.enabled) {
    // record to our p5.SoundFile
    // setTimeout(function(){
    if(Tone.Transport.state == "started"){
      togglePlay();
    }
    recorder.record(soundFile);
    logValues(f);
    // createP('Recording!', 20, 20);
    console.log("RECORDING AND LISTENING");
    state=1;
    stateManager();
  // },500);
  }
}

function stateManager(){
  setTimeout(stopRecording, 1000);
}

function stopRecording(){
  if (state === 1) {
    recorder.stop();
    // mic.stop();
    // createP('Stopped', 20, 20);
    console.log("STOPPED RECORDING AND LISTENING")
    state++;
  }
  setTimeout(findNote,1000);
}

function findNote(){
  if (state === 2) {
    var temp = Tone.Frequency.ftom(values[values.length-1]);
    // console.log(JSON.stringify(temp,null,null));
    theNote = Tone.Frequency(temp, "midi").toNote();
    notes.push(theNote);
    soundFile.play(); // play the result!
    filename = Date.now()+'.wav';
    filenames.push(filename);
    save(soundFile, filename);
    // createP('playing recording', 20, 20);
    console.log("RECORDING SAVED");
    state++;
  }
  setTimeout(feedNote,1000);
}

function feedNote(){
  if (state === 3) {
    console.log(`the note is ${theNote}`);
    console.log("SAMPLER INITIALISED");
    sampler = new Tone.Sampler({
      [theNote]: "./"+filenames[filenames.length-1]
    });
    sampler.attack = 0.5;
    sampler.release = 0.01;

    sampler2 = new Tone.Sampler({
      [theNote]: "./"+filenames[filenames.length-1]
    });
    sampler2.attack = 0.5;
    sampler2.release = 0.01;

    sampler3 = new Tone.Sampler({
      [theNote]: "./"+filenames[filenames.length-1]
    });
    sampler3.attack = 0.2;
    sampler3.release = 0.01;

    sampler4 = new Tone.Sampler({
      [theNote]: "./"+filenames[filenames.length-1]
    });
    sampler4.attack = 0.5;
    sampler4.release = 0.01;

    var chorus = new Tone.Chorus(4, 2.5, 0.1).toMaster();
    var freeverb = new Tone.Freeverb();
    freeverb.dampening.value = 1000;
    var pingPong = new Tone.PingPongDelay("2n", 0.2);
    sampler.connect(pingPong).connect(freeverb).connect(chorus);
    sampler2.connect(pingPong).connect(freeverb).connect(chorus);
    sampler3.connect(pingPong).connect(freeverb).connect(chorus);
    sampler4.connect(pingPong).connect(freeverb).connect(chorus);

    console.log("READY TO PLAY");
    state++;
    getPitch();
    console.log(notes);

  }
}

function draw(){
  background(150);
  // Tone.Transport.bpm.value = bpmSlider.value();
  // Tone.Transport.bpm.value = 90;
  if(state>3){
    sampler.volume.value = p1;
    synth.volume.value = map(sampler.volume.value, -48, -24, -48, 0);

    sampler2.volume.value = map(sampler.volume.value, -24, 2, -36, 0);
    synth2.volume.value = map(sampler2.volume.value, -36, 0, -30, 0);

    sampler3.volume.value = p2;
    synth3.volume.value = map(sampler3.volume.value, -24, 2, -24, 0);

    sampler4.volume.value = p3;
    synth4.volume.value = map(sampler4.volume.value, -24, 2, -48, 0);

    complexityValue = p4;
  }

  // console.log(complexityValue);

  if(melodyScale.length<1 || p1 <= -48){
    melody.stop();
    melodyButton.html("SynthOff");
  } else if(melodyScale.length>0 && Tone.Transport.state == "started" && p1 > -48){
    melody.start("2n");
    melodyButton.html("SynthOn");
  }

  if(melodyScale.length<1 || p2 <= -23){
    arpeggio.stop();
    arpeggioButton.html("MelodyOff");
  } else if(melodyScale.length>0 && Tone.Transport.state == "started" && p2 > -23){
      arpeggio.start("2n");
      arpeggioButton.html("MelodyOn");
    }

  if(p3 <= -24 || Tone.Transport.state != "started"){
    chord.stop();
    chordButton.html("BassOff");
  } else if(p3 > -24 && Tone.Transport.state == "started"){
    chord.start("4n");
    chordButton.html("BassOn");
  }

  if(buttonCstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-300,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-300,330,20,20);
    pop();
  }

  if(buttonDstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-250,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-250,330,20,20);
    pop();
  }

  if(buttonFstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-200,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-200,330,20,20);
    pop();
  }

  if(buttonGstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-155,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-155,330,20,20);
    pop();
  }

  if(buttonAstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-105,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-105,330,20,20);
    pop();
  }

  if(buttonCCstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-50,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-50,330,20,20);
    pop();
  }

  if(buttonDDstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355,330,20,20);
    pop();
  }

  // if(buttonCstate==true && note1=="C5"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-300,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-300,330,20,20);
  //   pop();
  // }
  //
  // if(buttonDstate==true && note1=="D5"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-250,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-250,330,20,20);
  //   pop();
  // }
  //
  // if(buttonFstate==true && note1=="F5"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-200,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-200,330,20,20);
  //   pop();
  // }
  //
  // if(buttonGstate==true && note1=="G5"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-155,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-155,330,20,20);
  //   pop();
  // }
  //
  // if(buttonAstate==true && note1=="A5"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-105,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-105,330,20,20);
  //   pop();
  // }
  //
  // if(buttonCCstate==true && note1=="C6"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355-50,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355-50,330,20,20);
  //   pop();
  // }
  //
  // if(buttonDDstate==true && note1=="D6"){
  //   push();
  //   fill(0,255,0);
  //   stroke(0);
  //   ellipse(355,330,20,20);
  //   pop();
  // } else{
  //   push();
  //   fill(150);
  //   stroke(0);
  //   ellipse(355,330,20,20);
  //   pop();
  // }

fill(0);
  text(note1,120,100-10);
  text(note2,120,200-10);
  text(note3,120,300-10);
  text(note3_5,220,300-10);
}

function togglePlay(){
	if(Tone.Transport.state == "started"){
  	Tone.Transport.stop();
    melody.stop();
    arpeggio.stop();
    chord.stop();
    toggleDrums();
    playButton.html('Play');
    melodyButton.html("SynthOff");
    arpeggioButton.html("MelodyOff");
    chordButton.html("BassOff");
  } else {
  	Tone.Transport.start();
    melody.start("2n");
    arpeggio.start("2n");
    chord.start("4n");
    toggleDrums();
    playButton.html('Stop');
    melodyButton.html("SynthOn");
    arpeggioButton.html("MelodyOn");
    chordButton.html("BassOn");
  }
}

// function toggleMelody(){
// 	if(melody.state == "started"){
//   	melody.stop();
//     melodyButton.html("SynthOff");
//   } else {
//   	melody.start("2n");
//     melodyButton.html("SynthOn");
//   }
// }

function toggleDrums(){
	beatOn = !beatOn;
  if(beatOn){
    drumsButton.html("DrumsOn");
  } else {
    drumsButton.html("DrumsOff");
  }
}

// function toggleArpeggio(){
// 	if(arpeggio.state == "started"){
//   	arpeggio.stop();
//     arpeggioButton.html("MelodyOff");
//   } else {
//   	arpeggio.start("2n");
//     arpeggioButton.html("MelodyOn");
//   }
// }

// function toggleChord(){
// 	if(chord.state == "started"){
//   	chord.stop();
//     chordButton.html("BassOff");
//   } else {
//   	chord.start("4n");
//     chordButton.html("BassOn");
//   }
// }

function addCtoArray(){
  if(buttonCstate==false){
    ellipse(40,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("C5");
    // harmonyScale.push("G4");
    arpScale.push("C4");
    // chordScale.push("C3");
    // chordScale.push("C4");
  	buttonCstate = true;
  } else if(buttonCstate==true && melodyScale.length>=minArrayLength){
    ellipse(40,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("C5");
    // let j = harmonyScale.indexOf("G4");
    let k = arpScale.indexOf("C4");
  	// let l = chordScale.indexOf("C3");
  	// let m = chordScale.indexOf("C4");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonCstate = false;
  }
}

function addDtoArray(){
	if(buttonDstate==false){
    ellipse(90,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("D5");
    // harmonyScale.push("A4");
    arpScale.push("D4");
    // chordScale.push("D3");
    // chordScale.push("D4");
    buttonDstate = true;
  } else if(buttonDstate==true && melodyScale.length>=minArrayLength){
    ellipse(90,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("D5");
    // let j = harmonyScale.indexOf("A4");
    let k = arpScale.indexOf("D4");
  	// let l = chordScale.indexOf("D3");
  	// let m = chordScale.indexOf("D4");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonDstate = false;
  }
}

// function addEtoArray(){
// 	if(buttonEstate==false){
//     melodyScale.push("E5");
//     // harmonyScale.push("B4");
//     arpScale.push("E4");
//     // chordScale.push("E3");
//     // chordScale.push("E4");
//     buttonEstate = true;
//   } else if(buttonEstate==true && melodyScale.length>1){
//     let i = melodyScale.indexOf("E5");
//     // let j = harmonyScale.indexOf("B4");
//     let k = arpScale.indexOf("E4");
//   	// let l = chordScale.indexOf("E3");
//   	// let m = chordScale.indexOf("E4");
//     melodyScale.splice(i,1);
//     // harmonyScale.splice(j,1);
//     arpScale.splice(k,1);
//     // chordScale.splice(l,1);
//     // chordScale.splice(m,1);
//     buttonEstate = false;
//   }
// }

function addFtoArray(){
	if(buttonFstate==false){
    ellipse(130,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("F5");
    // harmonyScale.push("C4");
    arpScale.push("F4");
    // chordScale.push("F3");
    // chordScale.push("F4");
    buttonFstate = true;
  } else if(buttonFstate==true && melodyScale.length>=minArrayLength){
    ellipse(130,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("F5");
    // let j = harmonyScale.indexOf("C4");
    let k = arpScale.indexOf("F4");
  	// let l = chordScale.indexOf("F3");
  	// let m = chordScale.indexOf("F4");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonFstate = false;
  }
}

function addGtoArray(){
	if(buttonGstate==false){
    ellipse(180,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("G5");
    // harmonyScale.push("D4");
    arpScale.push("G4");
    // chordScale.push("G3");
    // chordScale.push("G4");
    buttonGstate = true;
  } else if(buttonGstate==true && melodyScale.length>=minArrayLength){
    ellipse(180,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("G5");
    // let j = harmonyScale.indexOf("D4");
    let k = arpScale.indexOf("G4");
  	// let l = chordScale.indexOf("G3");
  	// let m = chordScale.indexOf("G4");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonGstate = false;
  }
}

function addAtoArray(){
	if(buttonAstate==false){
    ellipse(230,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("A5");
    // harmonyScale.push("E4");
    arpScale.push("A4");
    // chordScale.push("A3");
    // chordScale.push("A4");
    buttonAstate = true;
  } else if(buttonAstate==true && melodyScale.length>=minArrayLength){
    ellipse(230,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("A5");
    // let j = harmonyScale.indexOf("E4");
    let k = arpScale.indexOf("A4");
    // let l = chordScale.indexOf("A3");
    // let m = chordScale.indexOf("A4");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonAstate = false;
  }
}

function addCCtoArray(){
	if(buttonCCstate==false){
    ellipse(280,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("C6");
    // harmonyScale.push("G5");
    arpScale.push("C5");
    // chordScale.push("C4");
    // chordScale.push("C5");
    buttonCCstate = true;
  } else if(buttonCCstate==true && melodyScale.length>=minArrayLength){
    ellipse(280,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("C6");
    // let j = harmonyScale.indexOf("G5");
    let k = arpScale.indexOf("C5");
    // let l = chordScale.indexOf("C4");
    // let m = chordScale.indexOf("C5");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonCCstate = false;
  }
}

function addDDtoArray(){
	if(buttonDDstate==false){
    ellipse(330,350,20,20);
    noStroke();
    fill(0,255,0);
    melodyScale.push("D6");
    // harmonyScale.push("A5");
    arpScale.push("D5");
    // chordScale.push("D4");
    // chordScale.push("D5");
    buttonDDstate = true;
  } else if(buttonDDstate==true && melodyScale.length>=minArrayLength){
    ellipse(330,350,20,20);
    noStroke();
    fill(150);
    let i = melodyScale.indexOf("D6");
    // let j = harmonyScale.indexOf("A5");
    let k = arpScale.indexOf("D5");
    // let l = chordScale.indexOf("D4");
    // let m = chordScale.indexOf("D5");
    melodyScale.splice(i,1);
    // harmonyScale.splice(j,1);
    arpScale.splice(k,1);
    // chordScale.splice(l,1);
    // chordScale.splice(m,1);
    buttonDDstate = false;
  }
}
