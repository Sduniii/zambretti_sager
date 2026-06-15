DOMAIN = "zambretti_sager"

VERSION = "1.7.1"

CONF_PRESSURE_SENSOR = "pressure_sensor"
CONF_WIND_SENSOR = "wind_sensor"
CONF_TEMPERATURE_SENSOR = "temperature_sensor"
CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_USE_SEA_LEVEL = "use_sea_level_correction"

ZAMBRETTI_MAPPING = {
    # Falling
    1: "Settled Fine",
    2: "Fine Weather",
    3: "Fine, Becoming Less Settled",
    4: "Fairly Fine, Showery Later",
    5: "Showery, Becoming More Unsettled",
    6: "Unsettled, Rain Later",
    7: "Rain at Times, Worse Later",
    8: "Rain at Times, Becoming Very Unsettled",
    9: "Very Unsettled, Rain",
    # Steady
    10: "Settled Fine",
    11: "Fine Weather",
    12: "Fine, Possibly Showers",
    13: "Fairly Fine, Showers Likely",
    14: "Showery, Bright Intervals",
    15: "Changeable, Some Rain",
    16: "Unsettled, Rain at Times",
    17: "Rain at Frequent Intervals",
    18: "Very Unsettled, Rain",
    19: "Stormy, Much Rain",
    # Rising
    20: "Settled Fine",
    21: "Fine Weather",
    22: "Becoming Fine",
    23: "Fairly Fine, Improving",
    24: "Fairly Fine, Possibly Showers Early",
    25: "Showery Early, Improving",
    26: "Changeable, Mending",
    27: "Rather Unsettled, Clearing Later",
    28: "Unsettled, Probably Improving",
    29: "Unsettled, Short Fine Intervals",
    30: "Very Unsettled, Finer at Times",
    31: "Stormy, Possibly Improving",
    32: "Stormy, Much Rain"
}

# Пороги тренда давления по алгоритму Sager (hPa за ~3 ч)
SAGER_TREND_RAPID = 1.4
SAGER_TREND_SLOW = 0.7

WIND_COMPASS = ("N", "NE", "E", "SE", "S", "SW", "W", "NW")

SEA_LEVEL_SENSOR_HINTS = (
    "sea_level",
    "sealevel",
    "mslp",
    "relative",
    "qnh",
    "barometric",
)


def classify_pressure_trend(delta_hpa: float) -> str:
    """Классифицировать тренд давления для алгоритма Sager."""
    if delta_hpa >= SAGER_TREND_RAPID:
        return "rising_rapidly"
    if delta_hpa >= SAGER_TREND_SLOW:
        return "rising_slowly"
    if delta_hpa <= -SAGER_TREND_RAPID:
        return "falling_rapidly"
    if delta_hpa <= -SAGER_TREND_SLOW:
        return "falling_slowly"
    return "steady"


def wind_degrees_to_compass(degrees: float | None) -> str | None:
    """Преобразовать направление ветра в румб (N, NE, ...)."""
    if degrees is None:
        return None
    index = round(degrees / 45) % 8
    return WIND_COMPASS[index]


def calculate_sager_forecast(
    pressure_hpa: float,
    delta_hpa: float,
    wind_degrees: float | None = None,
) -> str:
    """Упрощённый прогноз Sager по давлению, тренду и направлению ветра."""
    trend = classify_pressure_trend(delta_hpa)
    wind = wind_degrees_to_compass(wind_degrees)

    if pressure_hpa > 1020:
        if trend in ("rising_rapidly", "rising_slowly"):
            forecast = "Fair, improving"
        elif trend in ("falling_rapidly", "falling_slowly"):
            forecast = "Fair now, tending to deteriorate"
        else:
            forecast = "Fair, no important change"
    elif pressure_hpa < 1005:
        if trend in ("falling_rapidly", "falling_slowly"):
            forecast = "Unsettled, rain likely"
        elif trend in ("rising_rapidly", "rising_slowly"):
            forecast = "Unsettled, probably improving"
        else:
            forecast = "Unsettled, rain at times"
    elif trend == "rising_rapidly":
        forecast = "Changeable, becoming fairer"
    elif trend == "falling_rapidly":
        forecast = "Changeable, becoming more unsettled"
    elif trend == "rising_slowly":
        forecast = "Variable, slowly improving"
    elif trend == "falling_slowly":
        forecast = "Variable, slowly deteriorating"
    else:
        forecast = "Variable, some change expected"

    if wind:
        forecast = f"{forecast}. {wind} winds expected"

    return forecast
