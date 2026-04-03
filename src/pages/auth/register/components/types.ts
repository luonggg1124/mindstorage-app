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
  /** session trả về từ verifyEmail để submit kèm */
  emailSession: string;
  emailCode: string;
  emailVerified: boolean;

  // final
  agree: boolean;
};

