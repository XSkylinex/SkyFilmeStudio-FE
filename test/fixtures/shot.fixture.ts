import { shotSchema } from 'sky-filme-studio-be/contracts';
import type { Shot } from 'sky-filme-studio-be/contracts';

export const buildShot = (overrides: Partial<Shot> = {}): Shot =>
  shotSchema.parse({
    id: '55555555-5555-4555-8555-555555555555',
    sceneId: '44444444-4444-4444-8444-444444444444',
    order: 0,
    shotType: 'WIDE',
    targetDurationSeconds: 6,
    subjectIds: [],
    propIds: [],
    framing: 'Wide shot of the workshop interior.',
    camera: 'Static, eye-level.',
    actionOrVisualIntent: 'Establish the space before she enters.',
    dialogueLineIds: [],
    audioCueIds: [],
    visualPriority: 'HIGH',
    motionComplexity: 'LOW',
    continuityRequirements: [],
    generationStrategy: 'IMAGE_TO_VIDEO',
    sourceClipIds: [],
    state: 'STORYBOARD_PENDING',
    ...overrides,
  });
