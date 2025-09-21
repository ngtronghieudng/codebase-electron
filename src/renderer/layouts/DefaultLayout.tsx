import { Layout } from 'antd';
import { Outlet } from 'react-router';

import styles from '@/renderer/assets/styles/components/shared/default-layout.module.scss';
import { TheSidebar } from '@/renderer/components/shared/TheSidebar';
import { TheTopbar } from '@/renderer/components/shared/TheTopbar';

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
