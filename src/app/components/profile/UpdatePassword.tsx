import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";

interface UserData {
  id: number;
  us_id: string;
  us_username: string;
  us_email: string;
  us_fullname: string;
  us_phone: string;
  us_photo: string;
  us_status: number;
}

interface UpdatePasswordProps {
  userData: UserData | null;
  setIsOpen: (value: boolean) => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({ userData, setIsOpen }) => {
  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPass: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPass: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const validateForm = () => {
    const validationErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPass: "",
    };
  
    // Regex for 8+ characters, at least 1 uppercase letter, and at least 1 digit
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    if (!formValues.oldPassword) {
      validationErrors.oldPassword = "Old password is required.";
    }
    if (!formValues.newPassword) {
      validationErrors.newPassword = "New password is required.";
    } else if (!passwordRegex.test(formValues.newPassword)) {
      validationErrors.newPassword =
        "New password must be at least 8 characters long, include at least one uppercase letter and one digit.";
    }
    if (formValues.newPassword !== formValues.confirmPass) {
      validationErrors.confirmPass = "Passwords do not match.";
    }
  
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/password`,
        {
          old_password: formValues.oldPassword,
          new_password: formValues.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const renderTextInput = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    error: string,
    type: "text" | "password" = "password"
  ) => (
    <div className="mb-4">
      <Label htmlFor={id} value={label} className="text-primary" />
      <TextInput
        id={id}
        type={"password"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        sizing="md"
        className={`form-control ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <>
      {renderTextInput(
        "oldPassword",
        "Old Password",
        "Enter old password",
        formValues.oldPassword,
        errors.oldPassword
      )}

      {renderTextInput(
        "newPassword",
        "New Password",
        "Enter new password",
        formValues.newPassword,
        errors.newPassword
      )}

      {renderTextInput(
        "confirmPass",
        "Confirm New Password",
        "Confirm new password",
        formValues.confirmPass,
        errors.confirmPass
      )}

      <div className="pt-4 flex justify-end gap-4">
        <Button color="primary" onClick={handleSubmit}>
          Save Password
        </Button>
        <Button color="error" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default UpdatePassword;
