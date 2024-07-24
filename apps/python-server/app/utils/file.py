from fastapi import UploadFile
import requests
from urllib.parse import urlparse, unquote


async def filepath_file(file: UploadFile):
		try:
			file_path = f"/tmp/{file.filename}"
			with open(file_path, "wb") as f:
				f.write(file.file.read())
			return file_path
		except:
			return None

async def filepath_url(url: str):
		try:
				response = requests.get(url)
				response.raise_for_status()       
				parsed_url = urlparse(url)
				filename = unquote(parsed_url.path.split('/')[-1]) or f"temp.webm" 
				file_path = f"/tmp/{filename}"
				with open(file_path, "wb") as f:
						f.write(response.content)
				return file_path
		except:
				return None