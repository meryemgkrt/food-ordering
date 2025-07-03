// pages/admin/index.js
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import Title from "@/components/ui/Title";
import LoginInput from "@/components/form/LoginInput";
import adminSchema from "@/schema/adminSchema";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import cookie from "cookie";

const Index = () => {
  const { push } = useRouter();

  const onSubmit = async (values, actions) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin`,
        values
      );

      if (res.status === 200) {
        toast.success("Admin Login Success!");
        actions.resetForm();
        push("/admin/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed!");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: adminSchema,
    onSubmit,
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Your Username",
      value: formik.values.username,
      errorMessage: formik.errors.username,
      touched: formik.touched.username,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Your Password",
      value: formik.values.password,
      errorMessage: formik.errors.password,
      touched: formik.touched.password,
    },
  ];

  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Title className="text-center font-dancing font-bold text-primary text-[2.5rem]">
          Admin Login
        </Title>
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md mt-4 flex flex-col gap-4"
        >
          {inputs.map((input) => (
            <LoginInput
              key={input.id}
              {...input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ))}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition"
            >
              Login
            </button>

            <Link href="/">
              <span className="text-center text-secondary cursor-pointer hover:underline">
                Home Page
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = (ctx) => {
  const cookies = cookie.parse(ctx.req?.headers.cookie || "");

  if (cookies.token === process.env.ADMIN_TOKEN) {
    return {
      redirect: {
        destination: "/admin/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Index;
