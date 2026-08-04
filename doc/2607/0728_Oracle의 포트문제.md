[증상]


상태: 실패 -테스트 실패: ORA-12541: 접속할 수 없습니다. host 172.23.160.1 port 1521에 리스너가 없습니다. (CONNECTION_ID=Fv9N1f4cT+O4qAzNq3csjw==)
https://docs.oracle.com/error-help/db/ora-12541/

이런 문제가 발생함.


[확인]

[실행] lsnrctl status
[결과]

```
LSNRCTL for 64-bit Windows: Version 23.26.2.0.0 - Production on 28-7월 -2026 13:53:33

Copyright (c) 1991, 2026, Oracle.  All rights reserved.

(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=DESKTOP-LQ4MATT.mshome.net)(PORT=1521)))에 연결되었습니다
TNS-12541: 접속할 수 없습니다. host DESKTOP-LQ4MATT.mshome.net port 1521에 리스너가 없습니다.
 TNS-12560: 데이터베이스 통신 프로토콜 오류입니다.
  TNS-00511: 리스너가 없습니다.
   64-bit Windows Error: 61: Unknown error
(DESCRIPTION=(ADDRESS=(PROTOCOL=IPC)(KEY=EXTPROC1521)))에 연결되었습니다
리스너의 상태
------------------------
별칭                     LISTENER
버전                     TNSLSNR for 64-bit Windows: Version 23.26.2.0.0 - Production
시작 날짜                 28-7월 -2026 05:24:43
업타임                   0 일 8 시간. 28 분. 53 초
트레이스 수준            off
보안                     ON: Local OS Authentication
SNMP                     OFF기본 서비스           FREE
리스너 매개변수 파일   C:\app\edward\product\26ai\dbhomeFree\network\admin\listener.ora
리스너 로그 파일         C:\app\edward\product\26ai\diag\tnslsnr\DESKTOP-LQ4MATT\listener\alert\log.xml
끝점 요약 청취 중...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=172.23.160.1)(PORT=1521)))
  (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(PIPENAME=\\.\pipe\EXTPROC1521ipc)))
리스너는 서비스를 지원하지 않습니다
명령이 성공적으로 수행되었습니다

```

172.23.160.1 이라는 대역대에서 실행중임을 확인할 수 있음

[해결책]
1. sqlplus에 접속함.

sqlplus / as sysdba 

2. ALTER SYSTEM REGISTER;

3. 로컬 리스너 변경
3-1. ALTER SYSTEM SET LOCAL_LISTENER = '(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))' SCOPE=BOTH;
3-2. 변경점 확인함.
ALTER SYSTEM REGISTER

4. sqlplus 탈출 

exit

하여 


```
ALTER SYSTEM SET LOCAL_LISTENER =
  '(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))'
  SCOPE=BOTH;

ALTER SYSTEM REGISTER;

```

를 실행한다. 

5. C:\app\edward\product\26ai\dbhomeFree\network\admin
경로에서 listener.ora파일 수정

LISTENER =
  (DESCRIPTION_LIST =
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
    )
  )



lsnrctl stop LISTENER_FREE
lsnrctl start LISTENER_FREE
lsnrctl services LISTENER_FREE


6. 이후 PC를 재시작하였다. 

lsnrctl status 실행결과. 

```
LSNRCTL for 64-bit Windows: Version 23.26.2.0.0 - Production on 28-7월 -2026 15:54:02

Copyright (c) 1991, 2026, Oracle.  All rights reserved.

(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521)))에 연결되었습니다
리스너의 상태
------------------------
별칭                     LISTENER
버전                     TNSLSNR for 64-bit Windows: Version 23.26.2.0.0 - Production
시작 날짜                 28-7월 -2026 15:49:28
업타임                   0 일 0 시간. 4 분. 35 초
트레이스 수준            off
보안                     ON: Local OS Authentication
SNMP                     OFF기본 서비스           FREE
리스너 매개변수 파일   C:\app\edward\product\26ai\dbhomeFree\network\admin\listener.ora
리스너 로그 파일         C:\app\edward\product\26ai\diag\tnslsnr\DESKTOP-LQ4MATT\listener\alert\log.xml
끝점 요약 청취 중...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=127.0.0.1)(PORT=1521)))
  (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(PIPENAME=\\.\pipe\EXTPROC1521ipc)))
서비스 요약...
"454789be79234e98838816753856e4d4" 서비스는 1개의 인스턴스를 가집니다.
  "free" 인스턴스(READY 상태)는 이 서비스에 대해 3 처리기를 가집니다.
"FREE" 서비스는 1개의 인스턴스를 가집니다.
  "free" 인스턴스(READY 상태)는 이 서비스에 대해 3 처리기를 가집니다.
"FREEXDB" 서비스는 1개의 인스턴스를 가집니다.
  "free" 인스턴스(READY 상태)는 이 서비스에 대해 1 처리기를 가집니다.
"freepdb1" 서비스는 1개의 인스턴스를 가집니다.
  "free" 인스턴스(READY 상태)는 이 서비스에 대해 3 처리기를 가집니다.
명령이 성공적으로 수행되었습니다
```