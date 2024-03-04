'use client'

import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconBell, IconHelpCircle, IconHome, IconHistogram, IconLive, IconSetting } from '@douyinfe/semi-icons';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)', height: '100vh' }}>
      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          defaultSelectedKeys={['Home']}
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: 'Home', text: '首页', icon: <IconHome size="large" /> },
            { itemKey: 'Histogram', text: '基础数据', icon: <IconHistogram size="large" /> },
            { itemKey: 'Live', text: '测试功能', icon: <IconLive size="large" /> },
            { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> },
          ]}
          header={{
            logo: <IconSemiLogo style={{ fontSize: 36 }} />,
            text: 'Semi Design',
          }}
          footer={{
            collapseButton: true,
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            mode="horizontal"
            footer={
              <>
                <Button
                  theme="borderless"
                  icon={<IconBell size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
                <Button
                  theme="borderless"
                  icon={<IconHelpCircle size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
                <UserButton />
              </>
            }
          />
        </Header>
        <Content
          style={{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)',
          }}
        >
          <Breadcrumb
            style={{
              marginBottom: '24px',
            }}
            routes={['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']}
          />
          <div
            style={{
              borderRadius: '10px',
              border: '1px solid var(--semi-color-border)',
              height: '376px',
              padding: '32px',
            }}
          >
            <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={true}>
              <p>Hi, Bytedance dance dance.</p>
              <p>Hi, Bytedance dance dance.</p>
            </Skeleton>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
