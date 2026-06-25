import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkflowStrip } from '~/components/sections/WorkflowStrip';

describe('WorkflowStrip', () => {
  it('渲染 4 个 step', () => {
    render(
      <WorkflowStrip
        eyebrow="AI 工作流"
        title="从提示词到手机阅读"
        sub="只需一次分享"
        steps={[
          { src: 'STEP 01', name: 'ChatGPT', desc: '对话' },
          { src: 'STEP 02', name: '分享', desc: '发送' },
          { src: 'STEP 03', name: 'NovaView', desc: '渲染', highlight: true },
          { src: 'STEP 04', name: '阅读', desc: '看完整文档' },
        ]}
      />,
    );
    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
    expect(screen.getByText('NovaView')).toBeInTheDocument();
    expect(screen.getByText('阅读')).toBeInTheDocument();
  });
});