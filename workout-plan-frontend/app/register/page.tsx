"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Typography, Alert } from "antd";
import { register } from "@/actions/register";

const { Title, Text } = Typography;

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    const res = await register({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login");
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Form
        name="register"
        onFinish={handleSubmit}
        className="w-full max-w-md p-6  bg-white rounded"
        initialValues={{ name: "", email: "", password: "" }}
      >
        {error && <Alert message={error} type="error" showIcon />}
        <Title level={2} className="text-center mb-4">
          Register
        </Title>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input placeholder="Full Name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input type="email" placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password placeholder="Password" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Sign Up
          </Button>
        </Form.Item>

        <Form.Item>
          <Text className="text-center">
            Already have an account? <Link href="/login">Login here</Link>
          </Text>
        </Form.Item>
      </Form>
    </section>
  );
}
