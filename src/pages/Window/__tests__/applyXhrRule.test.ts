import { applyXhrRule } from '../intercept';
import type { Rule } from '../../../types/rule';

describe('applyXhrRule', () => {
  it('matches using substring when isRegExp is false', () => {
    const rule: Rule = {
      id: '1',
      urlPattern: '/api',
      isRegExp: false,
      method: 'GET',
      enabled: true,
      date: '',
      response: 'override',
      statusCode: 200,
    };
    const result = applyXhrRule(
      { requestUrl: '/v1/api/test', requestMethod: 'GET' },
      rule,
      'orig'
    );
    expect(result).toBe('override');
  });

  it('returns undefined when RegExp is invalid', () => {
    const rule: Rule = {
      id: '1',
      urlPattern: '(',
      isRegExp: true,
      method: 'GET',
      enabled: true,
      date: '',
      response: null,
      statusCode: 200,
    };
    const result = applyXhrRule(
      { requestUrl: '/test', requestMethod: 'GET' },
      rule,
      'orig'
    );
    expect(result).toBeUndefined();
  });
});
