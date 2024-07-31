"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Space, Alert } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      setLoading(false);
      setError(res.error as string);
    }
    if (res?.ok) {
      router.push("/");
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Form
        name="login"
        onFinish={handleSubmit}
        className="w-full max-w-md"
        initialValues={{ email: "", password: "" }}
      >
        {error && <Alert message={error} type="error" showIcon />}
        <Title level={2} className="text-center mb-4">
          Sign In
        </Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input type="email" placeholder="Email" size="large" allowClear />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password placeholder="Password" size="large" allowClear />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </Form.Item>
        <Form.Item>
          <Space
            direction="vertical"
            size="small"
            className="w-full text-center"
          >
            <Link href="/register">
              <Text type="secondary">Don't have an account? Register here</Text>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </section>
  );
}
