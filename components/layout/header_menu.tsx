import { Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';

import { PieChartOutlined } from '@ant-design/icons';

import { getItem } from '../../interface/layout/menu_items_interface';

const headerItems = [
	getItem('/setting', 'Setting', <PieChartOutlined />),
];

const HeaderMenu = () => {
	return <Header className='bg-white'>
		<Menu
			theme="light"
			mode="horizontal"
			items={headerItems}
			className="flex justify-end"
		/>
	</Header>;
}

export default HeaderMenu;