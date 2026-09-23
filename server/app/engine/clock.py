from datetime import datetime, timedelta

class SimulationClock:
    def __init__(self, current_tick: int, current_time: datetime, tick_duration_minutes: int):
        self.current_tick = current_tick
        self.current_time = current_time
        self.tick_duration = timedelta(minutes=tick_duration_minutes)
        
    def advance(self) -> None:
        self.current_tick += 1
        self.current_time += self.tick_duration
        
    def get_time_of_day(self) -> str:
        return self.current_time.strftime("%H:%M")
        
    def get_day_of_week(self) -> int:
        return self.current_time.weekday()
