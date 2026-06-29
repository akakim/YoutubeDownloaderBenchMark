
1. 
```

# 테스트용 리엑트 프로젝트 생성. React + TypeScript, RSLint 
# npm create vite@latest shadcn-test -- --template react
PS D:\LLM> npm create vite@latest shadcn-lab -- --template react-ts

cd shadcn-lab
npm install
# shadcn 설치 
npm install shadcn class-variance-authority clsx tailwind-merge lucide-react tw-animate-css

```
1-1. 테스트용 리엑트 프로젝트 생성시  ESLint로 선택함. (Oxlint 설정과는 무관함 )


2. 프로젝트의 루트 경로 shadn-test 로 이동

3. vite.config.js 파일 작성 
```
import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

4. jsconfig.json 파일 작성 
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

```

# 의존성 설치 
npm install tailwindcss @tailwindcss/vite

5. ./src/index.css 파일 내용 일부 추가. 

```
# 가장 윗부분. 
@import "tailwindcss";

... 기타 css  

```

npx shadcn@latest init # 여러 파일을 생성함. ./src/index.css 같은것도 생성함.
npx shadcn@latest add button card input
