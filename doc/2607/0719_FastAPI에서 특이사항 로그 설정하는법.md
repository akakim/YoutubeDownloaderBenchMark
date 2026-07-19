[해결책]
console은 포기하고 파일에 로그를 기록한다. 

https://twoweekhee.tistory.com/22

주요 설정값들
when='midnight': 자정마다 새로운 로그 파일 생성
interval=1: 1일 간격으로 로테이션
backupCount=30: 최대 30일치 로그 파일 보관
suffix="%Y%m%d": 백업 파일명에 날짜 형식 지정
이렇게 설정하면 app.log.20241225, app.log.20241226 같은 형식으로 파일이 생성되고, 30일이 지난 파일은 자동으로 삭제됩니다! 🗂️




```
import sys
import logging
from logging.handlers import TimedRotatingFileHandler

# 환경변수로 로그 파일 경로 설정
LOG_FILE_PATH = "/app/logs/application.log"

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# 포맷터 생성
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# 콘솔 출력 핸들러
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

# 날짜별 로테이션 파일 핸들러
file_handler = TimedRotatingFileHandler(
    filename=LOG_FILE_PATH,
    when='midnight',  # 자정마다 로테이션
    interval=1,       # 1일 간격
    backupCount=30,   # 30일치 보관
    encoding='utf-8'
)
file_handler.setFormatter(formatter)

# 로테이션된 파일명 포맷 설정
file_handler.suffix = "%Y%m%d"

# 핸들러 추가
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# 사용 예시
if __name__ == "__main__":
    logger.info("애플리케이션이 시작되었습니다 🎉")
    logger.warning("이것은 경고 메시지입니다 ⚠️")
    logger.error("에러가 발생했습니다 ❌")

```
핵심 포인트 ✨
이중 출력: 콘솔과 파일에 동시에 로그를 기록해서 개발 시에는 콘솔로 확인하고, 프로덕션에서는 파일로 관리할 수 있습니다.
UTF-8 인코딩: 한글 로그 메시지도 문제없이 저장됩니다.
자동 파일 관리: 매일 새로운 로그 파일이 생성되고, 오래된 파일은 자동으로 정리됩니다.
실제 활용 방법 📋
설정한 로거를 실제 프로젝트에서 어떻게 활용하는지 몇 가지 예시를 살펴보겠습니다:

예외 처리와 함께 사용하기
import traceback

def risky_operation():
    try:
        # 위험한 작업 수행
        result = some_complex_calculation()
        logger.info("복잡한 계산 작업 성공")
        return result
    except ValueError as e:
        logger.warning(f"잘못된 값 입력: {str(e)}")
        return None
    except Exception as e:
        # 상세한 에러 정보 로깅
        logger.error(f"예상치 못한 에러 발생: {str(e)}")
        logger.error(f"에러 상세 정보:\\n{traceback.format_exc()}")
        raise

마무리 🎯
이렇게 구성된 로깅 시스템은 다음과 같은 장점들을 제공합니다:

효율적인 디스크 관리: 로그 파일이 무한정 커지는 것을 방지
빠른 문제 추적: 날짜별로 분리된 로그로 특정 시점의 이슈 추적 용이
개발 편의성: 콘솔과 파일 동시 출력으로 개발/운영 환경 모두 대응
실제 운영 환경에서 이런 로깅 시스템을 구축해두면, 장애 상황에서 빠르게 원인을 파악하고 대응할 수 있어서 정말 유용합니다. 여러분의 프로젝트에도 한번 적용해보시길 추천드려요! 😊


[문제점]

server.py 파일에서 
logger.info("블라블라")

가 동작하지 않는다.

GPT에게 물어본대로 
```

import logging

logger = logging.getLogger(__name__)


@app.get("/")
def root():
    logger.info("루트 엔드포인트가 호출되었습니다.")

```

이런식으로 코드를 짜기도하고 

package.json파일에서 

```
mkdir -p logs
uvicorn server:app \
  --reload \
  --host 0.0.0.0 \
  --port 5175 \
  --log-level info \
  --log-config logging.yaml


```

logging.yaml파일

```

version: 1
disable_existing_loggers: false

formatters:
  default:
    "()": uvicorn.logging.DefaultFormatter
    fmt: "%(asctime)s - %(levelprefix)s %(name)s - %(message)s"
    datefmt: "%Y-%m-%d %H:%M:%S"
    use_colors: false

  access:
    "()": uvicorn.logging.AccessFormatter
    fmt: '%(asctime)s - %(levelprefix)s %(client_addr)s - "%(request_line)s" %(status_code)s'
    datefmt: "%Y-%m-%d %H:%M:%S"
    use_colors: false

handlers:
  app_file:
    class: logging.handlers.RotatingFileHandler
    formatter: default
    filename: logs/app.log
    maxBytes: 10485760
    backupCount: 5
    encoding: utf-8

  access_file:
    class: logging.handlers.RotatingFileHandler
    formatter: access
    filename: logs/access.log
    maxBytes: 10485760
    backupCount: 5
    encoding: utf-8

loggers:
  uvicorn:
    level: INFO
    handlers: [app_file]
    propagate: false

  uvicorn.error:
    level: INFO
    handlers: [app_file]
    propagate: false

  uvicorn.access:
    level: INFO
    handlers: [access_file]
    propagate: false

  app:
    level: INFO
    handlers: [app_file]
    propagate: false

root:
  level: INFO
  handlers: [app_file]

```

을 설정했는데도 잘 안됬다. 



