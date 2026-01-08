'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { GraduationCap, Plus, Trash2, Calculator } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

type GpaScale = '4.0' | '5.0';

const GRADE_POINTS_4: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

const GRADE_POINTS_5: Record<string, number> = {
  'A+': 5.0, 'A': 5.0, 'A-': 4.7,
  'B+': 4.3, 'B': 4.0, 'B-': 3.7,
  'C+': 3.3, 'C': 3.0, 'C-': 2.7,
  'D+': 2.3, 'D': 2.0, 'D-': 1.7,
  'F': 0.0,
};

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

export default function GpaCalculator() {
  const t = useTranslations('tools.gpa-calculator');
  const tCommon = useTranslations('tools');

  const [scale, setScale] = useState<GpaScale>('4.0');
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Course 1', credits: 3, grade: 'A' },
    { id: '2', name: 'Course 2', credits: 3, grade: 'B+' },
    { id: '3', name: 'Course 3', credits: 4, grade: 'A-' },
  ]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: `Course ${courses.length + 1}`,
      credits: 3,
      grade: 'A',
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const result = useMemo(() => {
    const gradePoints = scale === '4.0' ? GRADE_POINTS_4 : GRADE_POINTS_5;
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      if (course.credits > 0 && course.grade in gradePoints) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const maxGpa = scale === '4.0' ? 4.0 : 5.0;
    const percentage = (gpa / maxGpa) * 100;

    return {
      gpa: Math.round(gpa * 100) / 100,
      totalCredits,
      totalPoints: Math.round(totalPoints * 100) / 100,
      percentage: Math.round(percentage),
      maxGpa,
    };
  }, [courses, scale]);

  const getGpaColor = (gpa: number, maxGpa: number) => {
    const ratio = gpa / maxGpa;
    if (ratio >= 0.9) return 'text-green-600 dark:text-green-400';
    if (ratio >= 0.8) return 'text-blue-600 dark:text-blue-400';
    if (ratio >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    if (ratio >= 0.6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGpaLabel = (gpa: number, maxGpa: number) => {
    const ratio = gpa / maxGpa;
    if (ratio >= 0.9) return t('excellent');
    if (ratio >= 0.8) return t('good');
    if (ratio >= 0.7) return t('satisfactory');
    if (ratio >= 0.6) return t('passing');
    return t('needsImprovement');
  };

  return (
    <div className="space-y-6">
      {/* Scale Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setScale('4.0')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            scale === '4.0'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          4.0 {t('scale')}
        </button>
        <button
          onClick={() => setScale('5.0')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            scale === '5.0'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          5.0 {t('scale')}
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('courses')} ({courses.length})
          </label>
        </div>

        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-sm text-gray-500 px-2">
          <div className="col-span-5">{t('courseName')}</div>
          <div className="col-span-3">{t('credits')}</div>
          <div className="col-span-3">{t('grade')}</div>
          <div className="col-span-1"></div>
        </div>

        {courses.map((course) => (
          <div key={course.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="text"
              value={course.name}
              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
              placeholder={t('courseName')}
              className="col-span-12 md:col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              value={course.credits}
              onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
              min="0"
              max="10"
              step="0.5"
              className="col-span-5 md:col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={course.grade}
              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              className="col-span-5 md:col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <button
              onClick={() => removeCourse(course.id)}
              disabled={courses.length === 1}
              className="col-span-2 md:col-span-1 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 justify-self-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addCourse}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          {t('addCourse')}
        </button>
      </div>

      {/* Results */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-8 h-8 text-blue-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('yourGpa')}</div>
            <div className={`text-4xl font-bold ${getGpaColor(result.gpa, result.maxGpa)}`}>
              {result.gpa.toFixed(2)} / {result.maxGpa.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${result.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0.0</span>
            <span className="font-medium">{getGpaLabel(result.gpa, result.maxGpa)}</span>
            <span>{result.maxGpa.toFixed(1)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalCredits}</div>
            <div className="text-sm text-gray-500">{t('totalCredits')}</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalPoints}</div>
            <div className="text-sm text-gray-500">{t('totalPoints')}</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.percentage}%</div>
            <div className="text-sm text-gray-500">{t('percentage')}</div>
          </div>
        </div>
      </div>

      {/* Grade Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {t('gradeReference')}
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-sm">
          {GRADES.map((grade) => (
            <div key={grade} className="flex justify-between p-2 bg-white dark:bg-gray-700 rounded">
              <span className="font-medium">{grade}</span>
              <span className="text-gray-500">
                {scale === '4.0' ? GRADE_POINTS_4[grade] : GRADE_POINTS_5[grade]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
