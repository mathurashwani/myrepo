from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import random
from datetime import datetime, timezone, timedelta


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


class SensorHealth(BaseModel):
    sensor_id: str
    sensor_name: str
    uptime_percentage: float
    last_online: datetime
    total_readings: int
    failed_readings: int
    last_maintenance: datetime
    next_maintenance: datetime
    health_status: str


class AlertConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    alert_id: str = Field(default_factory=lambda: f"ALERT-{random.randint(1000, 9999)}")
    sensor_id: str
    metric: str
    threshold_min: Optional[float] = None
    threshold_max: Optional[float] = None
    email: str
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AlertConfigCreate(BaseModel):
    sensor_id: str
    metric: str
    threshold_min: Optional[float] = None
    threshold_max: Optional[float] = None
    email: str
    enabled: bool = True


class MaintenanceSchedule(BaseModel):
    sensor_id: str
    scheduled_date: datetime
    maintenance_type: str
    notes: Optional[str] = None


class MaintenanceScheduleCreate(BaseModel):
    sensor_id: str
    scheduled_date: str
    maintenance_type: str
    notes: Optional[str] = None


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


def generate_sensor_health():
    sensors = [
        {"id": "SENSOR-01", "name": "North Wing"},
        {"id": "SENSOR-02", "name": "South Wing"},
        {"id": "SENSOR-03", "name": "East Wing"},
        {"id": "SENSOR-04", "name": "West Wing"},
        {"id": "SENSOR-05", "name": "Central Hub"}
    ]
    
    health_data = []
    for sensor in sensors:
        uptime = round(random.uniform(95, 99.9), 1)
        total = random.randint(10000, 15000)
        failed = int(total * (100 - uptime) / 100)
        
        last_maint = datetime.now(timezone.utc) - timedelta(days=random.randint(20, 60))
        next_maint = datetime.now(timezone.utc) + timedelta(days=random.randint(10, 40))
        
        health_status = "excellent" if uptime > 99 else "good" if uptime > 97 else "fair"
        
        health = SensorHealth(
            sensor_id=sensor["id"],
            sensor_name=sensor["name"],
            uptime_percentage=uptime,
            last_online=datetime.now(timezone.utc) - timedelta(seconds=random.randint(1, 300)),
            total_readings=total,
            failed_readings=failed,
            last_maintenance=last_maint,
            next_maintenance=next_maint,
            health_status=health_status
        )
        health_data.append(health)
    
    return health_data


@api_router.get("/")
async def root():
    return {"message": "IoT Dashboard API"}


@api_router.get("/sensors", response_model=List[SensorReading])
async def get_sensors():
    return generate_mock_sensor_data()


@api_router.get("/sensors/{sensor_id}/history", response_model=List[HistoricalData])
async def get_sensor_history(sensor_id: str):
    return generate_historical_data(sensor_id)


@api_router.get("/sensors/health/all", response_model=List[SensorHealth])
async def get_sensor_health():
    return generate_sensor_health()


@api_router.get("/alerts", response_model=List[AlertConfig])
async def get_alerts():
    alerts = await db.alerts.find({}, {"_id": 0}).to_list(1000)
    for alert in alerts:
        if isinstance(alert.get('created_at'), str):
            alert['created_at'] = datetime.fromisoformat(alert['created_at'])
    return alerts


@api_router.post("/alerts", response_model=AlertConfig)
async def create_alert(alert_input: AlertConfigCreate):
    alert_dict = alert_input.model_dump()
    alert = AlertConfig(**alert_dict)
    
    doc = alert.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.alerts.insert_one(doc)
    return alert


@api_router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    result = await db.alerts.delete_one({"alert_id": alert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}


@api_router.post("/alerts/test")
async def test_alert_notification(alert_id: str):
    alert = await db.alerts.find_one({"alert_id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {
        "success": True,
        "message": f"MOCKED: Email notification sent to {alert['email']}",
        "details": f"Alert test for {alert['sensor_id']} - {alert['metric']}"
    }


@api_router.get("/maintenance/schedule", response_model=List[MaintenanceSchedule])
async def get_maintenance_schedule():
    schedules = await db.maintenance.find({}, {"_id": 0}).to_list(1000)
    for schedule in schedules:
        if isinstance(schedule.get('scheduled_date'), str):
            schedule['scheduled_date'] = datetime.fromisoformat(schedule['scheduled_date'])
    return schedules


@api_router.post("/maintenance/schedule", response_model=MaintenanceSchedule)
async def create_maintenance_schedule(schedule_input: MaintenanceScheduleCreate):
    schedule = MaintenanceSchedule(
        sensor_id=schedule_input.sensor_id,
        scheduled_date=datetime.fromisoformat(schedule_input.scheduled_date),
        maintenance_type=schedule_input.maintenance_type,
        notes=schedule_input.notes
    )
    
    doc = schedule.model_dump()
    doc['scheduled_date'] = doc['scheduled_date'].isoformat()
    
    await db.maintenance.insert_one(doc)
    return schedule


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
