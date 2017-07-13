/*
 */
 
const byte STAT = 6;
const byte ZONE1 = 7;
const byte ZONE2 = 8;
const byte ZONE3 = 9;
const byte ZONE4 = 10;

void setup()
{                
  pinMode(STAT, OUTPUT);     
  pinMode(ZONE1, OUTPUT);     
  pinMode(ZONE2, OUTPUT);     
  pinMode(ZONE3, OUTPUT);     
  pinMode(ZONE4, OUTPUT);     
}

void loop()
{
  digitalWrite(STAT, HIGH);
  digitalWrite(ZONE1, HIGH);
  digitalWrite(ZONE2, HIGH);
  digitalWrite(ZONE3, HIGH);
  digitalWrite(ZONE4, HIGH);
  delay(250);
  digitalWrite(STAT, LOW);
  digitalWrite(ZONE1, LOW);
  digitalWrite(ZONE2, LOW);
  digitalWrite(ZONE3, LOW);
  digitalWrite(ZONE4, LOW);
  delay(250);
}
