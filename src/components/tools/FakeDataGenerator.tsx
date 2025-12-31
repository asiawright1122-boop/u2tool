'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type FieldType = 'name' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'company' | 'jobTitle' | 'date' | 'number' | 'uuid' | 'url' | 'username';

interface Field {
  id: string;
  name: string;
  type: FieldType;
}

// Localized field names for each language (for database column names)
const FIELD_NAMES: Record<string, Record<FieldType, string>> = {
  en: { name: 'name', firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone', address: 'address', city: 'city', country: 'country', company: 'company', jobTitle: 'job_title', date: 'date', number: 'number', uuid: 'uuid', url: 'url', username: 'username' },
  zh: { name: '姓名', firstName: '名', lastName: '姓', email: '邮箱', phone: '电话', address: '地址', city: '城市', country: '国家', company: '公司', jobTitle: '职位', date: '日期', number: '数字', uuid: 'uuid', url: '网址', username: '用户名' },
  ja: { name: '氏名', firstName: '名', lastName: '姓', email: 'メール', phone: '電話', address: '住所', city: '都市', country: '国', company: '会社', jobTitle: '役職', date: '日付', number: '番号', uuid: 'uuid', url: 'URL', username: 'ユーザー名' },
  ko: { name: '이름', firstName: '이름', lastName: '성', email: '이메일', phone: '전화', address: '주소', city: '도시', country: '국가', company: '회사', jobTitle: '직책', date: '날짜', number: '숫자', uuid: 'uuid', url: 'URL', username: '사용자명' },
  es: { name: 'nombre', firstName: 'nombre', lastName: 'apellido', email: 'correo', phone: 'teléfono', address: 'dirección', city: 'ciudad', country: 'país', company: 'empresa', jobTitle: 'cargo', date: 'fecha', number: 'número', uuid: 'uuid', url: 'url', username: 'usuario' },
  pt: { name: 'nome', firstName: 'nome', lastName: 'sobrenome', email: 'email', phone: 'telefone', address: 'endereço', city: 'cidade', country: 'país', company: 'empresa', jobTitle: 'cargo', date: 'data', number: 'número', uuid: 'uuid', url: 'url', username: 'usuário' },
  fr: { name: 'nom', firstName: 'prénom', lastName: 'nom', email: 'email', phone: 'téléphone', address: 'adresse', city: 'ville', country: 'pays', company: 'entreprise', jobTitle: 'poste', date: 'date', number: 'numéro', uuid: 'uuid', url: 'url', username: 'utilisateur' },
  de: { name: 'Name', firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail', phone: 'Telefon', address: 'Adresse', city: 'Stadt', country: 'Land', company: 'Firma', jobTitle: 'Position', date: 'Datum', number: 'Nummer', uuid: 'UUID', url: 'URL', username: 'Benutzername' },
  ru: { name: 'имя', firstName: 'имя', lastName: 'фамилия', email: 'почта', phone: 'телефон', address: 'адрес', city: 'город', country: 'страна', company: 'компания', jobTitle: 'должность', date: 'дата', number: 'номер', uuid: 'uuid', url: 'url', username: 'пользователь' },
  ar: { name: 'الاسم', firstName: 'الاسم', lastName: 'اللقب', email: 'البريد', phone: 'الهاتف', address: 'العنوان', city: 'المدينة', country: 'البلد', company: 'الشركة', jobTitle: 'المنصب', date: 'التاريخ', number: 'الرقم', uuid: 'uuid', url: 'الرابط', username: 'المستخدم' },
};

// Localized type display names for dropdown (more user-friendly)
const TYPE_DISPLAY_NAMES: Record<string, Record<FieldType, string>> = {
  en: { name: 'Full Name', firstName: 'First Name', lastName: 'Last Name', email: 'Email', phone: 'Phone', address: 'Address', city: 'City', country: 'Country', company: 'Company', jobTitle: 'Job Title', date: 'Date', number: 'Number', uuid: 'UUID', url: 'URL', username: 'Username' },
  zh: { name: '全名', firstName: '名', lastName: '姓', email: '邮箱', phone: '电话', address: '地址', city: '城市', country: '国家', company: '公司', jobTitle: '职位', date: '日期', number: '数字', uuid: 'UUID', url: '网址', username: '用户名' },
  ja: { name: '氏名', firstName: '名', lastName: '姓', email: 'メール', phone: '電話', address: '住所', city: '都市', country: '国', company: '会社', jobTitle: '役職', date: '日付', number: '番号', uuid: 'UUID', url: 'URL', username: 'ユーザー名' },
  ko: { name: '전체 이름', firstName: '이름', lastName: '성', email: '이메일', phone: '전화', address: '주소', city: '도시', country: '국가', company: '회사', jobTitle: '직책', date: '날짜', number: '숫자', uuid: 'UUID', url: 'URL', username: '사용자명' },
  es: { name: 'Nombre Completo', firstName: 'Nombre', lastName: 'Apellido', email: 'Correo', phone: 'Teléfono', address: 'Dirección', city: 'Ciudad', country: 'País', company: 'Empresa', jobTitle: 'Cargo', date: 'Fecha', number: 'Número', uuid: 'UUID', url: 'URL', username: 'Usuario' },
  pt: { name: 'Nome Completo', firstName: 'Nome', lastName: 'Sobrenome', email: 'Email', phone: 'Telefone', address: 'Endereço', city: 'Cidade', country: 'País', company: 'Empresa', jobTitle: 'Cargo', date: 'Data', number: 'Número', uuid: 'UUID', url: 'URL', username: 'Usuário' },
  fr: { name: 'Nom Complet', firstName: 'Prénom', lastName: 'Nom', email: 'Email', phone: 'Téléphone', address: 'Adresse', city: 'Ville', country: 'Pays', company: 'Entreprise', jobTitle: 'Poste', date: 'Date', number: 'Numéro', uuid: 'UUID', url: 'URL', username: 'Utilisateur' },
  de: { name: 'Vollständiger Name', firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail', phone: 'Telefon', address: 'Adresse', city: 'Stadt', country: 'Land', company: 'Firma', jobTitle: 'Position', date: 'Datum', number: 'Nummer', uuid: 'UUID', url: 'URL', username: 'Benutzername' },
  ru: { name: 'Полное имя', firstName: 'Имя', lastName: 'Фамилия', email: 'Почта', phone: 'Телефон', address: 'Адрес', city: 'Город', country: 'Страна', company: 'Компания', jobTitle: 'Должность', date: 'Дата', number: 'Номер', uuid: 'UUID', url: 'URL', username: 'Пользователь' },
  ar: { name: 'الاسم الكامل', firstName: 'الاسم الأول', lastName: 'اللقب', email: 'البريد الإلكتروني', phone: 'الهاتف', address: 'العنوان', city: 'المدينة', country: 'البلد', company: 'الشركة', jobTitle: 'المنصب', date: 'التاريخ', number: 'الرقم', uuid: 'UUID', url: 'الرابط', username: 'اسم المستخدم' },
};

// Phone formats by locale
const PHONE_FORMATS: Record<string, string> = {
  en: '+1-XXX-XXX-XXXX',
  zh: '+86-1XX-XXXX-XXXX',
  ja: '+81-XX-XXXX-XXXX',
  ko: '+82-10-XXXX-XXXX',
  es: '+34-XXX-XXX-XXX',
  pt: '+55-XX-XXXXX-XXXX',
  fr: '+33-X-XX-XX-XX-XX',
  de: '+49-XXX-XXXXXXX',
  ru: '+7-XXX-XXX-XX-XX',
  ar: '+966-5X-XXX-XXXX',
};

// Name data by locale
const FIRST_NAMES: Record<string, string[]> = {
  en: ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'],
  zh: ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋'],
  ja: ['太郎', '花子', '一郎', '美咲', '健太', '愛', '翔太', '結衣', '大輝', '陽菜'],
  ko: ['민준', '서연', '예준', '서윤', '도윤', '지우', '시우', '하윤', '준서', '지민'],
  es: ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa', 'Antonio', 'Isabel'],
  pt: ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Paulo', 'Fernanda', 'José', 'Mariana'],
  fr: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Isabelle', 'François', 'Claire', 'Nicolas', 'Camille'],
  de: ['Hans', 'Anna', 'Peter', 'Maria', 'Klaus', 'Ursula', 'Wolfgang', 'Helga', 'Thomas', 'Sabine'],
  ru: ['Иван', 'Мария', 'Александр', 'Анна', 'Дмитрий', 'Елена', 'Сергей', 'Ольга', 'Андрей', 'Наталья'],
  ar: ['محمد', 'فاطمة', 'أحمد', 'عائشة', 'علي', 'زينب', 'عمر', 'مريم', 'خالد', 'نور'],
};

const LAST_NAMES: Record<string, string[]> = {
  en: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'],
  zh: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'],
  ja: ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'],
  ko: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'],
  es: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'],
  pt: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'],
  fr: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'],
  de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
  ru: ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Федоров'],
  ar: ['الأحمد', 'المحمد', 'العلي', 'الحسن', 'الخالد', 'السعيد', 'الناصر', 'الرشيد', 'العمري', 'الصالح'],
};

const CITIES: Record<string, string[]> = {
  en: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Boston'],
  zh: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'],
  ja: ['東京', '大阪', '名古屋', '札幌', '福岡', '京都', '横浜', '神戸'],
  ko: ['서울', '부산', '인천', '대구', '대전', '광주', '수원', '울산'],
  es: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia'],
  pt: ['São Paulo', 'Rio de Janeiro', 'Lisboa', 'Porto', 'Brasília', 'Salvador', 'Curitiba', 'Recife'],
  fr: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Lille', 'Nantes'],
  de: ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf', 'Dresden'],
  ru: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Сочи', 'Нижний Новгород', 'Самара'],
  ar: ['القاهرة', 'دبي', 'الرياض', 'جدة', 'بيروت', 'عمان', 'الدوحة', 'الكويت'],
};

const COUNTRIES: Record<string, string[]> = {
  en: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'],
  zh: ['中国', '美国', '日本', '韩国', '英国', '德国'],
  ja: ['日本', 'アメリカ', '中国', '韓国', 'イギリス', 'ドイツ'],
  ko: ['한국', '미국', '일본', '중국', '영국', '독일'],
  es: ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú'],
  pt: ['Brasil', 'Portugal', 'Angola', 'Moçambique', 'Cabo Verde', 'Guiné-Bissau'],
  fr: ['France', 'Canada', 'Belgique', 'Suisse', 'Maroc', 'Algérie'],
  de: ['Deutschland', 'Österreich', 'Schweiz', 'Luxemburg', 'Liechtenstein', 'Belgien'],
  ru: ['Россия', 'Украина', 'Беларусь', 'Казахстан', 'Узбекистан', 'Грузия'],
  ar: ['مصر', 'السعودية', 'الإمارات', 'الأردن', 'لبنان', 'المغرب'],
};

// Helper function to get random item from array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Simple fake data generators
const generators: Record<FieldType, (locale: string) => string> = {
  name: (locale) => {
    const first = FIRST_NAMES[locale] || FIRST_NAMES.en;
    const last = LAST_NAMES[locale] || LAST_NAMES.en;
    // For CJK languages (Chinese, Japanese, Korean), put last name first
    if (['zh', 'ja', 'ko'].includes(locale)) {
      return `${randomItem(last)}${randomItem(first)}`;
    }
    return `${randomItem(first)} ${randomItem(last)}`;
  },
  firstName: (locale) => randomItem(FIRST_NAMES[locale] || FIRST_NAMES.en),
  lastName: (locale) => randomItem(LAST_NAMES[locale] || LAST_NAMES.en),
  email: () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com'];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';
    for (let i = 0; i < 8; i++) name += chars[Math.floor(Math.random() * chars.length)];
    return `${name}@${randomItem(domains)}`;
  },
  phone: (locale) => {
    const format = PHONE_FORMATS[locale] || PHONE_FORMATS.en;
    return format.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
  },
  address: (locale) => {
    const streets: Record<string, string[]> = {
      en: ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Cedar Ln'],
      zh: ['中山路', '人民路', '解放路', '建设路', '和平路'],
      ja: ['本町', '中央通り', '駅前通り', '大通り', '桜通り'],
      ko: ['중앙로', '대학로', '역삼로', '강남대로', '테헤란로'],
      es: ['Calle Mayor', 'Avenida Principal', 'Paseo del Prado', 'Gran Vía'],
      pt: ['Rua Principal', 'Avenida Brasil', 'Rua das Flores', 'Avenida Paulista'],
      fr: ['Rue Principale', 'Avenue des Champs', 'Boulevard Saint-Michel', 'Rue de la Paix'],
      de: ['Hauptstraße', 'Bahnhofstraße', 'Berliner Straße', 'Gartenstraße'],
      ru: ['Главная улица', 'Проспект Мира', 'Улица Ленина', 'Невский проспект'],
      ar: ['شارع الملك', 'شارع الجمهورية', 'شارع النصر', 'شارع التحرير'],
    };
    const num = Math.floor(Math.random() * 999) + 1;
    const street = randomItem(streets[locale] || streets.en);
    if (['zh', 'ja', 'ko'].includes(locale)) return `${street}${num}号`;
    return `${num} ${street}`;
  },
  city: (locale) => randomItem(CITIES[locale] || CITIES.en),
  country: (locale) => randomItem(COUNTRIES[locale] || COUNTRIES.en),
  company: (locale) => {
    const prefixes: Record<string, string[]> = {
      en: ['Global', 'Tech', 'Digital', 'Smart', 'Future', 'Prime'],
      zh: ['华为', '腾讯', '阿里', '百度', '京东', '字节'],
      ja: ['東京', 'グローバル', 'テック', 'デジタル', 'スマート'],
      ko: ['삼성', '현대', 'LG', 'SK', '롯데', '한화'],
      es: ['Global', 'Tech', 'Digital', 'Ibérica', 'Hispana'],
      pt: ['Brasil', 'Global', 'Tech', 'Digital', 'Sul'],
      fr: ['France', 'Euro', 'Tech', 'Digital', 'Global'],
      de: ['Deutsche', 'Euro', 'Tech', 'Digital', 'Global'],
      ru: ['Рос', 'Тех', 'Глобал', 'Дигитал', 'Смарт'],
      ar: ['العربية', 'التقنية', 'الرقمية', 'العالمية', 'المستقبل'],
    };
    const suffixes: Record<string, string[]> = {
      en: ['Corp', 'Inc', 'Ltd', 'Solutions', 'Systems'],
      zh: ['科技', '集团', '有限公司', '股份', '控股'],
      ja: ['株式会社', 'テクノロジー', 'ソリューションズ'],
      ko: ['그룹', '테크', '솔루션즈', '시스템즈'],
      es: ['S.A.', 'S.L.', 'Soluciones', 'Sistemas'],
      pt: ['S.A.', 'Ltda', 'Soluções', 'Sistemas'],
      fr: ['S.A.', 'SARL', 'Solutions', 'Systèmes'],
      de: ['GmbH', 'AG', 'Lösungen', 'Systeme'],
      ru: ['ООО', 'АО', 'Решения', 'Системы'],
      ar: ['للتقنية', 'للحلول', 'للأنظمة', 'المحدودة'],
    };
    return `${randomItem(prefixes[locale] || prefixes.en)} ${randomItem(suffixes[locale] || suffixes.en)}`;
  },
  jobTitle: (locale) => {
    const titles: Record<string, string[]> = {
      en: ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'Marketing Manager'],
      zh: ['软件工程师', '产品经理', '设计师', '数据分析师', '市场经理'],
      ja: ['ソフトウェアエンジニア', 'プロダクトマネージャー', 'デザイナー', 'データアナリスト'],
      ko: ['소프트웨어 엔지니어', '제품 관리자', '디자이너', '데이터 분석가'],
      es: ['Ingeniero de Software', 'Gerente de Producto', 'Diseñador', 'Analista de Datos'],
      pt: ['Engenheiro de Software', 'Gerente de Produto', 'Designer', 'Analista de Dados'],
      fr: ['Ingénieur Logiciel', 'Chef de Produit', 'Designer', 'Analyste de Données'],
      de: ['Software-Ingenieur', 'Produktmanager', 'Designer', 'Datenanalyst'],
      ru: ['Программист', 'Менеджер продукта', 'Дизайнер', 'Аналитик данных'],
      ar: ['مهندس برمجيات', 'مدير منتج', 'مصمم', 'محلل بيانات'],
    };
    return randomItem(titles[locale] || titles.en);
  },
  date: () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  },
  number: () => Math.floor(Math.random() * 10000).toString(),
  uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  }),
  url: () => {
    const domains = ['example.com', 'test.org', 'sample.net', 'demo.io'];
    const paths = ['page', 'article', 'post', 'item', 'product'];
    return `https://${randomItem(domains)}/${randomItem(paths)}/${Math.floor(Math.random() * 1000)}`;
  },
  username: () => {
    const adjectives = ['cool', 'super', 'mega', 'ultra', 'pro', 'epic'];
    const nouns = ['user', 'coder', 'dev', 'ninja', 'guru', 'master'];
    return `${randomItem(adjectives)}_${randomItem(nouns)}${Math.floor(Math.random() * 1000)}`;
  },
};

