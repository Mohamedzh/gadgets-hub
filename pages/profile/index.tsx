import React from "react";
import ProfileSection from "../../components/user/profileSection";
import { withPageAuth, User } from "@supabase/auth-helpers-nextjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type Props = {
  user: User;
};

function Profile({ user }: Props) {
  return (
    <div className="lg:mx-10 mx-5">
      <ProfileSection user={user} />
    </div>
  );
}

export default Profile;

export const getServerSideProps = withPageAuth({
  redirectTo: "/",
  async getServerSideProps(context) {
    return {
      props: {
        ...(await serverSideTranslations(
          context.locale ? context.locale : "en"
        )),
      },
    };
  },
});
