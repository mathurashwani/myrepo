from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import random
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class SensorReading(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    sensor_id: str
    sensor_name: str
    temperature: float
    humidity: float
    pressure: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str


class HistoricalData(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    pressure: float


def generate_mock_sensor_data():
    sensors = [
        {"id": "SENSOR-01", "name": "North Wing", "base_temp": 22},
        {"id": "SENSOR-02", "name": "South Wing", "base_temp": 24},
        {"id": "SENSOR-03", "name": "East Wing", "base_temp": 21},
        {"id": "SENSOR-04", "name": "West Wing", "base_temp": 23},
        {"id": "SENSOR-05", "name": "Central Hub", "base_temp": 22.5}
    ]
    
    readings = []
    for sensor in sensors:
        temp_variance = random.uniform(-2, 2)
        temperature = round(sensor["base_temp"] + temp_variance, 1)
        humidity = round(random.uniform(40, 70), 1)
        pressure = round(random.uniform(1010, 1030), 1)
        
        status = "operational"
        if temperature > 25 or temperature < 18:
            status = "warning"
        elif temperature > 27 or temperature < 16:
            status = "critical"
        
        reading = SensorReading(
            sensor_id=sensor["id"],
            sensor_name=sensor["name"],
            temperature=temperature,
            humidity=humidity,
            pressure=pressure,
            status=status
        )
        readings.append(reading)
    
    return readings


def generate_historical_data(sensor_id: str):
    base_values = {
        "SENSOR-01": {"temp": 22, "hum": 55, "press": 1015},
        "SENSOR-02": {"temp": 24, "hum": 60, "press": 1018},
        "SENSOR-03": {"temp": 21, "hum": 50, "press": 1012},
        "SENSOR-04": {"temp": 23, "hum": 58, "press": 1020},
        "SENSOR-05": {"temp": 22.5, "hum": 56, "press": 1016}
    }
    
    base = base_values.get(sensor_id, {"temp": 22, "hum": 55, "press": 1015})
    history = []
    
    for i in range(24):
        hour = f"{i:02d}:00"
        history.append(HistoricalData(
            timestamp=hour,
            temperature=round(base["temp"] + random.uniform(-1.5, 1.5), 1),
            humidity=round(base["hum"] + random.uniform(-5, 5), 1),
            pressure=round(base["press"] + random.uniform(-3, 3), 1)
        ))
    
    return history


@api_router.get("/")
async def root():
    return {"message": "IoT Dashboard API"}


@api_router.get("/sensors", response_model=List[SensorReading])
async def get_sensors():
    return generate_mock_sensor_data()


@api_router.get("/sensors/{sensor_id}/history", response_model=List[HistoricalData])
async def get_sensor_history(sensor_id: str):
    return generate_historical_data(sensor_id)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
