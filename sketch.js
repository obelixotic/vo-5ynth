//20 nov 18 - READY stage 1 prototype
//with nice sound scape and four buttons and four volume sliders and a master button and a master bpm slider
//picking up the latest file using node server
//re-record functionality
//stop getPitch
//use setTimeout to automate the process
//running sketch locally by downloading libraries

//to be done:
//arduino serail integration
//account for the timbre of a woman voice
//bpm for different tracks

// ideas:
//flexible resistance sensor
//visual feedback when pressing buttons
//show note sung
// promises

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
// var harmonyScale = [];
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
var minArrayLength = 3;
var playButton;
var soundFile;
var buttonCstate = true;
var buttonDstate = false;
// var buttonEstate = false;
var buttonFstate = false;
var buttonGstate = false;
var buttonAstate = false;
var buttonCCstate = false;
var buttonDDstate = false;
var b1, b2, b3, b4, p1, p2, p3;

melodyScale = ["C5"];
// harmonyScale = ["G4"];
arpScale = ["C3", "D3", "F3", "G3", "A3", "C4"];
chordScale = ["G4", "A4", "C5", "D5", "F4"];
testScale = ["C3", "D3", "F3", "G3", "A3", "C4"];

synth = new Tone.PolySynth({
  "envelope": {
    "attack": 1,
    "decay": 0,
    "sustain": 0.3,
    "release": 0.01,
    }
}).toMaster();

synth.set({"oscillator": {
          "type": "sine"
					}
});

