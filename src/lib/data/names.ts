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
  
  // Japanese names - Male
  { firstName: 'Haruto', gender: 'male', origin: 'japanese' },
  { firstName: 'Yuto', gender: 'male', origin: 'japanese' },
  { firstName: 'Sota', gender: 'male', origin: 'japanese' },
  { firstName: 'Yuki', gender: 'male', origin: 'japanese' },
  { firstName: 'Hayato', gender: 'male', origin: 'japanese' },
  { firstName: 'Ren', gender: 'male', origin: 'japanese' },
  { firstName: 'Kaito', gender: 'male', origin: 'japanese' },
  { firstName: 'Riku', gender: 'male', origin: 'japanese' },
  
  // Japanese names - Female
  { firstName: 'Yui', gender: 'female', origin: 'japanese' },
  { firstName: 'Hina', gender: 'female', origin: 'japanese' },
  { firstName: 'Sakura', gender: 'female', origin: 'japanese' },
  { firstName: 'Aoi', gender: 'female', origin: 'japanese' },
  { firstName: 'Mei', gender: 'female', origin: 'japanese' },
  { firstName: 'Rin', gender: 'female', origin: 'japanese' },
  { firstName: 'Mio', gender: 'female', origin: 'japanese' },
  { firstName: 'Yuna', gender: 'female', origin: 'japanese' },
  
  // Chinese names - Male
  { firstName: 'Wei', gender: 'male', origin: 'chinese' },
  { firstName: 'Jian', gender: 'male', origin: 'chinese' },
  { firstName: 'Ming', gender: 'male', origin: 'chinese' },
  { firstName: 'Chen', gender: 'male', origin: 'chinese' },
  { firstName: 'Hao', gender: 'male', origin: 'chinese' },
  { firstName: 'Jun', gender: 'male', origin: 'chinese' },
  { firstName: 'Feng', gender: 'male', origin: 'chinese' },
  { firstName: 'Long', gender: 'male', origin: 'chinese' },
  
  // Chinese names - Female
  { firstName: 'Mei', gender: 'female', origin: 'chinese' },
  { firstName: 'Ling', gender: 'female', origin: 'chinese' },
  { firstName: 'Xiu', gender: 'female', origin: 'chinese' },
  { firstName: 'Yan', gender: 'female', origin: 'chinese' },
  { firstName: 'Hui', gender: 'female', origin: 'chinese' },
  { firstName: 'Fang', gender: 'female', origin: 'chinese' },
  { firstName: 'Jing', gender: 'female', origin: 'chinese' },
  { firstName: 'Li', gender: 'female', origin: 'chinese' },
  
  // Korean names - Male
  { firstName: 'Min-jun', gender: 'male', origin: 'korean' },
  { firstName: 'Seo-jun', gender: 'male', origin: 'korean' },
  { firstName: 'Do-yun', gender: 'male', origin: 'korean' },
  { firstName: 'Ye-jun', gender: 'male', origin: 'korean' },
  { firstName: 'Si-woo', gender: 'male', origin: 'korean' },
  { firstName: 'Ha-jun', gender: 'male', origin: 'korean' },
  { firstName: 'Ji-ho', gender: 'male', origin: 'korean' },
  { firstName: 'Jun-seo', gender: 'male', origin: 'korean' },
  
  // Korean names - Female
  { firstName: 'Seo-yeon', gender: 'female', origin: 'korean' },
  { firstName: 'Ha-yoon', gender: 'female', origin: 'korean' },
  { firstName: 'Ji-woo', gender: 'female', origin: 'korean' },
  { firstName: 'Seo-yoon', gender: 'female', origin: 'korean' },
  { firstName: 'Min-seo', gender: 'female', origin: 'korean' },
  { firstName: 'Ha-eun', gender: 'female', origin: 'korean' },
  { firstName: 'Yoon-seo', gender: 'female', origin: 'korean' },
  { firstName: 'Ji-yoo', gender: 'female', origin: 'korean' },
  
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
  
  // Japanese
  { lastName: 'Sato', origin: 'japanese' },
  { lastName: 'Suzuki', origin: 'japanese' },
  { lastName: 'Takahashi', origin: 'japanese' },
  { lastName: 'Tanaka', origin: 'japanese' },
  { lastName: 'Watanabe', origin: 'japanese' },
  { lastName: 'Ito', origin: 'japanese' },
  { lastName: 'Yamamoto', origin: 'japanese' },
  { lastName: 'Nakamura', origin: 'japanese' },
  
  // Chinese
  { lastName: 'Wang', origin: 'chinese' },
  { lastName: 'Li', origin: 'chinese' },
  { lastName: 'Zhang', origin: 'chinese' },
  { lastName: 'Liu', origin: 'chinese' },
  { lastName: 'Chen', origin: 'chinese' },
  { lastName: 'Yang', origin: 'chinese' },
  { lastName: 'Huang', origin: 'chinese' },
  { lastName: 'Zhao', origin: 'chinese' },
  
  // Korean
  { lastName: 'Kim', origin: 'korean' },
  { lastName: 'Lee', origin: 'korean' },
  { lastName: 'Park', origin: 'korean' },
  { lastName: 'Choi', origin: 'korean' },
  { lastName: 'Jung', origin: 'korean' },
  { lastName: 'Kang', origin: 'korean' },
  { lastName: 'Cho', origin: 'korean' },
  { lastName: 'Yoon', origin: 'korean' },
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
