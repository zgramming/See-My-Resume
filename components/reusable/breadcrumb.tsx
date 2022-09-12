import { Breadcrumb } from "antd";
import { useRouter } from "next/router";

const MyBreadcrum = () => {

	const router = useRouter();
	const arrPath = router.pathname.split('/').filter(route => route.length !== 0).map(route => {
		const split = route.split("_");

		/// Route => user_group become User Group
		if (split.length > 1) {
			const capitalizeName = split.map(val => (val[0]?.toUpperCase() ?? "default") + val.slice(1))
			return capitalizeName.join(' ');
		}

		return route;
	});
	return <>
		<Breadcrumb separator=">" className="mb-5">
			{arrPath.map(val => <Breadcrumb.Item key={val} >{(val[0]?.toUpperCase() ?? "default") + val.slice(1)}</Breadcrumb.Item>)}
		</Breadcrumb>
	</>
}

export default MyBreadcrum;