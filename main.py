from fastapi import FastAPI
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from api import parrotAPI
from pydantic import BaseModel
import time

app = FastAPI(
    title="Open-Domain Parrot Paragraph",
    description="Open-Domain Parrot Paragraph",
    version="0.1.0"
)
api = parrotAPI()

class Item(BaseModel):
    sentence: str

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get('/', response_class=HTMLResponse)
def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post('/api')
def go_api(item: Item):
    print(item)
    return api(item.sentence)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0")
