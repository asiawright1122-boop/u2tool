// Name generator data
// Contains first names and last names from various cultures

export interface NameData {
  firstName: string;
  gender: 'male' | 'female' | 'neutral';
  origin: string;
}

export interface LastNameData {
  lastName: string;
  origin: string;
}

// First names by gender and origin
export const firstNames: NameData[] = [
  // English/American names - Male
  { firstName: 'James', gender: 'male', origin: 'english' },
  { firstName: 'William', gender: 'male', origin: 'english' },
  { firstName: 'Oliver', gender: 'male', origin: 'english' },
  { firstName: 'Benjamin', gender: 'male', origin: 'english' },
  { firstName: 'Lucas', gender: 'male', origin: 'english' },
  { firstName: 'Henry', gender: 'male', origin: 'english' },
  { firstName: 'Alexander', gender: 'male', origin: 'english' },
  { firstName: 'Sebastian', gender: 'male', origin: 'english' },
  { firstName: 'Jack', gender: 'male', origin: 'english' },
  { firstName: 'Daniel', gender: 'male', origin: 'english' },
  { firstName: 'Michael', gender: 'male', origin: 'english' },
  { firstName: 'Ethan', gender: 'male', origin: 'english' },
  { firstName: 'Noah', gender: 'male', origin: 'english' },
  { firstName: 'Liam', gender: 'male', origin: 'english' },
  { firstName: 'Mason', gender: 'male', origin: 'english' },
  
  // English/American names - Female
  { firstName: 'Emma', gender: 'female', origin: 'english' },
  { firstName: 'Olivia', gender: 'female', origin: 'english' },
  { firstName: 'Ava', gender: 'female', origin: 'english' },
  { firstName: 'Sophia', gender: 'female', origin: 'english' },
  { firstName: 'Isabella', gender: 'female', origin: 'english' },
  { firstName: 'Charlotte', gender: 'female', origin: 'english' },
  { firstName: 'Amelia', gender: 'female', origin: 'english' },
  { firstName: 'Mia', gender: 'female', origin: 'english' },
  { firstName: 'Harper', gender: 'female', origin: 'english' },
  { firstName: 'Evelyn', gender: 'female', origin: 'english' },
  { firstName: 'Abigail', gender: 'female', origin: 'english' },
  { firstName: 'Emily', gender: 'female', origin: 'english' },
  { firstName: 'Elizabeth', gender: 'female', origin: 'english' },
  { firstName: 'Sofia', gender: 'female', origin: 'english' },
  { firstName: 'Ella', gender: 'female', origin: 'english' },
  
  // Spanish names - Male
  { firstName: 'Santiago', gender: 'male', origin: 'spanish' },
  { firstName: 'Mateo', gender: 'male', origin: 'spanish' },
  { firstName: 'Diego', gender: 'male', origin: 'spanish' },
  { firstName: 'Carlos', gender: 'male', origin: 'spanish' },
  { firstName: 'Miguel', gender: 'male', origin: 'spanish' },
  { firstName: 'Alejandro', gender: 'male', origin: 'spanish' },
  { firstName: 'Pablo', gender: 'male', origin: 'spanish' },
  { firstName: 'Javier', gender: 'male', origin: 'spanish' },
  
  // Spanish names - Female
  { firstName: 'Valentina', gender: 'female', origin: 'spanish' },
  { firstName: 'Camila', gender: 'female', origin: 'spanish' },
  { firstName: 'Lucia', gender: 'female', origin: 'spanish' },
  { firstName: 'Maria', gender: 'female', origin: 'spanish' },
  { firstName: 'Elena', gender: 'female', origin: 'spanish' },
  { firstName: 'Carmen', gender: 'female', origin: 'spanish' },
  { firstName: 'Rosa', gender: 'female', origin: 'spanish' },
  { firstName: 'Ana', gender: 'female', origin: 'spanish' },
  
  // French names - Male
  { firstName: 'Louis', gender: 'male', origin: 'french' },
  { firstName: 'Gabriel', gender: 'male', origin: 'french' },
  { firstName: 'Raphaël', gender: 'male', origin: 'french' },
  { firstName: 'Léo', gender: 'male', origin: 'french' },
  { firstName: 'Hugo', gender: 'male', origin: 'french' },
  { firstName: 'Jules', gender: 'male', origin: 'french' },
  { firstName: 'Arthur', gender: 'male', origin: 'french' },
  { firstName: 'Théo', gender: 'male', origin: 'french' },
  
  // French names - Female
  { firstName: 'Louise', gender: 'female', origin: 'french' },
  { firstName: 'Jade', gender: 'female', origin: 'french' },
  { firstName: 'Emma', gender: 'female', origin: 'french' },
  { firstName: 'Alice', gender: 'female', origin: 'french' },
  { firstName: 'Chloé', gender: 'female', origin: 'french' },
  { firstName: 'Léa', gender: 'female', origin: 'french' },
  { firstName: 'Manon', gender: 'female', origin: 'french' },
  { firstName: 'Inès', gender: 'female', origin: 'french' },
  
  // German names - Male
  { firstName: 'Felix', gender: 'male', origin: 'german' },
  { firstName: 'Paul', gender: 'male', origin: 'german' },
  { firstName: 'Leon', gender: 'male', origin: 'german' },
  { firstName: 'Finn', gender: 'male', origin: 'german' },
  { firstName: 'Elias', gender: 'male', origin: 'german' },
  { firstName: 'Jonas', gender: 'male', origin: 'german' },
  { firstName: 'Ben', gender: 'male', origin: 'german' },
  { firstName: 'Noah', gender: 'male', origin: 'german' },
  
  // German names - Female
  { firstName: 'Mia', gender: 'female', origin: 'german' },
  { firstName: 'Hannah', gender: 'female', origin: 'german' },
  { firstName: 'Emilia', gender: 'female', origin: 'german' },
  { firstName: 'Lina', gender: 'female', origin: 'german' },
  { firstName: 'Lea', gender: 'female', origin: 'german' },
  { firstName: 'Anna', gender: 'female', origin: 'german' },
  { firstName: 'Lena', gender: 'female', origin: 'german' },
  { firstName: 'Marie', gender: 'female', origin: 'german' },
  
  // Japanese names - Male (日本語)
  { firstName: '陽翔', gender: 'male', origin: 'japanese' },
  { firstName: '悠斗', gender: 'male', origin: 'japanese' },
  { firstName: '蒼太', gender: 'male', origin: 'japanese' },
  { firstName: '悠希', gender: 'male', origin: 'japanese' },
  { firstName: '隼人', gender: 'male', origin: 'japanese' },
  { firstName: '蓮', gender: 'male', origin: 'japanese' },
  { firstName: '海斗', gender: 'male', origin: 'japanese' },
  { firstName: '陸', gender: 'male', origin: 'japanese' },
  
  // Japanese names - Female (日本語)
  { firstName: '結衣', gender: 'female', origin: 'japanese' },
  { firstName: '陽菜', gender: 'female', origin: 'japanese' },
  { firstName: 'さくら', gender: 'female', origin: 'japanese' },
  { firstName: '葵', gender: 'female', origin: 'japanese' },
  { firstName: '芽依', gender: 'female', origin: 'japanese' },
  { firstName: '凛', gender: 'female', origin: 'japanese' },
  { firstName: '澪', gender: 'female', origin: 'japanese' },
  { firstName: '結菜', gender: 'female', origin: 'japanese' },
  
  // Chinese names - Male (中文)
  { firstName: '伟', gender: 'male', origin: 'chinese' },
  { firstName: '建', gender: 'male', origin: 'chinese' },
  { firstName: '明', gender: 'male', origin: 'chinese' },
  { firstName: '辰', gender: 'male', origin: 'chinese' },
  { firstName: '浩', gender: 'male', origin: 'chinese' },
  { firstName: '俊', gender: 'male', origin: 'chinese' },
  { firstName: '峰', gender: 'male', origin: 'chinese' },
  { firstName: '龙', gender: 'male', origin: 'chinese' },
  
  // Chinese names - Female (中文)
  { firstName: '美', gender: 'female', origin: 'chinese' },
  { firstName: '玲', gender: 'female', origin: 'chinese' },
  { firstName: '秀', gender: 'female', origin: 'chinese' },
  { firstName: '燕', gender: 'female', origin: 'chinese' },
  { firstName: '慧', gender: 'female', origin: 'chinese' },
  { firstName: '芳', gender: 'female', origin: 'chinese' },
  { firstName: '静', gender: 'female', origin: 'chinese' },
  { firstName: '丽', gender: 'female', origin: 'chinese' },
  
  // Korean names - Male (한국어)
  { firstName: '민준', gender: 'male', origin: 'korean' },
  { firstName: '서준', gender: 'male', origin: 'korean' },
  { firstName: '도윤', gender: 'male', origin: 'korean' },
  { firstName: '예준', gender: 'male', origin: 'korean' },
  { firstName: '시우', gender: 'male', origin: 'korean' },
  { firstName: '하준', gender: 'male', origin: 'korean' },
  { firstName: '지호', gender: 'male', origin: 'korean' },
  { firstName: '준서', gender: 'male', origin: 'korean' },
  
  // Korean names - Female (한국어)
  { firstName: '서연', gender: 'female', origin: 'korean' },
  { firstName: '하윤', gender: 'female', origin: 'korean' },
  { firstName: '지우', gender: 'female', origin: 'korean' },
  { firstName: '서윤', gender: 'female', origin: 'korean' },
  { firstName: '민서', gender: 'female', origin: 'korean' },
  { firstName: '하은', gender: 'female', origin: 'korean' },
  { firstName: '윤서', gender: 'female', origin: 'korean' },
  { firstName: '지유', gender: 'female', origin: 'korean' },
  
  // Gender neutral names
  { firstName: 'Alex', gender: 'neutral', origin: 'english' },
  { firstName: 'Jordan', gender: 'neutral', origin: 'english' },
  { firstName: 'Taylor', gender: 'neutral', origin: 'english' },
  { firstName: 'Morgan', gender: 'neutral', origin: 'english' },
  { firstName: 'Casey', gender: 'neutral', origin: 'english' },
  { firstName: 'Riley', gender: 'neutral', origin: 'english' },
  { firstName: 'Avery', gender: 'neutral', origin: 'english' },
  { firstName: 'Quinn', gender: 'neutral', origin: 'english' },
];

