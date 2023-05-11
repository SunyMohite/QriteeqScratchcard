import React from "react";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../services/auth";
import { LogoIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../route/constant";
import { notify } from "../../utils/helper";

const Login = () => {
  const navigate = useNavigate();
  // const onFinish = async (values) => {
  //   localStorage.setItem(
  //     "authToken",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmQ2ZGZhZDJkMzFhODJlMTc4NzRlNTAiLCJpYXQiOjE2NTgyNDkxNTgsInR5cGUiOiJhY2Nlc3MifQ.WdMgb-agEEx-jdW0IOrB-HwLg7YQVHHVHopP8RM7ljg"
  //   );
  //   navigate(ROUTES.DASHBOARD)
  //   localStorage.setItem("active","1")
  //   // const data = await api.signin({
  //   //   email: values?.email,
  //   //   password: values?.password,
  //   // });

  //   // console.log("Received values of form: ", data.data);
  // };
  const onFinish = async (values) => {
    localStorage.setItem("active", "1");
    const data = await api.signin({
      email: values?.email,
      password: values?.password,
    });

    if (data.data?.error) {
      notify("error", data?.data?.message);
    } else {
      localStorage.setItem("authToken", data.data?.data?.token);
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="background-login ">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          email: "",
          password: "",
        }}
        onFinish={onFinish}
      >
        <div className="text-center ">
          <LogoIcon />
        </div>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
