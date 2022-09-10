import { PrismaClient } from "@prisma/client"
import { DatePicker } from "antd"
import { GetServerSideProps } from "next"

const HomePage = () => {
	return <>
		<DatePicker />
	</>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const prisma = new PrismaClient();
	const users = await prisma.user.findMany({
		include: {
			posts: true,
			_count: {
				select: { posts: true }
			}
		}
	});

	console.log({ users: users, message: "Message ini loh" });
	await prisma.$disconnect();
	return {
		props: {}
	}
}
export default HomePage