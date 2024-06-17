FROM python:3.11.2

WORKDIR /backend

COPY requirements.txt requirements.txt
COPY manage.py /backend/

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

CMD [ "python3", "manage.py","runserver", "0.0.0.0:8000" ]