import { expect, it } from 'vitest';
import { testForInjection } from './tool-stubs';
import { describeInjectionResult } from './sql-injection-presentation';

it('reports no heuristic match without certifying code as safe', () => {
  const presentation = describeInjectionResult(testForInjection('database.execute(queryFromAnotherFile)'));
  expect(presentation.label).toBe('No patterns detected');
  expect(presentation.caution).toContain('does not establish safety');
  expect(presentation).not.toHaveProperty('score');
});

it('shows even low-severity heuristic matches as findings requiring review', () => {
  expect(describeInjectionResult(testForInjection('multipleStatements: true')).label).toBe('Potential risk patterns detected');
});
