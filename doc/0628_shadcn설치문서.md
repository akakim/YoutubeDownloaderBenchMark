1. 
```

# 테스트용 리엑트 프로젝트 생성. React + TypeScript, RSLint 
# npm create vite@latest shadcn-test -- --template react
PS D:\LLM> npm create vite@latest shadcn-lab -- --template react-ts

```
1-1. 테스트용 리엑트 프로젝트 생성시  ESLint로 선택함. (Oxlint 설정과는 무관함 )



2. 프로젝트의 루트 경로 shadn-test 로 이동

cd shadcn-lab
npm install
# shadcn 설치 
npm install shadcn class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
npm install tailwindcss @tailwindcss/vite


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

4. src/styles/globals.css 작성 


4. src/lib/utils.ts 작성 
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

5. root 경로 (src 상위)에 components.json파일 작성

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

6. root경로

npx shadcn@latest add button card input
명령어 실행함.

7. main.tsx파일에서 import './styles/global.css' 를 꼭 넣음  

####### 최고의 옵션 

1. project명 폴더 하나를 생성함.

cd {project 명}

2. npx shadcn@latest add button card input

2-1. 적당한 앱 이름 만듦.
2-2. vite로 생성 


끝 

3. 추가로 다른 Component를 추가하고자 할 때, 
cd {project명}/{적당한 앱} 
npx shadcn@latest add bubble

