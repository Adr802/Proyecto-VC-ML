FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN apt-get update && \
    apt-get install -y openjdk-17-jre-headless && \
    apt-get clean;
COPY /Servidor/. .
EXPOSE 5000
CMD ["python", "main.py"]