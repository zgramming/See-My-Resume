import { Breadcrumb } from "antd";
import { useRouter } from "next/router";

const MyBreadcrum = () => {

	const router = useRouter();
	const arrPath = router.pathname.split('/').filter(val => val.length !== 0);
	return <>
		<Breadcrumb separator=">" className="mb-5">
			{arrPath.map(val => <Breadcrumb.Item key={val} >{val[0].toUpperCase() + val.slice(1)}</Breadcrumb.Item>)}
		</Breadcrumb>
	</>
}

export default MyBreadcrum;