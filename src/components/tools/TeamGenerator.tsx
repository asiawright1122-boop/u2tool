'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Team {
  name: string;
  members: string[];
}

export default function TeamGenerator() {
  const t = useTranslations('tools.team-generator');
  const tc = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [teamCount, setTeamCount] = useState('2');
  const [teamNames, setTeamNames] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);

  const generateTeams = () => {
    const members = input
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    if (members.length === 0) return;

    const count = parseInt(teamCount) || 2;
    const names = teamNames
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Shuffle members
    const shuffled = [...members].sort(() => Math.random() - 0.5);

    // Distribute to teams
    const result: Team[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        name: names[i] || `${t('team')} ${i + 1}`,
        members: [],
      });
    }

    shuffled.forEach((member, idx) => {
      result[idx % count].members.push(member);
    });

    setTeams(result);
  };

  const shuffleTeams = () => {
    if (teams.length === 0) return;
    
    const allMembers = teams.flatMap(t => t.members);
    const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
    
    const result = teams.map((team, idx) => ({
      ...team,
      members: [] as string[],
    }));

    shuffled.forEach((member, idx) => {
      result[idx % result.length].members.push(member);
    });

    setTeams(result);
  };

  const copyTeams = async () => {
    const text = teams
      .map(team => `${team.name}:\n${team.members.map(m => `  - ${m}`).join('\n')}`)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('enterMembers')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('membersPlaceholder')}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('numberOfTeams')}
          </label>
          <input
            type="number"
            value={teamCount}
            onChange={(e) => setTeamCount(e.target.value)}
            min="2"
            max="20"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('teamNames')} ({t('optional')})
          </label>
          <input
            type="text"
            value={teamNames}
            onChange={(e) => setTeamNames(e.target.value)}
            placeholder={t('teamNamesPlaceholder')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={generateTeams}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {tc('generate')}
        </button>
        {teams.length > 0 && (
          <>
            <button
              onClick={shuffleTeams}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              🔀 {t('shuffle')}
            </button>
            <button
              onClick={copyTeams}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              {tc('copy')}
            </button>
          </>
        )}
      </div>

      {/* Teams Display */}
      {teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  {team.members.length}
                </span>
                {team.name}
              </h3>
              <ul className="space-y-2">
                {team.members.map((member, mIdx) => (
                  <li
                    key={mIdx}
                    className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
