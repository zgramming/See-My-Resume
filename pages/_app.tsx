import 'antd/dist/antd.variable.min.css';
import '../styles/globals.css';

import { ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

import { PieChartOutlined } from '@ant-design/icons';

import MyBreadcrum from '../components/reusable/breadcrumb';
import Logo from '../public/images/logo_color.png';
import { primaryColor } from '../utils/constant';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
const { Content, Footer, Header, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const getItem = (
	key: React.Key,
	label: React.ReactNode,
	icon?: React.ReactNode,
	children?: MenuItem[]) => {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

function MyApp({ Component, pageProps }: AppProps) {

	ConfigProvider.config({
		theme: {
			primaryColor: primaryColor,
		},
	});

	const headerItems = [
		getItem('/setting', 'Setting', <PieChartOutlined />),
	];

	return <ConfigProvider>
		<Layout className='min-h-screen'>
			<Sider
				theme='light'
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={broken => {
					console.log(broken);
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type);
				}}
			>
				<div className="relative h-16 flex justify-center items-center" >
					<Image alt='Failed load image...' src={Logo} height={100} width={100} />
				</div>
				<SiderMenu />
			</Sider>
			<Layout>
				<Header className='bg-white'>
					<Menu
						theme="light"
						mode="horizontal"
						items={headerItems}
						className="flex justify-end"
					/>
				</Header>
				<Content className='py-12 p-2 md:p-5'>
					<MyBreadcrum />
					<Component {...pageProps} />
				</Content>
				<Footer className='text-center text-white bg-primary'>Ant Design ©2018 Created by Ant UED</Footer>
			</Layout>
		</Layout>
	</ConfigProvider>

}

const SiderMenu = () => {

	const router = useRouter();

	const currentPathHandler = (path: string): string => {
		const [first, second, third] = path.split('/').filter(route => route.length !== 0);

		/// We assume when `third` is undefined, this is sub menu
		return !third ? `/${first}/${second}` : `/${first}/${second}/${third}`;
	}

	const [currentPath, setCurrentPath] = useState(currentPathHandler(router.pathname));

	const sideItems = [
		getItem('/setting/user', 'Management User', <PieChartOutlined />),
		getItem('/setting/user_group', 'Management Group User', <PieChartOutlined />),
		getItem('/setting/modul', 'Modul', <PieChartOutlined />),
		getItem('/setting/menu', 'Menu', <PieChartOutlined />),
		getItem('/setting/access_modul', 'Access Modul', <PieChartOutlined />),
		getItem('/setting/access_menu', 'Access Menu', <PieChartOutlined />),
		getItem('/setting/master_category', 'Master Kategori', <PieChartOutlined />),
		getItem('/setting/master_data', 'Master Data', <PieChartOutlined />),
		getItem('/setting/example', 'Dokumentasi', <PieChartOutlined />),
		getItem('/setting/parameter', 'Parameter', <PieChartOutlined />),
		getItem('?/setting/parent', 'Parent Menu', <PieChartOutlined />, [
			getItem('/setting/parent/child_first', 'Child 1'),
			getItem('/setting/parent/child_second', 'Child 2'),
		]),
	];

	return <Menu
		theme="light"
		mode="inline"
		items={sideItems}
		selectedKeys={[currentPath]}
		onClick={(e) => {

			/// Jangan lakukan push jika character pertama === "?"
			/// Ini dilakukan untuk meng-akomodir sub menu
			if (e.key[0] === "?") return false;

			const path = currentPathHandler(e.key);
			setCurrentPath(path);
			router.push(path);
		}}
	/>
}

export default MyApp
