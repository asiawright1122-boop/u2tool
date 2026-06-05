export type CoverLetterTone = 'professional' | 'creative' | 'enthusiastic' | 'confident';

export interface CoverLetterInput {
  candidateName: string;
  jobTitle: string;
  companyName?: string;
  keySkills?: string | string[];
  experienceYears?: number;
  tone: CoverLetterTone;
  locale?: string;
}

export function formatSkillsList(skills: string | string[] | undefined, locale: string): string {
  if (!skills) return '';
  const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
  if (skillsArray.length === 0) return '';
  if (skillsArray.length === 1) return skillsArray[0];

  if (locale.startsWith('zh')) {
    if (skillsArray.length === 2) {
      return `${skillsArray[0]}和${skillsArray[1]}`;
    }
    return `${skillsArray.slice(0, -1).join('、')}和${skillsArray[skillsArray.length - 1]}`;
  } else {
    if (skillsArray.length === 2) {
      return `${skillsArray[0]} and ${skillsArray[1]}`;
    }
    return `${skillsArray.slice(0, -1).join(', ')}, and ${skillsArray[skillsArray.length - 1]}`;
  }
}

export function generateCoverLetter(input: CoverLetterInput): string {
  const {
    candidateName,
    jobTitle,
    companyName = 'your company',
    keySkills,
    experienceYears = 0,
    tone,
    locale = 'en',
  } = input;

  const isChinese = locale.startsWith('zh');
  const skillsList = formatSkillsList(keySkills, locale);

  const experienceTextEn = experienceYears > 0 ? `With over ${experienceYears} years of experience in the field` : 'With my background in the industry';
  const experienceTextZh = experienceYears > 0 ? `凭借在此领域超过 ${experienceYears} 年的深耕累积` : '凭借我在该行业的专业背景';

  const skillsTextEn = skillsList ? `, particularly my expertise in ${skillsList},` : '';
  const skillsTextZh = skillsList ? `，特别是在 ${skillsList} 方面的核心专长，` : '，';

  if (isChinese) {
    // Chinese Templates
    const templates = {
      professional: `尊敬的招聘经理：

您好！得知贵公司正在招聘 ${jobTitle} 一职，我写此信旨在表达我对此岗位的强烈兴趣。

${experienceTextZh}${skillsTextZh}我相信我的加入能直接为贵公司的项目团队贡献力量。在过往的经历中，我一向致力于提供高质量的产出与持续优化的解决方案。

贵公司在行业内的专业成就令我十分敬仰。我非常期待能有机会与您进一步面谈，探讨我如何能以自己的专业能力协助贵公司攻克未来的业务挑战。

感谢您的宝贵时间与考虑。

祝好，
${candidateName}`,

      enthusiastic: `尊敬的招聘经理：

您好！看到贵公司招聘 ${jobTitle} 的信息时，我感到非常兴奋！我一直密切关注 ${companyName} 在行业内的创新动向，并希望能有幸加入这支充满活力的团队。

${experienceTextZh}${skillsTextZh}这与贵公司当前招聘岗位的各项能力要求高度契合。我对技术充满热忱，喜欢解决复杂棘手的问题，并始终渴望在快节奏的团队环境中迎接新的挑战。

我渴望将我的工作激情和技术实力融入到贵公司的宏伟蓝图之中。非常期待能收到您的回复，让我有机会面对面表达我的热情和规划！

非常感谢您的考虑！

祝商祺，
${candidateName}`,

      creative: `尊敬的招聘经理：

您好！如果贵公司正在寻找一位不落俗套、能为团队带来独特视角的 ${jobTitle}，那么我想我就是合适的人选。

${experienceTextZh}${skillsTextZh}我不仅关注代码与流程的规范性，更擅长用创新的设计与跨界的灵感去解决传统手段难以攻克的瓶颈。我喜欢探索新事物的无限可能，且在团队碰撞中总是能够激发别样的创造性火花。

${companyName} 敢于打破常规的企业文化深深吸引着我。希望能有机会与您见上一面，分享我的一些创意构想以及它们如何能在贵公司的具体业务中落地生根。

感谢您的宝贵时间！

此致，
${candidateName}`,

      confident: `尊敬的招聘经理：

您好！请允许我开门见山地向您自荐：我就是贵公司正在寻找的优秀 ${jobTitle}。

${experienceTextZh}${skillsTextZh}我已经为快速上手并攻坚贵公司的核心业务做好了充分准备。在过往的团队中，我一向以高效的执行力和出众的问题解决能力著称，能够带领或协助团队按时、高质地完成富有挑战性的攻坚战。

${companyName} 卓越的行业地位与雄心壮志，正是我施展拳脚的理想舞台。我很乐意在接下来的面谈中，向您进一步证明为什么我是这个岗位的最佳人选。

期待您的面谈邀请！

顺祝商祺，
${candidateName}`,
    };

    return templates[tone] ?? templates.professional;
  } else {
    // English Templates
    const templates = {
      professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}.

${experienceTextEn}${skillsTextEn} I am confident in my ability to make a significant and immediate contribution to your team. Throughout my career, I have consistently focused on delivering high-quality results, optimizing workflows, and aligning technical execution with strategic business goals.

I have long admired ${companyName}'s market leadership and dedication to excellence. I welcome the opportunity to discuss how my qualifications align with your current needs in an interview.

Thank you for your time and consideration.

Sincerely,
${candidateName}`,

      enthusiastic: `Dear Hiring Manager,

I was absolutely thrilled to see the opening for the ${jobTitle} position at ${companyName}! I have been following your company's incredible growth and would be incredibly proud to join such a forward-thinking and dynamic team.

${experienceTextEn}${skillsTextEn} I am eager to channel my skills and high-energy dedication into your upcoming projects. I thrive in collaborative, fast-paced environments and love solving challenging problems alongside passionate people.

I am genuinely excited about the possibility of contributing to ${companyName}'s vision. I look forward to hearing from you and discussing this opportunity further.

Best regards,
${candidateName}`,

      creative: `Dear Hiring Manager,

If ${companyName} is searching for a ${jobTitle} who thinks outside the box and brings a fresh perspective to problem-solving, look no further.

${experienceTextEn}${skillsTextEn} I pride myself on bridging technical excellence with innovative approaches. I don't just build solutions; I aim to design experiences that stand out. I am highly adaptable and enjoy collaborating with creative teams to bring novel concepts to life.

I am drawn to ${companyName}'s culture of innovation and would love to meet to discuss how my creative approach can support your future initiatives.

Warm regards,
${candidateName}`,

      confident: `Dear Hiring Manager,

Allow me to introduce myself as the ideal candidate for the ${jobTitle} position currently open at ${companyName}.

${experienceTextEn}${skillsTextEn} I possess the hands-on expertise and strategic drive required to jump in and immediately accelerate your team's velocity. In my previous roles, I have established a proven track record of resolving complex technical bottlenecks and delivering projects on time and under budget.

${companyName} is doing outstanding work in the industry, and I am ready to help you drive it even further. I look forward to discussing this in detail during an interview.

Respectfully yours,
${candidateName}`,
    };

    return templates[tone] ?? templates.professional;
  }
}
