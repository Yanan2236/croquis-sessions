export const extractFirstErrorMessage = (data: any, fallback: string) => {
  return (
    data?.detail ??
    data?.non_field_errors?.[0] ??
    data?.key?.[0] ??
    data?.token?.[0] ??
    data?.uid?.[0] ??
    data?.email?.[0] ??
    data?.new_password1?.[0] ??
    data?.new_password2?.[0] ??
    fallback
  );
};