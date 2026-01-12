'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Common English words dictionary (subset for demo)
const commonWords = [
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'act', 'add', 'age', 'ago', 'air', 'all', 'and', 'any', 'arm', 'art',
  'ask', 'ate', 'bad', 'bag', 'bat', 'bed', 'big', 'bit', 'box', 'boy',
  'bus', 'but', 'buy', 'can', 'car', 'cat', 'cup', 'cut', 'dad', 'day',
  'did', 'dig', 'dog', 'dot', 'dry', 'ear', 'eat', 'egg', 'end', 'eye',
  'far', 'fat', 'few', 'fit', 'fly', 'for', 'fox', 'fun', 'gas', 'get',
  'god', 'got', 'gun', 'guy', 'had', 'has', 'hat', 'her', 'him', 'his',
  'hit', 'hot', 'how', 'ice', 'ill', 'its', 'job', 'joy', 'key', 'kid',
  'let', 'lie', 'lip', 'log', 'lot', 'low', 'mad', 'man', 'map', 'may',
  'men', 'met', 'mix', 'mom', 'mud', 'net', 'new', 'nor', 'not', 'now',
  'nut', 'odd', 'off', 'oil', 'old', 'one', 'our', 'out', 'own', 'pan',
  'pay', 'pen', 'pet', 'pie', 'pig', 'pin', 'pit', 'pop', 'pot', 'put',
  'ran', 'rat', 'raw', 'red', 'rid', 'rub', 'run', 'sad', 'sat', 'saw',
  'say', 'sea', 'set', 'she', 'sir', 'sit', 'six', 'sky', 'son', 'sun',
  'tab', 'tag', 'tan', 'tap', 'tax', 'tea', 'ten', 'the', 'tie', 'tip',
  'toe', 'top', 'toy', 'try', 'two', 'use', 'van', 'war', 'was', 'way',
  'wet', 'who', 'why', 'win', 'won', 'yes', 'yet', 'you', 'zip', 'zoo',
  'able', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball', 'band',
  'bank', 'base', 'bear', 'beat', 'been', 'best', 'bird', 'blue', 'boat',
  'body', 'book', 'born', 'both', 'call', 'came', 'card', 'care', 'case',
  'city', 'club', 'cold', 'come', 'cost', 'dark', 'data', 'date', 'days',
  'dead', 'deal', 'deep', 'does', 'done', 'door', 'down', 'draw', 'drop',
  'each', 'east', 'easy', 'edge', 'else', 'even', 'ever', 'eyes', 'face',
  'fact', 'fall', 'farm', 'fast', 'fear', 'feel', 'feet', 'fell', 'felt',
  'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five',
  'food', 'foot', 'form', 'four', 'free', 'from', 'full', 'game', 'gave',
  'girl', 'give', 'glad', 'goes', 'gold', 'gone', 'good', 'grew', 'grow',
  'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'have', 'head', 'hear',
  'heat', 'held', 'help', 'here', 'high', 'hold', 'home', 'hope', 'hour',
  'idea', 'into', 'iron', 'just', 'keep', 'kept', 'kind', 'king', 'knew',
  'know', 'lack', 'lady', 'laid', 'lake', 'land', 'last', 'late', 'lead',
  'left', 'less', 'life', 'like', 'line', 'list', 'live', 'long', 'look',
  'lord', 'lose', 'loss', 'lost', 'love', 'made', 'main', 'make', 'many',
  'mark', 'mass', 'mean', 'meet', 'mind', 'miss', 'more', 'most', 'move',
  'much', 'must', 'name', 'near', 'need', 'news', 'next', 'nice', 'nine',
  'none', 'note', 'once', 'only', 'open', 'over', 'page', 'paid', 'pain',
  'pair', 'part', 'pass', 'past', 'path', 'plan', 'play', 'plus', 'poor',
  'post', 'race', 'rain', 'rate', 'read', 'real', 'rest', 'rich', 'ride',
  'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'safe', 'said',
  'sale', 'same', 'save', 'seat', 'seem', 'seen', 'self', 'sell', 'send',
  'sent', 'ship', 'shop', 'shot', 'show', 'shut', 'side', 'sign', 'site',
  'size', 'skin', 'slow', 'snow', 'soft', 'sold', 'some', 'song', 'soon',
  'sort', 'soul', 'spot', 'star', 'stay', 'step', 'stop', 'such', 'sure',
  'take', 'talk', 'tall', 'team', 'tell', 'term', 'test', 'text', 'than',
  'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'till', 'time',
  'told', 'took', 'town', 'tree', 'trip', 'true', 'turn', 'type', 'unit',
  'upon', 'used', 'user', 'very', 'view', 'wait', 'walk', 'wall', 'want',
  'warm', 'week', 'well', 'went', 'were', 'west', 'what', 'when', 'wide',
  'wife', 'will', 'wind', 'wish', 'with', 'wood', 'word', 'work', 'year',
  'your', 'zero', 'zone',
  'about', 'above', 'abuse', 'actor', 'admit', 'adopt', 'adult', 'after',
  'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien',
  'allow', 'alone', 'along', 'alter', 'among', 'anger', 'angle', 'angry',
  'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armed', 'aside',
  'asset', 'avoid', 'award', 'aware', 'awful', 'basic', 'basis', 'beach',
  'begin', 'being', 'below', 'bench', 'birth', 'black', 'blame', 'blank',
  'blast', 'blend', 'bless', 'blind', 'block', 'blood', 'board', 'boost',
  'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brick', 'bride',
  'brief', 'bring', 'broad', 'brown', 'brush', 'build', 'bunch', 'burst',
  'buyer', 'cable', 'carry', 'catch', 'cause', 'chain', 'chair', 'chaos',
  'charm', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child',
  'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'climb',
  'clock', 'close', 'cloud', 'coach', 'coast', 'color', 'couch', 'could',
  'count', 'court', 'cover', 'crack', 'craft', 'crash', 'crazy', 'cream',
  'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance',
  'death', 'delay', 'depth', 'dirty', 'doubt', 'dozen', 'draft', 'drama',
  'dream', 'dress', 'drink', 'drive', 'drown', 'early', 'earth', 'eight',
  'elect', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal',
  'error', 'essay', 'event', 'every', 'exact', 'exist', 'extra', 'faith',
  'false', 'fault', 'favor', 'feast', 'fiber', 'field', 'fifth', 'fifty',
  'fight', 'final', 'first', 'fixed', 'flame', 'flash', 'fleet', 'flesh',
  'float', 'flood', 'floor', 'flour', 'fluid', 'focus', 'force', 'forth',
  'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit',
  'fully', 'funny', 'ghost', 'giant', 'given', 'glass', 'globe', 'glory',
  'going', 'grace', 'grade', 'grain', 'grand', 'grant', 'grass', 'grave',
  'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest',
  'guide', 'happy', 'heart', 'heavy', 'hello', 'hence', 'horse', 'hotel',
  'house', 'human', 'ideal', 'image', 'imply', 'index', 'inner', 'input',
  'issue', 'joint', 'judge', 'juice', 'knife', 'knock', 'known', 'label',
  'labor', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease',
  'least', 'leave', 'legal', 'level', 'light', 'limit', 'local', 'loose',
  'lover', 'lower', 'lucky', 'lunch', 'magic', 'major', 'maker', 'march',
  'match', 'maybe', 'mayor', 'media', 'metal', 'meter', 'might', 'minor',
  'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse',
  'mouth', 'movie', 'music', 'naked', 'nerve', 'never', 'newly', 'night',
  'noise', 'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer',
  'often', 'order', 'other', 'ought', 'outer', 'owner', 'paint', 'panel',
  'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piano', 'piece',
  'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point',
  'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior',
  'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
  'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer',
  'relax', 'reply', 'right', 'river', 'robot', 'roman', 'rough', 'round',
  'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense',
  'serve', 'seven', 'shade', 'shake', 'shall', 'shame', 'shape', 'share',
  'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock',
  'shoot', 'shore', 'short', 'shout', 'sight', 'since', 'sixth', 'sixty',
  'skill', 'slave', 'sleep', 'slice', 'slide', 'small', 'smart', 'smell',
  'smile', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space',
  'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport',
  'spray', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
  'steel', 'steep', 'stick', 'still', 'stock', 'stone', 'stood', 'store',
  'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar',
  'suite', 'super', 'sweet', 'swing', 'table', 'taste', 'teach', 'teeth',
  'thank', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third',
  'those', 'three', 'throw', 'tight', 'tired', 'title', 'today', 'token',
  'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'trail',
  'train', 'trash', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried',
  'truck', 'truly', 'trust', 'truth', 'twice', 'uncle', 'under', 'union',
  'unity', 'until', 'upper', 'upset', 'urban', 'usual', 'valid', 'value',
  'video', 'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water',
  'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman',
  'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound',
  'write', 'wrong', 'wrote', 'yield', 'young', 'youth',
];

export default function AnagramSolver() {
  const t = useTranslations('tools.anagram-solver');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const sortLetters = (word: string): string => {
    return word.toLowerCase().split('').sort().join('');
  };

  const results = useMemo(() => {
    if (!input.trim() || input.length < 2) return [];
    const sortedInput = sortLetters(input.replace(/\s/g, ''));
    const found = commonWords.filter(word => {
      if (word.length !== sortedInput.length) return false;
      return sortLetters(word) === sortedInput;
    });
    return [...new Set(found)].sort((a, b) => b.length - a.length);
  }, [input]);

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          maxLength={15}
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t('results')} ({results.length})
          </h3>
          {results.length > 0 && (
            <button
              onClick={copyResults}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        {results.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {results.map((word, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('noResults')}</p>
        )}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('tipTitle')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('tipDescription')}</p>
      </div>
    </div>
  );
}
