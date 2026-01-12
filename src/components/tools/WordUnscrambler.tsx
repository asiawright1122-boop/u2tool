'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Common words dictionary
const dictionary = new Set([
  'a', 'an', 'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
  'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'ate', 'awe', 'axe',
  'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'bet', 'bid', 'big', 'bin', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bus', 'but', 'buy',
  'cab', 'can', 'cap', 'car', 'cat', 'cop', 'cow', 'cry', 'cub', 'cup', 'cut',
  'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'due', 'dug', 'dye',
  'ear', 'eat', 'eel', 'egg', 'ego', 'elm', 'end', 'era', 'eve', 'eye',
  'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
  'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gig', 'gin', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
  'had', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut',
  'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'its', 'ivy',
  'jab', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'joy', 'jug',
  'keg', 'key', 'kid', 'kin', 'kit',
  'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low',
  'mad', 'man', 'map', 'mat', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mom', 'mop', 'mud', 'mug', 'mum',
  'nap', 'net', 'new', 'nod', 'nor', 'not', 'now', 'nun', 'nut',
  'oak', 'oar', 'oat', 'odd', 'off', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
  'pad', 'pal', 'pan', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'per', 'pet', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pro', 'pry', 'pub', 'pun', 'pup', 'put',
  'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'run', 'rut', 'rye',
  'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sow', 'soy', 'spa', 'spy', 'sub', 'sue', 'sum', 'sun', 'sup',
  'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'ten', 'the', 'thy', 'tie', 'tin', 'tip', 'toe', 'ton', 'too', 'top', 'tow', 'toy', 'try', 'tub', 'tug', 'two',
  'urn', 'use',
  'van', 'vat', 'vet', 'via', 'vie', 'vow',
  'wad', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow',
  'yak', 'yam', 'yap', 'yaw', 'yea', 'yes', 'yet', 'yew', 'you', 'yum',
  'zap', 'zed', 'zen', 'zip', 'zoo',
  'able', 'ache', 'acid', 'aged', 'aide', 'also', 'area', 'army', 'aunt', 'auto', 'away',
  'baby', 'back', 'bake', 'ball', 'band', 'bank', 'bare', 'barn', 'base', 'bath', 'bead', 'beam', 'bean', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bike', 'bill', 'bind', 'bird', 'bite', 'blow', 'blue', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boot', 'bore', 'born', 'boss', 'both', 'bowl', 'bred', 'brew', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush', 'busy', 'buzz',
  'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp', 'cane', 'cape', 'card', 'care', 'cart', 'case', 'cash', 'cast', 'cave', 'cell', 'chat', 'chef', 'chin', 'chip', 'chop', 'cite', 'city', 'clam', 'clap', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'come', 'cone', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'corn', 'cost', 'cozy', 'crab', 'crew', 'crop', 'crow', 'cube', 'cult', 'curb', 'cure', 'curl', 'cute',
  'dame', 'damp', 'dare', 'dark', 'dart', 'dash', 'data', 'date', 'dawn', 'days', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'deny', 'desk', 'dial', 'dice', 'diet', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'down', 'drag', 'draw', 'drew', 'drip', 'drop', 'drug', 'drum', 'dual', 'duck', 'dude', 'duel', 'duke', 'dull', 'dumb', 'dump', 'dune', 'dunk', 'dusk', 'dust', 'duty',
  'each', 'earn', 'ease', 'east', 'easy', 'echo', 'edge', 'edit', 'else', 'emit', 'envy', 'epic', 'even', 'ever', 'evil', 'exam', 'exit', 'expo', 'eyed', 'eyes',
  'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fare', 'farm', 'fast', 'fate', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fern', 'fest', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'five', 'flag', 'flap', 'flat', 'flaw', 'flea', 'fled', 'flee', 'flew', 'flip', 'flit', 'flow', 'foam', 'foil', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'free', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'funk', 'fury', 'fuse', 'fuss',
  'gain', 'gale', 'game', 'gang', 'gate', 'gave', 'gaze', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'glow', 'glue', 'goal', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'gore', 'grab', 'gram', 'gray', 'grew', 'grey', 'grid', 'grim', 'grin', 'grip', 'grit', 'grow', 'gulf', 'guru', 'gust',
  'hack', 'hail', 'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hard', 'hare', 'harm', 'harp', 'hash', 'hate', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heel', 'heir', 'held', 'hell', 'helm', 'help', 'herb', 'herd', 'here', 'hero', 'hide', 'high', 'hike', 'hill', 'hint', 'hire', 'hold', 'hole', 'holy', 'home', 'hood', 'hook', 'hope', 'horn', 'hose', 'host', 'hour', 'huge', 'hull', 'hung', 'hunt', 'hurt', 'hush',
  'icon', 'idea', 'idle', 'inch', 'info', 'into', 'iron', 'item',
  'jack', 'jade', 'jail', 'jazz', 'jean', 'jerk', 'jest', 'join', 'joke', 'jolt', 'jump', 'june', 'junk', 'jury', 'just',
  'keen', 'keep', 'kept', 'kick', 'kill', 'kind', 'king', 'kiss', 'kite', 'knee', 'knew', 'knit', 'knob', 'knot', 'know',
  'lace', 'lack', 'lady', 'laid', 'lake', 'lamb', 'lamp', 'land', 'lane', 'last', 'late', 'lawn', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'lend', 'lens', 'lent', 'less', 'liar', 'lick', 'life', 'lift', 'like', 'limb', 'lime', 'limp', 'line', 'link', 'lion', 'list', 'live', 'load', 'loaf', 'loan', 'lock', 'loft', 'logo', 'lone', 'long', 'look', 'loop', 'lord', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'luck', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust',
  'made', 'maid', 'mail', 'main', 'make', 'male', 'mall', 'many', 'mare', 'mark', 'mars', 'mask', 'mass', 'mast', 'mate', 'math', 'maze', 'meal', 'mean', 'meat', 'meet', 'melt', 'memo', 'menu', 'mere', 'mesh', 'mess', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mint', 'miss', 'mist', 'mode', 'mold', 'mole', 'monk', 'mood', 'moon', 'more', 'moss', 'most', 'moth', 'move', 'much', 'mule', 'muse', 'must', 'mute', 'myth',
  'nail', 'name', 'navy', 'near', 'neat', 'neck', 'need', 'nest', 'news', 'next', 'nice', 'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun',
  'odds', 'okay', 'once', 'only', 'onto', 'open', 'oral', 'oven', 'over', 'owed', 'owns',
  'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'pale', 'palm', 'pant', 'park', 'part', 'pass', 'past', 'path', 'peak', 'pear', 'peel', 'peer', 'perk', 'pest', 'pick', 'pier', 'pile', 'pill', 'pine', 'pink', 'pipe', 'pity', 'plan', 'play', 'plea', 'plot', 'plow', 'plug', 'plum', 'plus', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pond', 'pony', 'pool', 'poor', 'pope', 'pork', 'port', 'pose', 'post', 'pour', 'pray', 'prep', 'prey', 'prop', 'pull', 'pulp', 'pump', 'punk', 'pure', 'push',
  'quit', 'quiz',
  'race', 'rack', 'rage', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rang', 'rank', 'rare', 'rash', 'rate', 'rave', 'read', 'real', 'reap', 'rear', 'reef', 'reel', 'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'rift', 'ring', 'riot', 'ripe', 'rise', 'risk', 'road', 'roam', 'roar', 'robe', 'rock', 'rode', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rosy', 'rude', 'ruin', 'rule', 'rush', 'rust',
  'sack', 'safe', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'save', 'scan', 'seal', 'seam', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'shed', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sigh', 'sign', 'silk', 'sing', 'sink', 'site', 'size', 'skim', 'skin', 'skip', 'slab', 'slam', 'slap', 'slid', 'slim', 'slip', 'slit', 'slot', 'slow', 'slug', 'snap', 'snow', 'soak', 'soap', 'soar', 'sock', 'soda', 'sofa', 'soft', 'soil', 'sold', 'sole', 'solo', 'some', 'song', 'soon', 'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spec', 'sped', 'spin', 'spit', 'spot', 'stab', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stub', 'stud', 'such', 'suck', 'suit', 'sung', 'sunk', 'sure', 'surf', 'swap', 'swim',
  'tack', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tank', 'tape', 'task', 'team', 'tear', 'tech', 'teen', 'tell', 'tend', 'tent', 'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'tile', 'till', 'tilt', 'time', 'tiny', 'tire', 'toad', 'toes', 'told', 'toll', 'tomb', 'tone', 'took', 'tool', 'tops', 'tore', 'torn', 'toss', 'tour', 'town', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trot', 'true', 'tube', 'tuck', 'tune', 'turn', 'twin', 'type',
  'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'used', 'user',
  'vain', 'vary', 'vast', 'veil', 'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vice', 'view', 'vine', 'visa', 'void', 'volt', 'vote',
  'wade', 'wage', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward', 'warm', 'warn', 'warp', 'wary', 'wash', 'wave', 'wavy', 'waxy', 'weak', 'wear', 'weed', 'week', 'weep', 'well', 'went', 'were', 'west', 'what', 'when', 'whip', 'whom', 'wide', 'wife', 'wild', 'will', 'wilt', 'wind', 'wine', 'wing', 'wink', 'wipe', 'wire', 'wise', 'wish', 'with', 'woke', 'wolf', 'womb', 'wood', 'wool', 'word', 'wore', 'work', 'worm', 'worn', 'wrap', 'wren',
  'yard', 'yarn', 'yeah', 'year', 'yell', 'yoga', 'yoke', 'your',
  'zeal', 'zero', 'zest', 'zinc', 'zone', 'zoom',
]);

