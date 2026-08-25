import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows all user agents to crawl the whole site', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
  });

  it('points to the sitemap under the site url', () => {
    const result = robots();
    expect(result.sitemap).toBe('https://example.invalid/sitemap.xml');
  });
});
