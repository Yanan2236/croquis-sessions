import { Outlet } from "react-router-dom";
import styles from "./PublicLayout.module.css";
import { Footer } from "@/components/layout/Footer";

export const PublicLayout = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
