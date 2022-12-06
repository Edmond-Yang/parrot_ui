from fastapi import FastAPI
from fastapi import Body, FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
import uvicorn
from typing import Optional
from api import parrotAPI

app = FastAPI(
    title="Open-Domain Parrot Paragraph",
    description="Open-Domain Parrot Paragraph",
    version="0.1.0"
)
#api = parrotAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get('/', response_class=HTMLResponse)
def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0")