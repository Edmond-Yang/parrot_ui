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
#api = parrotAPI()

class Item(BaseModel):
    sentence: str

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get('/', response_class=HTMLResponse)
def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post('/api')
def api(item: Item):
    print(item)
    time.sleep(3)
    return {'A team of Harvard researchers found that keeping fresh flowers at home does wonders in keeping away anxiety and negative moods.': ['A team of Harvard researchers found that keeping fresh flowers at home does wonders in keeping away anxiety and negative moods. a team', 'A team of Harvard researchers found that keeping flowers at home does wonders in keeping away anxiety and negative moods.', 'A team of Harvard researchers found that keeping fresh flowers at home does wonders to keep away anxiety and negative moods.', 'A team of Harvard researchers found that having fresh flowers at home does wonders in keeping away anxiety and negative moods.', 'A team of Harvard researchers found that keeping fresh flowers at home does wonders for keeping away anxiety and negative moods.', 'A team of Harvard researchers found that keeping fresh flowers at home does wonders in keeping away anxiety and negative moods.', 'A team of Harvard researchers found that keeping fresh flowers at home does wonders in keeping away anxiety and negative moods.'], 'People in the study also felt more compassionate toward others and they felt a boost of energy and enthusiasm at work.': ['People in the study also felt more compassionate toward others and felt a boost in energy and enthusiasm at work.', 'People in the study also felt more compassionate towards others and felt a boost of energy and enthusiasm at work.', 'People in the study also felt more compassionate toward others and felt a boost of energy and enthusiasm at work.', 'People in the study also felt more compassionate toward others and felt a boost of energy and enthusiasm at work.', 'People in the study also felt more compassionate toward others and they felt a boost of energy and enthusiasm at work.', 'People in the study also felt more compassionate toward others and they felt a boost of energy and enthusiasm at work.']}

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0")