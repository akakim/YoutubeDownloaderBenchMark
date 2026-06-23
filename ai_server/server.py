from enum import Enum
from fastapi import FastAPI, Request, HTTPException

from controller.STTController import handle_stt

import time

class ModelName(str,Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

# class Job(str,str):

app = FastAPI()

@app.get("/")
def root():
    return {"message","hello Fast API "}


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name" : model_name,"message": "DeepLearning FTW"}
    if model_name.value == "lenet":
        return {"model_name" : model_name,"message": "LeCNN all the images"}
    
@app.post("/stt")
async def stt(request: Request):
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    if not isinstance(body, dict):
        raise HTTPException(status_code=400, detail="JSON body must be an object")

    # delegate to controller
    response = await handle_stt(body)

    return response    
