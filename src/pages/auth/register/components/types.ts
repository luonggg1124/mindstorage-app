export type Gender = "MALE" | "FEMALE" | "OTHER";

export type RegisterDraft = {
  // step 1
  fullName: string;
  gender: Gender | "";
  hobbies: string[];

  // step 2
  username: string;
  password: string;

  // step 3
  email: string;
  emailCode: string;
  emailVerified: boolean;

  // final
  agree: boolean;
};

