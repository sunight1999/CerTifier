# CerTifier
CerTifier는 인증 메일이 오면 인증 코드만 파싱하여 알림으로 띄워주는 데스크톱 앱입니다.



# 사용 방법
## 1. 필요 라이브러리 설치
- npm v9.6.4
- node v18.16.0

## 2. 구글 클라우드 API 키 발급
**1. GOOGLE_APPLICATION_CREDENTIALS 환경 변수 추가 후 값으로 `.\credentials.json` 설정**
![image](https://github.com/user-attachments/assets/c56a0dbb-eb51-499d-bfc6-47fb29a14110)

**2. 구글 콘솔 클라우드 접속** (_https://console.cloud.google.com/welcome?hl=ko_)
![image](https://github.com/user-attachments/assets/bf10f239-f23d-4dc6-aafb-216bdfe9399c)

**3. 새 프로젝트 생성**
![image](https://github.com/user-attachments/assets/8b4a9b40-f37f-4eb9-86df-9d9df055808c)

**4. API 및 서비스 접속**
![image](https://github.com/user-attachments/assets/e951f090-396a-49d5-960b-f1cc40eb6327)

**5. API 및 서비스 사용 설정 접속**
![image](https://github.com/user-attachments/assets/d1d2d80d-3135-4fe1-aff0-2174b4b3122f)

**6. `gmail api` 검색 후 `Gmail API` 클릭**
![image](https://github.com/user-attachments/assets/7885042c-4aa6-4fc6-99e9-9c7cdd591a08)

![image](https://github.com/user-attachments/assets/67706296-0a0b-45ef-95b2-1b89574f2091)

**7. `사용` 버튼 클릭 (`사용` 클릭 시 아래와 같은 화면으로 변함)**
![image](https://github.com/user-attachments/assets/8dcc3480-e500-4aad-8304-72ba4e58cc80)

**8. `관리` 버튼 클릭**
![image](https://github.com/user-attachments/assets/8dcc3480-e500-4aad-8304-72ba4e58cc80)

**9. 우상단 `사용자 인증 정보 만들기` 클릭**
![image](https://github.com/user-attachments/assets/d39ca682-6007-459c-91d8-8cf86e743e75)

**10. `애플리케이션 데이터` 선택 후 `다음` 클릭**
![image](https://github.com/user-attachments/assets/1aa4b15b-a600-45d2-b3a9-07f0e1ed6931)

**11. 원하는 이름을 `서비스 계정 이름`에 작성 후 `만들고 계속하기` 클릭**
![image](https://github.com/user-attachments/assets/b6545e06-978c-435c-aec1-a2a64c83635a)

**12. `역할 선택` 클릭 후 'pub'을 필터에 검색하고 `Cloud Pub/Sub 서비스 에이전트` 클릭**
![image](https://github.com/user-attachments/assets/1a05b625-97a4-4ab0-88b7-8610b68dfe8c)

**+ `다른 역할 추가`를 클릭해 `저장소 관리자` 역할도 추가**
![image](https://github.com/user-attachments/assets/259c821a-9c29-43f6-aedb-10b7d84257fb)

**`게시/구독 게시자`, `게시/구독 구독자`도 추가해 아래와 같이 역할이 설정되어야 함**
![image](https://github.com/user-attachments/assets/24e34a0f-50eb-4cbc-8be0-69a92fea0794)

**13. `계속` 클릭 후 `완료` 클릭**
![image](https://github.com/user-attachments/assets/c4728707-9861-4c6d-bf3f-c89f216db153)

**14. 좌측 `사용자 인증 정보` 클릭**
![image](https://github.com/user-attachments/assets/73e75bf5-35a3-45f8-ad91-708d4b400408)

**15. 생성한 서비스 계정 클릭**
![image](https://github.com/user-attachments/assets/f6c0791c-9119-44ae-a0bf-ad1da4ab6da1)

**16. 상단 `키` 탭 클릭 후 `키 추가 > 새 키 만들기` 클릭**
![image](https://github.com/user-attachments/assets/4f02f00f-7a93-4c41-ba29-50942b6bbee2)

**17. 다운받아진 파일 이름을 'credentials.json'으로 변경 후 프로젝트 폴더로 이동**

**18. 만약 결제 정보가 없다면 결제 계정을 연결해야 함**
![image](https://github.com/user-attachments/assets/d08a8f10-5421-4859-a928-d35bad0f2e84)

## 3. Pub/Sub 토픽 생성
1. 아래 토픽 관리 페이지로 접속
https://console.cloud.google.com/cloudpubsub/topic/list?

2. 상단 `Create Topic` 클릭
![image](https://github.com/user-attachments/assets/21a00f06-0d5c-4c81-8448-a248af88c846)

3. 원하는 이름 입력 후 `만들기` 클릭
![image](https://github.com/user-attachments/assets/61e6b662-87be-4914-90ee-92b3ae676ac9)

4. 구독 ID를 config.json의 "topic" 항목에 입력
![image](https://github.com/user-attachments/assets/308b795b-cd56-401f-a159-4bf326ab720c)

## 4. CerTifier 실행
**1. credentials.json 존재 여부 확인**

**2. 프로그램 설치**
`install.cmd` 더블클릭으로 실행

**3. 프로그램 시작**
`run.cmd` 더블클릭으로 실행
