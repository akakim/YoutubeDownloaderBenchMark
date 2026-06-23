class Util:
    @staticmethod
    def format_elapsed_time(elapsed: float) -> str:
        minutes = int(elapsed // 60)
        seconds = int(elapsed % 60)
        milliseconds = int((elapsed % 1) * 1000)

        return f"{minutes:02d}:{seconds:02d}:{milliseconds:03d}"
    
    @staticmethod
    def seconds_to_srt_time(seconds: float) -> str:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = round((seconds % 1) * 1000)

        return (
            f"{hours:02d}:"
            f"{minutes:02d}:"
            f"{secs:02d},"
            f"{millis:03d}"
        )