// Last names by origin
export const lastNames: LastNameData[] = [
  // English/American
  { lastName: 'Smith', origin: 'english' },
  { lastName: 'Johnson', origin: 'english' },
  { lastName: 'Williams', origin: 'english' },
  { lastName: 'Brown', origin: 'english' },
  { lastName: 'Jones', origin: 'english' },
  { lastName: 'Miller', origin: 'english' },
  { lastName: 'Davis', origin: 'english' },
  { lastName: 'Wilson', origin: 'english' },
  { lastName: 'Anderson', origin: 'english' },
  { lastName: 'Taylor', origin: 'english' },
  { lastName: 'Thomas', origin: 'english' },
  { lastName: 'Moore', origin: 'english' },
  { lastName: 'Jackson', origin: 'english' },
  { lastName: 'Martin', origin: 'english' },
  { lastName: 'Lee', origin: 'english' },
  
  // Spanish
  { lastName: 'García', origin: 'spanish' },
  { lastName: 'Rodríguez', origin: 'spanish' },
  { lastName: 'Martínez', origin: 'spanish' },
  { lastName: 'López', origin: 'spanish' },
  { lastName: 'González', origin: 'spanish' },
  { lastName: 'Hernández', origin: 'spanish' },
  { lastName: 'Pérez', origin: 'spanish' },
  { lastName: 'Sánchez', origin: 'spanish' },
  
  // French
  { lastName: 'Martin', origin: 'french' },
  { lastName: 'Bernard', origin: 'french' },
  { lastName: 'Dubois', origin: 'french' },
  { lastName: 'Thomas', origin: 'french' },
  { lastName: 'Robert', origin: 'french' },
  { lastName: 'Richard', origin: 'french' },
  { lastName: 'Petit', origin: 'french' },
  { lastName: 'Durand', origin: 'french' },
  
  // German
  { lastName: 'Müller', origin: 'german' },
  { lastName: 'Schmidt', origin: 'german' },
  { lastName: 'Schneider', origin: 'german' },
  { lastName: 'Fischer', origin: 'german' },
  { lastName: 'Weber', origin: 'german' },
  { lastName: 'Meyer', origin: 'german' },
  { lastName: 'Wagner', origin: 'german' },
  { lastName: 'Becker', origin: 'german' },
  
  // Japanese (日本語)
  { lastName: '佐藤', origin: 'japanese' },
  { lastName: '鈴木', origin: 'japanese' },
  { lastName: '高橋', origin: 'japanese' },
  { lastName: '田中', origin: 'japanese' },
  { lastName: '渡辺', origin: 'japanese' },
  { lastName: '伊藤', origin: 'japanese' },
  { lastName: '山本', origin: 'japanese' },
  { lastName: '中村', origin: 'japanese' },
  
  // Chinese (中文)
  { lastName: '王', origin: 'chinese' },
  { lastName: '李', origin: 'chinese' },
  { lastName: '张', origin: 'chinese' },
  { lastName: '刘', origin: 'chinese' },
  { lastName: '陈', origin: 'chinese' },
  { lastName: '杨', origin: 'chinese' },
  { lastName: '黄', origin: 'chinese' },
  { lastName: '赵', origin: 'chinese' },
  
  // Korean (한국어)
  { lastName: '김', origin: 'korean' },
  { lastName: '이', origin: 'korean' },
  { lastName: '박', origin: 'korean' },
  { lastName: '최', origin: 'korean' },
  { lastName: '정', origin: 'korean' },
  { lastName: '강', origin: 'korean' },
  { lastName: '조', origin: 'korean' },
  { lastName: '윤', origin: 'korean' },
];