export default function WordUnscrambler() {
  const t = useTranslations('tools.word-unscrambler');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const findWords = (letters: string): string[] => {
    const results: string[] = [];
    const letterArr = letters.toLowerCase().split('');
    
    dictionary.forEach(word => {
      if (word.length > letters.length) return;
      const available = [...letterArr];
      let canForm = true;
      for (const char of word) {
        const idx = available.indexOf(char);
        if (idx === -1) {
          canForm = false;
          break;
        }
        available.splice(idx, 1);
      }
      if (canForm) results.push(word);
    });
    
    return results.sort((a, b) => b.length - a.length || a.localeCompare(b));
  };

  const results = useMemo(() => {
    if (!input.trim() || input.length < 2) return [];
    return findWords(input.replace(/[^a-zA-Z]/g, ''));
  }, [input]);

  const groupedResults = useMemo(() => {
    const groups: Record<number, string[]> = {};
    results.forEach(word => {
      const len = word.length;
      if (!groups[len]) groups[len] = [];
      groups[len].push(word);
    });
    return groups;
  }, [results]);

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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg uppercase tracking-widest"
          maxLength={12}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('found')}: {results.length} {t('words')}
        </span>
        {results.length > 0 && (
          <button
            onClick={copyResults}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? t('copied') : t('copyAll')}
          </button>
        )}
      </div>

      {Object.keys(groupedResults).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedResults)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([length, words]) => (
              <div key={length} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {length} {t('letters')} ({words.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : input.length >= 2 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('noResults')}</p>
      ) : null}
    </div>
  );
}
