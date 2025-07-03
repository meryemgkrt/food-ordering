import * as Yup from "yup";

const footerSchema = Yup.object().shape({
  location: Yup.string()
    .min(3, "Location must be at least 3 characters.")
    .max(100, "Location cannot exceed 100 characters.")
    .required("Location is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10-15 digits.")
    .required("Phone number is required."),
  desc: Yup.string()
    .min(10, "Description must be at least 10 characters.")
    .max(300, "Description cannot exceed 300 characters.")
    .required("Description is required."),
  day: Yup.string()
    .matches(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
      "Invalid day format."
    )
    .required("Day is required."),
  time: Yup.string()
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Time must be in HH:mm format (24-hour)."
    )
    .required("Time is required."),
});

export default footerSchema;
