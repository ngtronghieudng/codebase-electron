import { Layout } from 'antd';
import { Outlet } from 'react-router';

import { TheSidebar } from '@/renderer/components/common/TheSidebar';
import { TheTopbar } from '@/renderer/components/common/TheTopbar';

import styles from './DefaultLayout.module.scss';

export const DefaultLayout: React.FC = () => {
  return (
    <Layout className={styles.container}>
      <Layout.Sider className={styles.containerSidebar} width={270}>
        <TheSidebar />
      </Layout.Sider>

      <Layout className={styles.containerMain}>
        <Layout.Header className={styles.containerMainHeader}>
          <TheTopbar />
        </Layout.Header>

        <Layout.Content className={styles.containerMainContent}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
