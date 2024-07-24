import speech_recognition as sr
import librosa
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd
import soundfile as sf
from pyAudioAnalysis import audioSegmentation as aS

label_mapping = {
    0: 'angry',
    1: 'disgust',
    2: 'fear',
    3: 'happy',
    4: 'neutral',
    5: 'sad',
    6: 'surprise',
}

def features_extractor(file_name):
    audio, sample_rate = librosa.load(file_name, res_type='kaiser_best')

    # Extract MFCC features
    mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=25)
    mfccs_scaled_features = np.mean(mfccs_features.T, axis=0)

    # Extract Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=audio)
    zcr_scaled_features = np.mean(zcr.T, axis=0)

    # Extract Chroma Features
    chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
    chroma_scaled_features = np.mean(chroma.T, axis=0)

    # Extract Mel Spectrogram Features
    mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
    mel_scaled_features = np.mean(mel.T, axis=0)

    # Concatenate all features into a single array
    features = np.hstack((mfccs_scaled_features, zcr_scaled_features, chroma_scaled_features, mel_scaled_features))

    return features

def predict_emotions(audio_path, interval,model_s):
    audio_data, samplerate = sf.read(audio_path)
    duration = len(audio_data) / samplerate
    emotions = []

    for start in np.arange(0, duration, interval):
        end = start + interval
        if end > duration:
            end = duration
        segment = audio_data[int(start*samplerate):int(end*samplerate)]
        segment_path = 'segment.wav'
        sf.write(segment_path, segment, samplerate)
        # Extract features
        feat = features_extractor(segment_path)
        if feat is not None:
            feat = feat.reshape(1, -1)
            predictions = model_s.predict(feat)

            # Format predictions
            predicted_emotions = {label_mapping[i]: round(float(predictions[0][i]), 4) for i in range(len(label_mapping))}
            
            emotions.append([start, end, predicted_emotions])

    return emotions

def recognize_speech_from_file(audio_file_path):
    recognizer = sr.Recognizer()  # Create a recognizer instance
    audio_file = sr.AudioFile(audio_file_path)  # Load the audio file
    with audio_file as source:  # Use the audio file as the source
        audio = recognizer.record(source)  # Record the audio
    try:
        # Recognize the speech using Google's Web Speech API
        transcript = recognizer.recognize_google(audio)
        return transcript  # Return the transcript
    except sr.UnknownValueError:  # If the speech is unintelligible
        return None
    except sr.RequestError as e:  # If there's an error with the API request
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return None

def count_words(text):
    words = text.split()  # Split the text into words
    return len(words)  # Return the number of words

def estimate_syllables(text):
    syllable_count = 0  # Initialize syllable count
    words = text.split()  # Split the text into words
    for word in words:  # Iterate through each word
        # Count the vowels in the word to estimate syllables
        syllable_count += len([c for c in word if c.lower() in 'aeiou'])
    return syllable_count  # Return the syllable count

def get_speaking_rate(file_path, transcript):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    total_duration = len(y) / sr  # Calculate the total duration of the audio
    num_syllables = estimate_syllables(transcript)  # Estimate the number of syllables
    speaking_rate = num_syllables / total_duration if total_duration > 0 else 0  # Calculate the speaking rate
    return speaking_rate  # Return the speaking rate

def calculate_pause_metrics(file_path):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    # Remove silence and get the segments
    segments = aS.silence_removal(y, sr, 0.020, 0.020, smooth_window=1.0, weight=0.3, plot=False)
    total_duration = len(y) / sr  # Calculate the total duration
    speech_duration = sum([end - start for start, end in segments])  # Calculate the speech duration
    pause_duration = total_duration - speech_duration  # Calculate the pause duration
    num_pauses = len(segments) - 1 if len(segments) > 0 else 0  # Calculate the number of pauses
    average_pause_length = pause_duration / num_pauses if num_pauses > 0 else 0  # Calculate the average pause length
    return average_pause_length  # Return the average pause length and number of pauses

def calculate_articulation_rate(file_path, transcript):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    # Remove silence and get the segments
    segments = aS.silence_removal(y, sr, 0.020, 0.020, smooth_window=1.0, weight=0.3, plot=False)
    speech_duration = sum([end - start for start, end in segments])  # Calculate the speech duration
    num_syllables = estimate_syllables(transcript)  # Estimate the number of syllables
    articulation_rate = num_syllables / speech_duration if speech_duration > 0 else 0  # Calculate the articulation rate
    return articulation_rate  # Return the articulation rate

def analyze_audio(file_path):
    # Get the transcript of the audio
    transcript = recognize_speech_from_file(file_path)
    if not transcript:  # If transcript is not available
        print("Could not transcribe the audio.")
        return

    # Calculate various metrics
    word_count = count_words(transcript)  # Count the number of words
    speaking_rate = get_speaking_rate(file_path, transcript) # Calculate the speaking rate
    average_pause_length = calculate_pause_metrics(file_path)  # Calculate pause metrics
    articulation_rate = calculate_articulation_rate(file_path, transcript)  # Calculate the articulation rate

    return [word_count, speaking_rate, average_pause_length, articulation_rate]

def speech(audio_path,model_path):
    model_s = load_model(model_path)
    interval = 3.0  # Set the interval for emotion detection segments

    emotions = predict_emotions(audio_path, interval,model_s)
    emotions_df = pd.DataFrame(emotions, columns=["Start", "End", "Emotion"],dtype='object')
    emotions_df['Emotion']=emotions_df['Emotion'].astype(object)
    # print(emotions_df)

    # Save emotions to a log file
    # Extrapolate major emotions
    major_emotion = emotions_df['Emotion'].mode().values[0]
    major_emotion = [key for key in major_emotion if major_emotion[key] == max(major_emotion.values())]
    # print(f"Major emotion: {major_emotion}")

    word = analyze_audio(audio_path)
    return emotions_df,major_emotion,word