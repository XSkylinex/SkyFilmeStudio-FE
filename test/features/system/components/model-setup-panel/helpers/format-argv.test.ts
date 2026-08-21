import { formatArgv } from '@/features/system/components/model-setup-panel/helpers/format-argv';

describe('formatArgv', () => {
  it('leaves an ordinary argument exactly as the orchestrator sent it', () => {
    expect(
      formatArgv(['huggingface-cli', 'download', 'qwen/qwen3.6-27b']),
    ).toBe('huggingface-cli download qwen/qwen3.6-27b');
    expect(formatArgv(['--local-dir', 'models/text/qwen3.6-27b'])).toBe(
      '--local-dir models/text/qwen3.6-27b',
    );
  });

  it('quotes a path with a space, so pasting it does not write somewhere else', () => {
    expect(formatArgv(['--local-dir', '/Users/alex/AI Models/text'])).toBe(
      "--local-dir '/Users/alex/AI Models/text'",
    );
  });

  it('escapes an embedded quote rather than ending the quoting early', () => {
    expect(formatArgv(["it's here"])).toBe("'it'\\''s here'");
  });

  it('quotes an empty argument, which would otherwise vanish from the line', () => {
    expect(formatArgv(['run', ''])).toBe("run ''");
  });

  it('quotes anything carrying a shell metacharacter', () => {
    expect(formatArgv(['a;rm', 'b$x', 'c&d'])).toBe("'a;rm' 'b$x' 'c&d'");
  });
});