export type Gender = 'male' | 'female' | 'neutral' | 'any';
export type Origin = 'english' | 'spanish' | 'french' | 'german' | 'japanese' | 'chinese' | 'korean' | 'any';

// Get random first name
export function getRandomFirstName(gender: Gender = 'any', origin: Origin = 'any'): string {
  let filtered = firstNames;
  
  if (gender !== 'any') {
    filtered = filtered.filter(n => n.gender === gender || n.gender === 'neutral');
  }
  
  if (origin !== 'any') {
    filtered = filtered.filter(n => n.origin === origin);
  }
  
  if (filtered.length === 0) {
    filtered = firstNames;
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)].firstName;
}

// Get random last name
export function getRandomLastName(origin: Origin = 'any'): string {
  let filtered = lastNames;
  
  if (origin !== 'any') {
    filtered = filtered.filter(n => n.origin === origin);
  }
  
  if (filtered.length === 0) {
    filtered = lastNames;
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)].lastName;
}

// Generate full name
export function generateFullName(gender: Gender = 'any', origin: Origin = 'any'): string {
  const firstName = getRandomFirstName(gender, origin);
  const lastName = getRandomLastName(origin);
  
  // For East Asian names (Chinese, Japanese, Korean), surname comes first
  if (origin === 'chinese' || origin === 'japanese' || origin === 'korean') {
    return `${lastName}${firstName}`;
  }
  
  return `${firstName} ${lastName}`;
}

// Generate multiple names
export function generateNames(
  count: number,
  gender: Gender = 'any',
  origin: Origin = 'any'
): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(generateFullName(gender, origin));
  }
  return names;
}

// Get available origins
export function getAvailableOrigins(): Origin[] {
  return ['english', 'spanish', 'french', 'german', 'japanese', 'chinese', 'korean', 'any'];
}

// Origin display names
export const originDisplayNames: Record<Origin, string> = {
  english: 'English/American',
  spanish: 'Spanish/Hispanic',
  french: 'French',
  german: 'German',
  japanese: 'Japanese',
  chinese: 'Chinese',
  korean: 'Korean',
  any: 'Any Origin',
};
