/**
 * 为 git-commit-message-generator 添加 UI 翻译键
 */
const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');

// UI 翻译内容
const UI_TRANSLATIONS = {
  en: {
    commitType: "Commit Type",
    scope: "Scope (optional)",
    scopePlaceholder: "e.g., api, ui, auth",
    subject: "Subject",
    subjectPlaceholder: "Short description of the change",
    subjectHint: "Use imperative mood: \"add feature\" not \"added feature\"",
    body: "Body (optional)",
    bodyPlaceholder: "Detailed description of the change...",
    breakingChange: "Breaking Change",
    breakingDescription: "Breaking Change Description",
    breakingPlaceholder: "Describe what breaks and how to migrate...",
    relatedIssues: "Related Issues (optional)",
    issuesPlaceholder: "#123, #456 or issue URLs",
    generatedMessage: "Generated Commit Message",
    emptyMessage: "Enter a subject to generate commit message",
    formatTitle: "Conventional Commits Format",
    types: {
      feat: "A new feature",
      fix: "A bug fix",
      docs: "Documentation only changes",
      style: "Code style changes (formatting, etc)",
      refactor: "Code refactoring",
      perf: "Performance improvements",
      test: "Adding or updating tests",
      build: "Build system or dependencies",
      ci: "CI/CD configuration",
      chore: "Other changes",
      revert: "Revert a previous commit"
    }
  },
  zh: {
    commitType: "提交类型",
    scope: "范围（可选）",
    scopePlaceholder: "例如：api, ui, auth",
    subject: "主题",
    subjectPlaceholder: "简短描述更改内容",
    subjectHint: "使用祈使语气：\"添加功能\" 而不是 \"添加了功能\"",
    body: "正文（可选）",
    bodyPlaceholder: "详细描述更改内容...",
    breakingChange: "破坏性变更",
    breakingDescription: "破坏性变更描述",
    breakingPlaceholder: "描述什么会被破坏以及如何迁移...",
    relatedIssues: "相关问题（可选）",
    issuesPlaceholder: "#123, #456 或问题链接",
    generatedMessage: "生成的提交信息",
    emptyMessage: "输入主题以生成提交信息",
    formatTitle: "常规提交格式",
    types: {
      feat: "新功能",
      fix: "修复 Bug",
      docs: "仅文档更改",
      style: "代码风格更改（格式化等）",
      refactor: "代码重构",
      perf: "性能优化",
      test: "添加或更新测试",
      build: "构建系统或依赖",
      ci: "CI/CD 配置",
      chore: "其他更改",
      revert: "回滚之前的提交"
    }
  },
  ja: {
    commitType: "コミットタイプ",
    scope: "スコープ（任意）",
    scopePlaceholder: "例：api, ui, auth",
    subject: "件名",
    subjectPlaceholder: "変更の簡単な説明",
    subjectHint: "命令形を使用：「機能を追加」ではなく「機能追加」",
    body: "本文（任意）",
    bodyPlaceholder: "変更の詳細な説明...",
    breakingChange: "破壊的変更",
    breakingDescription: "破壊的変更の説明",
    breakingPlaceholder: "何が壊れるか、移行方法を説明...",
    relatedIssues: "関連Issue（任意）",
    issuesPlaceholder: "#123, #456 またはIssue URL",
    generatedMessage: "生成されたコミットメッセージ",
    emptyMessage: "件名を入力してコミットメッセージを生成",
    formatTitle: "Conventional Commits形式",
    types: {
      feat: "新機能",
      fix: "バグ修正",
      docs: "ドキュメントのみの変更",
      style: "コードスタイルの変更（フォーマットなど）",
      refactor: "コードリファクタリング",
      perf: "パフォーマンス改善",
      test: "テストの追加・更新",
      build: "ビルドシステムまたは依存関係",
      ci: "CI/CD設定",
      chore: "その他の変更",
      revert: "以前のコミットを取り消し"
    }
  },
  ko: {
    commitType: "커밋 유형",
    scope: "범위 (선택)",
    scopePlaceholder: "예: api, ui, auth",
    subject: "제목",
    subjectPlaceholder: "변경 사항에 대한 간단한 설명",
    subjectHint: "명령형 사용: \"기능 추가됨\"이 아닌 \"기능 추가\"",
    body: "본문 (선택)",
    bodyPlaceholder: "변경 사항에 대한 자세한 설명...",
    breakingChange: "주요 변경 사항",
    breakingDescription: "주요 변경 사항 설명",
    breakingPlaceholder: "무엇이 깨지고 마이그레이션 방법 설명...",
    relatedIssues: "관련 이슈 (선택)",
    issuesPlaceholder: "#123, #456 또는 이슈 URL",
    generatedMessage: "생성된 커밋 메시지",
    emptyMessage: "제목을 입력하여 커밋 메시지 생성",
    formatTitle: "Conventional Commits 형식",
    types: {
      feat: "새로운 기능",
      fix: "버그 수정",
      docs: "문서만 변경",
      style: "코드 스타일 변경 (포맷팅 등)",
      refactor: "코드 리팩토링",
      perf: "성능 개선",
      test: "테스트 추가 또는 업데이트",
      build: "빌드 시스템 또는 종속성",
      ci: "CI/CD 구성",
      chore: "기타 변경",
      revert: "이전 커밋 되돌리기"
    }
  },
  es: {
    commitType: "Tipo de Commit",
    scope: "Alcance (opcional)",
    scopePlaceholder: "ej., api, ui, auth",
    subject: "Asunto",
    subjectPlaceholder: "Descripción breve del cambio",
    subjectHint: "Usa modo imperativo: \"agregar función\" no \"agregó función\"",
    body: "Cuerpo (opcional)",
    bodyPlaceholder: "Descripción detallada del cambio...",
    breakingChange: "Cambio Importante",
    breakingDescription: "Descripción del Cambio Importante",
    breakingPlaceholder: "Describe qué se rompe y cómo migrar...",
    relatedIssues: "Issues Relacionados (opcional)",
    issuesPlaceholder: "#123, #456 o URLs de issues",
    generatedMessage: "Mensaje de Commit Generado",
    emptyMessage: "Ingresa un asunto para generar el mensaje",
    formatTitle: "Formato Conventional Commits",
    types: {
      feat: "Una nueva característica",
      fix: "Corrección de error",
      docs: "Solo cambios en documentación",
      style: "Cambios de estilo de código (formato, etc)",
      refactor: "Refactorización de código",
      perf: "Mejoras de rendimiento",
      test: "Agregar o actualizar pruebas",
      build: "Sistema de compilación o dependencias",
      ci: "Configuración CI/CD",
      chore: "Otros cambios",
      revert: "Revertir un commit anterior"
    }
  },
  pt: {
    commitType: "Tipo de Commit",
    scope: "Escopo (opcional)",
    scopePlaceholder: "ex., api, ui, auth",
    subject: "Assunto",
    subjectPlaceholder: "Descrição breve da mudança",
    subjectHint: "Use modo imperativo: \"adicionar recurso\" não \"adicionou recurso\"",
    body: "Corpo (opcional)",
    bodyPlaceholder: "Descrição detalhada da mudança...",
    breakingChange: "Mudança Importante",
    breakingDescription: "Descrição da Mudança Importante",
    breakingPlaceholder: "Descreva o que quebra e como migrar...",
    relatedIssues: "Issues Relacionadas (opcional)",
    issuesPlaceholder: "#123, #456 ou URLs de issues",
    generatedMessage: "Mensagem de Commit Gerada",
    emptyMessage: "Digite um assunto para gerar a mensagem",
    formatTitle: "Formato Conventional Commits",
    types: {
      feat: "Um novo recurso",
      fix: "Correção de bug",
      docs: "Apenas mudanças na documentação",
      style: "Mudanças de estilo de código (formatação, etc)",
      refactor: "Refatoração de código",
      perf: "Melhorias de desempenho",
      test: "Adicionar ou atualizar testes",
      build: "Sistema de build ou dependências",
      ci: "Configuração CI/CD",
      chore: "Outras mudanças",
      revert: "Reverter um commit anterior"
    }
  },
  fr: {
    commitType: "Type de Commit",
    scope: "Portée (optionnel)",
    scopePlaceholder: "ex., api, ui, auth",
    subject: "Sujet",
    subjectPlaceholder: "Description courte du changement",
    subjectHint: "Utilisez l'impératif : \"ajouter fonction\" pas \"ajouté fonction\"",
    body: "Corps (optionnel)",
    bodyPlaceholder: "Description détaillée du changement...",
    breakingChange: "Changement Majeur",
    breakingDescription: "Description du Changement Majeur",
    breakingPlaceholder: "Décrivez ce qui casse et comment migrer...",
    relatedIssues: "Issues Liées (optionnel)",
    issuesPlaceholder: "#123, #456 ou URLs d'issues",
    generatedMessage: "Message de Commit Généré",
    emptyMessage: "Entrez un sujet pour générer le message",
    formatTitle: "Format Conventional Commits",
    types: {
      feat: "Une nouvelle fonctionnalité",
      fix: "Correction de bug",
      docs: "Changements de documentation uniquement",
      style: "Changements de style de code (formatage, etc)",
      refactor: "Refactorisation de code",
      perf: "Améliorations de performance",
      test: "Ajout ou mise à jour de tests",
      build: "Système de build ou dépendances",
      ci: "Configuration CI/CD",
      chore: "Autres changements",
      revert: "Annuler un commit précédent"
    }
  },
  de: {
    commitType: "Commit-Typ",
    scope: "Bereich (optional)",
    scopePlaceholder: "z.B., api, ui, auth",
    subject: "Betreff",
    subjectPlaceholder: "Kurze Beschreibung der Änderung",
    subjectHint: "Imperativ verwenden: \"Funktion hinzufügen\" nicht \"Funktion hinzugefügt\"",
    body: "Text (optional)",
    bodyPlaceholder: "Detaillierte Beschreibung der Änderung...",
    breakingChange: "Breaking Change",
    breakingDescription: "Breaking Change Beschreibung",
    breakingPlaceholder: "Beschreiben Sie was bricht und wie migriert wird...",
    relatedIssues: "Verwandte Issues (optional)",
    issuesPlaceholder: "#123, #456 oder Issue-URLs",
    generatedMessage: "Generierte Commit-Nachricht",
    emptyMessage: "Betreff eingeben um Nachricht zu generieren",
    formatTitle: "Conventional Commits Format",
    types: {
      feat: "Ein neues Feature",
      fix: "Eine Fehlerbehebung",
      docs: "Nur Dokumentationsänderungen",
      style: "Code-Stil-Änderungen (Formatierung, etc)",
      refactor: "Code-Refactoring",
      perf: "Performance-Verbesserungen",
      test: "Tests hinzufügen oder aktualisieren",
      build: "Build-System oder Abhängigkeiten",
      ci: "CI/CD-Konfiguration",
      chore: "Andere Änderungen",
      revert: "Einen vorherigen Commit rückgängig machen"
    }
  },
  ru: {
    commitType: "Тип коммита",
    scope: "Область (необязательно)",
    scopePlaceholder: "напр., api, ui, auth",
    subject: "Тема",
    subjectPlaceholder: "Краткое описание изменения",
    subjectHint: "Используйте повелительное наклонение: \"добавить функцию\" а не \"добавлена функция\"",
    body: "Тело (необязательно)",
    bodyPlaceholder: "Подробное описание изменения...",
    breakingChange: "Критическое изменение",
    breakingDescription: "Описание критического изменения",
    breakingPlaceholder: "Опишите что ломается и как мигрировать...",
    relatedIssues: "Связанные задачи (необязательно)",
    issuesPlaceholder: "#123, #456 или URL задач",
    generatedMessage: "Сгенерированное сообщение коммита",
    emptyMessage: "Введите тему для генерации сообщения",
    formatTitle: "Формат Conventional Commits",
    types: {
      feat: "Новая функция",
      fix: "Исправление ошибки",
      docs: "Только изменения документации",
      style: "Изменения стиля кода (форматирование и т.д.)",
      refactor: "Рефакторинг кода",
      perf: "Улучшения производительности",
      test: "Добавление или обновление тестов",
      build: "Система сборки или зависимости",
      ci: "Конфигурация CI/CD",
      chore: "Другие изменения",
      revert: "Отмена предыдущего коммита"
    }
  },
  ar: {
    commitType: "نوع الالتزام",
    scope: "النطاق (اختياري)",
    scopePlaceholder: "مثال: api, ui, auth",
    subject: "الموضوع",
    subjectPlaceholder: "وصف قصير للتغيير",
    subjectHint: "استخدم صيغة الأمر: \"إضافة ميزة\" وليس \"تمت إضافة ميزة\"",
    body: "المحتوى (اختياري)",
    bodyPlaceholder: "وصف تفصيلي للتغيير...",
    breakingChange: "تغيير جذري",
    breakingDescription: "وصف التغيير الجذري",
    breakingPlaceholder: "صف ما سيتعطل وكيفية الترحيل...",
    relatedIssues: "المشاكل ذات الصلة (اختياري)",
    issuesPlaceholder: "#123, #456 أو روابط المشاكل",
    generatedMessage: "رسالة الالتزام المُنشأة",
    emptyMessage: "أدخل موضوعاً لإنشاء رسالة الالتزام",
    formatTitle: "تنسيق Conventional Commits",
    types: {
      feat: "ميزة جديدة",
      fix: "إصلاح خطأ",
      docs: "تغييرات في التوثيق فقط",
      style: "تغييرات نمط الكود (التنسيق، إلخ)",
      refactor: "إعادة هيكلة الكود",
      perf: "تحسينات الأداء",
      test: "إضافة أو تحديث الاختبارات",
      build: "نظام البناء أو التبعيات",
      ci: "تكوين CI/CD",
      chore: "تغييرات أخرى",
      revert: "التراجع عن التزام سابق"
    }
  }
};

// 更新翻译文件
function updateTranslations() {
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
  
  for (const locale of locales) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // 获取 git-commit-message-generator 的翻译
      if (data.tools && data.tools['git-commit-message-generator']) {
        // 合并 UI 翻译
        const uiTranslations = UI_TRANSLATIONS[locale] || UI_TRANSLATIONS.en;
        Object.assign(data.tools['git-commit-message-generator'], uiTranslations);
        
        // 写回文件
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✓ ${locale}.json 已更新`);
      } else {
        console.log(`✗ ${locale}.json 中未找到 git-commit-message-generator`);
      }
    } catch (error) {
      console.error(`✗ 处理 ${locale}.json 时出错:`, error.message);
    }
  }
}

updateTranslations();
console.log('\n完成！请运行 npx tsx scripts/split-translations.ts 更新拆分文件');