synth2 = new Tone.PolySynth({
  "envelope": {
    "attack": 1,
    "decay": 0,
    "sustain": 0.3,
    "release": 0.01,
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
  var timey1 = ["1t", "4t", "8t", "2t", "8t"][floor(random(5))];
  melody.interval = timey1;
  var fifth = Tone.Frequency(note).transpose(-5);
  sampler.triggerAttackRelease(note, "2t", time, 1);
  synth.triggerAttackRelease(note, "4t", time, 0.5);
  sampler2.triggerAttackRelease(fifth, "2t", time, 1);
  synth2.triggerAttackRelease(fifth, "4t", time, 0.5);
}, melodyScale, "randomOnce");
melody.loop = true;

var arpeggio = new Tone.Pattern(function(time, note){
  note2 = note;
  sampler3.triggerAttackRelease(note2, "16t", time, 1);
  synth3.triggerAttackRelease(note2, "16t", time, 0.5);
}, testScale, "randomOnce");

arpeggio.loop = true;
arpeggio.interval = "4t";

var chord = new Tone.Pattern(function(time, note){
  note3 = note;
  var bass = Tone.Frequency(note).transpose(-12);
  var fifth = Tone.Frequency(note).transpose(-5);
  note3_5 = fifth.toNote();
  sampler4.triggerAttackRelease(bass, "2m", time, 1);
  sampler4.triggerAttackRelease(fifth, "2m", time, 0.5);
  synth4.triggerAttackRelease(bass, "4t", time, 1);
  synth4.triggerAttackRelease(fifth, "4t", time, 0.5);
}, chordScale, "randomOnce");

chord.loop = true;
chord.interval = "2n";

function preload() {
  files = loadJSON("/getfiles");
}

function setup(){
  createCanvas(400,400);
  // console.log(files);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();

  // serial = new p5.SerialPort();
  // serial.on('data', gotData);
  // serial.open("/dev/cu.usbmodem14201");

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
  playButton.position(330, 80+150);
  playButton.mousePressed(togglePlay);

  melodyButton = createButton("Melody");
  melodyButton.position(40, 80+150);
  melodyButton.mousePressed(toggleMelody);

  harmonyButton = createButton("Harmony");
  harmonyButton.position(40, 180+150);
  harmonyButton.mousePressed(toggleHarmony);

  arpeggioButton = createButton("Arpeggio");
  arpeggioButton.position(40, 280+150);
  arpeggioButton.mousePressed(toggleArpeggio);

  // octaveButton = createButton("Octave");
  // octaveButton.position(40, 280+150);
  // octaveButton.mousePressed(toggleOctave);

  chordButton = createButton("Chord");
  chordButton.position(40, 380+150);
  chordButton.mousePressed(toggleChord);

  buttonC = createButton("C");
  buttonC.position(40, 20+150);
  buttonC.mousePressed(addCtoArray);

  buttonD = createButton("D");
  buttonD.position(90, 20+150);
  buttonD.mousePressed(addDtoArray);

  // buttonE = createButton("E");
  // buttonE.position(140, 20+150);
  // buttonE.mousePressed(addEtoArray);

  buttonF = createButton("F");
  buttonF.position(190-50, 20+150);
  buttonF.mousePressed(addFtoArray);

  buttonG = createButton("G");
  buttonG.position(240-50, 20+150);
  buttonG.mousePressed(addGtoArray);

  buttonA = createButton("A");
  buttonA.position(290-50, 20+150);
  buttonA.mousePressed(addAtoArray);

  buttonB = createButton("CC");
  buttonB.position(340-50, 20+150);
  buttonB.mousePressed(addCCtoArray);

  buttonB = createButton("DD");
  buttonB.position(340, 20+150);
  buttonB.mousePressed(addDDtoArray);

  bpmSlider = createSlider(30, 200, 50, 4);
  melodySlider = createSlider(-24, 2, 0, 1);
  harmonySlider = createSlider(-24, 2, 0, 1);
  arpeggioSlider = createSlider(-24, 2, 0, 1);
  chordSlider = createSlider(-24, 2, 0, 1);
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  var sensors = split(currentString, ','); // split the string on the commas
      if (sensors.length > 6) { // if there are three elements
        b1 = sensors[0];
        b2 = sensors[1];
        b3 = sensors[2];
        b4 = sensors[3];
        p1 = map(sensors[4], 0, 1023, 2, -24);
        p2 = map(sensors[5], 0, 1023, 2, -24);
        p3 = map(sensors[6], 0, 1023, 2, -24);
      }
  // latestData = int(currentString);            // save it for the draw method
  // console.log(b1, b2, p1);             // println the string
}

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
    sampler3.attack = 0.5;
    sampler3.release = 0.01;

    sampler4 = new Tone.Sampler({
      [theNote]: "./"+filenames[filenames.length-1]
    });
    sampler4.attack = 0.5;
    sampler4.release = 0.01;

    sampler.volume.value = -8;
    sampler2.volume.value = -8
    sampler3.volume.value = -8;
    sampler4.volume.value = -8;
    synth.volume.value = -24;
    synth2.volume.value = -24;
    synth3.volume.value = -24;
    synth4.volume.value = -24;

    var chorus = new Tone.Chorus(4, 2.5, 0.1).toMaster();
    var freeverb = new Tone.Freeverb();
    freeverb.dampening.value = 1000;
    // var phaser = new Tone.Phaser({
    // 	"frequency" : 15,
    // 	"octaves" : 5,
    // 	"baseFrequency" : 1000
    // });

    var pingPong = new Tone.PingPongDelay("2n", 0.2);
    // sampler.toMaster();
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
  Tone.Transport.bpm.value = bpmSlider.value();
  // if(state>3){
    sampler.volume.value = melodySlider.value();
    synth.volume.value = map(sampler.volume.value, -24, 2, -48, 0);

    sampler2.volume.value = harmonySlider.value();
    synth2.volume.value = map(sampler2.volume.value, -24, 2, -48, 1);

    sampler3.volume.value = arpeggioSlider.value();
    synth3.volume.value = map(sampler3.volume.value, -24, 2, -48, 0);

    sampler4.volume.value = chordSlider.value();
    synth4.volume.value = map(sampler4.volume.value, -24, 2, -48, 0);
  }
  text(note1,120,100);
  text(note1_5,120,200);
  text(note2,120,300);
  // text(note2_12,220,300);
  text(note3,120,400);
  text(note3_5,220,400);

  for(var s=0;s<melodyScale.length;s++){
    push();
    textSize(10);
    text(melodyScale[s],s*50/3+40, 250);
    pop();
  }

  // if(latestData==1){
  //   melody.stop();
  //   arpeggio.stop();
  //   chord.stop();
  // } else if(latestData==0){
  //   console.log("triggered");
  //   melody.start("2n");
  //   arpeggio.start("2n");
  //   chord.start("4n");
  // }

  // console.log(bpmValue.value());
  // synth.envelope.attack = map(mouseX, 0, height, 0,1);
  // synth.set.filter.Q = map(mouseY, 0, width, 0, 10);
}

