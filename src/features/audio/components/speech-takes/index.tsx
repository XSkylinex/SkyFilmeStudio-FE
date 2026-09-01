import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { formatDateTime } from '@/lib/format/format-date-time';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { dialogueLineSpeechQueryOptions } from '@/features/audio/api/dialogue-line-speech.query';
import {
  TTS_PASS_EXPLAINED,
  TTS_PASS_LABEL,
} from '@/features/audio/audio.constants';
import type { SpeechTakesProps } from './speech-takes.interface';
import './speech-takes.css';

export const SpeechTakes: FC<SpeechTakesProps> = ({ line }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const takes = useQuery(dialogueLineSpeechQueryOptions(line.id));

  if (takes.error && takes.data === undefined) {
    return (
      <p className="speech-takes__note">{translate('audio.takes.error')}</p>
    );
  }

  if (takes.isPending) {
    return null;
  }

  if (takes.data.length === 0) {
    return (
      <p className="speech-takes__note">{translate('audio.takes.empty')}</p>
    );
  }

  return (
    <section className="speech-takes">
      <h5 className="speech-takes__title">{translate('audio.takes.title')}</h5>
      <p className="speech-takes__note">{translate('audio.take.noPlayback')}</p>

      <ul className="speech-takes__list">
        {takes.data.map((take) => {
          const isCurrent = take.audioPath === line.generatedAudioPath;
          const isApproved = take.id === line.approvedSynthesisId;
          const spokenDiffers = take.spokenText !== take.text;

          return (
            <li key={take.id} className="speech-takes__take">
              <div className="speech-takes__header">
                <Badge
                  tone={
                    take.pass === 'FINAL'
                      ? STATUS_TONE.ACTIVE
                      : STATUS_TONE.NEUTRAL
                  }
                  label={translate('audio.take.label', {
                    pass: translate(TTS_PASS_LABEL[take.pass]),
                    attempt: String(take.attempt),
                  })}
                />
                {isCurrent ? (
                  <Badge
                    tone={STATUS_TONE.ATTENTION}
                    label={translate('audio.take.current')}
                  />
                ) : null}
                {isApproved ? (
                  <Badge
                    tone={STATUS_TONE.SUCCESS}
                    label={translate('audio.take.approvedTake')}
                  />
                ) : null}
              </div>

              <p className="speech-takes__explained">
                {translate(TTS_PASS_EXPLAINED[take.pass])}
              </p>

              {spokenDiffers ? (
                <div className="speech-takes__spoken">
                  <p className="speech-takes__note">
                    {translate('audio.line.spokenDiffers')}
                  </p>
                  <p className="speech-takes__spoken-line">
                    <span className="speech-takes__field-label">
                      {translate('audio.line.spoken')}
                    </span>{' '}
                    <ContentText language={take.language}>
                      {take.spokenText}
                    </ContentText>
                  </p>
                </div>
              ) : null}

              <dl className="speech-takes__facts">
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.duration')}</dt>
                  <dd>
                    <span dir="ltr">{formatMilliseconds(take.durationMs)}</span>
                  </dd>
                </div>
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.peak')}</dt>
                  <dd>
                    <span dir="ltr">{`${take.peakLevelDb.toFixed(1)} dB`}</span>
                  </dd>
                </div>
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.sampleRate')}</dt>
                  <dd>
                    <span dir="ltr">{`${String(take.sampleRateHz)} Hz`}</span>
                  </dd>
                </div>
                {take.resampledFromHz === undefined ? null : (
                  <div className="speech-takes__fact">
                    <dt>{translate('audio.take.resampled')}</dt>
                    <dd>
                      <span dir="ltr">{`${String(take.resampledFromHz)} Hz`}</span>
                    </dd>
                  </div>
                )}
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.model')}</dt>
                  <dd>
                    <span dir="ltr">{take.modelId}</span>
                  </dd>
                </div>
                {take.seed === undefined ? null : (
                  <div className="speech-takes__fact">
                    <dt>{translate('audio.take.seed')}</dt>
                    <dd>
                      <span dir="ltr">{String(take.seed)}</span>
                    </dd>
                  </div>
                )}
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.voiceHash')}</dt>
                  <dd>
                    <span className="speech-takes__hash" dir="ltr">
                      {take.voiceProfileSha256}
                    </span>
                  </dd>
                </div>
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.audioHash')}</dt>
                  <dd>
                    <span className="speech-takes__hash" dir="ltr">
                      {take.audioSha256}
                    </span>
                  </dd>
                </div>
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.path')}</dt>
                  <dd>
                    <span className="speech-takes__hash" dir="ltr">
                      {take.audioPath}
                    </span>
                  </dd>
                </div>
                <div className="speech-takes__fact">
                  <dt>{translate('audio.take.created')}</dt>
                  <dd>{formatDateTime(take.createdAt, interfaceLanguage)}</dd>
                </div>
                {take.pronunciationOverrides.length === 0 ? null : (
                  <div className="speech-takes__fact">
                    <dt>{translate('audio.take.pronunciation')}</dt>
                    <dd>
                      <ul className="speech-takes__overrides">
                        {take.pronunciationOverrides.map((override) => (
                          <li key={override}>
                            <ContentText>{override}</ContentText>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
