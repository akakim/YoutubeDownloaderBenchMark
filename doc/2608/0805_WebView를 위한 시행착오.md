디버깅의 편의를 위해. 가상머신을 선택하여 
WebView를 테스트했다. 

문제는...

환경을 재현하기 위해 이것저것 바꾸었다.

http://localhost:5173으로 접속을 하자.
CSS가 깨져버렸다. 

그리고 이 문제에 대해서, 도저히 해결을 못하겠다. 
그게 두가지 관점에서 해결할 실마리가 있지만.
시간이 없는 관계로 포기한다. 


1. vite 명령어가 5173 포트에서 추가적으로 데이터를 어떤걸 작용하는지.
2. Android Emulator가 10.0.2.2 ip에서 web으로 갈수있는가. 

이 두가지이다. 

현재까지 시도한 바로는 

1. adb reverse tcp:5173 tcp:5173 명령을 시도하여 5173포트가 통신하게끔 포트를 열었다. 
2. network_security_config.xml 파일 수정 
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
<!--    <domain-config cleartextTrafficPermitted="true">-->
<!--        <domain includeSubdomains="true">10.0.2.2</domain>-->
<!--        <domain includeSubdomains="true">localhost</domain>-->
<!--    </domain-config>-->

    <base-config cleartextTrafficPermitted="true" />

</network-security-config>
```
3. react 소스코드(vite.config.ts) 설정 추가. 

```

export default defineConfig({
  ...
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    origin: "http://10.0.2.2:5173",
    hmr: {
      host: "0.0.0.0",
      port: 5173,
      clientPort: 5173,
      protocol: "ws"
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
  },
  ...
  
})


```

물론 webView이외의 것을 테스트 하기에는 에뮬레이터도 충분하다고 본다. 

