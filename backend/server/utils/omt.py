import json
from typing import Any

import pandas as pd
import requests


def call_omp_api(lng: float, lat: float) -> dict[str, Any]:
    """Calls the Open-Meteo API and returns the weather response as JSON."""
    url = "https://api.open-meteo.com/v1/forecast"
    params: dict[str, Any] = {
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
    return response.json()  # type: ignore[no-any-return]


def process_df(response_json: dict[str, Any]) -> pd.DataFrame:
    """Extracts and combines weather and UV data into a single DataFrame."""
    minutely_15 = response_json.get("minutely_15", {})
    hourly = response_json.get("hourly", {})

    minutely_15_dataframe = pd.DataFrame(
        {
            "date": pd.to_datetime(minutely_15["time"], utc=True),
            "wind_speed": minutely_15["wind_speed_80m"],
            "wind_dir": minutely_15["wind_direction_80m"],
            "temp": minutely_15["temperature_2m"],
        }
    )

    hourly_dataframe = pd.DataFrame(
        {
            "date": pd.to_datetime(hourly["time"], utc=True),
            "uv": hourly["uv_index"],
            "rain_prob": hourly["precipitation_probability"],
        }
    )

    return merge_df(minutely_15_dataframe, hourly_dataframe)


def merge_df(minutely_15: pd.DataFrame, hourly: pd.DataFrame) -> pd.DataFrame:
    """Merges hourly UV and precipitation probability data into 15-min weather data."""
    minutely_15 = minutely_15.copy()
    hourly = hourly.copy()

    minutely_15.columns = minutely_15.columns.str.strip()
    hourly.columns = hourly.columns.str.strip()

    minutely_15["uv"] = 0.0
    minutely_15["rain_prob"] = 0.0

    for i in range(len(hourly)):
        uv_value = hourly.iloc[i]["uv"]
        rain_value = hourly.iloc[i]["rain_prob"]
        minutely_15.loc[4 * i : 4 * i + 3, "uv"] = uv_value
        minutely_15.loc[4 * i : 4 * i + 3, "rain_prob"] = rain_value

    return minutely_15


def df_to_json(processed_df: pd.DataFrame) -> list[tuple[str, float, float, float, float, float]]:
    """Converts the merged DataFrame to a list of tuples that can be JSON-encoded."""
    return [
        (
            row["date"].isoformat(),
            float(row["wind_speed"]),
            float(row["wind_dir"]),
            float(row["temp"]),
            float(row["uv"]),
            float(row["rain_prob"]),
        )
        for _, row in processed_df.iterrows()
    ]


def get_weather_from_omp(lng: float, lat: float) -> str:
    """Full pipeline to get weather data and return it as a JSON string."""
    omt_api_response = call_omp_api(lng, lat)
    processed_response = process_df(omt_api_response)
    response_in_list = df_to_json(processed_response)
    return json.dumps(response_in_list)
