import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"

export const ButtonWithIcon = (props: {
	title?: string,
	className?: string,
	icon?: React.ReactNode,
	onClick?: () => void
}) => {
	return <Button onClick={props.onClick} type="ghost" className={props.className || "bg-white text-black"} >
		<div className="flex justify-center items-center space-x-1">
			{props.icon}
			<span>{props.title || "Button"}</span>
		</div>
	</Button>
}