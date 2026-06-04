import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
const messagesDir = path.join(process.cwd(), 'src', 'messages');

const translations = {
  en: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Invoice Number",
        currency: "Currency",
        invoiceDate: "Invoice Date",
        dueDate: "Due Date",
        from: "From",
        to: "To",
        companyName: "Company Name",
        clientName: "Client Name",
        address: "Address",
        items: "Items",
        description: "Description",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        amount: "Amount",
        addItem: "Add Item",
        taxRate: "Tax Rate",
        discountRate: "Discount Rate",
        notes: "Notes",
        downloadPdf: "Download PDF",
        invoice: "INVOICE",
        subtotal: "Subtotal",
        discount: "Discount",
        tax: "Tax",
        total: "Total"
      }
    },
    'resume-builder': {
      personalInfo: "Personal Information",
      summary: "Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      addExperience: "Add Experience",
      addEducation: "Add Education",
      addSkill: "Add Skill",
      addLanguage: "Add Language",
      exportPDF: "Export PDF",
      company: "Company",
      position: "Position",
      startDate: "Start Date",
      endDate: "End Date",
      jobDescription: "Job Description",
      school: "School / University",
      degree: "Degree",
      fieldOfStudy: "Field of Study",
      graduationDate: "Graduation Date",
      gpa: "GPA",
      present: "Present",
      editTab: "Edit",
      previewTab: "Preview",
      accentColor: "Theme Color",
      noSkills: "No skills added yet.",
      summaryPlaceholder: "Briefly describe your professional background and key achievements...",
      langLevels: {
        native: "Native",
        fluent: "Fluent",
        advanced: "Advanced",
        intermediate: "Intermediate",
        basic: "Basic"
      },
      templates: {
        professional: "Professional",
        minimal: "Minimalist",
        creative: "Creative"
      },
      placeholders: {
        name: "Your Name",
        title: "Professional Title",
        email: "email@example.com",
        phone: "+1 234 567 890",
        location: "City, Country",
        website: "portfolio.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Pen Color",
        penWidth: "Pen Width",
        backgroundColor: "Background Color",
        transparent: "Transparent Background",
        clear: "Clear",
        downloadPng: "Download PNG",
        downloadSvg: "Download SVG",
        undo: "Undo"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Work",
        shortBreak: "Short Break",
        longBreak: "Long Break",
        start: "Start",
        pause: "Pause",
        reset: "Reset",
        skip: "Skip",
        completedSessions: "Completed Sessions",
        showSettings: "Show Settings",
        hideSettings: "Hide Settings",
        settings: "Timer Settings",
        workDuration: "Work Duration",
        shortBreakDuration: "Short Break Duration",
        longBreakDuration: "Long Break Duration",
        sessionsBeforeLongBreak: "Sessions before Long Break",
        soundNotification: "Sound Notification",
        minutes: "minutes",
        clear: "Reset"
      }
    }
  },
  zh: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "发票号码",
        currency: "货币类型",
        invoiceDate: "开票日期",
        dueDate: "付款截止",
        from: "发件人 (开票方)",
        to: "收件人 (付款方)",
        companyName: "公司/个人名称",
        clientName: "客户名称",
        address: "地址信息",
        items: "收费明细项目",
        description: "项目描述",
        quantity: "数量",
        unitPrice: "单价",
        amount: "金额",
        addItem: "添加新项目",
        taxRate: "税率",
        discountRate: "折扣率",
        notes: "备注说明",
        downloadPdf: "下载发票 PDF",
        invoice: "发票",
        subtotal: "小计金额",
        discount: "折扣减免",
        tax: "税额",
        total: "最终应付总计"
      }
    },
    'resume-builder': {
      personalInfo: "个人基本信息",
      summary: "个人简介 / 评价",
      experience: "工作与项目经历",
      education: "教育背景",
      skills: "专业技能",
      languages: "语言能力",
      addExperience: "添加工作经历",
      addEducation: "添加教育经历",
      addSkill: "添加专业技能",
      addLanguage: "添加熟练语言",
      exportPDF: "导出简历 PDF",
      company: "公司/组织名称",
      position: "担任职位",
      startDate: "开始时间",
      endDate: "结束时间",
      jobDescription: "工作/职责描述",
      school: "毕业学校/院系",
      degree: "获得学位",
      fieldOfStudy: "所学专业",
      graduationDate: "毕业时间",
      gpa: "绩点/GPA",
      present: "至今",
      editTab: "编辑内容",
      previewTab: "实时预览",
      accentColor: "主题色调",
      noSkills: "暂未添加技能。",
      summaryPlaceholder: "简要介绍您的职业背景、核心优势和主要成就...",
      langLevels: {
        native: "母语",
        fluent: "精通",
        advanced: "熟练",
        intermediate: "中级",
        basic: "基础"
      },
      templates: {
        professional: "经典专业",
        minimal: "极简现代",
        creative: "创意活力"
      },
      placeholders: {
        name: "您的名字",
        title: "求职意向 / 职业头衔",
        email: "email@example.com",
        phone: "138-xxxx-xxxx",
        location: "城市, 国家",
        website: "个人网站 / 社交账号"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "画笔颜色",
        penWidth: "粗细大小",
        backgroundColor: "背景颜色",
        transparent: "透明背景",
        clear: "清除全部",
        downloadPng: "下载 PNG",
        downloadSvg: "下载 SVG (矢量)",
        undo: "撤销 (Undo)"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "专注时间",
        shortBreak: "短时间休息",
        longBreak: "长时间休息",
        start: "开始",
        pause: "暂停",
        reset: "重置",
        skip: "跳过",
        completedSessions: "已完成番茄钟个数",
        showSettings: "显示设置面板",
        hideSettings: "隐藏设置面板",
        settings: "计时器参数设置",
        workDuration: "专注时长",
        shortBreakDuration: "短休时长",
        longBreakDuration: "长休时长",
        sessionsBeforeLongBreak: "长休间隔番茄数",
        soundNotification: "播放结束提示音",
        minutes: "分钟",
        clear: "清零"
      }
    }
  },
  es: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Número de factura",
        currency: "Moneda",
        invoiceDate: "Fecha de factura",
        dueDate: "Fecha de vencimiento",
        from: "De",
        to: "Para",
        companyName: "Nombre de la empresa",
        clientName: "Nombre del cliente",
        address: "Dirección",
        items: "Artículos",
        description: "Descripción",
        quantity: "Cantidad",
        unitPrice: "Precio unitario",
        amount: "Monto",
        addItem: "Añadir artículo",
        taxRate: "Tasa de impuesto",
        discountRate: "Tasa de descuento",
        notes: "Notas",
        downloadPdf: "Descargar PDF",
        invoice: "FACTURA",
        subtotal: "Subtotal",
        discount: "Descuento",
        tax: "Impuesto",
        total: "Total"
      }
    },
    'resume-builder': {
      personalInfo: "Información Personal",
      summary: "Resumen",
      experience: "Experiencia Laboral",
      education: "Educación",
      skills: "Habilidades",
      languages: "Idiomas",
      addExperience: "Añadir Experiencia",
      addEducation: "Añadir Educación",
      addSkill: "Añadir Habilidad",
      addLanguage: "Añadir Idioma",
      exportPDF: "Exportar PDF",
      company: "Empresa",
      position: "Puesto",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Finalización",
      jobDescription: "Descripción del puesto",
      school: "Escuela / Universidad",
      degree: "Título",
      fieldOfStudy: "Campo de Estudio",
      graduationDate: "Fecha de Graduación",
      gpa: "GPA",
      present: "Presente",
      editTab: "Editar",
      previewTab: "Vista Previa",
      accentColor: "Color de Tema",
      noSkills: "Aún no se han añadido habilidades.",
      summaryPlaceholder: "Describa brevemente su trayectoria profesional y logros clave...",
      langLevels: {
        native: "Nativo",
        fluent: "Fluido",
        advanced: "Avanzado",
        intermediate: "Intermedio",
        basic: "Básico"
      },
      templates: {
        professional: "Profesional",
        minimal: "Minimalista",
        creative: "Creativo"
      },
      placeholders: {
        name: "Su Nombre",
        title: "Título Profesional",
        email: "correo@ejemplo.com",
        phone: "+34 123 456 789",
        location: "Ciudad, País",
        website: "web.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Color del lápiz",
        penWidth: "Grosor del lápiz",
        backgroundColor: "Color de fondo",
        transparent: "Fondo transparente",
        clear: "Borrar",
        downloadPng: "Descargar PNG",
        downloadSvg: "Descargar SVG",
        undo: "Deshacer"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Sesión de Trabajo",
        shortBreak: "Descanso Corto",
        longBreak: "Descanso Largo",
        start: "Iniciar",
        pause: "Pausar",
        reset: "Reiniciar",
        skip: "Omitir",
        completedSessions: "Sesiones Completadas",
        showSettings: "Mostrar Ajustes",
        hideSettings: "Ocultar Ajustes",
        settings: "Ajustes del Temporizador",
        workDuration: "Duración del Trabajo",
        shortBreakDuration: "Duración del Descanso Corto",
        longBreakDuration: "Duración del Descanso Largo",
        sessionsBeforeLongBreak: "Sesiones antes del Descanso Largo",
        soundNotification: "Notificación de Sonido",
        minutes: "minutos",
        clear: "Reiniciar"
      }
    }
  },
  pt: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Número da Fatura",
        currency: "Moeda",
        invoiceDate: "Data da Fatura",
        dueDate: "Data de Vencimento",
        from: "De",
        to: "Para",
        companyName: "Nome da Empresa",
        clientName: "Nome do Cliente",
        address: "Endereço",
        items: "Itens",
        description: "Descrição",
        quantity: "Quantidade",
        unitPrice: "Preço Unitário",
        amount: "Valor",
        addItem: "Adicionar Item",
        taxRate: "Alíquota de Imposto",
        discountRate: "Taxa de Desconto",
        notes: "Notas",
        downloadPdf: "Baixar PDF",
        invoice: "FATURA",
        subtotal: "Subtotal",
        discount: "Desconto",
        tax: "Imposto",
        total: "Total"
      }
    },
    'resume-builder': {
      personalInfo: "Informações Pessoais",
      summary: "Resumo",
      experience: "Experiência Profissional",
      education: "Educação",
      skills: "Habilidades",
      languages: "Idiomas",
      addExperience: "Adicionar Experiência",
      addEducation: "Adicionar Educação",
      addSkill: "Adicionar Habilidade",
      addLanguage: "Adicionar Idioma",
      exportPDF: "Exportar PDF",
      company: "Empresa",
      position: "Cargo",
      startDate: "Data de Início",
      endDate: "Data de Término",
      jobDescription: "Descrição do cargo",
      school: "Escola / Universidade",
      degree: "Diploma",
      fieldOfStudy: "Área de Estudo",
      graduationDate: "Data de Graduação",
      gpa: "GPA",
      present: "Presente",
      editTab: "Editar",
      previewTab: "Visualizar",
      accentColor: "Cor do Tema",
      noSkills: "Nenhuma habilidade adicionada ainda.",
      summaryPlaceholder: "Descreva brevemente sua trajetória profissional e principais conquistas...",
      langLevels: {
        native: "Nativo",
        fluent: "Fluente",
        advanced: "Avançado",
        intermediate: "Intermediário",
        basic: "Básico"
      },
      templates: {
        professional: "Profissional",
        minimal: "Minimalista",
        creative: "Criativo"
      },
      placeholders: {
        name: "Seu Nome",
        title: "Título Profissional",
        email: "email@exemplo.com",
        phone: "+55 11 98765-4321",
        location: "Cidade, País",
        website: "site.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Cor da caneta",
        penWidth: "Espessura da caneta",
        backgroundColor: "Cor de fundo",
        transparent: "Fundo transparente",
        clear: "Limpar",
        downloadPng: "Baixar PNG",
        downloadSvg: "Baixar SVG",
        undo: "Desfazer"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Sessão de Trabalho",
        shortBreak: "Pausa Curta",
        longBreak: "Pausa Longa",
        start: "Iniciar",
        pause: "Pausar",
        reset: "Reiniciar",
        skip: "Pular",
        completedSessions: "Sessões Concluídas",
        showSettings: "Mostrar Configurações",
        hideSettings: "Ocultar Configurações",
        settings: "Configurações do Temporizador",
        workDuration: "Duração do Trabalho",
        shortBreakDuration: "Duração da Pausa Curta",
        longBreakDuration: "Duração da Pausa Longa",
        sessionsBeforeLongBreak: "Sessões antes da Pausa Longa",
        soundNotification: "Notificação Sonora",
        minutes: "minutos",
        clear: "Reiniciar"
      }
    }
  },
  ja: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "請求書番号",
        currency: "通貨",
        invoiceDate: "請求日",
        dueDate: "支払期日",
        from: "差出人",
        to: "受取人",
        companyName: "会社名",
        clientName: "顧客名",
        address: "住所",
        items: "品目",
        description: "説明",
        quantity: "数量",
        unitPrice: "単価",
        amount: "金額",
        addItem: "項目を追加",
        taxRate: "税率",
        discountRate: "割引率",
        notes: "備考",
        downloadPdf: "PDFをダウンロード",
        invoice: "請求書",
        subtotal: "小計",
        discount: "割引",
        tax: "税金",
        total: "合計"
      }
    },
    'resume-builder': {
      personalInfo: "個人情報",
      summary: "プロフィール",
      experience: "職歴",
      education: "学歴",
      skills: "スキル",
      languages: "言語",
      addExperience: "職歴を追加",
      addEducation: "学歴を追加",
      addSkill: "スキルを追加",
      addLanguage: "言語を追加",
      exportPDF: "PDFをエクスポート",
      company: "企業名",
      position: "役職",
      startDate: "開始日",
      endDate: "終了日",
      jobDescription: "業務内容",
      school: "学校名 / 大学名",
      degree: "学位",
      fieldOfStudy: "専攻分野",
      graduationDate: "卒業日",
      gpa: "GPA",
      present: "現在",
      editTab: "編集",
      previewTab: "プレビュー",
      accentColor: "テーマカラー",
      noSkills: "スキルはまだ追加されていません。",
      summaryPlaceholder: "経歴や主な実績などを簡潔に説明してください...",
      langLevels: {
        native: "ネイティブ",
        fluent: "流暢",
        advanced: "上級",
        intermediate: "中級",
        basic: "初級"
      },
      templates: {
        professional: "プロフェッショナル",
        minimal: "ミニマル",
        creative: "クリエイティブ"
      },
      placeholders: {
        name: "お名前",
        title: "職種 / 肩書",
        email: "email@example.com",
        phone: "090-xxxx-xxxx",
        location: "市区町村, 国",
        website: "portfolio.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "ペンの色",
        penWidth: "ペンの太さ",
        backgroundColor: "背景色",
        transparent: "背景を透明にする",
        clear: "クリア",
        downloadPng: "PNGをダウンロード",
        downloadSvg: "SVGをダウンロード",
        undo: "元に戻す"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "作業セッション",
        shortBreak: "短い休憩",
        longBreak: "長い休憩",
        start: "スタート",
        pause: "一時停止",
        reset: "リセット",
        skip: "スキップ",
        completedSessions: "完了したセッション数",
        showSettings: "設定を表示",
        hideSettings: "設定を非表示",
        settings: "タイマー設定",
        workDuration: "作業時間",
        shortBreakDuration: "短い休憩時間",
        longBreakDuration: "長い休憩時間",
        sessionsBeforeLongBreak: "長い休憩までのセッション数",
        soundNotification: "効果音通知",
        minutes: "分",
        clear: "リセット"
      }
    }
  },
  ru: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Номер счета",
        currency: "Валюта",
        invoiceDate: "Дата счета",
        dueDate: "Срок оплаты",
        from: "От кого",
        to: "Кому",
        companyName: "Название компании",
        clientName: "Имя клиента",
        address: "Адрес",
        items: "Позиции",
        description: "Описание",
        quantity: "Кол-во",
        unitPrice: "Цена за ед.",
        amount: "Сумма",
        addItem: "Добавить позицию",
        taxRate: "Налоговая ставка",
        discountRate: "Скидка (%)",
        notes: "Заметки",
        downloadPdf: "Скачать PDF",
        invoice: "СЧЕТ-ФАКТУРА",
        subtotal: "Промежуточный итог",
        discount: "Скидка",
        tax: "Налог",
        total: "Итого"
      }
    },
    'resume-builder': {
      personalInfo: "Личная Информация",
      summary: "О себе",
      experience: "Опыт Работы",
      education: "Образование",
      skills: "Навыки",
      languages: "Языки",
      addExperience: "Добавить Опыт",
      addEducation: "Добавить Образование",
      addSkill: "Добавить Навык",
      addLanguage: "Добавить Язык",
      exportPDF: "Экспорт в PDF",
      company: "Компания",
      position: "Должность",
      startDate: "Дата Начала",
      endDate: "Дата Окончания",
      jobDescription: "Обязанности и достижения",
      school: "Школа / Университет",
      degree: "Степень / Диплом",
      fieldOfStudy: "Специальность",
      graduationDate: "Дата Окончания",
      gpa: "Средний балл (GPA)",
      present: "По настоящее время",
      editTab: "Редактировать",
      previewTab: "Просмотр",
      accentColor: "Цвет Темы",
      noSkills: "Навыки еще не добавлены.",
      summaryPlaceholder: "Кратко опишите ваш профессиональный опыт и ключевые достижения...",
      langLevels: {
        native: "Родной",
        fluent: "В совершенстве",
        advanced: "Продвинутый",
        intermediate: "Средний",
        basic: "Базовый"
      },
      templates: {
        professional: "Профессиональный",
        minimal: "Минималистичный",
        creative: "Креативный"
      },
      placeholders: {
        name: "Ваше Имя",
        title: "Должность / Специализация",
        email: "email@example.com",
        phone: "+7 999 123-45-67",
        location: "Город, Страна",
        website: "linkedin.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Цвет ручки",
        penWidth: "Толщина линии",
        backgroundColor: "Цвет фона",
        transparent: "Прозрачный фон",
        clear: "Очистить",
        downloadPng: "Скачать PNG",
        downloadSvg: "Скачать SVG",
        undo: "Отменить"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Работа",
        shortBreak: "Короткий перерыв",
        longBreak: "Длинный перерыв",
        start: "Старт",
        pause: "Пауза",
        reset: "Сброс",
        skip: "Пропустить",
        completedSessions: "Завершено сессий",
        showSettings: "Показать настройки",
        hideSettings: "Скрыть настройки",
        settings: "Настройки таймера",
        workDuration: "Время работы",
        shortBreakDuration: "Время короткого перерыва",
        longBreakDuration: "Время длинного перерыва",
        sessionsBeforeLongBreak: "Сессий до длинного перерыва",
        soundNotification: "Звуковое уведомление",
        minutes: "минут",
        clear: "Сброс"
      }
    }
  },
  fr: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Numéro de facture",
        currency: "Devise",
        invoiceDate: "Date de facture",
        dueDate: "Date d'échéance",
        from: "De",
        to: "À",
        companyName: "Nom de l'entreprise",
        clientName: "Nom du client",
        address: "Adresse",
        items: "Articles",
        description: "Description",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        amount: "Montant",
        addItem: "Ajouter un article",
        taxRate: "Taux de taxe",
        discountRate: "Taux de remise",
        notes: "Notes",
        downloadPdf: "Télécharger PDF",
        invoice: "FACTURE",
        subtotal: "Sous-total",
        discount: "Remise",
        tax: "Taxe",
        total: "Total"
      }
    },
    'resume-builder': {
      personalInfo: "Informations Personnelles",
      summary: "Résumé",
      experience: "Expérience Professionnelle",
      education: "Éducation",
      skills: "Compétences",
      languages: "Langues",
      addExperience: "Ajouter une Expérience",
      addEducation: "Ajouter une Formation",
      addSkill: "Ajouter une Compétence",
      addLanguage: "Ajouter une Langue",
      exportPDF: "Exporter en PDF",
      company: "Entreprise",
      position: "Poste",
      startDate: "Date de Début",
      endDate: "Date de Fin",
      jobDescription: "Description du poste",
      school: "École / Université",
      degree: "Diplôme",
      fieldOfStudy: "Domaine d'Études",
      graduationDate: "Date de Diplôme",
      gpa: "GPA",
      present: "Présent",
      editTab: "Modifier",
      previewTab: "Aperçu",
      accentColor: "Couleur du Thème",
      noSkills: "Aucune compétence ajoutée pour le moment.",
      summaryPlaceholder: "Décrivez brièvement votre parcours professionnel et vos réalisations clés...",
      langLevels: {
        native: "Langue maternelle",
        fluent: "Courant",
        advanced: "Avancé",
        intermediate: "Intermédiaire",
        basic: "Débutant"
      },
      templates: {
        professional: "Professionnel",
        minimal: "Minimaliste",
        creative: "Créatif"
      },
      placeholders: {
        name: "Votre Nom",
        title: "Titre Professionnel",
        email: "email@exemple.com",
        phone: "+33 6 12 34 56 78",
        location: "Ville, Pays",
        website: "site.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Couleur du stylo",
        penWidth: "Épaisseur du stylo",
        backgroundColor: "Couleur de fond",
        transparent: "Fond transparent",
        clear: "Effacer",
        downloadPng: "Télécharger PNG",
        downloadSvg: "Télécharger SVG",
        undo: "Annuler"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Session de Travail",
        shortBreak: "Pause Courte",
        longBreak: "Pause Longa",
        start: "Démarrer",
        pause: "Pause",
        reset: "Réinitialiser",
        skip: "Passer",
        completedSessions: "Sessions Terminées",
        showSettings: "Afficher les Réglages",
        hideSettings: "Masquer les Réglages",
        settings: "Réglages du Minuteur",
        workDuration: "Durée du Travail",
        shortBreakDuration: "Durée de la Pause Courte",
        longBreakDuration: "Durée de la Pause Longue",
        sessionsBeforeLongBreak: "Sessions avant Pause Longe",
        soundNotification: "Notification Sonore",
        minutes: "minutes",
        clear: "Réinitialiser"
      }
    }
  },
  ar: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "رقم الفاتورة",
        currency: "العملة",
        invoiceDate: "تاريخ الفاتورة",
        dueDate: "تاريخ الاستحقاق",
        from: "من",
        to: "إلى",
        companyName: "اسم الشركة",
        clientName: "اسم العميل",
        address: "العنوان",
        items: "العناصر",
        description: "الوصف",
        quantity: "الكمية",
        unitPrice: "سعر الوحدة",
        amount: "المبلغ",
        addItem: "إضافة عنصر",
        taxRate: "نسبة الضريبة",
        discountRate: "نسبة الخصم",
        notes: "ملاحظات",
        downloadPdf: "تحميل PDF",
        invoice: "فاتورة",
        subtotal: "المجموع الفرعي",
        discount: "الخصم",
        tax: "الضريبة",
        total: "الإجمالي"
      }
    },
    'resume-builder': {
      personalInfo: "معلومات شخصية",
      summary: "الملخص",
      experience: "الخبرة المهنية",
      education: "التعليم",
      skills: "المهارات",
      languages: "اللغات",
      addExperience: "إضافة خبرة",
      addEducation: "إضافة تعليم",
      addSkill: "إضافة مهارة",
      addLanguage: "إضافة لغة",
      exportPDF: "تصدير PDF",
      company: "الشركة",
      position: "المنصب",
      startDate: "تاريخ البدء",
      endDate: "تاريخ الانتهاء",
      jobDescription: "الوصف الوظيفي",
      school: "المدرسة / الجامعة",
      degree: "الشهادة",
      fieldOfStudy: "مجال الدراسة",
      graduationDate: "تاريخ التخرج",
      gpa: "المعدل التراكمي",
      present: "الحالي",
      editTab: "تعديل",
      previewTab: "معاينة",
      accentColor: "لون المظهر",
      noSkills: "لم يتم إضافة مهارات بعد.",
      summaryPlaceholder: "صف بإيجاز خلفيتك المهنية وإنجازاتك الرئيسية...",
      langLevels: {
        native: "اللغة الأم",
        fluent: "طلاقة",
        advanced: "متقدم",
        intermediate: "متوسط",
        basic: "مبتدئ"
      },
      templates: {
        professional: "مهني",
        minimal: "بسيط",
        creative: "إبداعي"
      },
      placeholders: {
        name: "اسمك الكامل",
        title: "المسمى الوظيفي",
        email: "email@example.com",
        phone: "+966 50 123 4567",
        location: "المدينة، الدولة",
        website: "portfolio.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "لون القلم",
        penWidth: "سمك القلم",
        backgroundColor: "لون الخلفية",
        transparent: "خلفية شفافة",
        clear: "مسح",
        downloadPng: "تحميل PNG",
        downloadSvg: "تحميل SVG",
        undo: "تراجع"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "جلسة العمل",
        shortBreak: "استراحة قصيرة",
        longBreak: "استراحة طويلة",
        start: "بدء",
        pause: "إيقاف مؤقت",
        reset: "إعادة ضبط",
        skip: "تخطي",
        completedSessions: "الجلسات المكتملة",
        showSettings: "إظهار الإعدادات",
        hideSettings: "إخفاء الإعدادات",
        settings: "إعدادات المؤقت",
        workDuration: "مدة العمل",
        shortBreakDuration: "مدة الاستراحة القصيرة",
        longBreakDuration: "مدة الاستراحة الطويلة",
        sessionsBeforeLongBreak: "الجلسات قبل الاستراحة الطويلة",
        soundNotification: "تنبيه صوتي",
        minutes: "دقائق",
        clear: "إعادة ضبط"
      }
    }
  },
  de: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "Rechnungsnummer",
        currency: "Währung",
        invoiceDate: "Rechnungsdatum",
        dueDate: "Fälligkeitsdatum",
        from: "Von",
        to: "An",
        companyName: "Firmenname",
        clientName: "Kundenname",
        address: "Adresse",
        items: "Artikel",
        description: "Beschreibung",
        quantity: "Menge",
        unitPrice: "Einzelpreis",
        amount: "Betrag",
        addItem: "Artikel hinzufügen",
        taxRate: "Steuersatz",
        discountRate: "Rabattsatz",
        notes: "Notizen",
        downloadPdf: "PDF herunterladen",
        invoice: "RECHNUNG",
        subtotal: "Zwischensumme",
        discount: "Rabatt",
        tax: "Steuer",
        total: "Gesamtsumme"
      }
    },
    'resume-builder': {
      personalInfo: "Persönliche Informationen",
      summary: "Zusammenfassung",
      experience: "Berufserfahrung",
      education: "Ausbildung",
      skills: "Fähigkeiten",
      languages: "Sprachen",
      addExperience: "Erfahrung hinzufügen",
      addEducation: "Ausbildung hinzufügen",
      addSkill: "Fähigkeit hinzufügen",
      addLanguage: "Sprache hinzufügen",
      exportPDF: "PDF exportieren",
      company: "Unternehmen",
      position: "Position",
      startDate: "Startdatum",
      endDate: "Enddatum",
      jobDescription: "Stellenbeschreibung",
      school: "Schule / Universität",
      degree: "Abschluss",
      fieldOfStudy: "Studienrichtung",
      graduationDate: "Abschlussdatum",
      gpa: "GPA",
      present: "Heute",
      editTab: "Bearbeiten",
      previewTab: "Vorschau",
      accentColor: "Themenfarbe",
      noSkills: "Noch keine Fähigkeiten hinzugefügt.",
      summaryPlaceholder: "Beschreiben Sie kurz Ihren beruflichen Hintergrund und Ihre wichtigsten Erfolge...",
      langLevels: {
        native: "Muttersprache",
        fluent: "Fließend",
        advanced: "Fortgeschritten",
        intermediate: "Mittelstufe",
        basic: "Grundkenntnisse"
      },
      templates: {
        professional: "Professionell",
        minimal: "Minimalist",
        creative: "Kreativ"
      },
      placeholders: {
        name: "Ihr Name",
        title: "Berufsbezeichnung",
        email: "email@example.com",
        phone: "+49 170 1234567",
        location: "Stadt, Land",
        website: "portfolio.de"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "Stiftfarbe",
        penWidth: "Stiftbreite",
        backgroundColor: "Hintergrundfarbe",
        transparent: "Transparenter Hintergrund",
        clear: "Löschen",
        downloadPng: "PNG herunterladen",
        downloadSvg: "SVG herunterladen",
        undo: "Rückgängig"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "Arbeitssitzung",
        shortBreak: "Kurze Pause",
        longBreak: "Lange Pause",
        start: "Start",
        pause: "Pause",
        reset: "Zurücksetzen",
        skip: "Überspringen",
        completedSessions: "Abgeschlossene Sitzungen",
        showSettings: "Einstellungen anzeigen",
        hideSettings: "Einstellungen ausblenden",
        settings: "Timer-Einstellungen",
        workDuration: "Arbeitsdauer",
        shortBreakDuration: "Kurze Pausendauer",
        longBreakDuration: "Lange Pausendauer",
        sessionsBeforeLongBreak: "Sitzungen vor langer Pause",
        soundNotification: "Tonbenachrichtigung",
        minutes: "Minuten",
        clear: "Zurücksetzen"
      }
    }
  },
  ko: {
    'invoice-generator': {
      invoice: {
        invoiceNumber: "송장 번호",
        currency: "통화",
        invoiceDate: "발행일",
        dueDate: "납부 기한",
        from: "보내는 사람",
        to: "받는 사람",
        companyName: "회사명",
        clientName: "고객명",
        address: "주소",
        items: "항목 목록",
        description: "상세 설명",
        quantity: "수량",
        unitPrice: "단가",
        amount: "금액",
        addItem: "항목 추가",
        taxRate: "세율",
        discountRate: "할인율",
        notes: "비고",
        downloadPdf: "PDF 다운로드",
        invoice: "인보이스 (송장)",
        subtotal: "소계",
        discount: "할인",
        tax: "세금",
        total: "합계"
      }
    },
    'resume-builder': {
      personalInfo: "개인 정보",
      summary: "자기소개",
      experience: "경력 사항",
      education: "학력 사항",
      skills: "보유 기술",
      languages: "외국어 능력",
      addExperience: "경력 추가",
      addEducation: "학력 추가",
      addSkill: "기술 추가",
      addLanguage: "언어 추가",
      exportPDF: "PDF 내보내기",
      company: "회사명",
      position: "직책 / 역할",
      startDate: "시작일",
      endDate: "종료일",
      jobDescription: "주요 업무 및 성과",
      school: "학교명 / 대학명",
      degree: "학위",
      fieldOfStudy: "전공",
      graduationDate: "졸업일",
      gpa: "학점 (GPA)",
      present: "재직 중",
      editTab: "편집",
      previewTab: "미리보기",
      accentColor: "테마 색상",
      noSkills: "추가된 기술이 없습니다.",
      summaryPlaceholder: "전문적인 배경과 주요 성과를 간략히 설명하세요...",
      langLevels: {
        native: "모국어",
        fluent: "유창함",
        advanced: "능숙함",
        intermediate: "중급",
        basic: "기초"
      },
      templates: {
        professional: "전문적인 스타일",
        minimal: "미니멀 스타일",
        creative: "크리에이티브 스타일"
      },
      placeholders: {
        name: "이름",
        title: "희망 직무 / 직함",
        email: "email@example.com",
        phone: "010-xxxx-xxxx",
        location: "도시, 국가",
        website: "portfolio.com"
      }
    },
    'signature-pad': {
      signature: {
        penColor: "펜 색상",
        penWidth: "펜 두께",
        backgroundColor: "배경 색상",
        transparent: "투명 배경",
        clear: "지우기",
        downloadPng: "PNG 다운로드",
        downloadSvg: "SVG 다운로드",
        undo: "되돌리기 (Undo)"
      }
    },
    'pomodoro-timer': {
      pomodoro: {
        work: "집중 시간",
        shortBreak: "짧은 휴식",
        longBreak: "긴 휴식",
        start: "시작",
        pause: "일시정지",
        reset: "초기화",
        skip: "건너뛰기",
        completedSessions: "완료한 뽀모도로 수",
        showSettings: "설정 표시",
        hideSettings: "설정 숨기기",
        settings: "타이머 설정",
        workDuration: "집중 시간 설정",
        shortBreakDuration: "짧은 휴식 설정",
        longBreakDuration: "긴 휴식 설정",
        sessionsBeforeLongBreak: "긴 휴식 간격",
        soundNotification: "완료 알림음 재생",
        minutes: "분",
        clear: "초기화"
      }
    }
  }
};

async function main() {
  for (const locale of LOCALES) {
    for (const [slug, transData] of Object.entries(translations[locale] || {})) {
      const filePath = path.join(messagesDir, locale, 'tools', `${slug}.json`);
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File not found for locale ${locale}, slug ${slug}: ${filePath}`);
        continue;
      }
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(fileContent);
        
        // Merge the translation keys into the JSON
        // Keeping existing meta fields (like detailed_description, usage_steps, etc.)
        for (const [key, val] of Object.entries(transData)) {
          json[key] = val;
        }
        
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
        console.log(`Successfully updated ${locale}/tools/${slug}.json`);
      } catch (err) {
        console.error(`Error updating ${locale}/tools/${slug}.json:`, err);
      }
    }
  }
  console.log("Translation injection finished.");
}

main().catch(err => {
  console.error("Fatal error running translation script:", err);
  process.exit(1);
});
