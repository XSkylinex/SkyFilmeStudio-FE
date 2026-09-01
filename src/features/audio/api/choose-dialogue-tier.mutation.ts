import { mutationOptions } from '@tanstack/react-query';
import {
  chooseDialogueTierRequestSchema,
  dialogueAnimationChoiceSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  ChooseDialogueTierRequest,
  DialogueAnimationChoice,
  DialogueLineId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';

const chooseDialogueTier = (
  dialogueLineId: DialogueLineId,
  request: ChooseDialogueTierRequest,
): Promise<DialogueAnimationChoice> =>
  requestJson(
    API_PATH.dialogueLineTier(dialogueLineId),
    dialogueAnimationChoiceSchema,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chooseDialogueTierRequestSchema.parse(request)),
    },
  );

export const chooseDialogueTierMutationOptions = (
  dialogueLineId: DialogueLineId,
) =>
  mutationOptions({
    mutationFn: (request: ChooseDialogueTierRequest) =>
      chooseDialogueTier(dialogueLineId, request),
  });
