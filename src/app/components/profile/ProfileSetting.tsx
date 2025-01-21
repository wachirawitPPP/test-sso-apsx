"use client";
import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import OutlineCard from "../shared/OutlineCard";
import Image from "next/image";
import axios from "axios";

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

interface ProfileSettingProps {
  userData: UserData | null;
  getUserData: () => Promise<void>;
}

const ProfileSetting: React.FC<ProfileSettingProps> = ({
  userData,
  getUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(userData);
  const [profileImage, setProfileImage] = useState<string | null>(
    userData?.us_photo || "/images/profile/user-1.jpg"
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Update the profile image preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes (mock functionality for now)
  const handleSave = async () => {
    console.log("Saved data:", formData);
    console.log("Uploaded profile image:", profileImage);

    try {
      const updateProfile = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,

        {
          us_profile: profileImage,
          us_fullname: formData?.us_fullname,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (updateProfile.data.status === "error") {
        alert(updateProfile.data.message);
      }
      setIsEditing(false);
      getUserData();
    } catch (error) {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      <div className="grid grid-cols-12 gap-30">
        <div className="col-span-12">
          <div className="my-4">
            <div className="mx-auto text-center mt-5">
              <Image
                src={profileImage || "/images/profile/user-1.jpg"}
                alt="Profile Picture"
                height={120}
                width={120}
                className="rounded-full mx-auto"
              />
              {isEditing && (
                <>
                  <div className="flex justify-center gap-3 py-6">
                    <label htmlFor="profileUpload" className="cursor-pointer">
                      <Button color={"primary"} as="span">
                        Upload
                      </Button>
                      <input
                        type="file"
                        id="profileUpload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {/* <Button
                      color={"lighterror"}
                      onClick={() =>
                        setProfileImage("/images/profile/user-1.jpg")
                      }
                    >
                      Reset
                    </Button> */}
                  </div>
                  <p className="text-sm text-darklink">
                    Allowed JPG, GIF or PNG. Max size of 800K
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 col-span-12">
              <div className="flex flex-col gap-3 mt-3">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="us_fullname" value="Name" />
                  </div>
                  <TextInput
                    id="us_fullname"
                    type="text"
                    sizing="md"
                    value={formData?.us_fullname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-control"
                  />
                </div>
                {/* <div>
                  <div className="mb-2 block">
                    <Label htmlFor="us_email" value="Email" />
                  </div>
                  <TextInput
                    id="us_email"
                    type="email"
                    value={formData?.us_email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sizing="md"
                    className="form-control"
                  />
                </div> */}
              </div>
            </div>
            <div className="md:col-span-6 col-span-12">
              <div className="flex flex-col gap-3 mt-3">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="us_username" value="Username" />
                  </div>
                  <TextInput
                    id="us_username"
                    type="text"
                    value={formData?.us_username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sizing="md"
                    className="form-control"
                  />
                </div>
                {/* <div>
                  <div className="mb-2 block">
                    <Label htmlFor="us_phone" value="Phone Number" />
                  </div>
                  <TextInput
                    id="us_phone"
                    type="text"
                    value={formData?.us_phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sizing="md"
                    className="form-control"
                  />
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-5">
            {!isEditing ? (
              <Button color={"primary"} onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button color={"primary"} onClick={handleSave}>
                  Save
                </Button>
                <Button
                  color={"light-error"}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
