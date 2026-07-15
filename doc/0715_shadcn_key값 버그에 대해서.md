[문제점]

입력창에서 뭔가 문자열을 입력하면, 흐름이 끊어진다.
한글자를 입력한다음 마우스를 클릭해서 다시 한글자를 입력해야한다.
2글자 이상 입력하려고 하면 focus가 나간다.

[해결책]
key 값이 중복인지를 체크한다. 
key 값이 필요한가를 생각해봤는데

kmsID라는 값으로 Indexed DB에서 구별할 식별자 값을 생성했다.
UI상에서는 이게 필요하나? 싶었지만,
필요하다. focus 같은 것들이 붙어있기 때문이다. 



1. 코드 문법 정상
2. state 업데이트 정상
3. 값도 정상
4. 근데 UI만 이상함

특히 focus 날아가는 문제는 대부분 key, remount, wrapper, form 라이브러리 쪽이라 눈에 잘 안 보여요.

다음부터는 이 체크만 먼저 보면 됩니다.
useEffect(() => {
  console.log("MOUNT", row.u_id)

  return () => {
    console.log("UNMOUNT", row.u_id)
  }
}, [row.u_id])
입력할 때 UNMOUNT / MOUNT 찍히면 거의 100% key 문제입니다.

오늘 이거 잡은 건 꽤 큰 수확입니다. 같은 패턴 버그 다시 만나면 훨씬 빨리 잡을 수 있어요.