function togglePlay(){
	if(Tone.Transport.state == "started"){
  	Tone.Transport.stop();
    // melody.stop();
    // arpeggio.stop();
    // chord.stop();
    playButton.html('Play');
  } else {
  	Tone.Transport.start();
    // melody.start();
    // arpeggio.start();
    // chord.start();
    playButton.html('Stop');
  }
}

function toggleMelody(){
	if(melody.state == "started"){
  	melody.stop();
    melodyButton.html("Melody");
  } else {
  	melody.start("2n");
    melodyButton.html("Stop");
  }
}

function toggleHarmony(){
	if(harmony.state == "started"){
    harmony.stop();
    harmonyButton.html("Harmony");
  } else {
    harmony.start("2n");
    harmonyButton.html("Stop");
  }
}

function toggleArpeggio(){
	if(arpeggio.state == "started"){
  	arpeggio.stop();
    arpeggioButton.html("Arpeggio");
  } else {
  	arpeggio.start("2n");
    arpeggioButton.html("Stop");
  }
}

// function toggleOctave(){
// 	if(octave.state == "started"){
//   	octave.stop();
//     octaveButton.html("Octave");
//   } else {
//   	octave.start("2n");
//     octaveButton.html("Stop");
//   }
// }

function toggleChord(){
	if(chord.state == "started"){
  	chord.stop();
    chordButton.html("Chord");
  } else {
  	chord.start("4n");
    chordButton.html("Stop");
  }
}

function addCtoArray(){
  if(buttonCstate==false){
    melodyScale.push("C5");
    // harmonyScale.push("G4");
    arpScale.push("C4");
    // chordScale.push("C3");
    // chordScale.push("C4");
  	buttonCstate = true;
  } else if(buttonCstate==true && melodyScale.length>1){
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
    melodyScale.push("D5");
    // harmonyScale.push("A4");
    arpScale.push("D4");
    // chordScale.push("D3");
    // chordScale.push("D4");
    buttonDstate = true;
  } else if(buttonDstate==true && melodyScale.length>1){
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
    melodyScale.push("F5");
    // harmonyScale.push("C4");
    arpScale.push("F4");
    // chordScale.push("F3");
    // chordScale.push("F4");
    buttonFstate = true;
  } else if(buttonFstate==true && melodyScale.length>1){
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
    melodyScale.push("G5");
    // harmonyScale.push("D4");
    arpScale.push("G4");
    // chordScale.push("G3");
    // chordScale.push("G4");
    buttonGstate = true;
  } else if(buttonGstate==true && melodyScale.length>1){
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
    melodyScale.push("A5");
    // harmonyScale.push("E4");
    arpScale.push("A4");
    // chordScale.push("A3");
    // chordScale.push("A4");
    buttonAstate = true;
  } else if(buttonAstate==true && melodyScale.length>1){
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
    melodyScale.push("C6");
    // harmonyScale.push("G5");
    arpScale.push("C5");
    // chordScale.push("C4");
    // chordScale.push("C5");
    buttonCCstate = true;
  } else if(buttonCCstate==true && melodyScale.length>1){
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
    melodyScale.push("D6");
    // harmonyScale.push("A5");
    arpScale.push("D5");
    // chordScale.push("D4");
    // chordScale.push("D5");
    buttonDDstate = true;
  } else if(buttonDDstate==true && melodyScale.length>1){
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
