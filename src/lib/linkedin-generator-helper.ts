import { formatSkillsList } from './cover-letter-helper';

export interface LinkedinHeadlineInput {
  jobTitle: string;
  keySkills?: string | string[];
  experienceYears?: number;
  valueProp?: string;
  tone: 'professional' | 'creative' | 'enthusiastic' | 'confident';
  locale?: string;
}

export interface LinkedinSummaryInput {
  jobTitle: string;
  keySkills?: string | string[];
  experienceYears?: number;
  valueProp?: string;
  tone: 'professional' | 'creative' | 'enthusiastic' | 'confident';
  locale?: string;
}

export function generateLinkedinHeadlines(input: LinkedinHeadlineInput): string[] {
  const {
    jobTitle,
    keySkills,
    experienceYears = 0,
    valueProp = '',
    locale = 'en',
  } = input;

  const isChinese = locale.startsWith('zh');
  const skillsList = formatSkillsList(keySkills, locale);
  const val = valueProp.trim();

  if (isChinese) {
    const skillsText = skillsList ? ` | 专注领域: ${skillsList}` : '';
    const expText = experienceYears > 0 ? ` | ${experienceYears}年经验` : '';
    const valText = val ? ` | ${val}` : '';

    return [
      `${jobTitle}${skillsText}${expText}`,
      `${jobTitle}${valText}${skillsText ? ` | ${skillsList}` : ''}`,
      `${jobTitle}${expText}${val ? ` | ${val}` : ''}`,
    ];
  } else {
    const skillsText = skillsList ? ` | Specializing in ${skillsList}` : '';
    const expText = experienceYears > 0 ? ` | ${experienceYears} Years Experience` : '';
    const valText = val ? ` | ${val}` : '';

    return [
      `${jobTitle}${skillsText}${expText}`,
      `${jobTitle}${valText}${skillsText ? ` | ${skillsList}` : ''}`,
      `${jobTitle}${expText}${val ? ` | ${val}` : ''}`,
    ];
  }
}

export function generateLinkedinSummary(input: LinkedinSummaryInput): string {
  const {
    jobTitle,
    keySkills,
    experienceYears = 0,
    valueProp = '',
    tone,
    locale = 'en',
  } = input;

  const isChinese = locale.startsWith('zh');
  const skillsList = formatSkillsList(keySkills, locale);
  
  const expTextZh = experienceYears > 0 ? `${experienceYears} 年` : '多年';
  const expTextEn = experienceYears > 0 ? `${experienceYears} years` : 'multiple years';

  const defaultValZh = '创造卓越的技术体验与商业价值';
  const defaultValEn = 'delivering outstanding technical experiences and business value';

  const valZh = valueProp.trim() || defaultValZh;
  const valEn = valueProp.trim() || defaultValEn;

  const skillsTextZh = skillsList ? `特别是在 ${skillsList} 方面有深厚的积累` : '致力于技术前沿的探索与实践';
  const skillsTextEn = skillsList ? `specializing in ${skillsList}` : 'focusing on industry best practices and cutting-edge technologies';

  if (isChinese) {
    const templates = {
      professional: `我是 ${jobTitle}，在行业拥有 ${expTextZh} 的工作经验。在我的职业生涯中，我专注于开发高效且易于维护的解决方案，${skillsTextZh}。

我的专业使命是：${valZh}。我擅长在多功能团队中协作，通过规范的技术实施与科学的管理手段将业务构想转化为落地产品。

期待在 LinkedIn 与您建立联系，共同探讨行业发展或潜在的合作机会。`,

      creative: `打破常规、拒绝平庸——我是 ${jobTitle}。

在 ${skillsTextZh} 的探索道路上，我已经深耕了 ${expTextZh} 的时光。我坚信优秀的工程不仅关乎结构与逻辑，更是创造引人入胜的用户体验与极具突破性的商业可能性的艺术。

我的核心动力是：${valZh}。如果你也想为团队注入新鲜的设计视角与非传统的创造力，欢迎直接与我私信交流！`,

      enthusiastic: `大家好！我是一名对工作极具热情的 ${jobTitle}！🚀

在过去 ${expTextZh} 里，我深度参与到 ${skillsTextZh} 之中，每天都在为攻克复杂挑战、开发更优体验而感到振奋。我始终保持对前沿动态的敏感，目前的焦点在于 ${valZh}。

我笃信开放的交流和不断的自我迭代。很高兴能在 LinkedIn 与志同道合的伙伴连接，随时欢迎给我留言！`,

      confident: `作为一名拥有 ${expTextZh} 实战经验的 ${jobTitle}，我专注于通过过硬的专业能力为企业创造切实的价值。

我的核心专长是：${valZh}。在过往的团队中，我常因高效的执行力和出色的问题解决效率备受认可，${skillsTextZh}。我能够在高要求且富有挑战的项目里，主导或深度协作以确保优秀的产品交付。

欢迎随时与我建立联系，探讨我如何能以自己的经验助力您的团队实现下一个业务增长点。`,
    };

    return templates[tone] ?? templates.professional;
  } else {
    const templates = {
      professional: `I am a dedicated ${jobTitle} with ${expTextEn} of experience in the industry. Over the course of my career, I have developed a strong specialization in ${skillsTextEn}, with a focus on delivering high-quality and sustainable solutions.

My professional mission is centered on ${valEn}. I thrive in dynamic environments where collaborative effort, structured processes, and technical rigor are keys to success.

Feel free to connect or reach out to discuss industry trends, technological innovation, or potential opportunities.`,

      creative: `Thinking outside the box isn't just a method for me—it's my mindset. As a ${jobTitle} with ${expTextEn} of experience exploring ${skillsTextEn}, I focus on bringing novel approaches to everyday challenges.

I am highly passionate about ${valEn}. For me, great work is about bridging technical execution with creative design to make things that stand out.

Let's connect and explore how we can push boundaries together!`,

      enthusiastic: `Hi there! I am an energetic ${jobTitle} who absolutely loves what I do! 🚀

For the past ${expTextEn}, I have been deeply immersed in ${skillsTextEn}, enjoying every moment of solving complex puzzles and building exceptional products. Currently, my main focus is on ${valEn}.

I believe that a growth mindset, curiosity, and a positive attitude are the foundations of great team achievements. I'd love to connect with fellow professionals, so feel free to reach out!`,

      confident: `I am a results-oriented ${jobTitle} with ${expTextEn} of hands-on expertise in ${skillsTextEn}. I have a proven track record of removing technical bottlenecks, leading initiatives, and driving products to successful releases.

My core competence lies in ${valEn}. I excel in demanding environments where rapid decision-making, direct execution, and high standards are required.

Let's connect to discuss how I can bring my experience to help accelerate your team's objectives.`,
    };

    return templates[tone] ?? templates.professional;
  }
}
