//16 nov 18 20:05
//with nice sound scape and four buttons and four volume sliders and a master button and a master bpm slider
//to be done - arduino serail integration

// promises

// //shiffman
// const RECORDING = 0;
// const STOP_RECORDING = 1;
// const IDENTIFY_NOTE = 2;
// const INIT_SAMPLER = 3;

//file naming using array of predefined names or millis()/date and time stamp
//picking up the latest file using node server
//flexible resistance sensor
//visual feedback when pressing buttons
//done - stop getPitch
//done - use setTimeout to automate the process
//show note sung
//running sketch locally by downloading libraries
//arduin serial integration with state change code

var files = [];
var filename = "";
// var serial;
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
var harmonyScale = [];
var synthScale = [];
var synth;
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
// var buttonCstate = true;
// var buttonDstate = false;
// var buttonEstate = false;
// var buttonFstate = false;
// var buttonGstate = false;
// var buttonAstate = false;
// var buttonBstate = false;
var minArrayLength = 3;
var playButton;
var soundFile;

synth = new Tone.PolySynth({
  // "volume": -10,
  "envelope": {
    "attack": 1,
    "decay": 0,
    "sustain": 0.3,
    "release": 0,
    }
}).toMaster();

synth.set({"oscillator": {
          "type": "sine"
					}
});

Tone.Transport.bpm.value = 65;

melodyScale = ["G4"];
harmonyScale = ["D5"];
synthScale = ["C4", "D4", "E4", "G4", "A4"];

var melody = new Tone.Pattern(function(time, note){
  note1 = note;
  sampler.triggerAttackRelease(note, "2t", time, 1);
}, melodyScale, "random");

melody.loop = true;
melody.interval = "4t";

var harmony = new Tone.Pattern(function(time, note){
  note1_5 = note;
  sampler2.triggerAttackRelease(note, "2t", time, 1);
}, harmonyScale, "random");

harmony.loop = true;
harmony.interval = "4t";

var octave = new Tone.Pattern(function(time, note){
  var foctave = Tone.Frequency(note).transpose(-12);
  var doctave = Tone.Frequency(note).transpose(-24);
  note2 = note;
  sampler3.triggerAttackRelease(note2, "2n", time, 1);//0.2
  // note2 = foctave.toNote();
  // note2_12 = doctave.toNote();
  // sampler3.triggerAttackRelease(foctave, "2n", time, 1);
  // sampler2.triggerAttackRelease(doctave, "2n", time, 1);
}, synthScale, "randomOnce");

octave.loop = true;
octave.interval = "8t";

var chord = new Tone.Pattern(function(time, note){
  note3 = note;
  var bass = Tone.Frequency(note).transpose(-12);
  var fifth = Tone.Frequency(note).transpose(-5);
  note3_5 = fifth.toNote();
  var chordDuration = "2n";
  sampler4.triggerAttackRelease(bass, chordDuration, time, 1);//0.2sampler3.triggerAttackRelease(bass, chordDuration, time, 1);//0.2
  // sampler4.triggerAttackRelease(fifth, chordDuration, time, 0.7);//0.2
}, synthScale, "randomOnce");

chord.loop = true;
chord.interval = "1m";

function preload() {
  files = loadJSON("/getfiles");
}

