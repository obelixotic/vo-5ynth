#include <Servo.h>      // include the servo library
int pot1 = A1;//complexity
int pot2 = A2;//bass
int pot3 = A3;//melody
int pot4 = A4;//synth

int button1 =  12;//C
int button2 = 2;//D
int button3 = 3;//F
int button4 = 4;//G
int button5 = 5;//A
int button6 = 6;//CC
int button7 = 7;//DD
int button8 = 8;//FF
int button9 = 9;//DRUMS
int button10 = 10;//REC
int button11 = 11;//PLAY

void setup() {
  Serial.begin(9600);       // initialize serial communications
  pinMode(button1, INPUT_PULLUP);
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  pinMode(button4, INPUT_PULLUP);
  pinMode(button5, INPUT_PULLUP);
  pinMode(button6, INPUT_PULLUP);
  pinMode(button7, INPUT_PULLUP);
  pinMode(button8, INPUT_PULLUP);
  pinMode(button9, INPUT_PULLUP);
  pinMode(button10, INPUT_PULLUP);
  pinMode(button11, INPUT_PULLUP);
  pinMode(pot1, INPUT);
  pinMode(pot2, INPUT);
  pinMode(pot3, INPUT);
  pinMode(pot4, INPUT);
}

void loop()
{
  int button1value = digitalRead(button1);
  int button2value = digitalRead(button2);
  int button3value = digitalRead(button3);
  int button4value = digitalRead(button4);
  int button5value = digitalRead(button5);
  int button6value = digitalRead(button6);
  int button7value = digitalRead(button7);
  int button8value = digitalRead(button8);
  int button9value = digitalRead(button9);
  int button10value = digitalRead(button10);
  int button11value = digitalRead(button11);
  int pot1value = analogRead(pot1);
  int pot2value = analogRead(pot2);
  int pot3value = analogRead(pot3);
  int pot4value = analogRead(pot4);

  //send it to p5    
  Serial.print(button1value);
  Serial.print(",");
  Serial.print(button2value); 
  Serial.print(",");
  Serial.print(button3value);
  Serial.print(",");
  Serial.print(button4value); 
  Serial.print(",");
  Serial.print(button5value);
  Serial.print(",");
  Serial.print(button6value); 
  Serial.print(",");
  Serial.print(button7value); 
  Serial.print(",");
  Serial.print(button8value); 
  Serial.print(",");
  Serial.print(button9value); 
  Serial.print(",");
  Serial.print(button10value); 
  Serial.print(",");
  Serial.print(button11value); 
  Serial.print(",");
  Serial.print(pot1value); 
  Serial.print(",");
  Serial.print(pot2value); 
  Serial.print(",");
  Serial.print(pot3value); 
  Serial.print(",");
  Serial.println(pot4value); 
  // println lines up with readline or readstringUntil(10) in p5
  // if your sensor's range is less than 0 to 1023, you'll need to
  // modify the map() function to use the values you discovered:
  delay(500);

}
