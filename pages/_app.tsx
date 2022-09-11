import 'antd/dist/antd.variable.min.css';
import '../styles/globals.css';

import { ConfigProvider, Layout, Menu, MenuProps } from 'antd';

import type { AppProps } from 'next/app'
import { PieChartOutlined } from '@ant-design/icons';
import { primaryColor } from '../utils/constant';
import React from 'react';
import Image from 'next/image';
import Logo from '../public/images/logo_color.png';
import MyBreadcrum from '../components/reusable/breadcrumb';
const { Content, Footer, Header, Sider } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
	ConfigProvider.config({
		theme: {
			primaryColor: primaryColor,
		},
	});

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

	const sideItems = [
		getItem('1', 'Management User', <PieChartOutlined />),
		getItem('2', 'Management Group User', <PieChartOutlined />),
		getItem('3', 'Modul', <PieChartOutlined />),
		getItem('4', 'Menu', <PieChartOutlined />),
		getItem('5', 'Master Kategori', <PieChartOutlined />),
		getItem('6', 'Master Data', <PieChartOutlined />),
		getItem('7', 'Parent Menu', <PieChartOutlined />, [
			getItem('7.1', 'Child 1'),
			getItem('7.2', 'Child 2'),
		]),
	];

	const headerItems = [
		getItem('1', 'Setting', <PieChartOutlined />),
		getItem('2', 'Lain', <PieChartOutlined />),
		getItem('3', 'Modul Lainnya', <PieChartOutlined />),
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
				<Menu
					theme="light"
					mode="inline"
					items={sideItems}
				/>
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


export default MyApp
