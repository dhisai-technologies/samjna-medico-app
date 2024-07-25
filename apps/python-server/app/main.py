from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
import socketio
from app.utils.file import filepath_file, filepath_url
from app.utils.session import create_session
from app.process import predict
import uvicorn


app = FastAPI()


sio=socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
socket_app = socketio.ASGIApp(sio)
app.mount("/socket.io", socket_app)
# await sio.emit("result", {
#         "sid": sid,
#     }, room=sid)

@app.post("/process/file")
async def process_file(background_tasks: BackgroundTasks, files: UploadFile = File(...), user_id: str = Form(...)):
    file_path = await filepath_file(files)
    if not file_path:
        return JSONResponse(status_code=400, content={"message": "Error processing file"})
    uid = await create_session(user_id)
    background_tasks.add_task(predict, file_path, uid, user_id)
    return JSONResponse(status_code=200, content={"message": "File uploaded and sent for processing", "data": {"uid": uid}})

@app.post("/process/url")
async def process_url(background_tasks: BackgroundTasks, url: str = Form(...), user_id: str = Form(...)):
    file_path = await filepath_url(url)
    if not file_path:
        return JSONResponse(status_code=400, content={"message": "Error processing URL"})
    uid = await create_session(user_id)
    background_tasks.add_task(predict, uid, file_path, user_id)
    return JSONResponse(status_code=200, content={"message": "URL downloaded and sent for processing", "data": {"uid": uid}})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")