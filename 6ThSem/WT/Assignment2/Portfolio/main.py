# main.py
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from data import profile_data
import uvicorn

app = FastAPI()

# Mount static for custom CSS/Images if needed
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "data": profile_data}
    )


@app.get("/cv")
async def cv_page(request: Request):
    return templates.TemplateResponse(
        "cv.html", 
        {"request": request, "data": profile_data}
    )

# ... existing code ...
if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀  PORTFOLIO IS LIVE!")
    print("👉  Click here to view: http://localhost:8000/cv")
    print("="*50 + "\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)