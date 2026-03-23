import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
};

export const Seo = ({ title, description }: SeoProps) => {
  const fullTitle = title === "LineLoop" ? title : `${title} | LineLoop`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? (
        <meta name="description" content={description} />
      ) : null}
    </Helmet>
  );
};