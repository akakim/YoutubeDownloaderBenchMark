TODO : 검증한번 필요.

axios 1.18버전에서 어떤 취약점이 발견됬지? npm install axios하니까 2 high serverity vulnerabilities가 떴거든

axios 1.8.x 근처에서 뜨는 대표 High 취약점은 보통 이겁니다.

CVE-2025-27152
Axios가 baseURL을 써도, 요청 URL에 절대경로가 들어오면 의도하지 않은 외부 주소로 요청이 나가면서 SSRF / 인증정보 유출 가능성이 생긴 취약점입니다. axios 1.0.0 ~ 1.8.1이 영향권이고, 1.8.2에서 수정된 것으로 보고됩니다.

그리고 npm audit에서 2개 High로 뜬다면, 추가로 이런 계열일 가능성이 큽니다.

CVE-2023-45857
Axios의 XSRF 토큰 관련 취약점입니다. 오래된 버전 범위까지 같이 걸려서 audit에 함께 표시되는 경우가 있습니다



[참조]
https://discourse.mcneel.com/t/npm-issue-for-javascript-sdk-axios-security-vulnerability/205978?utm_source=chatgpt.com


https://discourse.mcneel.com/t/npm-issue-for-javascript-sdk-axios-security-vulnerability/205978?utm_source=chatgpt.com