function setup(){
  createCanvas(400,400);
  console.log(files);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();

  // serial = new p5.SerialPort();
  // serial.open("/dev/cu.usbmodem14201");
  // serial.on('data', gotData);

  mic.start(startPitch);
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  createP('keyPress to record', 20, 20);
  // Tone.Transport.start();
  // melody.start(0);
  // harmony.start(0);
  // octave.start(0);
  // chord.start(0);

  textSize(30);

  playButton = createButton('Master');
  playButton.position(330, 80+150);
  playButton.mousePressed(togglePlay);

  melodyButton = createButton("Melody");
  melodyButton.position(40, 80+150);
  melodyButton.mousePressed(toggleMelody);

  harmonyButton = createButton("Harmony");
  harmonyButton.position(40, 180+150);
  harmonyButton.mousePressed(toggleHarmony);

  octaveButton = createButton("Octave");
  octaveButton.position(40, 280+150);
  octaveButton.mousePressed(toggleOctave);

  // octaveButton = createButton("Octave");
  // octaveButton.position(40, 280+150);
  // octaveButton.mousePressed(toggleOctave);

  chordButton = createButton("Chord");
  chordButton.position(40, 380+150);
  chordButton.mousePressed(toggleChord);

  buttonC = createButton("C");
  buttonC.position(40, 20+150);
  buttonC.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("C4");
    harmonyScale.splice(0,1);
    harmonyScale.push("G4");
  });

  buttonD = createButton("D");
  buttonD.position(90, 20+150);
  buttonD.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("D4");
    harmonyScale.splice(0,1);
    harmonyScale.push("A4");
  });

  buttonE = createButton("E");
  buttonE.position(140, 20+150);
  buttonE.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("E4");
    harmonyScale.splice(0,1);
    harmonyScale.push("B4");
  });

  buttonF = createButton("G");
  buttonF.position(190, 20+150);
  buttonF.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("G4");
    harmonyScale.splice(0,1);
    harmonyScale.push("D5");

  });

  buttonG = createButton("A");
  buttonG.position(240, 20+150);
  buttonG.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("A4");
    harmonyScale.splice(0,1);
    harmonyScale.push("E5");
  });

  buttonA = createButton("C");
  buttonA.position(290, 20+150);
  buttonA.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("C5");
    harmonyScale.splice(0,1);
    harmonyScale.push("G5");
  });

  buttonB = createButton("D");
  buttonB.position(340, 20+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("D5");
    harmonyScale.splice(0,1);
    harmonyScale.push("A5");
  });

  buttonB = createButton("E");
  buttonB.position(140, 50+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("E5");
    harmonyScale.splice(0,1);
    harmonyScale.push("B5");
  });

  buttonB = createButton("G");
  buttonB.position(190, 50+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("G5");
    harmonyScale.splice(0,1);
    harmonyScale.push("D5");
  });

  buttonB = createButton("A");
  buttonB.position(240, 50+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("A5");
    harmonyScale.splice(0,1);
    harmonyScale.push("E5");
  });

  buttonB = createButton("C");
  buttonB.position(290, 50+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("C6");
    harmonyScale.splice(0,1);
    harmonyScale.push("G6");
  });

  buttonB = createButton("D");
  buttonB.position(340, 50+150);
  buttonB.mousePressed(function(){
    melodyScale.splice(0,1);
    melodyScale.push("D6");
    harmonyScale.splice(0,1);
    harmonyScale.push("A6");
  });

  bpmSlider = createSlider(30, 200, 50, 4);
  melodySlider = createSlider(-24, 2, -8, 1);
  harmonySlider = createSlider(-24, 2, -8, 1);
  octaveSlider = createSlider(-24, 2, -8, 1);
  chordSlider = createSlider(-24, 0, -8, 1);
}

// function gotData() {
//   var currentString = serial.readLine();  // read the incoming string
//   trim(currentString);                    // remove any trailing whitespace
//   if (!currentString) return;             // if the string is empty, do no more
//   latestData = int(currentString);            // save it for the draw method
//   console.log(latestData);             // println the string
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
    if(state<1){
      setTimeout(getPitch, 50);
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
  if (state===0 && mic.enabled) {
    // record to our p5.SoundFile
    // setTimeout(function(){
    recorder.record(soundFile);
    logValues(f);
    // createP('Recording!', 20, 20);
    console.log("RECORDING AND LISTENING");
    state++;
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
    mic.stop();
    // createP('Stopped', 20, 20);
    console.log("STOPPED RECORDING AND LISTENING")
    state++;
  }
  setTimeout(findNote,1000);
}

function findNote(){
  if (state === 2) {
    var temp = Tone.Frequency.ftom(values[0]);
    // console.log(JSON.stringify(temp,null,null));
    theNote = Tone.Frequency(temp, "midi").toNote();
    // console.log(theNote);
    soundFile.play(); // play the result!
    filename = Date.now()+'.wav';
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
      // "D#3": "./fire.wav"
      [theNote]: "./"+filename
    });
    sampler.attack = 2;
    sampler.release = 5;

    sampler2 = new Tone.Sampler({
      // "D#3": "./fire.wav"
      [theNote]: "./"+filename
    });
    sampler2.attack = 2;
    sampler2.release = 5;

    sampler3 = new Tone.Sampler({
      // "D#3": "./fire.wav"
      [theNote]: "./"+filename
    });
    sampler3.attack = 1;
    sampler3.release = 1;

    sampler4 = new Tone.Sampler({
      // "D#3": "./fire.wav"
      [theNote]: "./"+filename
    });
    sampler4.attack = 2;
    sampler4.release = 2;

    sampler.volume.value = -8;
    sampler2.volume.value = -8
    sampler3.volume.value = -8;
    sampler4.volume.value = -8;
    synth.volume.value = -8;

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
  }
}

function draw(){
  background(150);
  Tone.Transport.bpm.value = bpmSlider.value();
  // if(state>3){
    sampler.volume.value = melodySlider.value();
    sampler2.volume.value = harmonySlider.value();
    sampler3.volume.value = octaveSlider.value();
    synth.volume.value = octaveSlider.value();
    sampler4.volume.value = chordSlider.value();
  }
  text(note1,120,100);
  text(note1_5,120,200);
  text(note2,120,300);
  // text(note2_12,220,300);
  text(note3,120,400);
  text(note3_5,220,400);

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
    playButton.html('Master');
  } else {
  	Tone.Transport.start();
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

function toggleOctave(){
	if(octave.state == "started"){
  	octave.stop();
    octaveButton.html("Octave");
  } else {
  	octave.start("2n");
    octaveButton.html("Stop");
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
