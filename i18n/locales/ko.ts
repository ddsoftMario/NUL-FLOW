
// Fix: Convert JSON object to a TypeScript module with a default export.
export default {
  "nav": {
    "home": "홈",
    "inbox": "받은 편지함",
    "history": "연결 로그",
    "contacts": "연결 서클",
    "dataExport": "데이터 내보내기",
    "settings": "설정",
    "installApp": "앱 설치",
    "shareApp": "앱 공유"
  },
  "share": {
    "text": "당신의 웰빙을 추적하는 멋진 앱, NUL flow를 확인해보세요.",
    "messageTemplate": "나의 NUL Flow 업데이트:\n🪣 부하: {{bucket}}%\n🔋 에너지: {{battery}}%{{moods}}{{notes}}",
    "emailSubject": "나의 NUL Flow 업데이트"
  },
  "home": {
    "subtitle": "신경 연결을 위한 보편적 언어.",
    "tagline": "당신의 정신 상태를 번역하세요. 당신의 감정뿐만 아니라 당신의 수용 능력을 공유하세요.",
    "sendFlow": "NUL Flow 보내기",
    "getFlow": "NUL Flow 받기",
    "sendFlowCardTitle": "NUL Flow 보내기",
    "sendFlowCardDesc": "신뢰하는 연락처와 현재 상태를 공유하세요",
    "startSharing": "공유 시작",
    "getFlowCardTitle": "NUL Flow 받기",
    "getFlowCardDesc": "연락처로부터 웰빙 업데이트를 요청하세요",
    "requestUpdates": "업데이트 요청"
  },
  "inbox": {
    "emptyTitle": "받은 편지함이 비어 있습니다",
    "emptyDesc": "연락처가 NUL flow를 공유하면 여기에 표시됩니다."
  },
  "history": {
    "title": "연결 로그",
    "description": "공유된 상태를 검토하고 신경 연결 패턴을 발견하세요.",
    "avgBucket": "평균 버킷",
    "bucketAvgDesc": "사회적 부하 평균",
    "avgBattery": "평균 배터리",
    "batteryAvgDesc": "에너지 수준 평균",
    "totalEntries": "총 로그",
    "totalEntriesDesc": "공유된 상태",
    "shared": "공유됨",
    "bucket": "버킷",
    "socialLoad": "사회적 부하",
    "battery": "배터리",
    "energy": "에너지",
    "moodTags": "기분 태그:",
    "note": "메모:"
  },
  "contacts": {
    "title": "나의 연결 서클",
    "description": "정신 상태를 공유하는 신뢰할 수 있는 사람들을 관리하세요.",
    "searchPlaceholder": "모든 연락처 검색...",
    "quickAdd": "빠른 추가",
    "newGroup": "새 그룹",
    "all": "모두",
    "showingContacts": "총 {{total}}개 중 {{count}}개 연락처 표시 중",
    "noContactsFound": "필터와 일치하는 연락처를 찾을 수 없습니다.",
    "sharingPermissions": "공유 권한:",
    "canRequestState": "내 상태를 요청할 수 있음",
    "canSeeBucket": "버킷 수준을 볼 수 있음",
    "canSeeBattery": "배터리 수준을 볼 수 있음",
    "canSeeNotes": "개인 메모를 볼 수 있음",
    "editContact": "연락처 편집",
    "name": "이름",
    "email": "이메일",
    "phone": "전화번호",
    "group": "그룹",
    "save": "저장",
    "cancel": "취소",
    "confirmDeleteTitle": "삭제 확인",
    "confirmDeleteMessage": "이 작업은 되돌릴 수 없습니다. 이 연락처를 네트워크에서 영구적으로 삭제하시겠습니까?",
    "delete": "삭제",
    "newContactName": "새 연락처",
    "enterGroupName": "새 그룹의 이름을 입력하세요:",
    "groupNameExists": "이 이름의 그룹이 이미 존재합니다.",
    "groupCreatedNote": "새 그룹이 생성되었습니다! 이제 편집 모드에서 연락처에 할당할 수 있습니다."
  },
  "requestFlow": {
    "title": "NUL Flow 요청",
    "description": "웰빙 업데이트를 요청할 연락처를 선택하세요.",
    "searchPlaceholder": "이름으로 검색...",
    "noContacts": "요청을 허용하는 연락처가 없습니다. 상대방에게 설정에서 '내 상태 요청 가능'을 활성화하도록 요청하세요.",
    "sendRequest": "요청 보내기",
    "requestSent": "요청 보냄!",
    "noContactInfo": "전화/이메일 없음",
    "smsTemplate": "{{name}}님 안녕하세요, 잘 지내시나요? NUL flow 상태를 공유해 주실 수 있나요?",
    "emailSubject": "NUL Flow 요청",
    "emailBody": "{{name}}님 안녕하세요,\n\n잘 지내시길 바랍니다. NUL Flow를 통해 안부를 묻습니다.\n현재 상태(버킷/배터리)를 공유해 주실 수 있나요?\n\n감사합니다,"
  },
  "contactGroups": {
    "Family": "가족",
    "Friend": "친구",
    "Therapist": "치료사",
    "Partner": "파트너"
  },
  "settings": {
    "title": "설정",
    "description": "NUL 웰빙 경험을 맞춤 설정하세요.",
    "appearance": "모양",
    "darkMode": "다크 모드",
    "darkModeDesc": "라이트 및 다크 테마 간 전환",
    "notifications": "알림",
    "bucketOverflow": "버킷 오버플로 알림",
    "bucketOverflowDesc": "버킷이 거의 가득 찼을 때 알림 받기",
    "lowBattery": "배터리 부족 알림",
    "lowBatteryDesc": "에너지가 부족할 때 알림 받기",
    "dailyCheckin": "매일 체크인 알림",
    "dailyCheckinDesc": "웰빙 상태를 기록하도록 부드럽게 알림",
    "weeklyReports": "주간 보고서",
    "weeklyReportsDesc": "웰빙 패턴 요약",
    "privacy": "개인정보 보호 및 보안",
    "shareLocation": "위치 데이터 공유",
    "shareLocationDesc": "위치 기반 통찰력 향상에 도움",
    "analytics": "분석",
    "analyticsDesc": "서비스 개선을 위한 익명 사용 데이터",
    "crashReporting": "충돌 보고",
    "crashReportingDesc": "버그 수정 및 안정성 향상에 도움",
    "dataSecure": "당신의 웰빙 데이터는 안전하게 암호화됩니다."
  },
  "dataExport": {
    "title": "데이터 내보내기",
    "description": "치료 세션이나 개인 검토를 위해 웰빙 기록을 내보내세요.",
    "selectPeriod": "기간 선택",
    "last7Days": "최근 7일",
    "last30Days": "최근 30일",
    "allTime": "전체 기간",
    "custom": "사용자 지정",
    "to": "~",
    "additionalFilters": "추가 필터",
    "sharedOnly": "공유된 항목만",
    "filterByMood": "기분으로 필터링",
    "entriesFound": "{{count}}개의 항목을 찾았습니다",
    "noEntries": "선택한 기간에 항목이 없습니다.",
    "exportCSV": "CSV로 내보내기"
  },
  "wizard": {
    "steps": {
      "setLevels": "상태 보정",
      "addDetails": "문맥 추가",
      "shareSave": "공유 및 기록"
    },
    "setLevels": {
      "title": "현재 수준 설정",
      "description": "시각 자료를 위아래로 드래그하여 조정하세요.",
      "socialLoad": "사회적 부하",
      "energy": "에너지",
      "levels": {
        "low": "낮음",
        "moderate": "보통",
        "high": "높음",
        "critical": "위험",
        "good": "좋음"
      }
    },
    "addDetails": {
      "title": "문맥 추가 (선택 사항)",
      "description": "기분을 기억하기 위해 메모나 태그를 추가하세요.",
      "feeling": "기분이 어떠신가요?",
      "selectMoods": "해당하는 기분을 선택하세요",
      "addOwnMood": "자신만의 기분 추가...",
      "additionalNotes": "추가 메모",
      "notesPlaceholder": "무슨 생각을 하고 있나요? 오늘 무슨 일이 있었나요?"
    },
    "shareSave": {
      "title": "공유 및 저장",
      "description": "공유할 사람을 선택하거나 자신을 위해 저장하세요.",
      "shareWithContacts": "연락처와 공유",
      "searchPlaceholder": "연락처 검색...",
      "addMoreContacts": "연락처 더 추가",
      "sendToContacts": "{{count}}명의 연락처에게 보내기",
      "saveForMyself": "나를 위해 저장"
    },
    "buttons": {
      "next": "다음 단계",
      "back": "뒤로"
    }
  },
  "moods": {
    "stressed": "스트레스 받음",
    "overwhelmed": "압도됨",
    "calm": "차분함",
    "energized": "활기참",
    "tired": "피곤함",
    "anxious": "불안함",
    "peaceful": "평화로움",
    "focused": "집중함"
  },
  "crisisModal": {
    "title": "웰빙 알림",
    "description1": "AI 웰빙 모니터가 최근 항목에서 우려스러운 패턴(예: 지속적인 높은 정신적 부하 및 낮은 에너지)을 감지했습니다.",
    "description2": "상위 3명의 지원 연락처에게 알리시겠습니까?",
    "notifyButton": "지원 네트워크에 알림",
    "dismissButton": "닫기"
  },
  "languages": {
    "select": "언어 선택"
  },
  "onboarding": {
    "title": "NUL flow에 오신 것을 환영합니다",
    "subtitle": "정신 상태를 보편적인 언어로 번역하는 첫 걸음입니다.",
    "bucketTitle": "버킷",
    "bucketDesc": "정신적, 사회적 부하를 나타냅니다. 버킷이 가득 차면 압도된 상태입니다.",
    "batteryTitle": "배터리",
    "batteryDesc": "에너지 수준을 나타냅니다. 배터리가 부족하면 지친 상태입니다.",
    "closeButton": "시작하기"
  },
  "profileSetup": {
    "title": "누구신가요?",
    "subtitle": "친구들이 누가 flow를 공유하는지 알 수 있도록 프로필을 설정해 봅시다.",
    "nameLabel": "이름",
    "namePlaceholder": "홍길동",
    "emailLabel": "이메일 주소",
    "phoneLabel": "전화번호",
    "submitButton": "프로필 생성",
    "nextStep": "다음: 연락처 추가",
    "contactsTitle": "서클 구축",
    "contactsSubtitle": "기기에서 신뢰할 수 있는 연락처를 가져와 flow를 공유하세요.",
    "importDescription": "주소록에서 이름과 번호를 빠르게 가져올 수 있습니다.",
    "importButton": "기기에서 가져오기",
    "importNotSupported": "이 기기/브라우저에서는 연락처 가져오기를 지원하지 않습니다.",
    "manualEntryNote": "이 기기는 자동 가져오기를 지원하지 않습니다. 나중에 '연결 서클' 탭을 통해 수동으로 연락처를 추가할 수 있습니다.",
    "contactsSelected": "{{count}}개의 연락처가 선택되었습니다!",
    "finishWithContacts": "완료 및 연락처 저장",
    "skipContacts": "지금은 건너뛰기"
  }
};
