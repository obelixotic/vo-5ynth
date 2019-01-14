//19 dec 18
//change variable theScale to change notes

var files = [];
var filename = "";
var filenames = [];
var notes = [];
var serial;
let audioContext;
let mic;
let pitch;
let values = [];
let f=0;
var theNote = "";
var recorder, soundFile;
var state = 0;
var synthScale = [];
var melodyScale = [];
var bassScale = [];
var synth1;
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
var buttonFFstate = false;
var b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11;
var p1, p2, p3, p4;
var beatOn = false;
var recordingInProcess = false;
var complexityValue;
var thescale = ["D", "E", "F", "D", "E"];
bassScale = [];

synth1 = new Tone.PolySynth({
  "envelope": {
    "attack": 3,
    "decay": 0,
    "sustain": 0,
    "release": 0.001,
    }
}).toMaster();

synth1.set({"oscillator": {
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

var synth = new Tone.Pattern(function(time, note){
  note1 = note;
  // var timey1 = ["2t", "4t", "8t", "8t", "8t", "16t"][floor(random(6))];
  var timey1 = ["4t", "8t", "8t", "16t", "16t", "32t"][floor(random(complexityValue))];
  synth.interval = timey1;
  var fifth = Tone.Frequency(note).transpose(-5);
  sampler.triggerAttackRelease(note, "8t", time, 1);
  synth1.triggerAttackRelease(note, "4t", time, 0.5);
  sampler2.triggerAttackRelease(fifth, "8t", time, 1);
  synth2.triggerAttackRelease(fifth, "4t", time, 0.5);
}, synthScale, "randomOnce");
synth.loop = true;

var melody = new Tone.Pattern(function(time, note){
  note2 = note;
  var timey1 = ["4t", "8t", "8t", "16t", "16t", "32t"][floor(random(complexityValue))];
  melody.interval = timey1;
  sampler3.triggerAttackRelease(note2, "32t", time, 1);
  synth3.triggerAttackRelease(note2, "16t", time, 0.5);
}, melodyScale, "randomOnce");
melody.loop = true;

var bass = new Tone.Pattern(function(time, note){
  note3 = note;
  var bass = Tone.Frequency(note).transpose(-12);
  var fifth = Tone.Frequency(note).transpose(-5);
  note3_5 = fifth.toNote();
  sampler4.triggerAttackRelease(bass, "2m", time, 1);
  sampler4.triggerAttackRelease(fifth, "2m", time, 0.5);
  synth4.triggerAttackRelease(bass, "4n", time, 1);
  synth4.triggerAttackRelease(fifth, "4n", time, 0.5);
}, bassScale, "randomOnce");

bass.loop = true;
bass.interval = "2n";

var kit = new Tone.Players({
  "kick": "./kick.mp3",
  "snare":"./snare.mp3"
});

kit.toMaster();
let audioLoop = new Tone.Event(playBeat, ["kick", "snare"]);
audioLoop.loop = true;
audioLoop.loopEnd = "4n";
audioLoop.start("4n");

function preload() {
  files = loadJSON("/getfiles");
}

function setup(){
  createCanvas(400,400);
  audioContext = getAudioContext();
  for(var i=0; i<thescale.length; i++){
    bassScale.push(thescale[i]+"4");
  }
  mic = new p5.AudioIn();

  console.log(bassScale);

  // serial = new p5.SerialPort();
  // serial.on('data', gotData);
  // serial.open("/dev/cu.usbmodem14201");

  mic.start(startPitch);
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  createP('keyPress to record', 20, 20);

  textSize(30);

  playButton = createButton('Record');
  playButton.position(330-80, 80+120);
  playButton.mousePressed(mainProcess);

  playButton = createButton('Play');
  playButton.position(330, 80+120);
  playButton.mousePressed(togglePlay);

  synthButton = createButton("synthOff");
  synthButton.position(40, 80+120);
  // synthButton.mousePressed(togglesynth);

  drumsButton = createButton("DrumsOff");
  drumsButton.position(330, 80+250);
  drumsButton.mousePressed(toggleDrums);

  melodyButton = createButton("melodyOff");
  melodyButton.position(40, 180+120);
  // melodyButton.mousePressed(togglemelody);

  bassButton = createButton("BassOff");
  bassButton.position(40, 280+120);
  // bassButton.mousePressed(togglebass);
  var s = 0;
  buttonC = createButton(thescale[s]);
  buttonC.position(40-40, 500);
  buttonC.mousePressed(addCtoArray);

  s++;
  buttonD = createButton(thescale[s]);
  buttonD.position(90-50, 500);
  buttonD.mousePressed(addDtoArray);

  s++;
  buttonF = createButton(thescale[s]);
  buttonF.position(190-100, 500);
  buttonF.mousePressed(addFtoArray);

  s++;
  buttonG = createButton(thescale[s]);
  buttonG.position(240-100, 500);
  buttonG.mousePressed(addGtoArray);

  s++;
  buttonA = createButton(thescale[s]);
  buttonA.position(290-100, 500);
  buttonA.mousePressed(addAtoArray);

  s=0;
  buttonCC = createButton(thescale[s]);
  buttonCC.position(340-100, 500);
  buttonCC.mousePressed(addCCtoArray);

  s++;
  buttonDD = createButton(thescale[s]);
  buttonDD.position(340-50, 500);
  buttonDD.mousePressed(addDDtoArray);

  s++;
  buttonFF = createButton(thescale[s]);
  buttonFF.position(340, 500);
  buttonFF.mousePressed(addFFtoArray);

  // bpmSlider = createSlider(50, 82, 66, 4);
  complexitySlider = createSlider(1, 6, 2, 1);
  bassSlider = createSlider(-24, 4, -2, 1);
  melodySlider = createSlider(-24, 6, -12, 1);
  synthSlider = createSlider(-24, 0, -20, 1);
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  var sensors = split(currentString, ','); // split the string on the commas
    if (sensors.length > 14) { // if there are more than one elements
      b1 = sensors[0]; //C
      b2 = sensors[1]; //D
      b3 = sensors[2]; //F
      b4 = sensors[3]; //G
      b5 = sensors[4]; //A
      b6 = sensors[5]; //CC
      b7 = sensors[6]; //DD
      b8 = sensors[7]; //FF
      b9 = sensors[8]; //DRUMS
      b10 = sensors[9]; //REC
      b11 = sensors[10]; //PLAY/STOP
      p1 = map(sensors[14], 0, 1023, 0, -24); //synth
      p2 = map(sensors[13], 0, 1023, 2, -24); //melody
      p3 = map(sensors[12], 0, 1023, 2, -24); //bass
      p4 = map(sensors[11], 0, 1023, 6, 1); //complexity
    }
  // console.log(b9, b11);
  // console.log(p4, p3, p2, p1);

  if(b1==0 && buttonCstate==false){
    synthScale.push("C5");
    melodyScale.push("C4");
    buttonCstate = true;
  } else if (b1==1 && buttonCstate==true){
    let i = synthScale.indexOf("C5");
    let k = melodyScale.indexOf("C4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonCstate = false;
  }

  if(b2==0 && buttonDstate==false){
    synthScale.push("D5");
    melodyScale.push("D4");
    buttonDstate = true;
  } else if (b2==1 && buttonDstate==true){
    let i = synthScale.indexOf("D5");
    let k = melodyScale.indexOf("D4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonDstate = false;
  }

  if(b3==0 && buttonFstate==false){
    synthScale.push("F5");
    melodyScale.push("F4");
    buttonFstate = true;
  } else if (b3==1 && buttonFstate==true){
    let i = synthScale.indexOf("F5");
    let k = melodyScale.indexOf("F4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonFstate = false;
  }

  if(b4==0 && buttonGstate==false){
    synthScale.push("G5");
    melodyScale.push("G4");
    buttonGstate = true;
  } else if (b4==1 && buttonGstate==true){
    let i = synthScale.indexOf("G5");
    let k = melodyScale.indexOf("G4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonGstate = false;
  }

  if(b5==0 && buttonAstate==false){
    synthScale.push("A5");
    melodyScale.push("A4");
    buttonAstate = true;
  } else if (b5==1 && buttonAstate==true){
    let i = synthScale.indexOf("A5");
    let k = melodyScale.indexOf("A4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonAstate = false;
  }

  if(b6==0 && buttonCCstate==false){
    synthScale.push("C6");
    melodyScale.push("C5");
    buttonCCstate = true;
  } else if (b6==1 && buttonCCstate==true){
    let i = synthScale.indexOf("C6");
    let k = melodyScale.indexOf("C5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonCCstate = false;
  }

  if(b7==0 && buttonDDstate==false){
    synthScale.push("D6");
    melodyScale.push("D5");
    buttonDDstate = true;
  } else if (b7==1 && buttonDDstate==true){
    let i = synthScale.indexOf("D6");
    let k = melodyScale.indexOf("D5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonDDstate = false;
  }

  if(b8==0 && buttonFFstate==false){
    synthScale.push("F6");
    melodyScale.push("F5");
    buttonFFstate = true;
  } else if (b8==1 && buttonFFstate==true){
    let i = synthScale.indexOf("F6");
    let k = melodyScale.indexOf("F5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonFFstate = false;
  }

//drums
  if(b9==0) {
    beatOn = true;
    // drumsButton.html("DrumsOn");
  } else if(b8==1){
    beatOn = false;
    // drumsButton.html("DrumsOff");
  }

//recording
  if(b10==0){
    if (state%4==0 && mic.enabled) {
      if(Tone.Transport.state == "started"){
        togglePlay();
      }
      recorder.record(soundFile);
      logValues(f);
      console.log("RECORDING AND LISTENING");
      state=1;
      stateManager();
    }
  }

//play/stop
  if(b11==1) {
    	Tone.Transport.stop();
      synth.stop();
      melody.stop();
      bass.stop();
      // toggleDrums();
      playButton.html('Play');
      synthButton.html("SynthOff");
      melodyButton.html("synthOff");
      bassButton.html("BassOff");
    } else if(b11==0){
    	Tone.Transport.start();
      synth.start("2n");
      melody.start("2n");
      bass.start("4n");
      // toggleDrums();
      playButton.html('Stop');
      synthButton.html("SynthOn");
      melodyButton.html("synthOn");
      bassButton.html("BassOn");
    }
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
    }
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

function mainProcess() {
  if (state%4==0 && mic.enabled) {
    if(Tone.Transport.state == "started"){
      togglePlay();
    }
    recorder.record(soundFile);
    logValues(f);
    console.log("RECORDING AND LISTENING");
    state=1;
    stateManager();
  }
}

function stateManager(){
  setTimeout(stopRecording, 1000);
}

function stopRecording(){
  if (state === 1) {
    recorder.stop();
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
    soundFile.play();
    filename = Date.now()+'.wav';
    filenames.push(filename);
    save(soundFile, filename);
    console.log("RECORDING SAVED");
    state++;
  }
  setTimeout(feedNote,1000);
}

function feedNote(){
  if (state === 3) {
    console.log(`the note is ${theNote}`);
    console.log("SAMPLER INITIALISED");
    if(buttonCstate==true && buttonGstate==false){
      console.log("angel mode on");
      synth1.set({"oscillator": {
                "type": "sine"
                }
      });
      synth2.set({"oscillator": {
                "type": "sine"
                }
      });
      synth3.set({"oscillator": {
                "type": "sine"
                }
      });
      synth4.set({"oscillator": {
                "type": "sine"
                }
      });
      sampler = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler.attack = 0.5;
      sampler.release = 0.01;

      sampler2 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler2.attack = 0.5;
      sampler2.release = 0.01;

      sampler3 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler3.attack = 0.2;
      sampler3.release = 0.01;

      sampler4 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler4.attack = 0.5;
      sampler4.release = 0.01;
    } else if(buttonCstate==false && buttonGstate==true){
          console.log("stranger things mode on");
          synth1.set({"oscillator": {
                    "type": "triangle"
                    }
          });
          synth2.set({"oscillator": {
                    "type": "sawtooth"
                    }
          });
          synth3.set({"oscillator": {
                    "type": "sawtooth"
                    }
          });
          synth4.set({"oscillator": {
                    "type": "square"
                    }
          });

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
    } else if(buttonCstate==true && buttonGstate==true){
      console.log("god mode on");
      sampler = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler.attack = 0.5;
      sampler.release = 0.01;

      sampler2 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler2.attack = 0.5;
      sampler2.release = 0.01;

      sampler3 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler3.attack = 0.2;
      sampler3.release = 0.01;

      sampler4 = new Tone.Sampler({
        "D3": "./tusharD3.mp3"
      });
      sampler4.attack = 0.5;
      sampler4.release = 0.01;
      synth1.set({"oscillator": {
                "type": "triangle"
                }
      });
      synth2.set({"oscillator": {
                "type": "sawtooth"
                }
      });
      synth3.set({"oscillator": {
                "type": "sawtooth"
                }
      });
      synth4.set({"oscillator": {
                "type": "square"
                }
      });
    } else if(buttonCstate==false && buttonGstate==false){
      synth1.set({"oscillator": {
                "type": "sine"
                }
      });
      synth2.set({"oscillator": {
                "type": "sine"
                }
      });
      synth3.set({"oscillator": {
                "type": "sine"
                }
      });
      synth4.set({"oscillator": {
                "type": "sine"
                }
      });
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
    }

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

  if(state>3){
    // sampler.volume.value = p1;
    sampler.volume.value = synthSlider.value();
    synth1.volume.value = map(sampler.volume.value, -24, 0, -48, 0);

    sampler2.volume.value = map(sampler.volume.value, -24, 0, -36, 0);
    synth2.volume.value = map(sampler2.volume.value, -36, 0, -30, 0);

    // sampler3.volume.value = p2;
    sampler3.volume.value = melodySlider.value();
    synth3.volume.value = map(sampler3.volume.value, -24, 6, -24, 2);

    // sampler4.volume.value = p3;
    sampler4.volume.value = bassSlider.value();
    synth4.volume.value = map(sampler4.volume.value, -24, 4, -48, 1);

    // complexityValue = p4;
    complexityValue = complexitySlider.value();
  }

//stopping layer if volume == min
  if(synthScale.length<1 || p1 <= -23 || synthSlider.value() <= -23){
    synth.stop();
    synthButton.html("SynthOff");
  } else if(synthScale.length>0 && Tone.Transport.state == "started" && (p1 > -23 || synthSlider.value() > -23)) {
    synth.start("2n");
    synthButton.html("SynthOn");
  }

  if(synthScale.length<1 || p2 <= -23 || melodySlider.value() <= -23){
    melody.stop();
    melodyButton.html("MelodyOff");
  } else if(synthScale.length>0 && Tone.Transport.state == "started" && (p2 > -23 || melodySlider.value() > -23)){
      melody.start("2n");
      melodyButton.html("MelodyOn");
    }

  if(p3 <= -23 || bassSlider.value() <= -23 || Tone.Transport.state != "started"){
    bass.stop();
    bassButton.html("BassOff");
  } else if((p3 > -23 || bassSlider.value() > -23) && Tone.Transport.state == "started"){
    bass.start("4n");
    bassButton.html("BassOn");
  }

  if(Tone.Transport.state == "started" && beatOn){
    drumsButton.html("DrumsOn");
  } else if (Tone.Transport.state != "started" || !beatOn){
    drumsButton.html("DrumsOff");
  }

//green circles
// use if(buttonCstate==true && note1=="C5"){ } for having the green circles move as notes are played
  if(buttonCstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-350,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-350,330,20,20);
    pop();
  }

  if(buttonDstate==true){
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

  if(buttonFstate==true){
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

  if(buttonGstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-205,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-205,330,20,20);
    pop();
  }

  if(buttonAstate==true){
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

  if(buttonCCstate==true){
    push();
    fill(0,255,0);
    stroke(0);
    ellipse(355-100,330,20,20);
    pop();
  } else{
    push();
    fill(150);
    stroke(0);
    ellipse(355-100,330,20,20);
    pop();
  }

  if(buttonDDstate==true){
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

  if(buttonFFstate==true){
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

  fill(0);
  text(note1,120,100-10);
  text(note2,120,200-10);
  text(note3,120,300-10);
  text(note3_5,220,300-10);
}

function togglePlay(){
	if(Tone.Transport.state == "started"){
  	Tone.Transport.stop();
    synth.stop();
    melody.stop();
    bass.stop();
    playButton.html('Play');
    synthButton.html("SynthOff");
    melodyButton.html("MelodyOff");
    bassButton.html("BassOff");
  } else {
  	Tone.Transport.start();
    synth.start("2n");
    melody.start("2n");
    bass.start("4n");
    playButton.html('Stop');
    synthButton.html("SynthOn");
    melodyButton.html("MelodyOn");
    bassButton.html("BassOn");
  }
}

function toggleDrums(){
	beatOn = !beatOn;
  if(beatOn){
    drumsButton.html("DrumsOn");
  } else {
    drumsButton.html("DrumsOff");
  }
}

//to control from DOM buttons
function addCtoArray(){
  if(buttonCstate==false){
    synthScale.push(thescale[0]+"5");
    melodyScale.push(thescale[0]+"4");
  	buttonCstate = true;
  } else if(buttonCstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[0]+"5");
    let k = melodyScale.indexOf(thescale[0]+"4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonCstate = false;
  }
}

function addDtoArray(){
	if(buttonDstate==false){
    synthScale.push(thescale[1]+"5");
    melodyScale.push(thescale[1]+"4");
    buttonDstate = true;
  } else if(buttonDstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[1]+"5");
    let k = melodyScale.indexOf(thescale[1]+"4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonDstate = false;
  }
}

function addFtoArray(){
	if(buttonFstate==false){
    synthScale.push(thescale[2]+"5");
    melodyScale.push(thescale[2]+"4");
    buttonFstate = true;
  } else if(buttonFstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[2]+"5");
    let k = melodyScale.indexOf(thescale[2]+"4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonFstate = false;
  }
}

function addGtoArray(){
	if(buttonGstate==false){
    synthScale.push(thescale[3]+"5");
    melodyScale.push(thescale[3]+"4");
    buttonGstate = true;
  } else if(buttonGstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[3]+"5");
    let k = melodyScale.indexOf(thescale[3]+"4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonGstate = false;
  }
}

function addAtoArray(){
	if(buttonAstate==false){
    synthScale.push(thescale[4]+"5");
    melodyScale.push(thescale[4]+"4");
    buttonAstate = true;
  } else if(buttonAstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[4]+"5");
    let k = melodyScale.indexOf(thescale[4]+"4");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonAstate = false;
  }
}

function addCCtoArray(){
	if(buttonCCstate==false){
    synthScale.push(thescale[0]+"6");
    melodyScale.push(thescale[0]+"5");
    buttonCCstate = true;
  } else if(buttonCCstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[0]+"6");
    let k = melodyScale.indexOf(thescale[0]+"5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonCCstate = false;
  }
}

function addDDtoArray(){
	if(buttonDDstate==false){
    synthScale.push(thescale[1]+"6");
    melodyScale.push(thescale[1]+"5");
    buttonDDstate = true;
  } else if(buttonDDstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[1]+"6");
    let k = melodyScale.indexOf(thescale[1]+"5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonDDstate = false;
  }
}

function addFFtoArray(){
	if(buttonFFstate==false){
    synthScale.push(thescale[2]+"6");
    melodyScale.push(thescale[2]+"5");
    buttonFFstate = true;
  } else if(buttonFFstate==true && synthScale.length>=minArrayLength){
    let i = synthScale.indexOf(thescale[2]+"6");
    let k = melodyScale.indexOf(thescale[2]+"5");
    synthScale.splice(i,1);
    melodyScale.splice(k,1);
    buttonFFstate = false;
  }
}

// function togglesynth(){
// 	if(synth.state == "started"){
//   	synth.stop();
//     synthButton.html("SynthOff");
//   } else {
//   	synth.start("2n");
//     synthButton.html("SynthOn");
//   }
// }

// function togglemelody(){
// 	if(melody.state == "started"){
//   	melody.stop();
//     melodyButton.html("MelodyOff");
//   } else {
//   	melody.start("2n");
//     melodyButton.html("MelodyOn");
//   }
// }

// function togglebass(){
// 	if(bass.state == "started"){
//   	bass.stop();
//     bassButton.html("BassOff");
//   } else {
//   	bass.start("4n");
//     bassButton.html("BassOn");
//   }
// }
