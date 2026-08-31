import { screen } from '@testing-library/react';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import { renderInApp } from '../../../../render-in-app';

describe('BibleRuleList', () => {
  it('says an empty list is empty rather than rendering a bare label', () => {
    renderInApp(<BibleRuleList label="Recurring themes" rules={[]} />);

    expect(screen.getByText('None recorded')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders each rule as its own item', () => {
    renderInApp(
      <BibleRuleList label="Recurring themes" rules={['Loyalty', 'Loss']} />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('None recorded')).not.toBeInTheDocument();
  });
});
