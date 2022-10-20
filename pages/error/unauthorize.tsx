import { Button } from "antd";
import { useRouter } from "next/router";

const UnauthorizePage = () => {
  const { replace } = useRouter();
  return (
    <div className="flex flex-col space-y-10">
      <h1 className="text-center text-4xl">Unauthorize</h1>
      <Button
        type="primary"
        htmlType="button"
        onClick={(e) => replace("/login")}
      >
        Login
      </Button>
    </div>
  );
};

UnauthorizePage.getLayout = (page: any) => page;

export default UnauthorizePage;
