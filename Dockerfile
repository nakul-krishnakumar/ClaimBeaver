# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements files for each service
COPY LLM_Microservices/requirements.txt ./LLM_Microservices/requirements.txt
COPY Voice_Agent/requirements.txt ./Voice_Agent/requirements.txt
COPY Frontend/package.json ./Frontend/package.json
COPY Frontend/package-lock.json ./Frontend/package-lock.json
COPY Landing_Page/package.json ./Landing_Page/package.json
COPY Landing_Page/package-lock.json ./Landing_Page/package-lock.json

# Install dependencies for each service
RUN pip install --no-cache-dir -r LLM_Microservices/requirements.txt
RUN pip install --no-cache-dir -r Voice_Agent/requirements.txt

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Install dependencies for the frontend and landing page
RUN cd Frontend && npm install
RUN cd Landing_Page && npm install

# Copy the application code
COPY . .

# Install LM Studio
RUN apt-get install -y wget
RUN wget https://github.com/lm-studio/lm-studio/releases/download/v1.0.0/lm-studio-linux-x64.tar.gz
RUN tar -xzf lm-studio-linux-x64.tar.gz -C /usr/local/bin

# Expose ports for the services
EXPOSE 3000 8000 5000

# Define environment variables
ENV FRONTEND_PORT=3000
ENV VOICE_AGENT_PORT=8000
ENV LLM_MICROSERVICES_PORT=5000

# Start the services
CMD ["sh", "-c", "\
    cd Frontend && npm run dev & \
    cd Landing_Page && npm run dev & \
    cd Voice_Agent && uvicorn main:app --host 0.0.0.0 --port $VOICE_AGENT_PORT & \
    cd LLM_Microservices && uvicorn main_api:app --host 0.0.0.0 --port $LLM_MICROSERVICES_PORT \
"]