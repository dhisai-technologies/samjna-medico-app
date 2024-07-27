FROM python:3.12

RUN apt-get update -y
RUN apt-get install -y libhdf5-dev libsndfile1 libgl1

WORKDIR /app

COPY ./apps/python-server/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./apps/python-server/app /app/app

ARG PORT=8002
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["sh", "-c", "uvicorn app.main:app --reload --host 0.0.0.0 --port ${PORT}"]