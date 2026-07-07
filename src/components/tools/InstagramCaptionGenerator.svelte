<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Instagram 配文生成器',
      subtitle: '生成引人入胜的 Instagram 配文，让每张图片都会说话',
      scene: '图片描述 / 场景',
      scenePlaceholder: '例如: 在咖啡馆度过的慵懒周末下午',
      mood: '心情 / 语气',
      moodOptions: '快乐,感性,励志,幽默,思考',
      includeHashtags: '包含话题标签',
      ctaType: 'CTA 类型',
      ctaNone: '无',
      ctaLike: '点赞',
      ctaComment: '评论互动',
      ctaShare: '分享保存',
      ctaLink: '链接跳转',
      short: '短配文',
      medium: '中配文',
      long: '长配文',
      chars: '字符',
      copy: '复制',
      copied: '✓ 已复制',
      suggestedTags: '推荐标签',
      placeholderText: '描述图片场景或心情，生成不同长度的 Instagram 配文。',
      disclaimer: 'Instagram 配文最多 2200 字符，建议前 125 字符内展示核心信息。',
    },
    en: {
      title: 'Instagram Caption Generator',
      subtitle: 'Generate engaging Instagram captions that make every photo tell a story',
      scene: 'Image Description / Scene',
      scenePlaceholder: 'e.g. Lazy Sunday afternoon at a cozy coffee shop',
      mood: 'Mood / Tone',
      moodOptions: 'Happy,Emotional,Inspirational,Humorous,Thoughtful',
      includeHashtags: 'Include Hashtags',
      ctaType: 'CTA Type',
      ctaNone: 'None',
      ctaLike: 'Like',
      ctaComment: 'Comment',
      ctaShare: 'Share/Save',
      ctaLink: 'Link in Bio',
      short: 'Short',
      medium: 'Medium',
      long: 'Long',
      chars: 'chars',
      copy: 'Copy',
      copied: '✓ Copied',
      suggestedTags: 'Suggested Tags',
      placeholderText: 'Describe your photo scene or mood to generate Instagram captions.',
      disclaimer: 'Instagram captions max 2200 chars. First 125 characters show before "more".',
    },
    es: {
      title: 'Generador de Subtítulos de Instagram',
      subtitle: 'Genera subtítulos atractivos para Instagram que hagan que cada foto cuente una historia',
      scene: 'Descripción de la Imagen / Escena',
      scenePlaceholder: 'ej. Perezosa tarde de domingo en una acogedora cafetería',
      mood: 'Estado de Ánimo / Tono',
      moodOptions: 'Feliz,Emocional,Inspirador,Humorístico,Reflexivo',
      includeHashtags: 'Incluir Hashtags',
      ctaType: 'Tipo de CTA',
      ctaNone: 'Ninguno',
      ctaLike: 'Me gusta',
      ctaComment: 'Comentar',
      ctaShare: 'Compartir/Guardar',
      ctaLink: 'Enlace en Bio',
      short: 'Corto',
      medium: 'Medio',
      long: 'Largo',
      chars: 'car.',
      copy: 'Copiar',
      copied: '✓ Copiado',
      suggestedTags: 'Etiquetas Sugeridas',
      placeholderText: 'Describa la escena de su foto para generar subtítulos de Instagram.',
      disclaimer: 'Los subtítulos de Instagram tienen un máximo de 2200 caracteres. Los primeros 125 son visibles.',
    },
    pt: {
      title: 'Gerador de Legendas do Instagram',
      subtitle: 'Gere legendas envolventes para Instagram que fazem cada foto contar uma história',
      scene: 'Descrição da Imagem / Cena',
      scenePlaceholder: 'ex. Preguiçosa tarde de domingo em um café aconchegante',
      mood: 'Humor / Tom',
      moodOptions: 'Feliz,Emocional,Inspirador,Humorístico,Reflexivo',
      includeHashtags: 'Incluir Hashtags',
      ctaType: 'Tipo de CTA',
      ctaNone: 'Nenhum',
      ctaLike: 'Curtir',
      ctaComment: 'Comentar',
      ctaShare: 'Compartilhar/Salvar',
      ctaLink: 'Link na Bio',
      short: 'Curta',
      medium: 'Média',
      long: 'Longa',
      chars: 'car.',
      copy: 'Copiar',
      copied: 'Copiado',
      suggestedTags: 'Tags Sugeridas',
      placeholderText: 'Descreva a cena da sua foto para gerar legendas do Instagram.',
      disclaimer: 'Máximo de 2200 caracteres. Os primeiros 125 caracteres aparecem antes do "mais".',
    },
    ja: {
      title: 'Instagram キャプションジェネレーター',
      subtitle: '写真に命を吹き込む魅力的なInstagramキャプションを生成します',
      scene: '画像の説明 / シーン',
      scenePlaceholder: '例: 居心地のいいカフェで過ごす、ゆったりした日曜の午後',
      mood: '気分 / トーン',
      moodOptions: 'ハッピー,感動的,インスパイア,ユーモラス,思慮深い',
      includeHashtags: 'ハッシュタグを含める',
      ctaType: 'CTAの種類',
      ctaNone: 'なし',
      ctaLike: 'いいね',
      ctaComment: 'コメント',
      ctaShare: 'シェア/保存',
      ctaLink: 'バイオのリンク',
      short: '短い',
      medium: '中程度',
      long: '長い',
      chars: '文字',
      copy: 'コピー',
      copied: 'コピーしました',
      suggestedTags: 'おすすめタグ',
      placeholderText: '写真のシーンや気分を入力してInstagramキャプションを生成します。',
      disclaimer: 'Instagramのキャプションは最大2200文字。最初の125文字が最初に表示されます。',
    },
    fr: {
      title: 'Générateur de Légendes Instagram',
      subtitle: 'Générez des légendes Instagram captivantes qui donnent vie à chaque photo',
      scene: 'Description de l\'Image / Scène',
      scenePlaceholder: 'ex. Un paresseux dimanche après-midi dans un café cosy',
      mood: 'Humeur / Ton',
      moodOptions: 'Joyeux,Émotionnel,Inspirant,Humoristique,Réfléchi',
      includeHashtags: 'Inclure des Hashtags',
      ctaType: 'Type de CTA',
      ctaNone: 'Aucun',
      ctaLike: 'J\'aime',
      ctaComment: 'Commenter',
      ctaShare: 'Partager/Sauvegarder',
      ctaLink: 'Lien en Bio',
      short: 'Courte',
      medium: 'Moyenne',
      long: 'Longue',
      chars: 'car.',
      copy: 'Copier',
      copied: 'Copié',
      suggestedTags: 'Tags Suggérés',
      placeholderText: 'Décrivez la scène de votre photo pour générer des légendes Instagram.',
      disclaimer: 'Max 2200 caractères. Les 125 premiers sont visibles avant "plus".',
    },
    de: {
      title: 'Instagram Bildunterschriften Generator',
      subtitle: 'Generiere ansprechende Instagram-Bildunterschriften, die jedes Foto zum Sprechen bringen',
      scene: 'Bildbeschreibung / Szene',
      scenePlaceholder: 'z.B. Fauler Sonntagsnachmittag in einem gemütlichen Café',
      mood: 'Stimmung / Ton',
      moodOptions: 'Glücklich,Emotional,Inspirierend,Humorvoll,Nachdenklich',
      includeHashtags: 'Hashtags einschließen',
      ctaType: 'CTA-Typ',
      ctaNone: 'Keiner',
      ctaLike: 'Gefällt mir',
      ctaComment: 'Kommentieren',
      ctaShare: 'Teilen/Speichern',
      ctaLink: 'Link in Bio',
      short: 'Kurz',
      medium: 'Mittel',
      long: 'Lang',
      chars: 'Zeichen',
      copy: 'Kopieren',
      copied: 'Kopiert',
      suggestedTags: 'Vorgeschlagene Tags',
      placeholderText: 'Beschreiben Sie die Szene Ihres Fotos, um Instagram-Bildunterschriften zu generieren.',
      disclaimer: 'Max. 2200 Zeichen. Die ersten 125 sind vor "mehr" sichtbar.',
    },
    ar: {
      title: 'مولد تعليقات Instagram',
      subtitle: 'أنشئ تعليقات Instagram جذابة تجعل كل صورة تحكي قصة',
      scene: 'وصف الصورة / المشهد',
      scenePlaceholder: 'مثال: بعد ظهر يوم أحد كسول في مقهى مريح',
      mood: 'المزاج / الأسلوب',
      moodOptions: 'سعيد,عاطفي,ملهم,فكاهي,تأملي',
      includeHashtags: 'تضمين الهاشتاقات',
      ctaType: 'نوع CTA',
      ctaNone: 'لا يوجد',
      ctaLike: 'إعجاب',
      ctaComment: 'تعليق',
      ctaShare: 'مشاركة/حفظ',
      ctaLink: 'رابط في النبذة',
      short: 'قصير',
      medium: 'متوسط',
      long: 'طويل',
      chars: 'حرف',
      copy: 'نسخ',
      copied: 'تم النسخ',
      suggestedTags: 'هاشتاقات مقترحة',
      placeholderText: 'صف مشهد صورتك لإنشاء تعليقات Instagram.',
      disclaimer: 'الحد الأقصى 2200 حرف. أول 125 حرفاً تظهر قبل "المزيد".',
    },
    ko: {
      title: 'Instagram 캡션 생성기',
      subtitle: '모든 사진이 이야기를 전하는 매력적인 Instagram 캡션을 생성하세요',
      scene: '이미지 설명 / 장면',
      scenePlaceholder: '예: 아늑한 카페에서 보내는 여유로운 일요일 오후',
      mood: '기분 / 어조',
      moodOptions: '행복,감성,영감,유머,사색',
      includeHashtags: '해시태그 포함',
      ctaType: 'CTA 유형',
      ctaNone: '없음',
      ctaLike: '좋아요',
      ctaComment: '댓글',
      ctaShare: '공유/저장',
      ctaLink: '바이오 링크',
      short: '짧은',
      medium: '중간',
      long: '긴',
      chars: '자',
      copy: '복사',
      copied: '✓ 복사됨',
      suggestedTags: '추천 태그',
      placeholderText: '사진 장면을 설명하여 Instagram 캡션을 생성하세요.',
      disclaimer: 'Instagram 캡션 최대 2200자. 처음 125자가 "더 보기" 전에 표시됩니다.',
    },
    ru: {
      title: 'Генератор Подписей Instagram',
      subtitle: 'Создавайте захватывающие подписи Instagram, которые оживляют каждое фото',
      scene: 'Описание Изображения / Сцена',
      scenePlaceholder: 'напр. Ленивый воскресный день в уютном кафе',
      mood: 'Настроение / Тон',
      moodOptions: 'Счастливый,Эмоциональный,Вдохновляющий,Юмористический,Задумчивый',
      includeHashtags: 'Включить хэштеги',
      ctaType: 'Тип CTA',
      ctaNone: 'Нет',
      ctaLike: 'Лайк',
      ctaComment: 'Комментарий',
      ctaShare: 'Поделиться/Сохранить',
      ctaLink: 'Ссылка в Bio',
      short: 'Короткая',
      medium: 'Средняя',
      long: 'Длинная',
      chars: 'симв.',
      copy: 'Копировать',
      copied: 'Скопировано',
      suggestedTags: 'Предлагаемые теги',
      placeholderText: 'Опишите сцену вашего фото для создания подписей Instagram.',
      disclaimer: 'Максимум 2200 символов. Первые 125 символов видны до "ещё".',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let scene = $state('');
  let mood = $state('happy');
  let includeHashtags = $state(true);
  let ctaType = $state('comment');

  const moodKeys = ['happy', 'emotional', 'inspirational', 'humorous', 'thoughtful'];

  const CTA_TEXT: Record<string, string> = {
    none: '',
    like: '❤️ Double tap if you agree!',
    comment: '💬 Tell me in the comments!',
    share: '📌 Save this for later!',
    link: '🔗 Link in bio for more!',
  };

  const MOOD_HASHTAGS: Record<string, string[]> = {
    happy: ['#happy', '#joy', '#smile', '#goodvibes', '#positivevibes'],
    emotional: ['#feelings', '#emotions', '#heartfelt', '#soulful', '#deepthoughts'],
    inspirational: ['#inspiration', '#motivate', '#goalsetting', '#mindset', '#believe'],
    humorous: ['#funny', '#lol', '#humor', '#relatable', '#comedy'],
    thoughtful: ['#thoughtful', '#reflection', '#mindfulness', '#wisdom', '#perspective'],
  };

  function buildCaption(scene: string, mood: string, hashtags: boolean, cta: string, length: 'short' | 'medium' | 'long'): string {
    const ctaText = CTA_TEXT[cta] || '';
    const tags = hashtags ? (MOOD_HASHTAGS[mood] || []).slice(0, 5).join(' ') : '';
    const w = scene || 'this moment';

    const templates: Record<string, Record<string, string>> = {
      short: {
        happy: `Life's little joys — ${w} ✨${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        emotional: `Some moments are meant to be felt, not explained. ${w} 🤍${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        inspirational: `${w} — a reminder that every small step matters. 💫${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        humorous: `Plot twist: ${w} is my whole personality now 😂${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        thoughtful: `${w}. Funny how the simplest moments leave the deepest impressions. 🌿${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
      },
      medium: {
        happy: `There's something about ${w} that makes everything feel right. Grateful for these small pockets of joy that remind me what life's really about. ✨\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        emotional: `${w}.\n\nSometimes I sit with a moment like this and realize how much we take for granted. The quiet ones are often the loudest.${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        inspirational: `${w} is where it starts for me.\n\nEvery big dream begins with a small, ordinary moment. Don't rush past yours.${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        humorous: `Me: I'll just spend 5 minutes on ${w}.\nAlso me, 3 hours later: totally worth it 😂\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        thoughtful: `${w}.\n\nI've been thinking a lot about slowing down lately. Not every moment needs to be optimized — some just need to be lived.${ctaText ? '\n\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
      },
      long: {
        happy: `Let me tell you about ${w}.\n\nI didn't plan this. I didn't prepare. I just showed up, and somehow that was enough. Sometimes the best moments are the ones you stumble into — unscripted, unfiltered, and absolutely perfect.\n\nGrateful for every single one of them. 🧡\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        emotional: `${w}.\n\nThere are feelings I still don't have words for. Moments that stay with you long after they're gone — not because they were dramatic, but because they were real. Quietly, deeply real.\n\nI hope you hold onto yours too. 🌙\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        inspirational: `${w} reminded me of something important.\n\nWe spend so much time waiting to feel "ready." But readiness is a myth. The people who change their lives aren't the ones who had the perfect plan — they're the ones who started anyway.\n\nStart anyway. 🌟\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        humorous: `Okay so here's what happened with ${w}.\n\nStep 1: Had a perfectly reasonable plan.\nStep 2: Immediately abandoned said plan.\nStep 3: Ended up somewhere way better.\n\nLife hack: Sometimes the detour IS the destination. You're welcome. 😂\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
        thoughtful: `${w}.\n\nI keep coming back to this idea: that we are constantly in the middle of a story we can't fully see. What feels like a quiet Tuesday could be a pivotal chapter.\n\nMaybe the ordinary moments deserve more credit than we give them.🌿\n${ctaText ? '\n' + ctaText : ''}${tags ? '\n\n' + tags : ''}`,
      },
    };

    return (templates[length]?.[mood] || templates[length]?.['thoughtful'] || '').trim();
  }

  const captions = $derived((() => {
    if (!scene.trim()) return null;
    return {
      short: buildCaption(scene.trim(), mood, includeHashtags, ctaType, 'short'),
      medium: buildCaption(scene.trim(), mood, includeHashtags, ctaType, 'medium'),
      long: buildCaption(scene.trim(), mood, includeHashtags, ctaType, 'long'),
    };
  })());

  const suggestedTags = $derived(includeHashtags ? (MOOD_HASHTAGS[mood] || []) : []);

  let copiedKey = $state<string | null>(null);
  function copyCap(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      copiedKey = key;
      setTimeout(() => (copiedKey = null), 1500);
    });
  }

  function charColor(len: number) {
    if (len > 2000) return 'text-red-400';
    if (len > 1500) return 'text-yellow-400';
    return 'text-fuchsia-400';
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🌸
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-fuchsia-700 dark:bg-gradient-to-r dark:from-fuchsia-300 dark:via-purple-100 dark:to-fuchsia-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.scene}</span>
        <textarea bind:value={scene} placeholder={l.scenePlaceholder} rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-fuchsia-500 focus:outline-none transition-colors resize-none"></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.mood}</span>
        <div class="grid grid-cols-5 gap-1">
          {#each moodKeys as key, idx}
            <button type="button" onclick={() => (mood = key)}
              class="py-1.5 text-xxs font-bold rounded-lg border transition-all {mood === key ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}">
              {l.moodOptions.split(',')[idx]}
            </button>
          {/each}
        </div>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.ctaType}</span>
        <select bind:value={ctaType}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-fuchsia-500 focus:outline-none transition-colors">
          <option value="none">{l.ctaNone}</option>
          <option value="like">{l.ctaLike}</option>
          <option value="comment">{l.ctaComment}</option>
          <option value="share">{l.ctaShare}</option>
          <option value="link">{l.ctaLink}</option>
        </select>
      </label>

      <button type="button" onclick={() => (includeHashtags = !includeHashtags)}
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all {includeHashtags ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}">
        <span class="text-xs font-medium">{l.includeHashtags}</span>
        <span class="text-xs font-bold">{includeHashtags ? '✓' : '○'}</span>
      </button>

      {#if suggestedTags.length > 0}
        <div>
          <p class="text-xxs text-stone-500 mb-1.5">{l.suggestedTags}</p>
          <div class="flex flex-wrap gap-1">
            {#each suggestedTags as tag}
              <span class="bg-fuchsia-950/40 border border-fuchsia-800/40 text-fuchsia-300 text-xxs px-2 py-0.5 rounded-full">{tag}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Right Panel: Output -->
    <div class="md:col-span-7 flex flex-col gap-3">
      {#if captions}
        {#each [{ key: 'short', label: l.short }, { key: 'medium', label: l.medium }, { key: 'long', label: l.long }] as cap}
          {@const text = captions[cap.key as keyof typeof captions]}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-fuchsia-500/30 transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xxs text-fuchsia-400 font-semibold uppercase tracking-wide">{cap.label}</span>
              <div class="flex items-center gap-2">
                <span class="{charColor(text.length)} text-xxs">{text.length}/2200 {l.chars}</span>
                <button type="button" onclick={() => copyCap(text, cap.key)}
                  class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all">
                  {copiedKey === cap.key ? l.copied : l.copy}
                </button>
              </div>
            </div>
            <p class="text-stone-200 text-xs leading-relaxed whitespace-pre-line">{text}</p>
          </div>
        {/each}
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[280px]">
          <div class="text-4xl mb-3">🌸</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}

      <p class="text-xxs text-stone-600 text-center leading-relaxed">{l.disclaimer}</p>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
