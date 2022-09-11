import { Button, Card, Select, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';

import { DownloadOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import useIsMobile from '../../../hooks/use_ismobile_hooks';

const { Option } = Select;

interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
	action: React.ReactNode,
}

const UserPage = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const intervalId = setTimeout(() => {
			setIsLoading(false);

			console.log("tick interval")
		}, 5000)

		return () => {
			clearTimeout(intervalId)
		};
	}, [])

	const columns: ColumnsType<DataType> = [
		{
			key: 'name',
			dataIndex: 'name',
			title: 'Name (all screens)',
			render: text => <a>{text}</a>,
		},
		{
			key: 'age',
			dataIndex: 'age',
			title: 'Age (medium screen or bigger)',
			sorter: (a, b) => a.age - b.age,
		},
		{
			key: 'address',
			dataIndex: 'address',
			title: 'Address (large screen or bigger)',
		},
		{
			key: 'action',
			dataIndex: 'action',
			title: 'Action',
		},
	];

	const data: DataType[] = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
			action: <span>Testing</span>
		},
		{
			key: '2',
			name: 'ZEFFRY Brown',
			age: 40,
			address: 'New York No. 1 Lake Park',
			action: <span>Testing</span>

		},
	];

	const children: React.ReactNode[] = [
		<Option key={0} value="">Pilih</Option>
	];

	for (let i = 10; i < 36; i++) children.push(<Option key={i.toString(36) + i} value={i}>{i.toString(36) + i}</Option>);

	return <Card

	>
		<div className="flex flex-col">
			<div className="flex justify-between items-center mb-5">
				<h1 className="font-medium text-base mr-5 md:text-xl">Management User</h1>
				<div className="flex flex-wrap gap-2">
					<Button type="ghost" shape="round" className="bg-accent text-white" >
						<div className="flex justify-center items-center space-x-1">
							<ImportOutlined />
							<span>Import</span>
						</div>
					</Button>
					<Button type="ghost" shape="round" className="bg-info text-white" >
						<div className="flex justify-center items-center space-x-1">
							<ExportOutlined />
							<span>Export</span>
						</div>
					</Button>
					<Button type="ghost" shape="round" className="bg-success text-white" >
						<div className="flex justify-center items-center space-x-1">
							<PlusOutlined />
							<span>Halaman</span>
						</div>
					</Button>
					<Button type="ghost" shape="round" className="bg-success text-white" >
						<div className="flex justify-center items-center space-x-1">
							<PlusOutlined />
							<span>Modal</span>
						</div>
					</Button>
				</div>
			</div>
			<div className="flex flex-wrap items-center space-x-2 mb-5">
				<Search placeholder="Cari sesuatu..." onSearch={(e) => ''} className="w-48" allowClear />

				<Select
					defaultValue={{
						value: 0,
						label: "Pilih"
					}}
					onChange={(e, option) => ''}
					className="w-auto md:min-w-[10rem]"  >
					{children}
				</Select>
			</div>
			<Table
				loading={isLoading}
				columns={columns}
				dataSource={data}
				pagination={{ position: ['bottomRight'] }}
				scroll={{ x: 1000 }}
			/>
		</div>
	</Card>
}

const ButtonAction = () => { }

export default UserPage;