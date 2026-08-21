import { http, HttpResponse } from 'msw';
import { screen, within } from '@testing-library/react';
import {
  modelManifestIdSchema,
  projectRelativePathSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  ModelSetupEntry,
  ModelSetupReport,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ModelSetupPanel } from '@/features/system/components/model-setup-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildModelSetupReport } from '../../../../fixtures/model-setup-report.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const orchestratorReports = (report: ModelSetupReport): void => {
  server.use(http.get(API_PATH.modelSetup(), () => HttpResponse.json(report)));
};

const MISSING_MODEL_DOWNLOAD_ARGV = [
  'huggingface-cli',
  'download',
  'qwen/qwen-image-edit',
  '--local-dir',
  'models/image-edit/qwen-image-edit-2509',
];

const missingModel = (): ModelSetupEntry => ({
  id: modelManifestIdSchema.parse('qwen-image-edit-2509'),
  role: 'IMAGE_EDIT',
  upstreamRepo: 'qwen/qwen-image-edit',
  license: 'apache-2.0',
  totalBytes: 8_000_000_000,
  missingBytes: 8_000_000_000,
  ready: false,
  files: [
    {
      relativePath: projectRelativePathSchema.parse(
        'image-edit/qwen-image-edit-2509/model.safetensors',
      ),
      bytes: 8_000_000_000,
      status: 'MISSING',
      detail: 'The file is not present on disk.',
    },
  ],
  downloadArgv: MISSING_MODEL_DOWNLOAD_ARGV,
});

const hashMismatchModel = (): ModelSetupEntry => ({
  id: modelManifestIdSchema.parse('ltx-2.5-distilled'),
  role: 'VIDEO',
  upstreamRepo: 'lightricks/ltx-video',
  license: 'openrail-m',
  totalBytes: 12_000_000_000,
  missingBytes: 0,
  ready: false,
  files: [
    {
      relativePath: projectRelativePathSchema.parse(
        'video/ltx-2.5-distilled/model.safetensors',
      ),
      bytes: 12_000_000_000,
      status: 'HASH_MISMATCH',
      detail: 'The file on disk does not match the manifest hash.',
    },
  ],
  downloadArgv: ['huggingface-cli', 'download', 'lightricks/ltx-video'],
});

const fieldRow = (label: string): HTMLElement => {
  const row = screen
    .getByText(label, { selector: 'dt' })
    .closest<HTMLElement>('.model-setup-panel__field');
  if (!row) {
    throw new Error(`no field row for ${label}`);
  }

  return row;
};

describe('ModelSetupPanel', () => {
  it('never claims a hash was checked, because this endpoint only stats the file', async () => {
    orchestratorReports(buildModelSetupReport());

    renderInApp(<ModelSetupPanel />);

    expect(
      await screen.findByText(/at the size the manifest declares/),
    ).toBeInTheDocument();
    expect(screen.getByText(/nothing here reads a hash/)).toBeInTheDocument();
    expect(
      screen.getByText(/MODEL_HASHES_MATCH preflight check is what does/),
    ).toBeInTheDocument();
  });

  it('does not call a present but wrong-sized file missing', async () => {
    orchestratorReports(
      buildModelSetupReport({
        ready: false,
        totalMissingBytes: 8_000_000_000,
        models: [
          {
            id: modelManifestIdSchema.parse('ltx-2.5-distilled'),
            role: 'VIDEO',
            upstreamRepo: 'lightricks/ltx-video',
            license: 'openrail-m',
            totalBytes: 8_000_000_000,
            missingBytes: 8_000_000_000,
            ready: false,
            files: [
              {
                relativePath: projectRelativePathSchema.parse(
                  'video/ltx-2.5-distilled/model.safetensors',
                ),
                bytes: 8_000_000_000,
                status: 'SIZE_MISMATCH',
                detail: 'On disk, but not the size the manifest declares.',
              },
            ],
            downloadArgv: [
              'huggingface-cli',
              'download',
              'lightricks/ltx-video',
            ],
          },
        ],
      }),
    );

    renderInApp(<ModelSetupPanel />);

    expect(await screen.findByText('Wrong size')).toBeInTheDocument();
    expect(screen.getByText('Files not ready')).toBeInTheDocument();
    expect(screen.queryByText('Files missing')).not.toBeInTheDocument();
    expect(screen.queryByText(/Still to fetch/)).not.toBeInTheDocument();
  });

  it('never presents files-present as benchmarked, and shows the caveat alongside it', async () => {
    orchestratorReports(buildModelSetupReport());

    renderInApp(<ModelSetupPanel />);

    expect(await screen.findByText('Files ready')).toBeInTheDocument();
    expect(
      screen.getByText(/does not mean the model has been benchmarked/),
    ).toBeInTheDocument();
  });

  it('shows the expected size and the setup command for a missing model', async () => {
    orchestratorReports(
      buildModelSetupReport({
        ready: false,
        totalMissingBytes: 8_000_000_000,
        models: [missingModel()],
      }),
    );

    renderInApp(<ModelSetupPanel />);

    await screen.findByText('qwen-image-edit-2509');

    expect(within(fieldRow('Size')).getByText('8.0 GB')).toBeInTheDocument();
    expect(
      screen.getByText(MISSING_MODEL_DOWNLOAD_ARGV.join(' ')),
    ).toBeInTheDocument();
  });

  it('never renders a button or a link, because nothing here may trigger a download', async () => {
    orchestratorReports(
      buildModelSetupReport({
        ready: false,
        totalMissingBytes: 8_000_000_000,
        models: [missingModel()],
      }),
    );

    renderInApp(<ModelSetupPanel />);

    await screen.findByText('Files not ready');

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('tones a hash mismatch as danger, not as a pass', async () => {
    orchestratorReports(
      buildModelSetupReport({
        ready: false,
        models: [hashMismatchModel()],
      }),
    );

    renderInApp(<ModelSetupPanel />);

    const status = await screen.findByText('Hash mismatch');

    expect(status.closest('.badge')).toHaveAttribute('data-tone', 'danger');
  });

  it('marks the model id, the models root and the setup command as machine text', async () => {
    orchestratorReports(
      buildModelSetupReport({
        ready: false,
        totalMissingBytes: 8_000_000_000,
        models: [missingModel()],
      }),
    );

    renderInApp(<ModelSetupPanel />);

    const modelId = await screen.findByText('qwen-image-edit-2509');
    expect(modelId.tagName).toBe('CODE');
    expect(modelId).toHaveAttribute('dir', 'ltr');

    const root = screen.getByText('models');
    expect(root.tagName).toBe('CODE');
    expect(root).toHaveAttribute('dir', 'ltr');

    const command = screen.getByText(MISSING_MODEL_DOWNLOAD_ARGV.join(' '));
    expect(command.tagName).toBe('CODE');
    expect(command).toHaveAttribute('dir', 'ltr');
  });

  it('renders the error state instead of a half-built panel when the report cannot be read', async () => {
    server.use(
      http.get(
        API_PATH.modelSetup(),
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderInApp(<ModelSetupPanel />);

    expect(
      await screen.findByText('The model setup report could not be read'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Files ready')).not.toBeInTheDocument();
    expect(screen.queryByText('Files not ready')).not.toBeInTheDocument();
  });
});