const FIELD_TYPES: FieldType[] = ['name', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'company', 'jobTitle', 'date', 'number', 'uuid', 'url', 'username'];

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
];

export default function FakeDataGenerator() {
  const t = useTranslations('tools.fake-data-generator');
  const tg = useTranslations('tools');
  
  const [count, setCount] = useState(10);
  const [locale, setLocale] = useState('en');
  const [fields, setFields] = useState<Field[]>([
    { id: '1', name: 'name', type: 'name' },
    { id: '2', name: 'email', type: 'email' },
    { id: '3', name: 'phone', type: 'phone' },
  ]);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [tableName, setTableName] = useState('users');
  const [copied, setCopied] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null);

  // Update field names when locale changes
  useEffect(() => {
    const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
    setFields(prev => prev.map(f => ({ ...f, name: fieldNames[f.type] || f.name })));
  }, [locale]);

  const addField = () => {
    const id = Date.now().toString();
    const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
    setFields([...fields, { id, name: fieldNames.name, type: 'name' }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      // If type changes, update name to match the new type
      if (updates.type && updates.type !== f.type) {
        const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
        return { ...f, ...updates, name: fieldNames[updates.type] };
      }
      return { ...f, ...updates };
    }));
  };

  const handleGenerate = useCallback(() => {
    const generated: Record<string, string>[] = [];
    for (let i = 0; i < count; i++) {
      const record: Record<string, string> = {};
      for (const field of fields) {
        record[field.name] = generators[field.type](locale);
      }
      generated.push(record);
    }
    setData(generated);
  }, [count, locale, fields]);

  const handleClear = () => setData([]);

  // Update a single cell value
  const updateCell = (rowIndex: number, fieldName: string, value: string) => {
    setData(prev => prev.map((row, idx) => 
      idx === rowIndex ? { ...row, [fieldName]: value } : row
    ));
  };

  const exportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSql = () => {
    if (data.length === 0) return;
    const columns = Object.keys(data[0]);
    const values = data.map(row => {
      const vals = columns.map(c => `'${row[c].replace(/'/g, "''")}'`);
      return `(${vals.join(', ')})`;
    });
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')})\nVALUES\n${values.join(',\n')};`;
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Section - Two columns with equal width */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('count')}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('locale')}
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {LOCALES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fields Configuration */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fields')}
          </label>
          <button
            onClick={addField}
            className="text-sm px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            {t('addField')}
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-2 gap-2 items-center">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                placeholder={t('fieldName')}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="flex gap-2">
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                  className="flex-1 h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {FIELD_TYPES.map(type => (
                    <option key={type} value={type}>{(TYPE_DISPLAY_NAMES[locale] || TYPE_DISPLAY_NAMES.en)[type]}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeField(field.id)}
                  className="h-10 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg whitespace-nowrap"
                  disabled={fields.length <= 1}
                >
                  {t('removeField')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Name for SQL Export */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tableName')} (SQL)
        </label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleGenerate} className="btn-primary">
          {t('generate')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Results Section */}
      {data.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')} ({data.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`text-sm px-3 py-1 rounded ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {copied ? tg('copied') : tg('copy')}
              </button>
              <button
                onClick={exportJson}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportJson')}
              </button>
              <button
                onClick={exportCsv}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportCsv')}
              </button>
              <button
                onClick={exportSql}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportSql')}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">#</th>
                  {fields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.slice(0, 20).map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{index + 1}</td>
                    {fields.map(field => (
                      <td key={field.id} className="px-1 py-1">
                        {editingCell?.row === index && editingCell?.field === field.name ? (
                          <input
                            type="text"
                            value={row[field.name]}
                            onChange={(e) => updateCell(index, field.name, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            autoFocus
                            className="w-full px-2 py-1 border border-blue-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <div
                            onClick={() => setEditingCell({ row: index, field: field.name })}
                            className="px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
                            title={t('clickToEdit')}
                          >
                            {row[field.name]}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 20 && (
              <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                ... and {data.length - 20} more rows
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
