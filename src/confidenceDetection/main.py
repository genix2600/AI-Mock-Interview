import cv2
import math
import numpy as np

cap=cv2.VideoCapture(0)
face_cascade=cv2.CascadeClassifier("haarcascade_frontalface_default.xml") 
while True:
    
    ret, frame = cap.read()
    grayScale=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    face=face_cascade.detectMultiScale(grayScale,1.06,8) # Best setting i've found so far. could be fine tuned later
    if len(face) == 0:
        print("No faces found")# TODO: add fallback for this later

    for(x,y,width,height) in face: 
        l=y+height//2
        m=x+width//2
        cv2.circle(frame,(m,l),150,(0, 255, 0),2)
    # TODO : Add Formula to give movement of face a percentage. Higher the %, the worse. Person being interviewed must be stable.
    # a log graph could be used.

    cv2.imshow("Camera", frame) 
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break