import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { sceneDialogueLinesQueryOptions } from '@/features/audio/api/scene-dialogue-lines.query';
import { DialogueLineCard } from '@/features/audio/components/dialogue-line-card';
import type { SceneDialogueProps } from './scene-dialogue.interface';
import './scene-dialogue.css';

export const SceneDialogue: FC<SceneDialogueProps> = ({ scene }) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const lines = useQuery({
    ...sceneDialogueLinesQueryOptions(scene.id),
    enabled: open,
  });

  const toggleLabel = translate(open ? 'audio.scene.hide' : 'audio.scene.show');

  return (
    <li className="scene-dialogue">
      <div className="scene-dialogue__header">
        <h2 className="scene-dialogue__title">
          {translate('audio.scene.label', { order: String(scene.order) })}
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-label={`${toggleLabel} ${translate('audio.scene.toggleContext', { order: String(scene.order) })}`}
          onClick={() => setOpen(!open)}
        >
          {toggleLabel}
        </Button>
      </div>

      {scene.slugline === undefined ? null : (
        <p className="scene-dialogue__slugline">
          <ContentText>{scene.slugline}</ContentText>
        </p>
      )}

      {open ? (
        <div className="scene-dialogue__detail">
          {lines.error && lines.data === undefined ? (
            <p className="scene-dialogue__note">
              {translate('audio.lines.error')}
            </p>
          ) : null}

          {lines.isPending ? (
            <p className="scene-dialogue__note">
              {translate('audio.lines.loading')}
            </p>
          ) : null}

          {lines.data === undefined ? null : lines.data.items.length === 0 ? (
            <p className="scene-dialogue__note">
              {translate('audio.lines.empty')}
            </p>
          ) : (
            <>
              <ul className="scene-dialogue__lines">
                {[...lines.data.items]
                  .sort((a, b) => a.order - b.order)
                  .map((line) => (
                    <DialogueLineCard
                      key={line.id}
                      line={line}
                      sceneId={scene.id}
                    />
                  ))}
              </ul>
              {lines.data.nextCursor === undefined ? null : (
                <p className="scene-dialogue__note">
                  {translate('audio.lines.firstPageOnly')}
                </p>
              )}
            </>
          )}
        </div>
      ) : null}
    </li>
  );
};
