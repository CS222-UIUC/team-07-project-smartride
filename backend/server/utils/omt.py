import pandas as pd
import requests
import json
from typing import Tuple

def call_omp_api(lng: float, lat: float) -> dict:
    """Calls the Open-Meteo API and returns the weather response as JSON."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lng,
        "hourly": "uv_index,precipitation_probability",
        "minutely_15": "wind_speed_80m,wind_direction_80m,temperature_2m,relative_humidity_2m",
        "timezone": "auto",
        "forecast_days": 1,
        "wind_speed_unit": "mph",
        "temperature_unit": "fahrenheit",
        "precipitation_unit": "inch",
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def process_df(response_json: dict) -> pd.DataFrame:
    """Extracts and combines weather and UV data into a single DataFrame."""
    minutely_15 = response_json.get("minutely_15", {})
    hourly = response_json.get("hourly", {})

    # Create minutely_15 dataframe
    minutely_15_dataframe = pd.DataFrame({
        "date": pd.to_datetime(minutely_15["time"], utc=True),
        "wind_speed": minutely_15["wind_speed_80m"],
        "wind_dir": minutely_15["wind_direction_80m"],
        "temp": minutely_15["temperature_2m"]
    })

    # Create hourly dataframe
    hourly_dataframe = pd.DataFrame({
        "date": pd.to_datetime(hourly["time"], utc=True),
        "uv": hourly["uv_index"],
        "rain_prob": hourly["precipitation_probability"]
    })

    return merge_df(minutely_15_dataframe, hourly_dataframe)


def merge_df(minutely_15: pd.DataFrame, hourly: pd.DataFrame) -> pd.DataFrame:
    """
    Merges hourly UV and precipitation probability data into 15-min weather data.
    Each hourly value is assigned to the next four 15-minute intervals.
    """
    minutely_15 = minutely_15.copy()
    hourly = hourly.copy()

    # Clean up column names
    minutely_15.columns = minutely_15.columns.str.strip()
    hourly.columns = hourly.columns.str.strip()

    # Initialize new columns
    minutely_15["uv"] = 0.0
    minutely_15["rain_prob"] = 0.0

    for i in range(len(hourly)):
        uv_value = hourly.iloc[i]["uv"]
        rain_value = hourly.iloc[i]["rain_prob"]
        minutely_15.loc[4 * i : 4 * i + 3, "uv"] = uv_value
        minutely_15.loc[4 * i : 4 * i + 3, "rain_prob"] = rain_value

    return minutely_15

def df_to_json(processed_df: pd.DataFrame) -> dict:
    """Converts the merged DataFrame to a JSON file."""
    # Create a list of tuples
    data_list = []
    for index, row in processed_df.iterrows():
        data_list.append((
            row["date"].isoformat(),
            row["wind_speed"],
            row["wind_dir"],
            row["temp"],
            row["uv"],
            row["rain_prob"]
        ))
    # Save to a JSON file
    return json.dumps(data_list)

def get_weather_from_omp(lng: float, lat: float) -> dict:
    omt_api_response = call_omp_api(lng, lat)
    processed_response = process_df(omt_api_response)
    response_in_json = df_to_json(processed_response)
    return response_in_json