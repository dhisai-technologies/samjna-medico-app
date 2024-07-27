import httpx
import time

NODE_SERVER = "http://node-server:8001"

async def create_session(user_id: str):
	uid = f"{int(time.time() * 1000)}"
	async with httpx.AsyncClient() as client:
				response = await client.post(
						f'{NODE_SERVER}/v1/sessions',
						json={"user_id": user_id, "uid": uid},
				)
				print("HTTP Request sent. Response status code: ", response.status_code)
				return uid

async def send_analytics(json = None):
	async with httpx.AsyncClient() as client:
				response = await client.post(
						f'{NODE_SERVER}/v1/sessions/analytics',
						json=json,
				)
				print("HTTP Request sent. Response status code: ", response.status_code)

async def send_csv(json = None):
	async with httpx.AsyncClient() as client:
				response = await client.post(
						f'{NODE_SERVER}/v1/sessions/csv',
						json=json,
				)
				print("HTTP Request sent. Response status code: ", response.status_code)
