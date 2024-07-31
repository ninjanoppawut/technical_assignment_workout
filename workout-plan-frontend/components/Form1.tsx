"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  Row,
  message,
  InputNumber,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface WeeklyActivity {
  activity: string;
}

interface FormData {
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

interface Form1Props {
  hasPersonalData: (exists: boolean) => void;
}

const Form1: React.FC<Form1Props> = ({ hasPersonalData }) => {
  const { data: session, status } = useSession();

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>({
    planOwner: "",
    planName: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    weeklyActivities: [{ activity: "" }],
  });

  const handleSubmit = async (values: any) => {
    const dataToSubmit = {
      ...formData,
      ...values,
      dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
    };

    try {
      const response = await axios.post("/api/form-submission", dataToSubmit);
      // console.log(response.data.message);
      if (response.data.message === "Form data saved successfully!") {
        hasPersonalData(true);
      }
      message.success("Personal Information Saved!");
    } catch (error) {
      console.error("Error saving form data:", error);
      message.error("Something wrong");
    }
  };

  useEffect(() => {
    if (session && session.user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        planOwner: String(session.user?.email),
      }));
      form.setFieldsValue({
        planOwner: String(session.user?.email),
      });
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You need to sign in to access this form.</div>;
  }

  return (
    <div className="">
      <h2 className="text-xl mb-4">Personal Information</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          planName: formData.planName,
          dateOfBirth: formData.dateOfBirth,
          // ? moment(formData.dateOfBirth)
          // : null,
          height: formData.height,
          weight: formData.weight,
          weeklyActivities: formData.weeklyActivities.map((activity) => ({
            activity: activity.activity,
          })),
        }}
      >
        <Form.Item
          label="Plan Name"
          name="planName"
          rules={[{ required: true, message: "Please enter the plan name" }]}
        >
          <Input placeholder="Enter plan name" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[
            { required: true, message: "Please select the date of birth" },
          ]}
        >
          <DatePicker style={{ width: "50%" }} />
        </Form.Item>

        <Form.Item
          label="Height (cm)"
          name="height"
          rules={[{ required: true, message: "Please enter your height" }]}
        >
          <InputNumber
            placeholder="Enter height"
            min={0}
            style={{ width: "50%" }}
          />
        </Form.Item>

        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[{ required: true, message: "Please enter your weight" }]}
        >
          <InputNumber
            placeholder="Enter weight"
            min={0}
            style={{ width: "50%" }}
          />
        </Form.Item>

        <Form.Item label="Weekly Activities">
          <Form.List name="weeklyActivities">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline" className="mr-2">
                    <Form.Item
                      name={[name, "activity"]}
                      rules={[
                        { required: true, message: "Please enter an activity" },
                      ]}
                    >
                      <Input placeholder="Enter activity" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Row justify="space-between">
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Activity
                    </Button>
                  </Form.Item>{" "}
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Row>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form1;
