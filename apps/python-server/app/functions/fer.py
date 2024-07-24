import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import timm
from tqdm import tqdm
import torch.nn as nn
from torchvision import models
import pandas as pd

def model_(fer_model,valence_model,arousal_model):
    device = "cuda"
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"

    
    # Define the transformation to apply to the images
    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    # Load the Haar cascade for face detection

    # Load saved model
    model = timm.create_model("tf_efficientnet_b0_ns", pretrained=False)
    model.classifier = torch.nn.Identity()
    model.classifier = nn.Sequential(
        nn.Linear(in_features=1280, out_features=7)
    )  # 1792 #1280 #1536
    model = torch.load(
        fer_model,
        map_location=torch.device('cpu')
    )
    model.to(device)
    # summary(model, (3, 244, 244))
    model.eval()
    model.to(device)

    # Loading Arousal Model
    model_arousal = models.efficientnet_b0(pretrained=True)
    model_arousal.classifier = torch.nn.Identity()
    model_arousal.classifier = nn.Linear(1280, 1)
    model_arousal = torch.load(
        arousal_model,
        map_location=torch.device('cpu')
    )
    model_arousal = model_arousal.to(device)
    model_arousal.eval()
    model_arousal = model_arousal.to(device)

    # Loading valence Model
    model_valence = models.efficientnet_b0(pretrained=True)
    model_valence.classifier = torch.nn.Identity()
    model_valence.classifier = nn.Linear(1280, 1)
    model_valence = torch.load(
        valence_model,
        map_location=torch.device('cpu')
    )
    model_valence = model_valence.to(device)
    model_valence.eval()
    model_valence = model_valence.to(device)

    return device, transform, model, model_arousal, model_valence




def prediction(frames, transform, model, model_arousal, model_valence, device,fps):
    # device, transform, model, model_arousal, model_valence = model()
    
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    histogram = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }

    mat = [[0 for _ in range(7)] for _ in range(7)]
    
    prev_emotion = None
    current_emotion = None

    arousal_list = []
    valence_list = []
    emotion_list = []
    emotion_count = [0] * 7

    frame_count = 0
    time_stamps=[]
    for frame in tqdm(frames):
        timestamp=frame_count/fps
        time_stamps.append(timestamp)
        frame_count+=1
        frame=np.copy(frame)
        # Convert frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        for x, y, w, h in faces:
            # Extract the region of interest (the face)
            face = frame[y : y + h, x : x + w]

            # Convert the face to a PIL image
            face_pil = Image.fromarray(cv2.cvtColor(face, cv2.COLOR_BGR2RGB))

            # Apply transformations
            face_tensor = transform(face_pil).unsqueeze(0).to(device)

            # Pass the face through the neural network
            with torch.no_grad():
                output = model(face_tensor)
                arousal_output = model_arousal(face_tensor)
                valence_output = model_valence(face_tensor)
                arousal_list.append(arousal_output[0].item())
                valence_list.append(valence_output[0].item())
                _, predicted = torch.max(output, 1)
                # _, predicted2 = torch.max(arousal_output, 1)

            label_dict = {
                0: "angry",
                1: "disgust",
                2: "fear",
                3: "happy",
                4: "neutral",
                5: "sad",
                6: "surprised",
            }

            # Draw a rectangle around the face and label it with the prediction
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            label = f"{label_dict[predicted.item()]}"
            emotion_count[predicted.item()]+=1
            frame_count += 1
            label2 = f"Arousal : {arousal_output[0]}, Valence : {valence_output[0]}"

            current_emotion = predicted.item()

            if prev_emotion is not None:
                mat[current_emotion][prev_emotion] += 1

            prev_emotion = current_emotion
            histogram[predicted.item()] += 1
            emotion_list.append(label)
            break


    x = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprised"]
    class_labels = ["angry", "disgust", "fear", "happy", "neutral", "sad","surprised"]
    class_wise_frame_count = dict(zip(class_labels, emotion_count))
    y = list(histogram.values())
    sum = 0
    for i in y:
        sum = sum + i
    y_new = []
    for i in y:
        y_new.append((i / sum) * 100)
    matrix = mat
    x = arousal_list
    y = valence_list
    
    data = {
        "angry": matrix[0],
        "disgust": matrix[1],
        "fear": matrix[2],
        "happy": matrix[3],
        "neutral": matrix[4],
        "sad": matrix[5],
        "surprise": matrix[6],
    }
    data = {"Time Stamp": time_stamps, "Emotion": emotion_list}
    print(len(time_stamps), len(emotion_list))
    df = pd.DataFrame(data)
    

    return class_wise_frame_count,df, histogram, mat, x, y


def fer_pred(frames,fps,fer_model,valence_model,arousal_model):

    # device, transform, model, model_arousal, model_valence = model()
    # Prediction Starts here
    device, transform, model, model_arousal, model_valence=model_(fer_model,valence_model,arousal_model)
    class_wise_frame_count,df, histogram, mat, x, y=prediction(frames,transform, model, model_arousal, model_valence, device,fps)
    return class_wise_frame_count,df, histogram, mat, x, y