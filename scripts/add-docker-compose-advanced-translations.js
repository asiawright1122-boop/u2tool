const fs = require('fs');
const path = require('path');

// docker-compose-generator-advanced UI translations
const translations = {
  en: {
    quickAddService: 'Quick Add Service',
    services: 'Services',
    addEmptyService: '+ Add Empty Service',
    serviceName: 'service_name',
    remove: 'Remove',
    image: 'Image',
    restartPolicy: 'Restart Policy',
    ports: 'Ports (comma separated, e.g., 3000:3000, 8080:80)',
    volumes: 'Volumes (comma separated)',
    dependsOn: 'Depends On (comma separated service names)',
    none: 'none',
    always: 'always',
    unlessStopped: 'unless-stopped',
    onFailure: 'on-failure'
  },
  zh: {
    quickAddService: '快速添加服务',
    services: '服务',
    addEmptyService: '+ 添加空服务',
    serviceName: '服务名称',
    remove: '移除',
    image: '镜像',
    restartPolicy: '重启策略',
    ports: '端口（逗号分隔，如 3000:3000, 8080:80）',
    volumes: '卷（逗号分隔）',
    dependsOn: '依赖服务（逗号分隔的服务名）',
    none: '无',
    always: '总是',
    unlessStopped: '除非停止',
    onFailure: '失败时'
  },
  ja: {
    quickAddService: 'クイック追加サービス',
    services: 'サービス',
    addEmptyService: '+ 空のサービスを追加',
    serviceName: 'サービス名',
    remove: '削除',
    image: 'イメージ',
    restartPolicy: '再起動ポリシー',
    ports: 'ポート（カンマ区切り、例: 3000:3000, 8080:80）',
    volumes: 'ボリューム（カンマ区切り）',
    dependsOn: '依存関係（カンマ区切りのサービス名）',
    none: 'なし',
    always: '常に',
    unlessStopped: '停止しない限り',
    onFailure: '失敗時'
  },
  ko: {
    quickAddService: '빠른 서비스 추가',
    services: '서비스',
    addEmptyService: '+ 빈 서비스 추가',
    serviceName: '서비스_이름',
    remove: '제거',
    image: '이미지',
    restartPolicy: '재시작 정책',
    ports: '포트 (쉼표로 구분, 예: 3000:3000, 8080:80)',
    volumes: '볼륨 (쉼표로 구분)',
    dependsOn: '의존성 (쉼표로 구분된 서비스 이름)',
    none: '없음',
    always: '항상',
    unlessStopped: '중지되지 않는 한',
    onFailure: '실패 시'
  },
  es: {
    quickAddService: 'Agregar Servicio Rápido',
    services: 'Servicios',
    addEmptyService: '+ Agregar Servicio Vacío',
    serviceName: 'nombre_servicio',
    remove: 'Eliminar',
    image: 'Imagen',
    restartPolicy: 'Política de Reinicio',
    ports: 'Puertos (separados por coma, ej: 3000:3000, 8080:80)',
    volumes: 'Volúmenes (separados por coma)',
    dependsOn: 'Depende de (nombres de servicios separados por coma)',
    none: 'ninguno',
    always: 'siempre',
    unlessStopped: 'a menos que se detenga',
    onFailure: 'en caso de fallo'
  },
  pt: {
    quickAddService: 'Adicionar Serviço Rápido',
    services: 'Serviços',
    addEmptyService: '+ Adicionar Serviço Vazio',
    serviceName: 'nome_servico',
    remove: 'Remover',
    image: 'Imagem',
    restartPolicy: 'Política de Reinício',
    ports: 'Portas (separadas por vírgula, ex: 3000:3000, 8080:80)',
    volumes: 'Volumes (separados por vírgula)',
    dependsOn: 'Depende de (nomes de serviços separados por vírgula)',
    none: 'nenhum',
    always: 'sempre',
    unlessStopped: 'a menos que parado',
    onFailure: 'em caso de falha'
  },
  fr: {
    quickAddService: 'Ajout Rapide de Service',
    services: 'Services',
    addEmptyService: '+ Ajouter un Service Vide',
    serviceName: 'nom_service',
    remove: 'Supprimer',
    image: 'Image',
    restartPolicy: 'Politique de Redémarrage',
    ports: 'Ports (séparés par virgule, ex: 3000:3000, 8080:80)',
    volumes: 'Volumes (séparés par virgule)',
    dependsOn: 'Dépend de (noms de services séparés par virgule)',
    none: 'aucun',
    always: 'toujours',
    unlessStopped: 'sauf si arrêté',
    onFailure: 'en cas d\'échec'
  },
  de: {
    quickAddService: 'Schnell Service hinzufügen',
    services: 'Dienste',
    addEmptyService: '+ Leeren Service hinzufügen',
    serviceName: 'service_name',
    remove: 'Entfernen',
    image: 'Image',
    restartPolicy: 'Neustart-Richtlinie',
    ports: 'Ports (kommagetrennt, z.B. 3000:3000, 8080:80)',
    volumes: 'Volumes (kommagetrennt)',
    dependsOn: 'Abhängig von (kommagetrennte Servicenamen)',
    none: 'keine',
    always: 'immer',
    unlessStopped: 'außer wenn gestoppt',
    onFailure: 'bei Fehler'
  },
  ru: {
    quickAddService: 'Быстрое добавление сервиса',
    services: 'Сервисы',
    addEmptyService: '+ Добавить пустой сервис',
    serviceName: 'имя_сервиса',
    remove: 'Удалить',
    image: 'Образ',
    restartPolicy: 'Политика перезапуска',
    ports: 'Порты (через запятую, напр. 3000:3000, 8080:80)',
    volumes: 'Тома (через запятую)',
    dependsOn: 'Зависит от (имена сервисов через запятую)',
    none: 'нет',
    always: 'всегда',
    unlessStopped: 'если не остановлен',
    onFailure: 'при ошибке'
  },
  ar: {
    quickAddService: 'إضافة خدمة سريعة',
    services: 'الخدمات',
    addEmptyService: '+ إضافة خدمة فارغة',
    serviceName: 'اسم_الخدمة',
    remove: 'إزالة',
    image: 'الصورة',
    restartPolicy: 'سياسة إعادة التشغيل',
    ports: 'المنافذ (مفصولة بفواصل، مثال: 3000:3000, 8080:80)',
    volumes: 'وحدات التخزين (مفصولة بفواصل)',
    dependsOn: 'يعتمد على (أسماء الخدمات مفصولة بفواصل)',
    none: 'لا شيء',
    always: 'دائماً',
    unlessStopped: 'ما لم يتم الإيقاف',
    onFailure: 'عند الفشل'
  }
};

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add docker-compose-generator-advanced translations
  if (!data.tools['docker-compose-generator-advanced']) {
    data.tools['docker-compose-generator-advanced'] = {};
  }
  
  // Merge translations
  Object.assign(data.tools['docker-compose-generator-advanced'], translations[locale]);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated ${locale}.json with docker-compose-generator-advanced translations`);
});

console.log('\nDone! Run: npx tsx scripts/split-translations.ts');
