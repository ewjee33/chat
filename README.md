# Chat
- Nest.js 기반의 Socket.io용 Socket 서버
- Redis의 Pub / Sub 기능을 활용해 두개 이상의 인스턴스 사용 가능 
- Chat History 추적을 위한 MongoDB 사용


## 사용법 
1. Repo 를 다운로드 후에 .envexample 파일 설명에 맞게 .env 파일 생성 
2. npm install 로 필요 package 설치
3. nest start 명령어를 통해 시작
* docker-compose.yaml 파일 필요에 맞게 수정해 사용 가능

## .env File Example 
```bash
DB_URL=mongodb://Mongo 주소 
PORTNUMBER=사용할 포트 번호 
SOCKET_END_POINT=/test
REDIS_URL=redis://Redis 주소
TZ=사용할 타임존 
```

## Socket Event Subscribe / Emit Pattern  
1. joinTeamChat
- Arg : teamId(string)
- Res : eventName : 'joinTeam' , `Client ${client.id} joined room ${teamId}

2. leaveTeamChat
- Arg : teamId(string)
- Res : eventName : 'leftTeam' , `Client ${client.id} left room ${teamId}

3. sendTeamChat
- Arg : Json - data : { teamId: string, message: string , userId : string}
- Res : eventName : 'chat' , { clientId: client.id, message: data.message }

4. deleteChat
- Arg : teamId(string)
- Res : eventName : 'deleteChat' , { chatId: packet['chatId'] }

5. chatLog
- Arg : teamId(string)
- Res : eventName : 'chatlog' , chats
