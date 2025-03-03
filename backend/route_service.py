from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/route/")
async def get_route(start: str, end: str):
    return {"route": []} # Todo

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)