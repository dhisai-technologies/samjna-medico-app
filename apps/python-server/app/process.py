import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='tensorflow')
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import logging
logging.getLogger('absl').setLevel(logging.ERROR)
from moviepy.editor import VideoFileClip
import pandas as pd
from app.utils.session import send_analytics, send_csv
from app.functions.Speech import *
from app.functions.eye_track import *
from app.functions.fer import *



async def predict(video_path: str, uid: str, user_id: str):

	models_folder='/Users/nagasaivegur/Developer/work/dhisai/samjna-medico-app/apps/python-server/app/models'    #change this path to folder_path where models are saved
	#MODELS FOLDER
	speech_model=os.path.join(models_folder,'speech.keras')
	fer_model=os.path.join(models_folder,'22.6_AffectNet_10K_part2.pt')
	valence_model=os.path.join(models_folder,'valence3.pt')
	arousal_model=os.path.join(models_folder,'arousal4.pt')

	#change path to directory in which you want to get output
	output_dir = 'output'
	if not os.path.exists(output_dir):
			os.makedirs(output_dir)

	#OUTPUT PATHS
	fer_log_path = os.path.join(output_dir,"fer_log.csv")
	Speech_log_path = os.path.join(output_dir,"speech_log.csv")
	eye_log_path = os.path.join(output_dir,"eyetrack_log.csv")


	video_clip = VideoFileClip(video_path)
	video_clip = video_clip.set_fps(30)
	fps = video_clip.fps
	audio = video_clip.audio
	audio_path = 'extracted_audio.wav'
	audio.write_audiofile(audio_path)
	video_frames = [frame for frame in video_clip.iter_frames()]


	##EYE TRACKING
	fc=Facetrack()
	column=['Timestamp','Frame_number','Total_Blinks','Avg_blink_duration']
	preds=process_video(fc,video_frames,fps)
	eye_df=pd.DataFrame(preds,columns=column)
	eye_df.to_csv(eye_log_path,index=False)


	#FACIAL EXPRESSION RECOGNITION
	class_wise_frame_count,fer_df, histogram, mat, x, y=fer_pred(video_frames,fps,fer_model,valence_model,arousal_model)
	fer_df.to_csv(fer_log_path, index=False)

	# SPEECH EMOTION RECOGNITION
	# emotions_df,major_emotion,word=speech(audio_path,speech_model)
	# emotions_df.to_csv(Speech_log_path, index=False)

	# print("\n*****Speech Predictions*****\n")
	# print("Major Emotion : ",major_emotion)
	# if word is not None:
	# 		print(f'Number of words = {word[0]}')
	# 		print(f'speaking rate = {word[1]} syllables per second')
	# 		print(f'Average Pause Duration = {word[2]} seconds')
	# 		print(f'Articulation rate = {word[3]} syllables per second')
	# else:
	# 		print("Transcript Failed")
	# print(f"Emotion log saved to {eye_log_path}")

	print("\n*****EYE tracking Predictions*****\n")
	print("Total Blinks : ",preds[-1][2])
	print("Average Blink Duration : ",preds[-1][3])
	print("Eye tracking Log file saved to eye_track.csv")

	print("\n*****FER Predictions*****\n")
	print("class_wise_frame_count\n",class_wise_frame_count)


	print("\nMatrix : ",)
	for row in mat:
			print(row)

	await send_analytics({
		"uid": uid,
		"user_id": user_id, 
		"analytics": {
			"eye_tracking": {
				"duration": video_clip.duration,
			"total_blinks": preds[-1][2],
			"average_blink_duration": preds[-1][3],
			},
			"fer": {
				"class_wise_frame_count": class_wise_frame_count,
				"matrix": mat
			},
			"speech": {

			}
		}
	})

	await send_csv({
			"uid": uid,
			"user_id": user_id, 
			"csv": {
				"eye_tracking": eye_df.to_json(orient='records'),
				"fer": fer_df.to_json(orient='records'),
				"speech": {}
			}
	})

	if os.path.exists(audio_path):
			os.remove(audio_path)
			print(f"Deleted temporary audio file: {audio_path}")

	path='segment.wav'
	if os.path.exists(path):
			os.remove(path)
			print(f"Deleted temporary audio file: {path}")