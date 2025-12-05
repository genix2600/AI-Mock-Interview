import cv2
import time
import math
start_time=time.time()
detector = cv2.FaceDetectorYN_create(
    "yunet.onnx", "", (320, 320),
    score_threshold=0.85,
    nms_threshold=0.2,
    top_k=500
)
stability=0
camera = cv2.VideoCapture(0)

prev_cx, prev_cy = None, None
speed = 0.0
smoothed_speed = 0.0

alpha = 0.75      # smoothing factor
MAX_JUMP = 60     # pixel jump clamp
CONF_MIN = 0.5    # minimum reliable confidence

while True:
    ret, frame = camera.read()
    h, w = frame.shape[:2]

    detector.setInputSize((w, h))
    _, face = detector.detect(frame)

    if face is not None:
        for face in face:
            x, y, w, h = map(int, face[:4])
            confidence = face[14]

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            cx = x + w // 2
            cy = y + h // 2

            if confidence < CONF_MIN:
                speed = 0.0
            else:
                if prev_cx is not None:
                    dx = cx - prev_cx
                    dy = cy - prev_cy
                    instant_speed = (dx**2 + dy**2) ** 0.5

                    if instant_speed > MAX_JUMP:
                        instant_speed = smoothed_speed

                    smoothed_speed = (
                        alpha * smoothed_speed + (1 - alpha) * instant_speed
                    )
                    speed = smoothed_speed
                else:
                    speed = 0.0
                    smoothed_speed = 0.0

                prev_cx, prev_cy = cx, cy

            print(f"Speed: {speed:.2f}", end="\r", flush=True)
            if(speed>7):
                print("Stay still please",end="\r",flush=True)
                stability=stability+1

    cv2.imshow("Confidence Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        
        end_time = time.time()

        # total time
        elapsed_time = end_time - start_time
        print("Total time: ",elapsed_time)
        f=math.log((elapsed_time/stability))
        print("Log value : ", f)
        if(f<0):
            print("Extremely unstable.")
        elif(f>0 or f<0.5):
            print("Mostly stable")
        break

camera.release()
cv2.destroyAllWindows()
