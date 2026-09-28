'use client';

/**
 * The coming-soon story as a video. It shows its last frame, and exposes
 * `window.__adFrame[file](ms)` so scripts/generate-ads.mts can draw any moment
 * synchronously (flushSync), capture it, and move on — 30 frames a second,
 * each one exact, with no dependence on how fast the machine is.
 */

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { STORY_DURATION, StoryScene, type StoryLabels } from './story';

declare global {
  interface Window {
    __adFrame?: Record<string, (ms: number) => void>;
  }
}

export function StoryAnimated({ file, labels, latin }: { file: string; labels: StoryLabels; latin: boolean }) {
  const [t, setT] = useState(STORY_DURATION);

  useEffect(() => {
    window.__adFrame = { ...window.__adFrame, [file]: (ms: number) => flushSync(() => setT(ms)) };
    return () => {
      if (window.__adFrame) delete window.__adFrame[file];
    };
  }, [file]);

  return <StoryScene t={t} labels={labels} latin={latin} />;
}
