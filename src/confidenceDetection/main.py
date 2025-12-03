import cv2
detector = cv2.FaceDetectorYN_create("yunet.onnx",   "",(320, 320),score_threshold=0.85,nms_threshold=0.2,top_k=500)

camera=cv2.VideoCapture(0)
while True:
    ret,frame=camera.read()
    h, w = frame.shape[:2]
    detector.setInputSize((w, h))
    _, face=detector.detect(frame)
    if face is not None:
        for face in face:
            x, y, w, h = map(int, face[:4])
            confidence=face[14]
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
    
    cv2.imshow("Confidence Detection", frame)
# TODO: Add formula for confidence(depending on face stability)scoring
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
camera.release()
cv2.destroyAllWindows()


