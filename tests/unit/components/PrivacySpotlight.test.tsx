import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacySpotlight } from '~/components/sections/PrivacySpotlight';

describe('PrivacySpotlight', () => {
  it('渲染 pill + 4 特性 + 7 行 flow', () => {
    render(
      <PrivacySpotlight
        pill="本地优先"
        title="你的文件不离开你的设备"
        sub="所有渲染都在本地完成"
        items={[{ bold: '不上传', desc: '不经过外部服务器' }]}
        flowRows={[
          { key: '文件路径', value: 'on-device', tag: '本地', tagKind: 'local' },
          { key: '云同步', value: '未启用', tag: '关闭', tagKind: 'no' },
        ]}
        moreHref="/zh/privacy"
        moreLabel="完整政策 →"
      />,
    );
    expect(screen.getByText('本地优先')).toBeInTheDocument();
    expect(screen.getByText('你的文件不离开你的设备')).toBeInTheDocument();
    expect(screen.getByText('不上传')).toBeInTheDocument();
    expect(screen.getByText('on-device')).toBeInTheDocument();
  });
});