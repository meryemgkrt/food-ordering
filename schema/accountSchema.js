import * as Yup from "yup";

const accountSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username can't be longer than 20 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't exceed 15 digits")
    .required("Phone number is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address can't exceed 100 characters")
    .required("Address is required"),
  job: Yup.string()
    .max(50, "Job title can't exceed 50 characters")
    .required("Job title is required"),
  bio: Yup.string()
    .max(200, "Bio can't exceed 200 characters")
    .required("Bio is required"),
});

export default accountSchema;
