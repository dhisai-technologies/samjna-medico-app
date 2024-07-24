from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
import socketio
from app.utils.file import filepath_file, filepath_url
from app.process import predict
import uvicorn


app = FastAPI()

# sio=socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
# socket_app = socketio.ASGIApp(sio)
# app.mount("/socket.io", socket_app)

# user_sockets = {}

# @sio.on("disconnect")
# async def disconnect(sid):
#     print("Client disconnected:", sid)
#     for user_id, socket_id in user_sockets.items():
#         if socket_id == sid:
#             del user_sockets[user_id]
#             break

# @sio.on("join")
# async def join(sid, room):
#     sio.enter_room(sid, room)
#     user_sockets[room] = room
#     print("Client joined room:", room)

# @sio.on("leave")
# async def leave(sid, room):
#     sio.leave_room(sid, room)
#     for user_id, socket_id in user_sockets.items():
#         if socket_id == sid:
#             del user_sockets[user_id]
#             break
#     print("Client left room:", room)

@app.post("/process/file")
async def process_file(background_tasks: BackgroundTasks, files: UploadFile = File(...), user_id: str = Form(...)):
    file_path = await filepath_file(files)
    if not file_path:
        return JSONResponse(status_code=400, content={"message": "Error processing file"})
    print("Calling predict")
    background_tasks.add_task(predict, file_path, user_id)
        	# 	from app.main import user_sockets, sio
		# if user_id in user_sockets:
		# 	sio.emit("result", {
		# 		"user_id": user_id,
		# 	}, room=user_sockets[user_id])
    return JSONResponse(status_code=200, content={"message": "File uploaded and sent for processing"})

@app.post("/process/url")
async def process_url(url: str = Form(...), user_id: str = Form(...)):
    file_path = await filepath_url(url)
    if not file_path:
        return JSONResponse(status_code=400, content={"message": "Error processing URL"})
    predict(file_path, user_id)
    return JSONResponse(status_code=200, content={"message": "URL downloaded and sent for processing"})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")