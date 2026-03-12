import fastapi
import uvicorn

from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import Scope


app = fastapi.FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def redirect_if_null():
    return fastapi.responses.RedirectResponse("/home.html")


app.mount("", StaticFiles(directory="static"), name="static")