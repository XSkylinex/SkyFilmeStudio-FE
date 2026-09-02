import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { Dialog } from '@/lib/components/dialog';
import { useTranslate } from '@/lib/i18n/use-translate';
import { sceneDialogueLinesQueryOptions } from '@/features/audio/api/scene-dialogue-lines.query';
import { CreateDialogueLineForm } from '@/features/audio/components/create-dialogue-line-form';
import { DialogueLineCard } from '@/features/audio/components/dialogue-line-card';
import { SceneMix } from '@/features/audio/components/scene-mix';
import { SceneScore } from '@/features/audio/components/scene-score';
import type { SceneDialogueProps } from './scene-dialogue.interface';
import './scene-dialogue.css';

export const SceneDialogue: FC<SceneDialogueProps> = ({ projectId, scene }) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);

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
          <div className="scene-dialogue__toolbar">
            <Button
              type="button"
              variant="primary"
              size="sm"
              aria-label={`${translate('audio.line.add')} ${translate('audio.scene.toggleContext', { order: String(scene.order) })}`}
              onClick={() => setAdding(true)}
            >
              {translate('audio.line.add')}
            </Button>
          </div>

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

      <Dialog
        open={adding}
        title={translate('audio.line.add')}
        onClose={() => setAdding(false)}
      >
        {adding ? (
          <CreateDialogueLineForm
            projectId={projectId}
            sceneId={scene.id}
            nextOrder={lines.data?.items.length ?? 0}
            onClose={() => setAdding(false)}
          />
        ) : null}
      </Dialog>

      <SceneScore
        projectId={projectId}
        productionId={scene.productionId}
        sceneId={scene.id}
      />

      <SceneMix scene={scene} />
    </li>
  );
};
