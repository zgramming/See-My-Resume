import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { PieChartOutlined } from '@ant-design/icons';

import { getItem } from '../../interface/layout/menu_items_interface';

const SiderMenu = (props: {}) => {

	const router = useRouter();

	const currentPathHandler = (path: string): string => {
		const [first, second, third] = path.split('/').filter(route => route.length !== 0);

		/// We assume when `third` is undefined, this is sub menu
		return !third ? `/${first}/${second}` : `/${first}/${second}/${third}`;
	}

	const [currentPath, setCurrentPath] = useState(currentPathHandler(router.pathname));

	const sideItems = [
		getItem('/setting/user_group', 'Management Group User', <PieChartOutlined />),
		getItem('/setting/user', 'Management User', <PieChartOutlined />),
		getItem('/setting/modul', 'Modul', <PieChartOutlined />),
		getItem('/setting/menu', 'Menu', <PieChartOutlined />),
		getItem('/setting/access_modul', 'Access Modul', <PieChartOutlined />),
		getItem('/setting/access_menu', 'Access Menu', <PieChartOutlined />),
		getItem('/setting/master_category', 'Master Kategori', <PieChartOutlined />),
		getItem('/setting/documentation', 'Dokumentasi', <PieChartOutlined />),
		getItem('/setting/parameter', 'Parameter', <PieChartOutlined />),
		getItem('?/setting/parent', 'Parent Menu', <PieChartOutlined />, [
			getItem('/setting/parent/child_first', 'Child 1'),
			getItem('/setting/parent/child_second', 'Child 2'),
		]),
	];

	/// Listen every change route path name
	useEffect(() => {
		const path = currentPathHandler(router.pathname);
		setCurrentPath(path);
		return () => {
		}
	}, [router.pathname])

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

export default SiderMenu;