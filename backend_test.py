import requests
import sys
import json
from datetime import datetime

class IoTDashboardAPITester:
    def __init__(self, base_url="https://data-pulse-68.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "message" in data and "IoT Dashboard API" in data["message"]
                details = f"Response: {data}" if success else f"Unexpected response: {data}"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_sensors_endpoint(self):
        """Test /api/sensors endpoint"""
        try:
            response = requests.get(f"{self.api_url}/sensors", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Verify we get exactly 5 sensors
                if len(data) != 5:
                    success = False
                    details = f"Expected 5 sensors, got {len(data)}"
                else:
                    # Verify sensor structure
                    required_fields = ["sensor_id", "sensor_name", "temperature", "humidity", "pressure", "status", "timestamp"]
                    sensor_ids = ["SENSOR-01", "SENSOR-02", "SENSOR-03", "SENSOR-04", "SENSOR-05"]
                    
                    for sensor in data:
                        # Check required fields
                        for field in required_fields:
                            if field not in sensor:
                                success = False
                                details = f"Missing field '{field}' in sensor data"
                                break
                        
                        # Check sensor ID format
                        if sensor["sensor_id"] not in sensor_ids:
                            success = False
                            details = f"Invalid sensor_id: {sensor['sensor_id']}"
                            break
                        
                        # Check data types and ranges
                        if not isinstance(sensor["temperature"], (int, float)):
                            success = False
                            details = f"Temperature should be numeric, got {type(sensor['temperature'])}"
                            break
                        
                        if not isinstance(sensor["humidity"], (int, float)) or not (0 <= sensor["humidity"] <= 100):
                            success = False
                            details = f"Humidity should be 0-100, got {sensor['humidity']}"
                            break
                        
                        if not isinstance(sensor["pressure"], (int, float)):
                            success = False
                            details = f"Pressure should be numeric, got {type(sensor['pressure'])}"
                            break
                        
                        if sensor["status"] not in ["operational", "warning", "critical"]:
                            success = False
                            details = f"Invalid status: {sensor['status']}"
                            break
                    
                    if success:
                        details = f"All 5 sensors returned with correct structure"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text}"
            
            self.log_test("Sensors Endpoint", success, details)
            return success, data if success else []
        except Exception as e:
            self.log_test("Sensors Endpoint", False, str(e))
            return False, []

    def test_sensor_history_endpoint(self, sensor_id="SENSOR-01"):
        """Test /api/sensors/{sensor_id}/history endpoint"""
        try:
            response = requests.get(f"{self.api_url}/sensors/{sensor_id}/history", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Verify we get 24 hours of data
                if len(data) != 24:
                    success = False
                    details = f"Expected 24 hours of data, got {len(data)}"
                else:
                    # Verify historical data structure
                    required_fields = ["timestamp", "temperature", "humidity", "pressure"]
                    
                    for i, entry in enumerate(data):
                        # Check required fields
                        for field in required_fields:
                            if field not in entry:
                                success = False
                                details = f"Missing field '{field}' in historical data entry {i}"
                                break
                        
                        # Check timestamp format (should be HH:MM)
                        if not entry["timestamp"].endswith(":00") or len(entry["timestamp"]) != 5:
                            success = False
                            details = f"Invalid timestamp format: {entry['timestamp']}"
                            break
                        
                        # Check data types
                        if not isinstance(entry["temperature"], (int, float)):
                            success = False
                            details = f"Temperature should be numeric in historical data"
                            break
                        
                        if not isinstance(entry["humidity"], (int, float)):
                            success = False
                            details = f"Humidity should be numeric in historical data"
                            break
                        
                        if not isinstance(entry["pressure"], (int, float)):
                            success = False
                            details = f"Pressure should be numeric in historical data"
                            break
                    
                    if success:
                        details = f"24 hours of historical data returned with correct structure for {sensor_id}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text}"
            
            self.log_test(f"Sensor History Endpoint ({sensor_id})", success, details)
            return success
        except Exception as e:
            self.log_test(f"Sensor History Endpoint ({sensor_id})", False, str(e))
            return False

    def test_all_sensor_histories(self, sensor_ids):
        """Test historical data for all sensors"""
        all_success = True
        for sensor_id in sensor_ids:
            success = self.test_sensor_history_endpoint(sensor_id)
            if not success:
                all_success = False
        return all_success

    def test_invalid_sensor_history(self):
        """Test historical data endpoint with invalid sensor ID"""
        try:
            response = requests.get(f"{self.api_url}/sensors/INVALID-SENSOR/history", timeout=10)
            # Should still return 200 with default data based on the implementation
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = len(data) == 24  # Should return default 24 hours
                details = f"Invalid sensor ID handled correctly, returned {len(data)} entries"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Invalid Sensor History", success, details)
            return success
        except Exception as e:
            self.log_test("Invalid Sensor History", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting IoT Dashboard Backend API Tests")
        print("=" * 50)
        
        # Test API root
        if not self.test_api_root():
            print("❌ API root test failed, stopping tests")
            return False
        
        # Test sensors endpoint
        sensors_success, sensors_data = self.test_sensors_endpoint()
        if not sensors_success:
            print("❌ Sensors endpoint test failed, stopping tests")
            return False
        
        # Extract sensor IDs for history testing
        sensor_ids = [sensor["sensor_id"] for sensor in sensors_data]
        
        # Test historical data for all sensors
        self.test_all_sensor_histories(sensor_ids)
        
        # Test invalid sensor ID
        self.test_invalid_sensor_history()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Backend API Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend API tests passed!")
            return True
        else:
            print("⚠️  Some backend API tests failed")
            return False

def main():
    tester = IoTDashboardAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "0%",
        "test_details": tester.test_results
    }
    
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())