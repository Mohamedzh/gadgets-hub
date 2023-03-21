import { Dispatch } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { addToComparison } from "../../redux/slices/compareSlice";
import { DetailedPhone } from "../../types";

const AddToComparison = ({
  dispatch,
  phone,
  setShow,
}: {
  dispatch: Dispatch;
  phone: DetailedPhone;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-4 sm:mt-0 sm:flex-none">
      <button
        onClick={() => {
          dispatch(addToComparison(phone));
          setShow(true);
        }}
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        {t("phone:addPhoneToComparisonMsg")}
      </button>
    </div>
  );
};
export default AddToComparison;
