import {
  pronunciationDictionaryEntrySchema,
  pronunciationDictionarySchema,
  voiceProfileSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  PronunciationDictionary,
  PronunciationDictionaryEntry,
  VoiceProfile,
} from 'sky-filme-studio-be/contracts';

export const buildVoiceProfile = (
  overrides: Partial<VoiceProfile> = {},
): VoiceProfile =>
  voiceProfileSchema.parse({
    id: '99999999-9999-4999-8999-999999999999',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    displayName: 'Mira',
    engine: 'moss-tts',
    modelId: 'moss-ttsd-v0.5',
    language: 'en-GB',
    additionalLanguages: [],
    generationParameters: {},
    approved: false,
    ...overrides,
  });

export const buildPronunciationDictionary = (
  overrides: Partial<PronunciationDictionary> = {},
): PronunciationDictionary =>
  pronunciationDictionarySchema.parse({
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    language: 'he-IL',
    ...overrides,
  });

export const buildPronunciationEntry = (
  overrides: Partial<PronunciationDictionaryEntry> = {},
): PronunciationDictionaryEntry =>
  pronunciationDictionaryEntrySchema.parse({
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    dictionaryId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    term: 'שלום  עולם',
    normalisedTerm: 'שלום עולם',
    ...overrides,
  });
