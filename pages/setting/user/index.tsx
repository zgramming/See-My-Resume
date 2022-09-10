import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
const { Option } = Select;

interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
}

const UserPage = () => {
	const columns: ColumnsType<DataType> = [
		{
			title: 'Name (all screens)',
			dataIndex: 'name',
			key: 'name',
			render: text => <a>{text}</a>,
		},
		{
			title: 'Age (medium screen or bigger)',
			dataIndex: 'age',
			key: 'age',
			responsive: ['md'],
			sorter: (a, b) => a.age - b.age,

		},
		{
			title: 'Address (large screen or bigger)',
			dataIndex: 'address',
			key: 'address',
			responsive: ['lg'],

		},
	];

	const children: React.ReactNode[] = [
		<Option key={0} value="">Pilih</Option>
	];

	const data: DataType[] = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
		},
		{
			key: '2',
			name: 'ZEFFRY Brown',
			age: 40,
			address: 'New York No. 1 Lake Park',
		},
	];

	for (let i = 10; i < 36; i++) 	children.push(<Option key={i.toString(36) + i} value={i}>{i.toString(36) + i}</Option>);

	return <Card

	>
		<div className="flex flex-col">
			<div className="flex flex-wrap justify-between items-center mb-5">
				<h1 className="text-base md:text-xl">Management User</h1>
				<div className="flex space-x-2">
					<Button type="ghost" shape="round" className="bg-accent text-white" >Import</Button>
					<Button type="ghost" shape="round" className="bg-info text-white" >Export</Button>
					<Button type="ghost" shape="round" className="bg-success text-white" >Tambah</Button>
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
			<Table columns={columns} dataSource={data} pagination={{ position: ['topLeft', 'bottomRight'] }} />
		</div>
	</Card>
}

const ButtonAction = () => { }

export default UserPage;