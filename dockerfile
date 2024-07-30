FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY /Servidor/. .
EXPOSE 5000
CMD ["python", "main.py"]