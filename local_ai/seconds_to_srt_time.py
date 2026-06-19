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


# 테스트
print(seconds_to_srt_time(7.3))
# 00:00:07,300

print(seconds_to_srt_time(10.73))
# 00:00:10,730