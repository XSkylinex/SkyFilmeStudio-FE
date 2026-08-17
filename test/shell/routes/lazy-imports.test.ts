describe('the dynamic imports behind the five lazy routes', () => {
  it('resolves the storyboard route module', async () => {
    const routeModule = await import('@/features/storyboard/StoryboardPage');

    expect(routeModule.StoryboardPage).toBeTypeOf('function');
  });

  it('resolves the shots list route module', async () => {
    const routeModule = await import('@/features/shots/ShotsPage');

    expect(routeModule.ShotsPage).toBeTypeOf('function');
  });

  it('resolves the shot review route module', async () => {
    const routeModule = await import('@/features/shots/ShotReviewPage');

    expect(routeModule.ShotReviewPage).toBeTypeOf('function');
  });

  it('resolves the audio route module', async () => {
    const routeModule = await import('@/features/audio/AudioPage');

    expect(routeModule.AudioPage).toBeTypeOf('function');
  });

  it('resolves the timeline route module', async () => {
    const routeModule = await import('@/features/timeline/TimelinePage');

    expect(routeModule.TimelinePage).toBeTypeOf('function');
  });
});
